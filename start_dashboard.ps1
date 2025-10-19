# Quick Start Script for AI Testing Dashboard
# Starts both the AI runner and opens the dashboard

Write-Host "🚀 Starting AI Testing Dashboard System" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running on 3000
$devServer = netstat -ano | findstr ":3000.*LISTENING"
if (!$devServer) {
    Write-Host "❌ Dev server not running on port 3000" -ForegroundColor Red
    Write-Host "   Please start it first: cd frontend && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dev server detected on port 3000" -ForegroundColor Green

# Start AI runner in background
Write-Host "🤖 Starting AI test runner..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python ai_runner_enhanced.py"

# Wait a moment
Start-Sleep -Seconds 2

# Open dashboard in browser
Write-Host "🌐 Opening dashboard at http://localhost:3000/ai-testing" -ForegroundColor Cyan
Start-Process "http://localhost:3000/ai-testing"

Write-Host ""
Write-Host "✨ System Started!" -ForegroundColor Green
Write-Host ""
Write-Host "Dashboard: http://localhost:3000/ai-testing" -ForegroundColor Cyan
Write-Host "Monitor GPU: .\monitor_gpu.ps1" -ForegroundColor Gray
Write-Host "Check status: .\status.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to stop the AI runner..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop the AI runner
Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*ai_runner*"} | Stop-Process
Write-Host "👋 Stopped" -ForegroundColor Gray
