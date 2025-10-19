#!/usr/bin/env python3
"""
Enhanced Continuous AI Test Loop - With Deep Code Analysis
Gives AI full access to failing tests, source files, and project context.
"""

import json
import subprocess
import time
from datetime import datetime
from pathlib import Path
import sys
import re
import os
import signal
import atexit
import uuid
from event_emitter import AITestEventEmitter

# Config
SLEEP_MINUTES = 15
OLLAMA_MODEL = "qwen2.5"
TEST_DIR = Path("frontend")
LOGS_DIR = Path("logs")
REPORTS_DIR = Path("reports")
README_PATH = Path("README.md")
PROJECT_ROOT = Path(".")
PID_FILE = LOGS_DIR / "runner.pid"
SESSION_FILE = LOGS_DIR / "session.json"

# Generate unique session ID for this run
SESSION_ID = datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + str(uuid.uuid4())[:8]

# GPU Resource Control
GPU_ID = "1"  # Use GPU 0 (least active)
GPU_LAYERS = 35  # ~75-80% GPU usage for 7B models (max ~45)
MAX_PARALLEL_REQUESTS = 1  # One request at a time
USE_GPU_CONTROLS = True  # Set to False to disable GPU controls

# Ensure directories exist
LOGS_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)

# Initialize event emitter for dashboard
event_emitter = AITestEventEmitter(
    stream_file=LOGS_DIR / "live_stream.jsonl",
    results_file=LOGS_DIR / "test_results.json",
)


