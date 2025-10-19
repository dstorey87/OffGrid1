# Continuous AI Test Loop - Quick Start

## What This Does

Runs Playwright tests continuously in a loop:
1. Executes all tests (headless + headed modes)
2. Logs pass/fail counts to `reports/test_runs.md`
3. On failures, calls Ollama (qwen2.5) to analyze and suggest fixes
4. Saves AI suggestions to `reports/ai_suggestions.md`
5. Sleeps 15 minutes, then repeats

## Prerequisites

1. **Ollama installed** with qwen2.5 model:
   ```powershell
   # Install Ollama from https://ollama.ai
   
   # Pull the model
   ollama pull qwen2.5
   ```

2. **Playwright installed**:
   ```powershell
   cd frontend
   npm install
   npx playwright install
   ```

3. **Dev server running** (in separate terminal):
   ```powershell
   cd frontend
   npm run dev
   ```

## Usage

### Start Continuous Loop

```powershell
# From project root
python ai_runner.py
```

This will run forever until you press `Ctrl+C`.

### Analyze Existing Test Results

```powershell
# Analyze a specific test output file
python ai_reviewer.py logs/playwright_headless_20250119_143022.json
```

## Output Files

- **`logs/`** - Test JSON outputs and daily run logs
  - `playwright_headless_YYYYMMDD_HHMMSS.json`
  - `playwright_headed_YYYYMMDD_HHMMSS.json`
  - `runner_YYYYMMDD.log`

- **`reports/`** - Summary reports and AI analysis
  - `test_runs.md` - Table of all test runs with pass/fail counts
  - `ai_suggestions.md` - AI-generated root cause analysis and fixes

## Configuration

Edit these constants in `ai_runner.py`:

```python
SLEEP_MINUTES = 15           # Sleep between test runs
OLLAMA_MODEL = "qwen2.5"     # Ollama model to use
TEST_DIR = Path("frontend")  # Where to run tests
```

## Stopping

Press `Ctrl+C` to gracefully stop the loop.

## Troubleshooting

**"Ollama not found"**
- Install from https://ollama.ai
- Make sure `ollama` is in your PATH

**Tests timeout**
- Increase timeout in `ai_runner.py` (default: 600s = 10 min)
- Make sure dev server is running

**No test results**
- Check that `frontend/playwright.config.ts` has JSON reporter configured
- Verify tests exist in `frontend/tests/`

**AI suggestions are generic**
- The AI only has access to test JSON + README excerpt
- For better suggestions, provide more context in README
- Or manually review test failures in `logs/` directory

## Example Output

```
[2025-01-19 14:30:15] 🚀 Starting Continuous AI Test Loop
[2025-01-19 14:30:15]    - Test directory: C:\OffGrid1\OffGrid1\frontend
[2025-01-19 14:30:15]    - Logs: C:\OffGrid1\OffGrid1\logs
[2025-01-19 14:30:15]    - Reports: C:\OffGrid1\OffGrid1\reports
[2025-01-19 14:30:15]    - Sleep interval: 15 minutes

============================================================
[2025-01-19 14:30:15] 🔄 Starting test run #1
============================================================
[2025-01-19 14:30:15] 🎭 Running Playwright tests...
[2025-01-19 14:35:22] ✅ Headless tests completed. Exit code: 1
[2025-01-19 14:40:18] ✅ Headed tests completed. Exit code: 0
[2025-01-19 14:40:18] 📊 Headless: {'passed': 8, 'failed': 2, 'total': 10}
[2025-01-19 14:40:18] 📊 Headed: {'passed': 10, 'failed': 0, 'total': 10}
[2025-01-19 14:40:18] 📊 Updated report: C:\OffGrid1\OffGrid1\reports\test_runs.md
[2025-01-19 14:40:18] ⚠️ Failures detected, requesting AI analysis...
[2025-01-19 14:40:18] 🤖 Calling Ollama for AI analysis...
[2025-01-19 14:41:05] ✅ AI suggestions saved to C:\OffGrid1\OffGrid1\reports\ai_suggestions.md
[2025-01-19 14:41:05] 😴 Sleeping for 15 minutes before next run...
```

## Architecture

```
ai_runner.py
├── run_playwright_tests()      # Execute tests, save JSON
├── count_results()              # Parse JSON → pass/fail counts
├── update_markdown_report()    # Update reports/test_runs.md
└── call_ollama_for_analysis()  # AI analysis on failures
    └── → reports/ai_suggestions.md

ai_reviewer.py                   # Standalone analyzer
└── analyze_test_file()          # On-demand analysis
```

Keep it simple. Keep it running. Let AI catch the bugs. 🤖✨
