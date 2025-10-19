# 🎯 AI Testing Dashboard - Complete Guide

## Overview
Real-time web dashboard showing AI's autonomous testing process, including live console output, test results, root cause analysis, and suggested fixes.

## Features
- **Live AI Console** - Watch the AI's thought process in real-time
- **Test Results Grid** - All tests with pass/fail status
- **Root Cause Analysis** - AI-generated RCA for each failure
- **Suggested Fixes** - Code fixes proposed by AI
- **Historical Tracking** - Full versioning with timestamps
- **Auto-refresh** - Server-Sent Events (SSE) for instant updates

## Architecture

```
┌─────────────────────┐
│  ai_runner_enhanced │ ──┐
│   (Python Process)  │   │
└─────────────────────┘   │
                          │ Writes events
                          ▼
                  ┌──────────────┐
                  │ logs/        │
                  │ ├─ live_stream.jsonl
                  │ └─ test_results.json
                  └──────────────┘
                          │
                          │ Reads via API
                          ▼
                  ┌──────────────┐
                  │ Next.js API  │
                  │ /api/ai-testing/stream
                  │ /api/ai-testing/tests
                  └──────────────┘
                          │
                          │ SSE Stream
                          ▼
                  ┌──────────────┐
                  │ Dashboard UI │
                  │ /ai-testing  │
                  └──────────────┘
```

## Quick Start

### Option 1: Automated Start
```powershell
.\start_dashboard.ps1
```
This will:
1. Check dev server is running
2. Start AI runner in background
3. Open dashboard in browser

### Option 2: Manual Start
```powershell
# Terminal 1: Start dev server (if not running)
cd frontend
npm run dev

# Terminal 2: Start AI runner
python ai_runner_enhanced.py

# Terminal 3: Monitor GPU (optional)
.\monitor_gpu.ps1

# Open browser
# Navigate to: http://localhost:3000/ai-testing
```

## Dashboard Sections

