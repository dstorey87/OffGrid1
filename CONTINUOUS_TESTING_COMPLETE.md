# 🔁 Continuous AI Testing System - Complete

## ✅ What Was Created

A minimal, self-contained continuous testing system with AI-powered failure analysis:

### Core Files
1. **`ai_runner.py`** - Main orchestrator (runs forever)
   - Executes Playwright tests (headless + headed)
   - Logs pass/fail counts
   - Calls Ollama on failures
   - Sleeps 15 minutes, repeats

2. **`ai_reviewer.py`** - On-demand analyzer
   - Analyzes specific test JSON files
   - Useful for manual investigation

3. **`start_continuous_tests.ps1`** - Quick start script
   - Checks all prerequisites
   - Verifies Ollama and qwen2.5 model
   - Starts the runner

4. **`RUN_CONTINUOUS_TESTS.md`** - Full documentation

### Directories
- **`logs/`** - Test outputs and run logs
- **`reports/`** - Markdown reports and AI suggestions

## 🚀 How to Use

### Quick Start (PowerShell)
```powershell
.\start_continuous_tests.ps1
```

### Manual Start
```powershell
# Terminal 1: Start dev server
cd frontend
npm run dev

# Terminal 2: Start test loop
python ai_runner.py
```

### On-Demand Analysis
```powershell
python ai_reviewer.py logs/playwright_headless_20250119_143022.json
```

## 📊 Output

### Reports Generated

1. **`reports/test_runs.md`** - Table of all test runs:
   ```markdown
   | Run | Time | Headless Pass/Fail/Total | Headed Pass/Fail/Total |
   |-----|------|--------------------------|------------------------|
   | 1   | 2025-01-19 14:30:15 | 8/2/10 | 10/0/10 |
   | 2   | 2025-01-19 14:45:20 | 9/1/10 | 10/0/10 |
   ```

2. **`reports/ai_suggestions.md`** - AI analysis on failures:
   ```markdown
   ## Analysis at 2025-01-19 14:35:22
   
   **Root Cause**: Authentication timeout in signin.spec.ts
   **Suggested Fix**: Increase timeout in auth provider...
   **Priority**: High
   ```

3. **`logs/runner_YYYYMMDD.log`** - Daily run log:
   ```
   [2025-01-19 14:30:15] 🚀 Starting Continuous AI Test Loop
   [2025-01-19 14:30:15] 🎭 Running Playwright tests...
   [2025-01-19 14:35:22] ✅ Headless tests completed. Exit code: 1
   ```

## 🎯 Key Features

✅ **Simple** - No frameworks, just Python stdlib + subprocess  
✅ **Resilient** - Never crashes, handles all errors gracefully  
✅ **Continuous** - Runs forever until Ctrl+C  
✅ **AI-Powered** - Ollama (qwen2.5) analyzes failures  
✅ **Self-Documenting** - Markdown reports with timestamps  
✅ **Windows-Ready** - PowerShell scripts included  

## 🔧 Configuration

Edit `ai_runner.py` to customize:

```python
SLEEP_MINUTES = 15           # Sleep between runs
OLLAMA_MODEL = "qwen2.5"     # AI model
TEST_DIR = Path("frontend")  # Test directory
```

## 📝 Prerequisites

1. **Python 3.8+** (already installed)
2. **Ollama** with qwen2.5:
   ```powershell
   # Install from https://ollama.ai
   ollama pull qwen2.5
   ```
3. **Playwright** in frontend:
   ```powershell
   cd frontend
   npm install
   npx playwright install
   ```
4. **Dev server running**:
   ```powershell
   cd frontend
   npm run dev
   ```

## 🎬 Example Session

```powershell
PS C:\OffGrid1\OffGrid1> .\start_continuous_tests.ps1

🚀 Starting Continuous AI Test Loop

Checking prerequisites...
✅ Python found: Python 3.12.0
✅ Ollama found: ollama version 0.1.20
✅ qwen2.5 model found
✅ Dev server is running

============================================================
All prerequisites met! Starting continuous test loop...
============================================================

Press Ctrl+C to stop

[2025-01-19 14:30:15] 🚀 Starting Continuous AI Test Loop
[2025-01-19 14:30:15]    - Test directory: C:\OffGrid1\OffGrid1\frontend
[2025-01-19 14:30:15]    - Logs: C:\OffGrid1\OffGrid1\logs
[2025-01-19 14:30:15]    - Reports: C:\OffGrid1\OffGrid1\reports

============================================================
[2025-01-19 14:30:15] 🔄 Starting test run #1
============================================================
[2025-01-19 14:30:15] 🎭 Running Playwright tests...
[2025-01-19 14:35:22] ✅ Headless tests completed. Exit code: 1
[2025-01-19 14:40:18] ✅ Headed tests completed. Exit code: 0
[2025-01-19 14:40:18] 📊 Headless: {'passed': 8, 'failed': 2, 'total': 10}
[2025-01-19 14:40:18] 📊 Headed: {'passed': 10, 'failed': 0, 'total': 10}
[2025-01-19 14:40:18] 📊 Updated report: reports\test_runs.md
[2025-01-19 14:40:18] ⚠️ Failures detected, requesting AI analysis...
[2025-01-19 14:40:18] 🤖 Calling Ollama for AI analysis...
[2025-01-19 14:41:05] ✅ AI suggestions saved to reports\ai_suggestions.md
[2025-01-19 14:41:05] 😴 Sleeping for 15 minutes before next run...
```

## 📁 File Structure

```
OffGrid1/
├── ai_runner.py                    # Main orchestrator
├── ai_reviewer.py                  # On-demand analyzer
├── start_continuous_tests.ps1      # Quick start script
├── RUN_CONTINUOUS_TESTS.md         # Documentation
├── logs/                           # Auto-generated
│   ├── playwright_headless_*.json
│   ├── playwright_headed_*.json
│   └── runner_*.log
└── reports/                        # Auto-generated
    ├── test_runs.md
    └── ai_suggestions.md
```

## 🛑 Stopping

Press `Ctrl+C` in the terminal running `ai_runner.py`. It will gracefully exit.

## 🔍 Troubleshooting

**"Ollama not found"**  
→ Install from https://ollama.ai and ensure it's in PATH

**"Tests timeout after 10 minutes"**  
→ Increase `timeout=600` in `ai_runner.py` → `run_playwright_tests()`

**"Dev server not running"**  
→ Start it: `cd frontend && npm run dev`

**"No test results in JSON"**  
→ Verify `playwright.config.ts` has `['json', { outputFile: 'test-results/results.json' }]`

**"AI suggestions are too generic"**  
→ AI only sees test JSON + README excerpt. For better analysis, add more context to README or review logs manually.

## 🎯 What This Achieves

1. **Continuous Validation** - Tests run 24/7, catching regressions immediately
2. **AI-Powered Debugging** - Ollama analyzes failures and suggests fixes
3. **Historical Tracking** - All runs logged in Markdown for trend analysis
4. **Zero Crash** - Handles all errors gracefully, never stops
5. **Minimal Dependencies** - Just Python stdlib + Playwright + Ollama

## 🚀 Next Steps

1. **Start it**: `.\start_continuous_tests.ps1`
2. **Check reports**: Open `reports/test_runs.md` and `reports/ai_suggestions.md`
3. **Monitor logs**: Tail `logs/runner_YYYYMMDD.log`
4. **Fix failures**: Use AI suggestions as guidance
5. **Let it run**: It'll keep testing and improving forever

---

**Keep It Simple Stupid** ✨  
One orchestrator. Two helpers. Two directories. Runs forever. AI fixes bugs. Done. 🤖
