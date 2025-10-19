# 🎮 GPU Resource Control Configuration

## Overview

All AI scripts now support GPU resource limiting to:
- ✅ Force GPU 0 (least active)
- ✅ Limit to ~75% GPU usage
- ✅ Prevent resource hogging

## Configuration (Top of Each Script)

```python
# GPU Resource Control
GPU_ID = "0"                    # Use GPU 0 (change to "1" for GPU 1)
GPU_LAYERS = 35                 # ~75-80% GPU usage for 7B models (max ~45)
MAX_PARALLEL_REQUESTS = 1       # One request at a time
USE_GPU_CONTROLS = True         # Set to False to disable GPU controls
```

## What Each Setting Does

### 1. `GPU_ID = "0"`
**Forces specific GPU**
- Sets `CUDA_VISIBLE_DEVICES=0`
- Ollama will only see and use GPU 0
- Change to `"1"` for GPU 1, `"0,1"` for both

### 2. `GPU_LAYERS = 35`
**Limits GPU memory usage**
- Controls how much of the model runs on GPU
- For qwen2.5 (7B parameters):
  - Full GPU: 40-45 layers (~100% GPU)
  - 75% GPU: 30-35 layers
  - 50% GPU: 20-25 layers
  - CPU only: 0 layers
- Adjust based on your GPU and model size

### 3. `MAX_PARALLEL_REQUESTS = 1`
**Prevents concurrent loads**
- Sets `OLLAMA_NUM_PARALLEL=1`
- Only one AI analysis at a time
- Reduces memory spikes

### 4. `USE_GPU_CONTROLS = True`
**Master switch**
- `True`: Apply all GPU controls
- `False`: Let Ollama use defaults (may use more resources)

## GPU Layer Calculation

### For Different Models

**Small Models (1-3B parameters)**
- 100% GPU: ~25 layers
- 75% GPU: ~18-20 layers

**Medium Models (7B parameters) - qwen2.5**
- 100% GPU: ~40-45 layers
- 75% GPU: ~30-35 layers ✅ (default)
- 50% GPU: ~20-25 layers

**Large Models (13B+ parameters)**
- 100% GPU: ~50+ layers
- 75% GPU: ~37-40 layers
- 50% GPU: ~25-30 layers

### How to Find Your Optimal Value

1. **Check GPU memory**:
   ```powershell
   nvidia-smi
   ```

2. **Start conservative** (lower layers):
   ```python
   GPU_LAYERS = 30  # Start here
   ```

3. **Monitor usage** during AI call:
   ```powershell
   # In another terminal
   nvidia-smi -l 1  # Update every 1 second
   ```

4. **Adjust**:
   - GPU < 75%? Increase layers
   - GPU > 80%? Decrease layers
   - Target: 70-75% utilization

## Environment Variables Set

When `USE_GPU_CONTROLS = True`, the scripts set:

```bash
CUDA_VISIBLE_DEVICES=0          # Force GPU 0
OLLAMA_NUM_GPU=1                # Use only 1 GPU
OLLAMA_NUM_PARALLEL=1           # One request at a time
```

Plus the Ollama command includes:
```bash
ollama run qwen2.5 --gpu-layers 35
```

## Verify GPU Usage

### Before Running AI Script
```powershell
# Check which GPUs are active
nvidia-smi

# Example output:
#   GPU 0: 15% utilization  ← Least active (use this)
#   GPU 1: 85% utilization  ← Busy
```

### During AI Analysis
```powershell
# Watch GPU usage in real-time
nvidia-smi -l 1

# Should see:
#   GPU 0: ~70-75% utilization ✅
#   Memory: ~6-8 GB used (for 7B model)
```

### Check Which GPU Ollama Uses
```powershell
# List Ollama processes
Get-Process ollama

# Check environment
ollama ps  # Shows running models
```

## Tuning Examples

### Conservative (50% GPU)
```python
GPU_ID = "0"
GPU_LAYERS = 25           # Half GPU
MAX_PARALLEL_REQUESTS = 1
USE_GPU_CONTROLS = True
```

