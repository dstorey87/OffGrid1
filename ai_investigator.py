#!/usr/bin/env python3
"""
AI Code Investigator - Deep Dive Analysis
Give AI maximum power to interrogate code and propose fixes.
Usage: python ai_investigator.py <test-results.json>
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime
import os


OLLAMA_MODEL = "qwen2.5"
PROJECT_ROOT = Path(".")
FRONTEND = Path("frontend")
REPORTS_DIR = Path("reports")

# GPU Resource Control
# ============================================================================
# GPU RESOURCE CONTROLS
# ============================================================================
GPU_ID = "1"  # Which GPU to use (0, 1, 2, etc.)
GPU_LAYERS = 35  # ~75-80% GPU usage for 7B models
MAX_PARALLEL_REQUESTS = 1  # One request at a time
USE_GPU_CONTROLS = True  # Set to False to disable GPU controls


def read_file_safe(file_path):
    """Safely read a file"""
    try:
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
    except:
        pass
    return None


def extract_all_test_info(test_data):
    """Extract comprehensive test information"""
    info = {"failures": [], "files": set(), "errors": []}

    def process_suite(suite, file_path=""):
        current_file = suite.get("file", file_path)

        for spec in suite.get("specs", []):
            spec_file = spec.get("file", current_file)
            if spec_file:
                info["files"].add(spec_file)

            for test in spec.get("tests", []):
                for result in test.get("results", []):
                    if result.get("status") != "passed":
                        error_msg = result.get("error", {}).get("message", "")
                        error_stack = result.get("error", {}).get("stack", "")

                        info["failures"].append(
                            {
                                "file": spec_file,
                                "suite": spec.get("title", ""),
                                "test": test.get("title", ""),
                                "status": result.get("status"),
                                "error": error_msg,
                                "stack": error_stack,
                                "duration": result.get("duration", 0),
                            }
                        )

                        info["errors"].append(f"{spec_file}: {error_msg}")

        for subsuite in suite.get("suites", []):
            process_suite(subsuite, current_file)

    for suite in test_data.get("suites", []):
        process_suite(suite)

    return info


def gather_comprehensive_context(test_info):
    """Gather ALL relevant code context"""
    print("🔍 Gathering comprehensive code context...")

    context = {
        "test_files": {},
        "source_files": {},
        "config_files": {},
        "api_routes": {},
        "components": {},
        "pages": {},
    }

    # Read all failing test files
    for test_file in test_info["files"]:
        full_path = FRONTEND / test_file
        content = read_file_safe(full_path)
        if content:
            context["test_files"][test_file] = content
            print(f"  ✅ Test file: {test_file}")

    # Infer and read related source files from error messages and test names
    keywords = set()
    for failure in test_info["failures"]:
        # Extract keywords from test names
        words = failure["test"].lower().split()
        keywords.update([w for w in words if len(w) > 3])

        # Extract from file paths
        if failure["file"]:
            parts = Path(failure["file"]).parts
            keywords.update([p.replace("-", "").replace("_", "") for p in parts])

    # Search for related files
    search_patterns = {
        "pages": "src/app/**/page.tsx",
        "components": "src/components/**/*.tsx",
        "api_routes": "src/app/api/**/*.ts",
        "lib": "src/lib/**/*.ts",
    }

    for category, pattern in search_patterns.items():
        for file_path in FRONTEND.glob(pattern):
            file_name_lower = file_path.name.lower()

            # Check if any keyword matches
            if any(
                keyword in file_name_lower or keyword in str(file_path).lower()
                for keyword in keywords
            ):
                content = read_file_safe(file_path)
                if content:
                    rel_path = file_path.relative_to(FRONTEND)
                    if category == "pages":
                        context["pages"][str(rel_path)] = content
                    elif category == "components":
                        context["components"][str(rel_path)] = content
                    elif category == "api_routes":
                        context["api_routes"][str(rel_path)] = content
                    else:
                        context["source_files"][str(rel_path)] = content
                    print(f"  ✅ {category}: {rel_path}")

    # Read key config files
    configs = [
        "playwright.config.ts",
        "next.config.js",
        "package.json",
        "tsconfig.json",
        ".env.example",
    ]

    for config in configs:
        full_path = FRONTEND / config
        content = read_file_safe(full_path)
        if content:
            context["config_files"][config] = content
            print(f"  ✅ Config: {config}")

    print(
        f"📚 Context gathered: {len(context['test_files'])} test files, "
        f"{len(context['source_files']) + len(context['pages']) + len(context['components'])} source files, "
        f"{len(context['config_files'])} configs"
    )

    return context


def build_investigator_prompt(test_info, context):
    """Build ultra-comprehensive prompt for deep investigation"""

    prompt = f"""You are an EXPERT debugging AI with FULL ACCESS to the codebase.

