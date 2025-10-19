# 🔁 Continuous AI Testing System

## Quick Start

```powershell
# 1. Check status
.\status.ps1

# 2. Start continuous testing (runs forever)
.\start_continuous_tests.ps1

# 3. Analyze most recent test (in another terminal)
.\analyze_latest.ps1
```

## What It Does

1. **Runs Playwright tests** (headless + headed) every 15 minutes
2. **Logs results** to `reports/test_runs.md` (markdown table)
3. **On failures**: Calls Ollama (qwen2.5) to analyze and suggest fixes
4. **Saves AI analysis** to `reports/ai_suggestions.md`
5. **Repeats forever** until you press Ctrl+C

## Files Created

### Scripts
- `ai_runner.py` - Main orchestrator (infinite loop)
- `ai_reviewer.py` - On-demand test analysis
- `start_continuous_tests.ps1` - Quick start with prereq checks
- `analyze_latest.ps1` - Analyze most recent test results
- `status.ps1` - Show current status

### Directories
- `logs/` - Test JSON outputs and daily run logs
- `reports/` - Test run summaries and AI suggestions

### Documentation
- `RUN_CONTINUOUS_TESTS.md` - Full documentation
- `CONTINUOUS_TESTING_COMPLETE.md` - Implementation summary

## System Status

Run `.\status.ps1` to see:
- ✅ Test runner active/inactive
- ✅ Number of test runs completed
- ✅ Latest test results
- ✅ AI analysis count
- ✅ Dev server status
- ✅ Ollama availability

## Prerequisites (All ✅)

- ✅ Python 3.11.8
- ✅ Ollama 0.12.6 with qwen2.5 model
- ✅ Dev server running on port 3000
- ✅ Playwright installed in frontend/

## Output Examples

### `reports/test_runs.md`
```markdown
| Run | Time | Headless Pass/Fail/Total | Headed Pass/Fail/Total |
|-----|------|--------------------------|------------------------|
| 1   | 2025-01-19 14:30:15 | 8/2/10 | 10/0/10 |
```

### `reports/ai_suggestions.md`
```markdown
## Analysis at 2025-01-19 14:35:22

**Root Cause**: Timeout in authentication flow
**Suggested Fixes**: 
1. Increase navigation timeout to 60s
2. Add explicit waits for auth state
**Priority**: High
```

### `logs/runner_20250119.log`
```
[2025-01-19 14:30:15] 🚀 Starting Continuous AI Test Loop
[2025-01-19 14:30:15] 🎭 Running Playwright tests...
[2025-01-19 14:35:22] ✅ Headless tests completed
[2025-01-19 14:40:18] 📊 Headless: {'passed': 8, 'failed': 2}
[2025-01-19 14:40:18] 🤖 Calling Ollama for AI analysis...
[2025-01-19 14:41:05] ✅ AI suggestions saved
[2025-01-19 14:41:05] 😴 Sleeping for 15 minutes...
```

## Configuration

Edit `ai_runner.py` to customize:

```python
SLEEP_MINUTES = 15           # Time between test runs
OLLAMA_MODEL = "qwen2.5"     # AI model to use
TEST_DIR = Path("frontend")  # Where tests live
```

## Stop the Runner

Press **Ctrl+C** in the terminal running `ai_runner.py`

## Architecture

```
ai_runner.py (infinite loop)
│
├─> run_playwright_tests()
│   ├─> npx playwright test (headless)
│   └─> npx playwright test --headed
│
├─> count_results()
│   └─> Parse JSON → pass/fail counts
│
├─> update_markdown_report()
│   └─> Append to reports/test_runs.md
│
├─> call_ollama_for_analysis() (if failures)
│   ├─> Read README.md for context
│   ├─> ollama run qwen2.5 <prompt>
│   └─> Save to reports/ai_suggestions.md
│
└─> sleep(15 minutes)
```

## Why This Design?

✅ **Simple** - No frameworks, just Python stdlib  
✅ **Resilient** - Never crashes, handles all errors  
✅ **Continuous** - Runs 24/7 until stopped  
✅ **AI-Powered** - Ollama analyzes failures automatically  
✅ **Self-Documenting** - Markdown reports with full history  
✅ **Windows-Native** - PowerShell scripts included  

## Next Steps

1. **Start it**: `.\start_continuous_tests.ps1`
2. **Let it run**: It'll test every 15 minutes forever
3. **Check reports**: `reports/test_runs.md` and `reports/ai_suggestions.md`
4. **Fix issues**: Use AI suggestions as guidance
5. **Watch it improve**: Tests will pass more over time

---

**Keep It Simple Stupid** ✨  
One loop. Two directories. AI fixes bugs. Done. 🤖