### Balanced (75% GPU) - DEFAULT ✅
```python
GPU_ID = "0"
GPU_LAYERS = 35           # Three-quarters GPU
MAX_PARALLEL_REQUESTS = 1
USE_GPU_CONTROLS = True
```

### Aggressive (95% GPU)
```python
GPU_ID = "0"
GPU_LAYERS = 43           # Nearly full GPU
MAX_PARALLEL_REQUESTS = 2  # Allow 2 concurrent
USE_GPU_CONTROLS = True
```

### CPU Only (No GPU)
```python
GPU_LAYERS = 0            # All layers on CPU
USE_GPU_CONTROLS = True
```

### Multiple GPUs (Advanced)
```python
GPU_ID = "0,1"            # Use both GPUs
GPU_LAYERS = 45           # Full model
MAX_PARALLEL_REQUESTS = 2  # Parallel requests
USE_GPU_CONTROLS = True
```

## Troubleshooting

### "GPU not detected"
- Check Ollama can see GPUs: `ollama list`
- Verify CUDA: `nvidia-smi`
- Restart Ollama service

### "Out of memory"
- Reduce `GPU_LAYERS` (try 25 instead of 35)
- Set `MAX_PARALLEL_REQUESTS = 1`
- Close other GPU applications

### "Using wrong GPU"
- Verify `GPU_ID = "0"` in script
- Check `echo $env:CUDA_VISIBLE_DEVICES` (should show 0)
- Restart script

### "AI is slow"
- Increase `GPU_LAYERS` for more GPU usage
- Check GPU isn't throttling: `nvidia-smi`
- Verify GPU 0 isn't busy with other tasks

### "Still using 100% GPU"
- Check `GPU_LAYERS` value (should be < 45)
- Verify `USE_GPU_CONTROLS = True`
- Try lower value (e.g., 30)

## Advanced: Per-Script Configuration

You can set different limits for each script:

**ai_runner.py** (continuous, low priority):
```python
GPU_LAYERS = 30  # Conservative
```

**ai_runner_enhanced.py** (more detailed):
```python
GPU_LAYERS = 35  # Balanced
```

**ai_investigator.py** (deep analysis):
```python
GPU_LAYERS = 40  # More power for deep dives
```

## Performance Impact

| GPU Layers | GPU Usage | Speed | Quality |
|------------|-----------|-------|---------|
| 0 (CPU)    | 0%        | Slow (5-10x) | Same |
| 20         | ~45%      | Medium | Same |
| 35         | ~75%      | Fast | Same |
| 45         | ~100%     | Fastest | Same |

**Note**: Quality is the same regardless of layers - it only affects speed!

## Recommended Settings

### Development Workstation (Shared GPU)
```python
GPU_ID = "0"              # Least active GPU
GPU_LAYERS = 30           # Leave room for IDE, browser
MAX_PARALLEL_REQUESTS = 1
USE_GPU_CONTROLS = True
```

### Dedicated Testing Server
```python
GPU_ID = "0"
GPU_LAYERS = 40           # Can use more
MAX_PARALLEL_REQUESTS = 2  # Faster processing
USE_GPU_CONTROLS = True
```

### Laptop (Limited GPU Memory)
```python
GPU_ID = "0"
GPU_LAYERS = 20           # Conservative
MAX_PARALLEL_REQUESTS = 1
USE_GPU_CONTROLS = True
```

## Quick Reference

```python
# Force GPU 0, use 75%, limit to 1 request (RECOMMENDED)
GPU_ID = "0"
GPU_LAYERS = 35
MAX_PARALLEL_REQUESTS = 1
USE_GPU_CONTROLS = True

# Disable GPU controls (let Ollama decide)
USE_GPU_CONTROLS = False
```

---

**Default Settings**: GPU 0, 75% usage, 1 parallel request ✅  
**Easy to Change**: Edit values at top of script  
**No Restart Needed**: Changes apply on next run  
**Safe Defaults**: Won't overload your GPU 🎮
