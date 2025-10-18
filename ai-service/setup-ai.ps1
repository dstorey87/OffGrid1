# AI Product Discovery System - Setup Instructions
# Run this script to set up the AI environment

Write-Host "=== OffGrid AI Product Discovery Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check Python version
Write-Host "1. Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version
Write-Host "   $pythonVersion" -ForegroundColor Green

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Python not found. Install Python 3.10+ first." -ForegroundColor Red
    exit 1
}

# 2. Check NVIDIA GPU
Write-Host ""
Write-Host "2. Checking GPU..." -ForegroundColor Yellow
$gpuCheck = nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   GPU: $gpuCheck" -ForegroundColor Green
} else {
    Write-Host "   WARNING: NVIDIA GPU not detected. AI will run on CPU (slower)." -ForegroundColor Yellow
}

# 3. Check/Install Ollama
Write-Host ""
Write-Host "3. Checking Ollama..." -ForegroundColor Yellow
$ollamaCheck = ollama --version 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Ollama: $ollamaCheck" -ForegroundColor Green
} else {
    Write-Host "   Ollama not found. Installing..." -ForegroundColor Yellow
    Write-Host "   Please download from: https://ollama.ai/download/windows" -ForegroundColor Cyan
    Write-Host "   Then run this script again." -ForegroundColor Cyan
    Start-Process "https://ollama.ai/download/windows"
    exit 0
}

# 4. Pull Qwen2.5 model
Write-Host ""
Write-Host "4. Downloading Qwen2.5-7B model (~4GB)..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes..." -ForegroundColor Cyan

ollama pull qwen2.5:7b-instruct-q4_K_M

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Model downloaded successfully!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Failed to download model." -ForegroundColor Red
    exit 1
}

# 5. Test Ollama
Write-Host ""
Write-Host "5. Testing Ollama inference..." -ForegroundColor Yellow
$testPrompt = "Olá! Responde apenas: OK"
$testResponse = ollama run qwen2.5:7b-instruct-q4_K_M $testPrompt

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Test response: $testResponse" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Ollama test failed." -ForegroundColor Red
    exit 1
}

# 6. Install Python dependencies
Write-Host ""
Write-Host "6. Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes..." -ForegroundColor Cyan

cd C:\OffGrid1\OffGrid1\ai-service
pip install -r requirements-ai.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Dependency installation failed." -ForegroundColor Red
    exit 1
}

# 7. Install Playwright browsers
Write-Host ""
Write-Host "7. Installing Playwright browsers..." -ForegroundColor Yellow
python -m playwright install chromium

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Playwright ready!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Playwright installation failed." -ForegroundColor Red
    exit 1
}

# 8. Download embedding model
Write-Host ""
Write-Host "8. Downloading multilingual-e5-large embedding model (~2GB)..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes..." -ForegroundColor Cyan

python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('intfloat/multilingual-e5-large'); print('Embedding model ready!')"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Embedding model downloaded!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Embedding model download failed." -ForegroundColor Red
    exit 1
}

# 9. Create data directories
Write-Host ""
Write-Host "9. Creating data directories..." -ForegroundColor Yellow

$directories = @(
    "C:\OffGrid1\OffGrid1\data\chromadb",
    "C:\OffGrid1\OffGrid1\data\scraped",
    "C:\OffGrid1\OffGrid1\logs"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "   Exists: $dir" -ForegroundColor Gray
    }
}

# 10. Test AI service
Write-Host ""
Write-Host "10. Testing AI service components..." -ForegroundColor Yellow

# Test embeddings
Write-Host "   Testing embeddings..." -ForegroundColor Cyan
python -c "
from app.core.embeddings import EmbeddingService
service = EmbeddingService()
emb = service.encode('painel solar 400W')
print(f'   ✓ Embedding shape: {emb.shape}')
"

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Embedding test failed." -ForegroundColor Red
    exit 1
}

# Test ChromaDB
Write-Host "   Testing ChromaDB..." -ForegroundColor Cyan
python -c "
from app.core.chromadb_client import ChromaDBClient
client = ChromaDBClient()
print(f'   ✓ ChromaDB connected: {client.count()} products')
"

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: ChromaDB test failed." -ForegroundColor Red
    exit 1
}

# Test Ollama
Write-Host "   Testing Ollama client..." -ForegroundColor Cyan
python -c "
from app.core.ollama_client import OllamaClient
client = OllamaClient()
response = client.generate('Olá! Responde apenas: OK')
print(f'   ✓ Ollama response: {response.content[:50]}')
"

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ERROR: Ollama client test failed." -ForegroundColor Red
    exit 1
}

# 11. Check VRAM usage
Write-Host ""
Write-Host "11. Checking GPU memory usage..." -ForegroundColor Yellow

if ($gpuCheck) {
    $vramUsed = nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits
    $vramTotal = nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits
    
    Write-Host "   VRAM Used: ${vramUsed}MB / ${vramTotal}MB" -ForegroundColor Green
    
    if ([int]$vramUsed -gt 9000) {
        Write-Host "   WARNING: VRAM usage high. May affect performance." -ForegroundColor Yellow
    }
}

# 12. Setup complete
Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review AI_PRODUCT_DISCOVERY_SYSTEM.md for architecture" -ForegroundColor White
Write-Host "2. Start Ollama server: ollama serve" -ForegroundColor White
Write-Host "3. Start AI service: uvicorn app.main:app --reload --port 8001" -ForegroundColor White
Write-Host "4. Test endpoint: http://localhost:8001/ai/health" -ForegroundColor White
Write-Host ""
Write-Host "Expected VRAM usage:" -ForegroundColor Cyan
Write-Host "- Qwen2.5-7B: ~6GB" -ForegroundColor White
Write-Host "- Embeddings: ~2GB" -ForegroundColor White
Write-Host "- Total: ~8GB (fits in 11GB GPU)" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: C:\OffGrid1\OffGrid1\AI_PRODUCT_DISCOVERY_SYSTEM.md" -ForegroundColor Yellow
Write-Host ""
