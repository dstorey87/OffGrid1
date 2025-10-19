#!/usr/bin/env python3
"""
Quick test to verify the enhanced event system works
"""
import subprocess
import time
from pathlib import Path
from event_emitter import AITestEventEmitter

LOGS_DIR = Path("logs")
LOGS_DIR.mkdir(exist_ok=True)

# Initialize emitter
emitter = AITestEventEmitter(
    stream_file=LOGS_DIR / "live_stream.jsonl",
    results_file=LOGS_DIR / "test_results.json",
)

print("🚀 Quick Test - Enhanced Event System")

# Emit various event types
emitter.emit(
    "runner_start", {"message": "Quick test started", "config": {"model": "qwen2.5"}}
)
emitter.start_cycle(1)

# Test discovery
emitter.test_discovered("example.spec.ts", 5)
time.sleep(0.5)

# Test execution
for i in range(3):
    test_name = f"Test #{i+1}: Homepage loads"
    emitter.test_execution_start(test_name, "homepage.spec.ts")
    time.sleep(0.3)

    # Simulate test output
    emitter.test_output(f"  Running {test_name}...")
    emitter.test_output(f"  ✓ Page loaded in 250ms")
    time.sleep(0.2)

    emitter.test_complete(test_name, "passed", 250)

print("\n🤖 Simulating AI analysis...")
time.sleep(0.5)

# Simulate AI prompt
prompt = """Analyze these test failures:

Test: Homepage navigation
Error: Button not found

Please provide:
1. Root cause analysis
2. Code fix
3. Configuration changes"""

emitter.ai_prompt(prompt)
time.sleep(0.3)

emitter.ai_thinking("Analyzing test context and source code...")
time.sleep(0.5)

# Simulate streaming AI response
response_chunks = [
    "# Root Cause Analysis\n\n",
    "The button selector is incorrect. ",
    "The test is looking for 'button.submit' ",
    "but the actual element is 'button[type=submit]'.\n\n",
    "# Recommended Fix\n\n",
    "```typescript\n",
    "// Change from:\n",
    "await page.click('button.submit');\n\n",
    "// To:\n",
    "await page.click('button[type=\"submit\"]');\n",
    "```\n\n",
    "# Priority: HIGH\n",
]

for chunk in response_chunks:
    emitter.ai_response_chunk(chunk)
    time.sleep(0.1)

full_response = "".join(response_chunks)
emitter.ai_full_response(full_response)

print("\n📊 Completing cycle...")
emitter.cycle_complete(
    {
        "run_number": 1,
        "total_tests": 3,
        "passed": 3,
        "failed": 0,
    }
)

print("\n✅ Quick test complete!")
print(f"📄 Events written to: {LOGS_DIR / 'live_stream.jsonl'}")
print("\nYou should now see detailed events in the dashboard including:")
print("  • Test discovery (🔍)")
print("  • Test execution (▶️)")
print("  • Test output (📄)")
print("  • AI prompt (📤)")
print("  • AI response chunks (💬)")
print("  • Full AI analysis (✅)")