# MISSION
Investigate test failures, identify root causes, and provide SPECIFIC, ACTIONABLE fixes with exact code changes.

# TEST FAILURES ({len(test_info['failures'])} total)

"""

    # Detailed failure breakdown
    for i, failure in enumerate(test_info["failures"], 1):
        prompt += f"""
{'='*60}
## FAILURE {i}: {failure['file']}

**Suite**: {failure['suite']}
**Test**: {failure['test']}
**Status**: {failure['status']}
**Duration**: {failure['duration']}ms

**Error Message**:
{failure['error']}

"""
        if failure["stack"]:
            prompt += f"""**Stack Trace**:
```
{failure['stack'][:1000]}
```

"""

    # Add all test file contents
    if context["test_files"]:
        prompt += f"\n\n{'='*60}\n# TEST FILES ({len(context['test_files'])} files)\n{'='*60}\n\n"
        for file_path, content in context["test_files"].items():
            prompt += f"## {file_path}\n```typescript\n{content}\n```\n\n"

    # Add page files
    if context["pages"]:
        prompt += (
            f"\n\n{'='*60}\n# PAGE FILES ({len(context['pages'])} files)\n{'='*60}\n\n"
        )
        for file_path, content in context["pages"].items():
            prompt += f"## {file_path}\n```typescript\n{content[:3000]}\n```\n\n"

    # Add component files
    if context["components"]:
        prompt += f"\n\n{'='*60}\n# COMPONENT FILES ({len(context['components'])} files)\n{'='*60}\n\n"
        for file_path, content in context["components"].items():
            prompt += f"## {file_path}\n```typescript\n{content[:3000]}\n```\n\n"

    # Add API routes
    if context["api_routes"]:
        prompt += f"\n\n{'='*60}\n# API ROUTES ({len(context['api_routes'])} files)\n{'='*60}\n\n"
        for file_path, content in context["api_routes"].items():
            prompt += f"## {file_path}\n```typescript\n{content[:3000]}\n```\n\n"

    # Add other source files
    if context["source_files"]:
        prompt += f"\n\n{'='*60}\n# SOURCE FILES ({len(context['source_files'])} files)\n{'='*60}\n\n"
        for file_path, content in context["source_files"].items():
            prompt += f"## {file_path}\n```typescript\n{content[:2000]}\n```\n\n"

    # Add config files
    if context["config_files"]:
        prompt += f"\n\n{'='*60}\n# CONFIGURATION FILES\n{'='*60}\n\n"
        for file_name, content in context["config_files"].items():
            prompt += f"## {file_name}\n```\n{content[:1500]}\n```\n\n"

    prompt += f"""

{'='*60}
# YOUR ANALYSIS TASK
{'='*60}

Provide a COMPREHENSIVE analysis with:

## 1. ROOT CAUSE ANALYSIS
- Identify the exact reason each test is failing
- Reference specific files and line numbers
- Explain the chain of events leading to failure

## 2. SPECIFIC CODE FIXES
For EACH failure, provide:
- **File to edit**: Exact file path
- **Current code**: The problematic code section
- **Fixed code**: The corrected version
- **Explanation**: Why this fixes the issue

## 3. TEST IMPROVEMENTS
- Are the tests themselves correct?
- Do they need updating?
- Provide improved test code if needed

