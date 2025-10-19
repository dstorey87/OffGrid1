# Quick script to analyze the most recent test failure
# Usage: .\analyze_latest.ps1

$logsDir = "logs"

if (-not (Test-Path $logsDir)) {
    Write-Host "❌ No logs directory found. Run tests first." -ForegroundColor Red
    exit 1
}

# Find most recent JSON file
$latestJson = Get-ChildItem -Path $logsDir -Filter "*.json" | 
              Sort-Object LastWriteTime -Descending | 
              Select-Object -First 1

if ($null -eq $latestJson) {
    Write-Host "❌ No test results found in logs/" -ForegroundColor Red
    exit 1
}

Write-Host "📖 Analyzing: $($latestJson.Name)" -ForegroundColor Cyan
Write-Host "   Modified: $($latestJson.LastWriteTime)" -ForegroundColor Gray
Write-Host ""

# Run the AI reviewer
python ai_reviewer.py $latestJson.FullName
