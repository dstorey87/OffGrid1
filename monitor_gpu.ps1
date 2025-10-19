# Quick GPU monitoring script
# Usage: .\monitor_gpu.ps1

Write-Host "🎮 GPU Monitoring - Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host ""

# Check if nvidia-smi is available
try {
    $null = nvidia-smi --version
} catch {
    Write-Host "❌ nvidia-smi not found. NVIDIA GPU drivers not installed?" -ForegroundColor Red
    exit 1
}

Write-Host "Monitoring GPU usage every 2 seconds..." -ForegroundColor Gray
Write-Host ""

while ($true) {
    Clear-Host
    
    Write-Host "="*80 -ForegroundColor Cyan
    Write-Host " 🎮 GPU RESOURCE MONITOR - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
    Write-Host "="*80 -ForegroundColor Cyan
    Write-Host ""
    
    # Get GPU info
    $gpuInfo = nvidia-smi --query-gpu=index,name,utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw --format=csv,noheader,nounits
    
    $gpus = $gpuInfo -split "`n"
    
    foreach ($gpu in $gpus) {
        if ($gpu.Trim()) {
            $parts = $gpu -split ","
            $id = $parts[0].Trim()
            $name = $parts[1].Trim()
            $util = [int]$parts[2].Trim()
            $memUsed = [int]$parts[3].Trim()
            $memTotal = [int]$parts[4].Trim()
            $temp = $parts[5].Trim()
            $power = $parts[6].Trim()
            
            $memPercent = [math]::Round(($memUsed / $memTotal) * 100, 1)
            
            Write-Host "GPU $id`: $name" -ForegroundColor Yellow
            
            # Utilization bar
            $utilBar = ""
            $barLength = 50
            $filledBars = [math]::Floor(($util / 100) * $barLength)
            for ($i = 0; $i -lt $barLength; $i++) {
                if ($i -lt $filledBars) {
                    $utilBar += "█"
                } else {
                    $utilBar += "░"
                }
            }
            
            $utilColor = "Green"
            if ($util -gt 75) { $utilColor = "Yellow" }
            if ($util -gt 90) { $utilColor = "Red" }
            
            Write-Host "  Utilization: " -NoNewline
            Write-Host "$utilBar" -ForegroundColor $utilColor -NoNewline
            Write-Host " $util%" -ForegroundColor $utilColor
            
            # Memory bar
            $memBar = ""
            $memFilledBars = [math]::Floor(($memPercent / 100) * $barLength)
            for ($i = 0; $i -lt $barLength; $i++) {
                if ($i -lt $memFilledBars) {
                    $memBar += "█"
                } else {
                    $memBar += "░"
                }
            }
            
            $memColor = "Green"
            if ($memPercent -gt 75) { $memColor = "Yellow" }
            if ($memPercent -gt 90) { $memColor = "Red" }
            
            Write-Host "  Memory:      " -NoNewline
            Write-Host "$memBar" -ForegroundColor $memColor -NoNewline
            Write-Host " $memPercent% ($memUsed MB / $memTotal MB)" -ForegroundColor $memColor
            
            Write-Host "  Temperature: $temp°C" -ForegroundColor Gray
            Write-Host "  Power:       $power W" -ForegroundColor Gray
            Write-Host ""
        }
    }
    
    # Check for Ollama processes
    Write-Host "="*80 -ForegroundColor Cyan
    $ollamaProcesses = Get-Process -Name "ollama*" -ErrorAction SilentlyContinue
    
    if ($ollamaProcesses) {
        Write-Host "🤖 Ollama Processes:" -ForegroundColor Green
        foreach ($proc in $ollamaProcesses) {
            $memMB = [math]::Round($proc.WorkingSet64 / 1MB, 1)
            Write-Host "  $($proc.Name) (PID: $($proc.Id)) - Memory: $memMB MB" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚪ No Ollama processes running" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "="*80 -ForegroundColor Cyan
    Write-Host "Target: GPU 0 at 70-75% utilization" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
    
    Start-Sleep -Seconds 2
}
