# Show status of continuous testing
# Usage: .\status.ps1

Write-Host ""
Write-Host "🔍 Continuous Testing Status" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Gray
Write-Host ""

# Check if runner is active
$runnerProcess = Get-Process -Name python -ErrorAction SilentlyContinue | 
                 Where-Object { $_.CommandLine -like "*ai_runner.py*" }

if ($runnerProcess) {
    Write-Host "✅ Test runner is ACTIVE (PID: $($runnerProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚪ Test runner is NOT running" -ForegroundColor Yellow
}

Write-Host ""

# Check logs
$logsDir = "logs"
if (Test-Path $logsDir) {
    $jsonFiles = Get-ChildItem -Path $logsDir -Filter "*.json"
    $logFiles = Get-ChildItem -Path $logsDir -Filter "*.log"
    
    Write-Host "📁 Logs Directory:" -ForegroundColor Cyan
    Write-Host "   Test results: $($jsonFiles.Count) files" -ForegroundColor Gray
    Write-Host "   Run logs: $($logFiles.Count) files" -ForegroundColor Gray
    
    if ($jsonFiles.Count -gt 0) {
        $latest = $jsonFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        Write-Host "   Latest: $($latest.Name) ($(([DateTime]::Now - $latest.LastWriteTime).TotalMinutes.ToString('0.0')) min ago)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚪ No logs directory" -ForegroundColor Yellow
}

Write-Host ""

# Check reports
$reportsDir = "reports"
if (Test-Path $reportsDir) {
    $testRuns = Join-Path $reportsDir "test_runs.md"
    $aiSuggestions = Join-Path $reportsDir "ai_suggestions.md"
    
    Write-Host "📊 Reports Directory:" -ForegroundColor Cyan
    
    if (Test-Path $testRuns) {
        $lines = (Get-Content $testRuns | Measure-Object -Line).Lines
        Write-Host "   test_runs.md: $lines lines ($(($lines - 3)) test runs)" -ForegroundColor Gray
        
        # Show last 3 runs
        if ($lines -gt 3) {
            Write-Host ""
            Write-Host "   Last 3 runs:" -ForegroundColor Gray
            Get-Content $testRuns | Select-Object -Last 3 | ForEach-Object {
                Write-Host "   $_" -ForegroundColor DarkGray
            }
        }
    } else {
        Write-Host "   test_runs.md: Not created yet" -ForegroundColor DarkGray
    }
    
    Write-Host ""
    
    if (Test-Path $aiSuggestions) {
        $size = (Get-Item $aiSuggestions).Length
        $analyses = (Get-Content $aiSuggestions | Select-String "^## Analysis at").Count
        Write-Host "   ai_suggestions.md: $analyses analyses ($([Math]::Round($size/1KB, 1)) KB)" -ForegroundColor Gray
    } else {
        Write-Host "   ai_suggestions.md: Not created yet" -ForegroundColor DarkGray
    }
} else {
    Write-Host "⚪ No reports directory" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "="*60 -ForegroundColor Gray

# Check dev server
Write-Host ""
Write-Host "🌐 Dev Server:" -ForegroundColor Cyan
$devServer = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue -InformationLevel Quiet
if ($devServer) {
    Write-Host "   ✅ Running on port 3000" -ForegroundColor Green
} else {
    Write-Host "   ⚪ Not detected on port 3000" -ForegroundColor Yellow
}

# Check Ollama
Write-Host ""
Write-Host "🤖 Ollama:" -ForegroundColor Cyan
try {
    $ollamaVersion = ollama --version 2>&1
    Write-Host "   ✅ $ollamaVersion" -ForegroundColor Green
    
    $models = ollama list 2>&1 | Out-String
    if ($models -match "qwen2.5") {
        Write-Host "   ✅ qwen2.5 model available" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  qwen2.5 model not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚪ Not installed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "="*60 -ForegroundColor Gray
Write-Host ""

# Quick actions
Write-Host "Quick Actions:" -ForegroundColor Cyan
Write-Host "   Start runner:     .\start_continuous_tests.ps1" -ForegroundColor Gray
Write-Host "   Analyze latest:   .\analyze_latest.ps1" -ForegroundColor Gray
Write-Host "   View status:      .\status.ps1" -ForegroundColor Gray
Write-Host ""