def log(msg):
    """Simple logger with timestamp - writes to session-specific log"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Handle Unicode encoding for Windows console
    try:
        print(f"[{timestamp}] {msg}")
    except UnicodeEncodeError:
        # Fallback: remove emojis for Windows console
        msg_ascii = msg.encode("ascii", "ignore").decode("ascii")
        print(f"[{timestamp}] {msg_ascii}")

    # Write to session-specific log file
    log_file = LOGS_DIR / f"session_{SESSION_ID}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {msg}\n")


def check_pid_file():
    """Check if another instance is already running"""
    if PID_FILE.exists():
        try:
            with open(PID_FILE, "r") as f:
                pid = int(f.read().strip())

            # Check if process exists
            if sys.platform == "win32":
                import ctypes

                kernel32 = ctypes.windll.kernel32
                SYNCHRONIZE = 0x00100000
                process = kernel32.OpenProcess(SYNCHRONIZE, 0, pid)
                if process != 0:
                    kernel32.CloseHandle(process)
                    return True, pid
            else:
                os.kill(pid, 0)  # Doesn't actually kill, just checks
                return True, pid
        except (ProcessLookupError, ValueError, OSError):
            # Process doesn't exist, remove stale PID file
            PID_FILE.unlink(missing_ok=True)
    return False, None


def create_pid_file():
    """Create PID file with current process ID"""
    PID_FILE.parent.mkdir(exist_ok=True)
    with open(PID_FILE, "w") as f:
        f.write(str(os.getpid()))
    log(f"📝 Created PID file: {PID_FILE} (PID: {os.getpid()})")


def remove_pid_file():
    """Remove PID file on exit"""
    if PID_FILE.exists():
        PID_FILE.unlink()
        log("🗑️ Removed PID file")


def create_session_metadata():
    """Create session metadata file for reconnection"""
    SESSION_FILE.parent.mkdir(exist_ok=True)
    session_data = {
        "session_id": SESSION_ID,
        "pid": os.getpid(),
        "start_time": datetime.now().isoformat(),
        "log_file": f"session_{SESSION_ID}.log",
        "stream_file": "live_stream.jsonl",
        "status": "running",
    }
    with open(SESSION_FILE, "w", encoding="utf-8") as f:
        json.dump(session_data, f, indent=2)
    log(f"📝 Created session metadata: {SESSION_FILE}")


def update_session_status(status: str, run_number: int = 0):
    """Update session status in metadata"""
    if SESSION_FILE.exists():
        with open(SESSION_FILE, "r", encoding="utf-8") as f:
            session_data = json.load(f)
        session_data["status"] = status
        session_data["last_update"] = datetime.now().isoformat()
        session_data["current_cycle"] = run_number
        with open(SESSION_FILE, "w", encoding="utf-8") as f:
            json.dump(session_data, f, indent=2)


def get_current_session():
    """Get current session metadata if exists"""
    if SESSION_FILE.exists():
        try:
            with open(SESSION_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return None
    return None


def remove_session_metadata():
    """Remove session metadata on exit"""
    if SESSION_FILE.exists():
        SESSION_FILE.unlink()
        log("🗑️ Removed session metadata")


def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    log(f"\n🛑 Received signal {signum}, shutting down gracefully...")
    update_session_status("stopped")
    remove_session_metadata()
    remove_pid_file()
    sys.exit(0)


def check_test_server():
    """Check if test dev server is running on port 3100, start if not"""
    import socket

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(("localhost", 3100))
    sock.close()

    if result != 0:
        log("🚀 Starting test dev server on port 3100...")
        # Start dev server in background - don't wait for it
        subprocess.Popen(
            "npm run dev:test",
            cwd=TEST_DIR,
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        log("⏳ Waiting 15 seconds for server to start...")
        time.sleep(15)
        log("✅ Test server should be ready")
    else:
        log("✅ Test server already running on port 3100")


def run_playwright_tests():
    """Run Playwright tests and return results with detailed streaming output"""
    log("🎭 Running Playwright tests...")

    # Ensure test server is running
    check_test_server()

    # First, discover tests
    log("🔍 Discovering test files...")
    event_emitter.ai_thinking("Discovering Playwright tests...")

    try:
        list_result = subprocess.run(
            "npx playwright test --list",
            cwd=TEST_DIR,
            capture_output=True,
            text=True,
            timeout=30,
            shell=True,
        )

        if list_result.stdout:
            test_count = list_result.stdout.count("[chromium]")
            event_emitter.test_discovered("All test files", test_count)
            log(f"📋 Found {test_count} tests")

            # Show first few test names
            for line in list_result.stdout.split("\n")[:10]:
                if "[chromium]" in line:
                    event_emitter.test_output(line.strip())

    except Exception as e:
        log(f"⚠️ Could not list tests: {e}")

    test_results = {"headless": None, "headed": None}

    # Run headless tests with streaming output
    log("🎭 Starting HEADLESS test run...")
    event_emitter.ai_thinking("Running headless Playwright tests...")

    try:
        # Use Popen for streaming output
        process = subprocess.Popen(
            "npx playwright test --reporter=json",
            cwd=TEST_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True,
        )

        stdout, stderr = process.communicate(timeout=300)  # 5 minute timeout

        # Stream stderr (progress) to dashboard
        if stderr:
            for line in stderr.split("\n"):
                if line.strip():
                    log(f"  {line}")
                    event_emitter.test_output(line)

        output_file = (
            LOGS_DIR
            / f"playwright_headless_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(stdout)

        if stdout.strip():
            try:
                test_results["headless"] = json.loads(stdout)
                log(f"✅ Headless tests completed. Exit code: {process.returncode}")
            except json.JSONDecodeError as e:
                log(f"⚠️ Failed to parse headless JSON: {e}")
                test_results["headless"] = {"error": f"json parse error: {e}"}
        else:
            log(f"⚠️ No output from headless tests. Exit code: {process.returncode}")
            test_results["headless"] = {
                "error": f"no output, exit code {process.returncode}"
            }

    except subprocess.TimeoutExpired:
        log("⚠️ Headless tests timed out after 5 minutes")
        test_results["headless"] = {"error": "timeout"}
        process.kill()
    except Exception as e:
        log(f"❌ Headless tests failed: {e}")
        test_results["headless"] = {"error": str(e)}
        event_emitter.error("Headless test execution failed", str(e))

    # Skip headed tests for now to avoid hanging
    log("⏭️  Skipping headed tests for speed...")
    test_results["headed"] = {"skipped": True}

    return test_results


def extract_failures(test_data):
    """Extract detailed failure information from test results"""
    if not test_data or "error" in test_data:
        return []

    failures = []

    def process_suite(suite, file_path=""):
        # Get file path from suite
        current_file = suite.get("file", file_path)

        for spec in suite.get("specs", []):
            spec_file = spec.get("file", current_file)

            for test in spec.get("tests", []):
                for result in test.get("results", []):
                    if result.get("status") != "passed":
                        failures.append(
                            {
                                "file": spec_file,
                                "title": spec.get("title", "Unknown"),
                                "test_title": test.get("title", "Unknown"),
                                "status": result.get("status", "unknown"),
                                "error": result.get("error", {}),
                                "duration": result.get("duration", 0),
                            }
                        )

        # Process nested suites
        for subsuite in suite.get("suites", []):
            process_suite(subsuite, current_file)

    for suite in test_data.get("suites", []):
        process_suite(suite)

    return failures


def read_file_safe(file_path):
    """Safely read a file, returning None if it fails"""
    try:
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
    except Exception as e:
        log(f"⚠️ Could not read {file_path}: {e}")
    return None


def generate_file_tree(
    root_path,
    max_depth=3,
    exclude_dirs={".next", "node_modules", ".git", "dist", "build"},
):
    """Generate a simple file tree for context"""
    tree_lines = []

    def walk_dir(path, depth=0, prefix=""):
        if depth > max_depth:
            return

        try:
            items = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name))
            for i, item in enumerate(items):
                if item.name.startswith(".") and item.name not in {".env.example"}:
                    continue
                if item.name in exclude_dirs:
                    continue

                is_last = i == len(items) - 1
                current_prefix = "└── " if is_last else "├── "
                tree_lines.append(f"{prefix}{current_prefix}{item.name}")

                if item.is_dir() and depth < max_depth:
                    next_prefix = prefix + ("    " if is_last else "│   ")
                    walk_dir(item, depth + 1, next_prefix)
        except PermissionError:
            pass

    walk_dir(root_path)
    return "\n".join(tree_lines[:200])  # Limit output


def enrich_context(test_results):
    """Gather comprehensive context about failures"""
    log("📚 Enriching context with code files...")

    context = {
        "failures": [],
        "test_files": {},
        "source_files": {},
        "config_files": {},
        "project_tree": "",
        "readme": "",
    }

    # Extract all failures from both test runs
    all_failures = []
    if test_results.get("headless"):
        all_failures.extend(extract_failures(test_results["headless"]))
    if test_results.get("headed"):
        all_failures.extend(extract_failures(test_results["headed"]))

    context["failures"] = all_failures
    log(f"📋 Found {len(all_failures)} test failures")

    # Read failing test files
    test_files_read = set()
    for failure in all_failures:
        file_path = failure.get("file")
        if file_path and file_path not in test_files_read:
            full_path = TEST_DIR / file_path
            content = read_file_safe(full_path)
            if content:
                context["test_files"][file_path] = content
                test_files_read.add(file_path)
                log(f"📖 Read test file: {file_path}")

    # Try to infer and read source files from test names
    for failure in all_failures:
        test_file = failure.get("file", "")

        # Infer source file from test path
        # e.g., tests/e2e/auth.spec.ts -> src/app/auth/*
        if "auth" in test_file.lower():
            for pattern in ["src/app/auth/**/*.tsx", "src/app/auth/**/*.ts"]:
                for src_file in (PROJECT_ROOT / TEST_DIR).glob(pattern):
                    rel_path = src_file.relative_to(PROJECT_ROOT / TEST_DIR)
                    if str(rel_path) not in context["source_files"]:
                        content = read_file_safe(src_file)
                        if content:
                            context["source_files"][str(rel_path)] = content
                            log(f"📖 Read source file: {rel_path}")

    # Read key config files
    config_files = [
        TEST_DIR / "playwright.config.ts",
        TEST_DIR / "next.config.js",
        TEST_DIR / "package.json",
        TEST_DIR / "tsconfig.json",
    ]

    for config_file in config_files:
        if config_file.exists():
            content = read_file_safe(config_file)
            if content:
                context["config_files"][config_file.name] = content
                log(f"⚙️ Read config: {config_file.name}")

    # Generate project tree
    context["project_tree"] = generate_file_tree(TEST_DIR)

    # Read README
    if README_PATH.exists():
        context["readme"] = read_file_safe(README_PATH)[:10000]

    log("✅ Context enrichment complete")
    return context


def build_enhanced_prompt(test_results, context):
    """Build a comprehensive prompt with full code context"""

    prompt = f"""You are an expert test failure analyst with full access to the codebase.