### 1. Status Header
- **Connection indicator** - Green pulse = connected, Red = disconnected
- **Current Cycle** - Shows which test cycle is running (#1, #2, etc.)
- **Config info** - Sleep interval, model, GPU settings

### 2. Live AI Console (Left Panel)
Real-time stream of AI actions:
- `[test_start]` - Test beginning
- `[test_complete]` - Test finished (pass/fail)
- `[ai_thinking]` - What AI is analyzing
- `[ai_rca]` - Root cause analysis
- `[ai_fix]` - Suggested fix
- `[cycle_complete]` - Full cycle done

**Features:**
- Auto-scroll (toggle with checkbox)
- Color-coded by event type
- Timestamps on every line
- Scrollback history (last 50 events on connect)

### 3. Test Results (Right Panel)
Collapsible cards for each test:
- **Status icon** - ✅ Pass | ❌ Fail | ⏰ Running
- **Test name** - Full test file path
- **Pass rate** - X/Y passed across all runs
- **Duration** - Execution time in ms

**Expandable details:**
- Error message (if failed)
- Root cause analysis
- Suggested fix
- Last run timestamp

## Event Types

The AI runner emits these structured events:

```typescript
type EventType =
  | "runner_start"      // AI runner initialized
  | "cycle_start"       // New test cycle beginning
  | "test_start"        // Individual test starting
  | "test_complete"     // Test finished (with status)
  | "ai_thinking"       // AI analysis step
  | "ai_rca"           // Root cause analysis
  | "ai_fix"           // Suggested fix
  | "cycle_complete"    // Test cycle finished
  | "error"            // Error occurred
```

Each event includes:
- `timestamp` - ISO 8601 timestamp
- `cycle` - Current cycle number
- `type` - Event type (above)
- Additional data (test_name, status, message, etc.)

## Data Files

### `logs/live_stream.jsonl`
JSON Lines format - one event per line:
```json
{"timestamp":"2025-10-19T15:20:55.123","type":"cycle_start","cycle":1,"message":"Starting test cycle #1"}
{"timestamp":"2025-10-19T15:21:02.456","type":"test_complete","cycle":1,"test_name":"auth.spec.ts","status":"passed","duration_ms":1234}
{"timestamp":"2025-10-19T15:21:15.789","type":"ai_thinking","cycle":1,"message":"Analyzing test failures..."}
```

### `logs/test_results.json`
Complete historical data:
```json
{
  "last_updated": "2025-10-19T15:30:00.000Z",
  "total_cycles": 5,
  "results": [
    {
      "test_name": "auth.spec.ts::login",
      "status": "passed",
      "duration_ms": 1234,
      "cycle": 1,
      "timestamp": "2025-10-19T15:20:55.000Z"
    }
  ]
}
```

## API Endpoints

### GET `/api/ai-testing/stream`
Server-Sent Events (SSE) endpoint for live updates.

**Response:**
```
Content-Type: text/event-stream
Cache-Control: no-cache

data: {"timestamp":"...","type":"test_start",...}

data: {"timestamp":"...","type":"test_complete",...}
```

**Usage:**
```javascript
const eventSource = new EventSource('/api/ai-testing/stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

### GET `/api/ai-testing/tests`
Historical test results in JSON format.

**Query params:**
- `cycle` (optional) - Filter by cycle number

**Response:**
```json
{
  "last_updated": "2025-10-19T15:30:00.000Z",
  "total_cycles": 5,
  "results": [...]
}
```

## Customization

### Change Dashboard Port
Edit `frontend/playwright.config.ts`:
```typescript
baseURL: 'http://localhost:3100'  // Change port here
```

And `frontend/package.json`:
```json
"dev:test": "next dev -p 3100"
```

### Adjust Event Retention
Edit `frontend/src/app/api/ai-testing/stream/route.ts`:
```typescript
const recentLines = lines.slice(-50);  // Last 50 events
```

### Customize Dashboard Theme
Edit `frontend/src/app/ai-testing/page.tsx` - uses Tailwind CSS classes.

## Troubleshooting

### Dashboard shows "Waiting for AI runner..."
**Cause:** AI runner hasn't started or hasn't created log files yet.
**Fix:** Start `python ai_runner_enhanced.py`

### Events not updating
**Cause:** SSE connection dropped or file polling issue.
**Fix:** Refresh browser page, check browser console for errors.

### "Failed to read test results"
**Cause:** `logs/test_results.json` doesn't exist or is malformed.
**Fix:** Wait for AI runner to complete first cycle, check file permissions.

### Dashboard not accessible
**Cause:** Dev server not running or wrong port.
**Fix:** 
```powershell
cd frontend
npm run dev
```
Check it's on port 3000 (or whatever you configured).

### GPU not being used
**Cause:** GPU controls not configured or Ollama not using GPU.
**Fix:** Check `GPU_ID`, `GPU_LAYERS` in `ai_runner_enhanced.py`, monitor with `.\monitor_gpu.ps1`

## Advanced Usage

### Filter by Cycle
```
GET /api/ai-testing/tests?cycle=3
```
Returns only results from cycle #3.

### Tail Live Stream
```powershell
Get-Content logs\live_stream.jsonl -Wait -Tail 20
```
Watch events in terminal.

### Export Test History
```powershell
Copy-Item logs\test_results.json results_backup_$(Get-Date -Format 'yyyyMMdd').json
```

### Clear History
```powershell
# Stop AI runner first!
Remove-Item logs\live_stream.jsonl
Remove-Item logs\test_results.json
```

## Performance Notes

- **SSE Polling:** Checks for new events every 500ms
- **Event Retention:** Last 50 events sent on initial connection
- **File Size:** `live_stream.jsonl` grows infinitely - rotate periodically
- **Browser Memory:** Events accumulate in React state - refresh if sluggish

## Roadmap

Future enhancements:
- [ ] Filtering/search in live console
- [ ] Export to CSV/JSON
- [ ] Test trends/charts over time
- [ ] Slack/Discord notifications
- [ ] AI confidence scores
- [ ] One-click "Apply Fix" button
- [ ] Test flakiness detection

## Inspiration

Inspired by:
- Vercel deployment logs
- GitHub Actions UI
- Cypress Dashboard
- Playwright Trace Viewer

Built with: Next.js 15, React, Tailwind CSS, Server-Sent Events, Python 3.11