## 4. CONFIGURATION CHANGES
- Any config files that need updating?
- Environment variables needed?
- Dependencies to install/update?

## 5. IMPLEMENTATION PLAN
- Step-by-step instructions to fix all issues
- Order of operations (what to fix first)
- How to verify fixes

## 6. PRIORITY RANKING
- High: Blocking issues that prevent functionality
- Medium: Issues that affect user experience
- Low: Minor issues or improvements

Be SPECIFIC. Provide WORKING CODE. Reference EXACT FILES AND LINE NUMBERS.
Think step-by-step and be thorough. This is a real codebase that needs fixing.
"""

    return prompt


def run_investigation(test_file):
    """Run comprehensive investigation on test results"""
    print(f"{'='*60}")
    print(f"🔬 AI CODE INVESTIGATOR - Deep Dive Analysis")
    print(f"{'='*60}\n")

    # Read test results
    print(f"📖 Reading test results: {test_file}")
    with open(test_file, "r", encoding="utf-8") as f:
        test_data = json.load(f)

    # Extract test info
    test_info = extract_all_test_info(test_data)
    print(
        f"📊 Found {len(test_info['failures'])} failures in {len(test_info['files'])} test files\n"
    )

    if not test_info["failures"]:
        print("✅ No failures to investigate!")
        return

    # Gather comprehensive context
    context = gather_comprehensive_context(test_info)

    # Build prompt
    print("\n📝 Building comprehensive analysis prompt...")
    prompt = build_investigator_prompt(test_info, context)

    # Save prompt for reference
    REPORTS_DIR.mkdir(exist_ok=True)
    prompt_file = (
        REPORTS_DIR
        / f"investigator_prompt_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    )
    with open(prompt_file, "w", encoding="utf-8") as f:
        f.write(prompt)
    print(f"💾 Prompt saved: {prompt_file}")
    print(f"📏 Prompt size: {len(prompt):,} characters\n")

    # Call Ollama
    print(f"🤖 Calling Ollama ({OLLAMA_MODEL}) for deep analysis...")
    print("   This may take a few minutes...\n")

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

        result = subprocess.run(
            f'{cmd} "{prompt}"',
            capture_output=True,
            text=True,
            timeout=300,  # 5 minutes for deep analysis
            shell=True,
            env=env,
        )

        analysis = result.stdout.strip()

        if analysis:
            # Display analysis
            print(f"\n{'='*60}")
            print("🎯 AI INVESTIGATION RESULTS")
            print(f"{'='*60}\n")
            print(analysis)
            print(f"\n{'='*60}\n")

            # Save to file
            output_file = (
                REPORTS_DIR
                / f"investigation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            )
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(f"# AI Code Investigation Report\n\n")
                f.write(f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"**Source**: {test_file}\n")
                f.write(f"**Failures**: {len(test_info['failures'])}\n\n")
                f.write(f"{'='*60}\n\n")
                f.write(analysis)

            print(f"💾 Full report saved: {output_file}")
            print(f"📏 Report size: {len(analysis):,} characters\n")
        else:
            print("⚠️ No response from Ollama\n")

    except subprocess.TimeoutExpired:
        print("❌ Analysis timed out after 5 minutes\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")


def main():
    if len(sys.argv) < 2:
        print("AI Code Investigator - Deep Dive Analysis")
        print("\nUsage: python ai_investigator.py <test-results.json>")
        print("\nExample:")
        print(
            "  python ai_investigator.py logs/playwright_headless_20250119_143022.json"
        )

        # Show available files
        logs_dir = Path("logs")
        if logs_dir.exists():
            json_files = list(logs_dir.glob("*.json"))
            if json_files:
                print("\n📁 Available test results:")
                for f in sorted(json_files, reverse=True)[:5]:
                    print(f"  - {f}")
        sys.exit(1)

    test_file = Path(sys.argv[1])

    if not test_file.exists():
        print(f"❌ File not found: {test_file}")
        sys.exit(1)

    run_investigation(test_file)


if __name__ == "__main__":
    main()
