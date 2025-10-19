#!/usr/bin/env python3
"""
AI Test Reviewer - Helper script for on-demand analysis
Can be called independently to analyze existing test results.
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime
import os


OLLAMA_MODEL = "qwen2.5"
LOGS_DIR = Path("logs")
REPORTS_DIR = Path("reports")
README_PATH = Path("README.md")

# GPU Resource Control
GPU_ID = "1"  # Use GPU 0 (least active)
GPU_LAYERS = 35  # ~75-80% GPU usage for 7B models
MAX_PARALLEL_REQUESTS = 1  # One request at a time
USE_GPU_CONTROLS = True  # Set to False to disable GPU controls


def analyze_test_file(json_file: Path):
    """Analyze a specific test results JSON file"""
    print(f"📖 Reading {json_file}...")

    with open(json_file, "r", encoding="utf-8") as f:
        test_data = json.load(f)

    # Read README
    readme_content = ""
    if README_PATH.exists():
        with open(README_PATH, "r", encoding="utf-8") as f:
            readme_content = f.read()[:8000]

    # Build prompt
    prompt = f"""Analyze these Playwright test results and provide:

1. **Summary**: Overall test status
2. **Failed Tests**: List each failed test with error details
3. **Root Cause Analysis**: Why are these tests failing?
4. **Recommended Fixes**: Specific code changes or configuration updates
5. **Prevention**: How to avoid similar failures

# Test Results
{json.dumps(test_data, indent=2)[:10000]}

# Project README (for context)
{readme_content}

Be specific and actionable. Provide file paths and code snippets where possible.
"""

    print("🤖 Calling Ollama for analysis...")

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
            timeout=180,
            shell=True,  # Required on Windows
            env=env,
        )

        analysis = result.stdout.strip()

        if analysis:
            print("\n" + "=" * 60)
            print("AI ANALYSIS")
            print("=" * 60)
            print(analysis)
            print("=" * 60 + "\n")

            # Save to file
            output_file = (
                REPORTS_DIR / f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            )
            REPORTS_DIR.mkdir(exist_ok=True)

            with open(output_file, "w", encoding="utf-8") as f:
                f.write(
                    f"# Test Analysis - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                )
                f.write(f"**Source**: {json_file}\n\n")
                f.write(analysis)

            print(f"💾 Saved to {output_file}")
            return analysis
        else:
            print("⚠️ No response from Ollama")
            return None

    except subprocess.TimeoutExpired:
        print("❌ Ollama timed out")
        return None
    except FileNotFoundError:
        print("❌ Ollama not found. Install from https://ollama.ai")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python ai_reviewer.py <test-results.json>")
        print("\nExample:")
        print("  python ai_reviewer.py logs/playwright_headless_20250119_143022.json")

        # Show available files
        if LOGS_DIR.exists():
            json_files = list(LOGS_DIR.glob("*.json"))
            if json_files:
                print("\nAvailable test results:")
                for f in sorted(json_files, reverse=True)[:5]:
                    print(f"  - {f}")
        sys.exit(1)

    test_file = Path(sys.argv[1])

    if not test_file.exists():
        print(f"❌ File not found: {test_file}")
        sys.exit(1)

    analyze_test_file(test_file)


if __name__ == "__main__":
    main()
