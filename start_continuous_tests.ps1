# Quick start script for continuous AI testing
# Run this to start the continuous test loop

Write-Host "🚀 Starting Continuous AI Test Loop" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check Ollama
try {
    $ollamaVersion = ollama --version 2>&1
    Write-Host "✅ Ollama found: $ollamaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama not found. Install from https://ollama.ai" -ForegroundColor Red
    exit 1
}

# Check if qwen2.5 is available
Write-Host "Checking for qwen2.5 model..." -ForegroundColor Yellow
$models = ollama list 2>&1 | Out-String
if ($models -match "qwen2.5") {
    Write-Host "✅ qwen2.5 model found" -ForegroundColor Green
} else {
    Write-Host "⚠️  qwen2.5 model not found. Pulling now..." -ForegroundColor Yellow
    ollama pull qwen2.5
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ qwen2.5 model installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to pull qwen2.5 model" -ForegroundColor Red
        exit 1
    }
}

# Check if dev server is running
Write-Host "Checking if dev server is running on port 3000..." -ForegroundColor Yellow
$devServer = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue -InformationLevel Quiet
if ($devServer) {
    Write-Host "✅ Dev server is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dev server not detected on port 3000" -ForegroundColor Yellow
    Write-Host "   Make sure to run 'npm run dev' in frontend/ directory first!" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

Write-Host ""
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "All prerequisites met! Starting continuous test loop..." -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "reports" | Out-Null

# Run the Python script
python ai_runner.py