# TEST RESULTS SUMMARY

Headless: {count_results(test_results.get("headless"))}
Headed: {count_results(test_results.get("headed"))}

# DETAILED FAILURES

"""

    # Add detailed failure info
    for i, failure in enumerate(context["failures"][:10], 1):  # Limit to 10 failures
        prompt += f"""
## Failure {i}: {failure['file']}
**Test**: {failure['test_title']}
**Status**: {failure['status']}
**Error**: {failure.get('error', {}).get('message', 'No message')}

"""

        # Add stack trace if available
        if failure.get("error", {}).get("stack"):
            prompt += (
                f"**Stack Trace**:\n```\n{failure['error']['stack'][:500]}\n```\n\n"
            )

    # Add test file contents
    if context["test_files"]:
        prompt += "\n# TEST FILES\n\n"
        for file_path, content in list(context["test_files"].items())[
            :3
        ]:  # Limit to 3 files
            prompt += f"## {file_path}\n```typescript\n{content[:2000]}\n```\n\n"

    # Add relevant source files
    if context["source_files"]:
        prompt += "\n# SOURCE FILES\n\n"
        for file_path, content in list(context["source_files"].items())[:3]:
            prompt += f"## {file_path}\n```typescript\n{content[:2000]}\n```\n\n"

    # Add config files
    if context["config_files"]:
        prompt += "\n# CONFIGURATION\n\n"
        for file_name, content in context["config_files"].items():
            prompt += f"## {file_name}\n```\n{content[:1000]}\n```\n\n"

    # Add project structure
    if context["project_tree"]:
        prompt += f"\n# PROJECT STRUCTURE\n\n```\n{context['project_tree']}\n```\n\n"

    prompt += """
