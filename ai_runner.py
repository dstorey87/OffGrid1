#!/usr/bin/env python3
"""
Continuous AI Test Loop - Simple Orchestrator
Runs Playwright tests continuously, calls Ollama on failures, repeats forever.
"""

import json
import subprocess
import time
from datetime import datetime
from pathlib import Path
import sys
import os

# Config
SLEEP_MINUTES = 15
OLLAMA_MODEL = "qwen2.5"
TEST_DIR = Path("frontend")
LOGS_DIR = Path("logs")
REPORTS_DIR = Path("reports")
README_PATH = Path("README.md")

# GPU Resource Control
GPU_ID = "1"  # Use GPU 0 (least active)
GPU_LAYERS = 35  # ~75-80% GPU usage for 7B models
MAX_PARALLEL_REQUESTS = 1  # One request at a time
USE_GPU_CONTROLS = True  # Set to False to disable GPU controls

# Ensure directories exist
LOGS_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)


def log(msg):
    """Simple logger with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {msg}")

    # Also append to log file
    log_file = LOGS_DIR / f"runner_{datetime.now().strftime('%Y%m%d')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {msg}\n")


def run_playwright_tests():
    """Run Playwright tests and return results"""
    log("🎭 Running Playwright tests...")

    test_results = {"headless": None, "headed": None}

    # Run headless first
    try:
        result = subprocess.run(
            "npx playwright test --reporter=json",
            cwd=TEST_DIR,
            capture_output=True,
            text=True,
            timeout=600,  # 10 min timeout
            shell=True,  # Required on Windows to find npx
        )

        # Save raw output
        output_file = (
            LOGS_DIR
            / f"playwright_headless_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(result.stdout)

        # Parse JSON
        if result.stdout.strip():
            try:
                test_results["headless"] = json.loads(result.stdout)
            except json.JSONDecodeError as e:
                log(f"⚠️ Failed to parse headless JSON: {e}")
                test_results["headless"] = {"error": f"json parse error: {e}"}

        log(f"✅ Headless tests completed. Exit code: {result.returncode}")

    except subprocess.TimeoutExpired:
        log("⚠️ Headless tests timed out after 10 minutes")
        test_results["headless"] = {"error": "timeout"}
    except Exception as e:
        log(f"❌ Headless tests failed: {e}")
        test_results["headless"] = {"error": str(e)}

    # Run headed (UI mode with browser visible)
    try:
        result = subprocess.run(
            "npx playwright test --headed --reporter=json",
            cwd=TEST_DIR,
            capture_output=True,
            text=True,
            timeout=600,
            shell=True,  # Required on Windows to find npx
        )

        output_file = (
            LOGS_DIR
            / f"playwright_headed_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(result.stdout)

        if result.stdout.strip():
            try:
                test_results["headed"] = json.loads(result.stdout)
            except json.JSONDecodeError as e:
                log(f"⚠️ Failed to parse headed JSON: {e}")
                test_results["headed"] = {"error": f"json parse error: {e}"}

        log(f"✅ Headed tests completed. Exit code: {result.returncode}")

    except subprocess.TimeoutExpired:
        log("⚠️ Headed tests timed out after 10 minutes")
        test_results["headed"] = {"error": "timeout"}
    except Exception as e:
        log(f"❌ Headed tests failed: {e}")
        test_results["headed"] = {"error": str(e)}

    return test_results


def count_results(test_data):
    """Extract pass/fail counts from test results"""
    if not test_data or "error" in test_data:
        return {
            "passed": 0,
            "failed": 0,
            "total": 0,
            "error": test_data.get("error") if test_data else "no data",
        }

    # Parse Playwright JSON format
    stats = test_data.get("stats", {})
    suites = test_data.get("suites", [])

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

    for suite in suites:
        count_tests(suite)

    return {"passed": passed, "failed": failed, "total": total}


def update_markdown_report(run_number, headless_counts, headed_counts):
    """Update the test run report markdown"""
    report_file = REPORTS_DIR / "test_runs.md"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create or append to report
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

    # Format counts
    h_status = f"{headless_counts.get('passed', 0)}/{headless_counts.get('failed', 0)}/{headless_counts.get('total', 0)}"
    if "error" in headless_counts:
        h_status += f" (error: {headless_counts['error']})"

    headed_status = f"{headed_counts.get('passed', 0)}/{headed_counts.get('failed', 0)}/{headed_counts.get('total', 0)}"
    if "error" in headed_counts:
        headed_status += f" (error: {headed_counts['error']})"

    # Add new row
    content += f"| {run_number} | {timestamp} | {h_status} | {headed_status} |\n"

    with open(report_file, "w", encoding="utf-8") as f:
        f.write(content)

    log(f"📊 Updated report: {report_file}")


def call_ollama_for_analysis(test_results):
    """Call Ollama to analyze test failures and suggest fixes"""
    log("🤖 Calling Ollama for AI analysis...")

    # Read README for context
    readme_content = ""
    if README_PATH.exists():
        with open(README_PATH, "r", encoding="utf-8") as f:
            readme_content = f.read()[:8000]  # Limit context

    # Prepare prompt
    prompt = f"""You are a test failure analyst. Review the test results below and provide:

1. **Root Cause**: What's likely causing the failures?
2. **Suggested Fixes**: Concrete steps to fix the issues
3. **Priority**: High/Medium/Low

# Test Results
{json.dumps(test_results, indent=2)}

# Project Context (README excerpt)
{readme_content}

Keep your analysis concise and actionable. Focus on the most critical failures first.
"""

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

        # Call Ollama with GPU controls
        result = subprocess.run(
            f'{cmd} "{prompt}"',
            capture_output=True,
            text=True,
            timeout=120,  # 2 min timeout for AI
            shell=True,  # Required on Windows
            env=env,
        )

        ai_response = result.stdout.strip()

        if ai_response:
            # Save to suggestions file
            suggestions_file = REPORTS_DIR / "ai_suggestions.md"

            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            with open(suggestions_file, "a", encoding="utf-8") as f:
                f.write(f"\n\n---\n## Analysis at {timestamp}\n\n")
                f.write(ai_response)
                f.write("\n")

            log(f"✅ AI suggestions saved to {suggestions_file}")
            return ai_response
        else:
            log("⚠️ Ollama returned empty response")
            return None

    except subprocess.TimeoutExpired:
        log("⚠️ Ollama timed out after 2 minutes")
        return None
    except FileNotFoundError:
        log("❌ Ollama not found. Make sure it's installed and in PATH")
        return None
    except Exception as e:
        log(f"❌ Ollama call failed: {e}")
        return None


def main():
    """Main loop"""
    log("🚀 Starting Continuous AI Test Loop")
    log(f"   - Test directory: {TEST_DIR.absolute()}")
    log(f"   - Logs: {LOGS_DIR.absolute()}")
    log(f"   - Reports: {REPORTS_DIR.absolute()}")
    log(f"   - Sleep interval: {SLEEP_MINUTES} minutes")
    log(f"   - Ollama model: {OLLAMA_MODEL}")

    run_number = 1

    while True:
        try:
            log(f"\n{'='*60}")
            log(f"🔄 Starting test run #{run_number}")
            log(f"{'='*60}")

            # Run tests
            test_results = run_playwright_tests()

            # Count results
            headless_counts = count_results(test_results["headless"])
            headed_counts = count_results(test_results["headed"])

            log(f"📊 Headless: {headless_counts}")
            log(f"📊 Headed: {headed_counts}")

            # Update markdown report
            update_markdown_report(run_number, headless_counts, headed_counts)

            # If any failures, call Ollama
            has_failures = (
                headless_counts.get("failed", 0) > 0
                or headed_counts.get("failed", 0) > 0
                or "error" in headless_counts
                or "error" in headed_counts
            )

            if has_failures:
                log("⚠️ Failures detected, requesting AI analysis...")
                call_ollama_for_analysis(test_results)
            else:
                log("✅ All tests passed! No AI analysis needed.")

            # Sleep before next run
            log(f"😴 Sleeping for {SLEEP_MINUTES} minutes before next run...")
            time.sleep(SLEEP_MINUTES * 60)

            run_number += 1

        except KeyboardInterrupt:
            log("\n👋 Stopped by user (Ctrl+C)")
            sys.exit(0)
        except Exception as e:
            log(f"❌ Unexpected error in main loop: {e}")
            log("   Continuing anyway...")
            time.sleep(60)  # Wait 1 min before retry


if __name__ == "__main__":
    main()