# YOUR TASK

Provide a comprehensive analysis with:

1. **Root Cause Analysis** (with file:line references)
2. **Specific Code Fixes** (provide actual code changes)
3. **Test Improvements** (if tests need updating)
4. **Configuration Changes** (if config is the issue)
5. **Priority** (High/Medium/Low)

Format your response with clear sections and code blocks.
Be specific - reference exact files, line numbers, and provide working code snippets.
"""

    return prompt


def count_results(test_data):
    """Extract pass/fail counts from test results"""
    if not test_data:
        return {"passed": 0, "failed": 0, "total": 0, "error": "no data"}

    if "error" in test_data:
        return {
            "passed": 0,
            "failed": 0,
            "total": 0,
            "error": test_data.get("error"),
        }

    if "skipped" in test_data:
        return {"passed": 0, "failed": 0, "total": 0, "skipped": True}

    passed = 0
    failed = 0
    total = 0

    def count_tests(suite):
        nonlocal passed, failed, total
        for spec in suite.get("specs", []):
            for test in spec.get("tests", []):
                total += 1
                results = test.get("results", [])
                if results and results[0].get("status") == "passed":
                    passed += 1
                else:
                    failed += 1

        for subsuite in suite.get("suites", []):
            count_tests(subsuite)

    for suite in test_data.get("suites", []):
        count_tests(suite)

    return {"passed": passed, "failed": failed, "total": total}


def update_markdown_report(run_number, headless_counts, headed_counts):
    """Update the test run report markdown"""
    report_file = REPORTS_DIR / "test_runs.md"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not report_file.exists():
        content = "# Continuous Test Run Report\n\n"
        content += (
            "| Run | Time | Headless Pass/Fail/Total | Headed Pass/Fail/Total |\n"
        )
        content += (
            "|-----|------|--------------------------|------------------------|\n"
        )
    else:
        with open(report_file, "r", encoding="utf-8") as f:
            content = f.read()

    h_status = f"{headless_counts.get('passed', 0)}/{headless_counts.get('failed', 0)}/{headless_counts.get('total', 0)}"
    if "error" in headless_counts:
        h_status += f" (error: {headless_counts['error']})"

    headed_status = f"{headed_counts.get('passed', 0)}/{headed_counts.get('failed', 0)}/{headed_counts.get('total', 0)}"
    if "error" in headed_counts:
        headed_status += f" (error: {headed_counts['error']})"

    content += f"| {run_number} | {timestamp} | {h_status} | {headed_status} |\n"

    with open(report_file, "w", encoding="utf-8") as f:
        f.write(content)

    log(f"📊 Updated report: {report_file}")


def call_ollama_enhanced(test_results):
    """Call Ollama with enriched context for deep analysis"""
    log("🤖 Calling Ollama with enhanced context...")
    event_emitter.ai_thinking("Enriching context with test files and source code...")

    # Enrich context with code files
    context = enrich_context(test_results)

    if not context["failures"]:
        log("ℹ️ No failures to analyze")
        event_emitter.ai_thinking("No failures found to analyze")
        return None

    event_emitter.ai_thinking(f"Found {len(context['failures'])} failures to analyze")

    # Build comprehensive prompt
    prompt = build_enhanced_prompt(test_results, context)

    # Save prompt for debugging
    prompt_file = LOGS_DIR / f"prompt_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(prompt_file, "w", encoding="utf-8") as f:
        f.write(prompt)
    log(f"💾 Saved prompt to {prompt_file}")

    # Emit the actual prompt to dashboard
    event_emitter.ai_prompt(prompt)
    event_emitter.ai_thinking(
        f"Sending {len(prompt)} character prompt to {OLLAMA_MODEL}..."
    )

    try:
        # Prepare environment with GPU controls
        env = os.environ.copy()
        if USE_GPU_CONTROLS:
            env["CUDA_VISIBLE_DEVICES"] = GPU_ID
            env["OLLAMA_NUM_GPU"] = "1"
            env["OLLAMA_NUM_PARALLEL"] = str(MAX_PARALLEL_REQUESTS)

        # Build command with GPU layer control
        if USE_GPU_CONTROLS and GPU_LAYERS:
            cmd = f"ollama run {OLLAMA_MODEL} --gpu-layers {GPU_LAYERS}"
        else:
            cmd = f"ollama run {OLLAMA_MODEL}"

        log(f"🤖 Executing: {cmd} (with {len(prompt)} char prompt)")
        event_emitter.ai_thinking(
            f"AI model {OLLAMA_MODEL} processing on GPU {GPU_ID}..."
        )

        # Call Ollama with enhanced prompt and GPU controls
        # Use Popen to stream output
        process = subprocess.Popen(
            f'{cmd} "{prompt}"',
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True,
            env=env,
        )

        # Stream the response
        ai_response = ""
        log("📥 Streaming AI response...")

        for line in iter(process.stdout.readline, ""):
            if not line:
                break
            ai_response += line
            # Emit chunks to dashboard
            event_emitter.ai_response_chunk(line.rstrip())
            log(f"  AI: {line.rstrip()}")

        process.wait(timeout=180)  # 3 min timeout

        # Get any remaining output
        remaining, stderr = process.communicate(timeout=1)
        if remaining:
            ai_response += remaining
            event_emitter.ai_response_chunk(remaining.rstrip())

        if ai_response.strip():
            # Emit full response
            event_emitter.ai_full_response(ai_response)

            # Save to suggestions file
            suggestions_file = REPORTS_DIR / "ai_suggestions_enhanced.md"
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            with open(suggestions_file, "a", encoding="utf-8") as f:
                f.write(f"\n\n{'='*60}\n")
                f.write(f"# Analysis at {timestamp}\n")
                f.write(f"{'='*60}\n\n")
                f.write(ai_response)
                f.write("\n")

            log(f"✅ Enhanced AI analysis saved to {suggestions_file}")

            # Emit RCA and fixes to dashboard
            # Try to parse the response for structured output
            for failure in context["failures"]:
                test_name = f"{failure['file']}::{failure['title']}"
                event_emitter.ai_rca(
                    test_name,
                    f"AI Analysis for {failure['title']}: See full response above",
                )
                event_emitter.ai_fix(
                    test_name, f"See AI full response for detailed fixes"
                )

            return ai_response
        else:
            log("⚠️ Ollama returned empty response")
            event_emitter.error("Ollama returned empty response")
            return None

    except subprocess.TimeoutExpired:
        log("⚠️ Ollama timed out after 3 minutes")
        event_emitter.error("Ollama timed out after 3 minutes")
        process.kill()
        return None
    except Exception as e:
        log(f"❌ Ollama call failed: {e}")
        event_emitter.error("Ollama call failed", str(e))
        return None


def main():
    """Main continuous test loop"""
    # Check for existing instance
    is_running, existing_pid = check_pid_file()
    if is_running:
        log(f"❌ Another instance is already running (PID: {existing_pid})")
        log(f"   Session info available in: {SESSION_FILE}")
        log(f"   Dashboard will connect to existing session automatically")
        sys.exit(1)

    # Create PID file and session metadata
    create_pid_file()
    create_session_metadata()

    # Register cleanup handlers
    atexit.register(remove_session_metadata)
    atexit.register(remove_pid_file)
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    log("🚀 Starting Enhanced Continuous AI Test Loop")
    log(f"   - Session ID: {SESSION_ID}")
    log(f"   - Test directory: {TEST_DIR.absolute()}")
    log(f"   - Logs: {LOGS_DIR.absolute()}")
    log(f"   - Session log: session_{SESSION_ID}.log")
    log(f"   - Reports: {REPORTS_DIR.absolute()}")
    log(f"   - Sleep interval: {SLEEP_MINUTES} minutes")
    log(f"   - Ollama model: {OLLAMA_MODEL}")
    log(f"   - Process ID: {os.getpid()}")
    log(f"   - Enhanced mode: ACTIVE 🔥")

    event_emitter.emit(
        "runner_start",
        {
            "message": "Enhanced AI test runner started",
            "config": {
                "sleep_minutes": SLEEP_MINUTES,
                "model": OLLAMA_MODEL,
                "gpu_id": GPU_ID,
            },
        },
    )

    run_number = 1

    while True:
        try:
            log(f"\n{'='*60}")
            log(f"🔄 Starting test run #{run_number}")
            log(f"{'='*60}")

            update_session_status("running", run_number)
            event_emitter.start_cycle(run_number)

            # Run tests
            test_results = run_playwright_tests()

            # Count results
            headless_counts = count_results(test_results["headless"])
            headed_counts = count_results(test_results["headed"])

            log(f"📊 Headless: {headless_counts}")
            log(f"📊 Headed: {headed_counts}")

            # Emit test results to dashboard
            for test_type, counts in [
                ("headless", headless_counts),
                ("headed", headed_counts),
            ]:
                for status, count in counts.items():
                    if status != "error":
                        for i in range(count):
                            event_emitter.test_complete(
                                test_name=f"{test_type}_test_{i+1}",
                                status=status,
                                duration_ms=0,
                            )

            # Update markdown report
            update_markdown_report(run_number, headless_counts, headed_counts)

            # If any failures, call enhanced Ollama analysis
            has_failures = (
                headless_counts.get("failed", 0) > 0
                or headed_counts.get("failed", 0) > 0
                or "error" in headless_counts
                or "error" in headed_counts
            )

            if has_failures:
                log("⚠️ Failures detected, running ENHANCED AI analysis...")
                event_emitter.ai_thinking(
                    "Analyzing test failures with enhanced context..."
                )
                call_ollama_enhanced(test_results)
            else:
                log("✅ All tests passed! No AI analysis needed.")
                event_emitter.ai_thinking("All tests passed - no analysis needed")

            # Cycle complete
            event_emitter.cycle_complete(
                {
                    "run_number": run_number,
                    "total_tests": headless_counts.get("passed", 0)
                    + headless_counts.get("failed", 0)
                    + headed_counts.get("passed", 0)
                    + headed_counts.get("failed", 0),
                    "passed": headless_counts.get("passed", 0)
                    + headed_counts.get("passed", 0),
                    "failed": headless_counts.get("failed", 0)
                    + headed_counts.get("failed", 0),
                }
            )

            # Sleep before next run
            update_session_status("sleeping", run_number)
            log(f"😴 Sleeping for {SLEEP_MINUTES} minutes before next run...")
            time.sleep(SLEEP_MINUTES * 60)

            run_number += 1

        except KeyboardInterrupt:
            log("\n👋 Stopped by user (Ctrl+C)")
            update_session_status("stopped")
            remove_session_metadata()
            remove_pid_file()
            sys.exit(0)
        except Exception as e:
            log(f"❌ Unexpected error in main loop: {e}")
            log("   Continuing anyway...")
            update_session_status("error", run_number)
            time.sleep(60)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"💥 Fatal error: {e}")
        update_session_status("crashed")
        remove_session_metadata()
        remove_pid_file()
        sys.exit(1)
