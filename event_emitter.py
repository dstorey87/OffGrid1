"""
Event Emitter for AI Testing Dashboard
Writes structured events to JSONL for real-time streaming
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Literal

EventType = Literal[
    "runner_start",
    "cycle_start",
    "test_discovered",
    "test_execution_start",
    "test_output",
    "test_start",
    "test_complete",
    "ai_prompt",
    "ai_thinking",
    "ai_response_chunk",
    "ai_full_response",
    "ai_rca",
    "ai_fix",
    "cycle_complete",
    "error",
]


class AITestEventEmitter:
    def __init__(self, stream_file: Path, results_file: Path):
        self.stream_file = stream_file
        self.results_file = results_file
        self.current_cycle = 0
        self.test_results = []

        # Initialize files
        stream_file.parent.mkdir(exist_ok=True)
        results_file.parent.mkdir(exist_ok=True)

    def emit(self, event_type: EventType, data: dict):
        """Emit an event to the live stream"""
        event = {
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "cycle": self.current_cycle,
            **data,
        }

        # Append to JSONL stream
        with open(self.stream_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(event) + "\n")

    def start_cycle(self, cycle_number: int):
        """Start a new test cycle"""
        self.current_cycle = cycle_number
        self.emit(
            "cycle_start",
            {"cycle": cycle_number, "message": f"Starting test cycle #{cycle_number}"},
        )

    def test_start(self, test_name: str):
        """Notify test starting"""
        self.emit("test_start", {"test_name": test_name, "status": "running"})

    def test_complete(
        self, test_name: str, status: str, duration_ms: int, error: str = None
    ):
        """Record test completion"""
        result = {
            "test_name": test_name,
            "status": status,
            "duration_ms": duration_ms,
            "error": error,
            "cycle": self.current_cycle,
            "timestamp": datetime.now().isoformat(),
        }

        self.test_results.append(result)
        self.emit("test_complete", result)

    def ai_thinking(self, message: str):
        """Show what AI is thinking"""
        self.emit("ai_thinking", {"message": message})

    def ai_rca(self, test_name: str, analysis: str):
        """Record AI root cause analysis"""
        self.emit("ai_rca", {"test_name": test_name, "analysis": analysis})

    def ai_fix(self, test_name: str, fix: str):
        """Record AI suggested fix"""
        self.emit("ai_fix", {"test_name": test_name, "fix": fix})

    def cycle_complete(self, stats: dict):
        """Complete test cycle"""
        self.emit("cycle_complete", stats)

        # Save complete results
        self._save_results()

    def test_discovered(self, test_file: str, test_count: int):
        """Emit when test file is discovered"""
        self.emit(
            "test_discovered",
            {
                "file": test_file,
                "count": test_count,
                "message": f"Found {test_count} tests in {test_file}",
            },
        )

    def test_execution_start(self, test_name: str, test_file: str = ""):
        """Emit when a specific test starts executing"""
        self.emit(
            "test_execution_start",
            {
                "test": test_name,
                "file": test_file,
                "message": f"▶️  Running: {test_name}",
            },
        )

    def test_output(self, output: str):
        """Emit real-time test execution output"""
        if output.strip():  # Only emit non-empty output
            self.emit(
                "test_output", {"output": output.strip(), "message": output.strip()}
            )

    def ai_prompt(self, prompt: str):
        """Emit the actual AI prompt being sent"""
        # Truncate very long prompts for display
        display_prompt = prompt[:1000] + "..." if len(prompt) > 1000 else prompt
        self.emit(
            "ai_prompt",
            {
                "prompt": display_prompt,
                "full_length": len(prompt),
                "message": f"🤖 Sending {len(prompt)} char prompt to AI",
            },
        )

    def ai_response_chunk(self, chunk: str):
        """Emit AI response as it streams in"""
        if chunk.strip():
            self.emit("ai_response_chunk", {"chunk": chunk, "message": chunk})

    def ai_full_response(self, response: str):
        """Emit complete AI response"""
        self.emit(
            "ai_full_response",
            {
                "response": response,
                "length": len(response),
                "message": f"✅ AI analysis complete ({len(response)} chars)",
            },
        )

    def error(self, message: str, details: str = None):
        """Log error"""
        self.emit("error", {"message": message, "details": details})

    def _save_results(self):
        """Save test results to JSON file (cumulative)"""
        # Load existing results if file exists
        existing_results = []
        if self.results_file.exists():
            try:
                with open(self.results_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    existing_results = data.get("results", [])
            except (json.JSONDecodeError, FileNotFoundError):
                pass

        # Append new results to existing ones
        all_results = existing_results + self.test_results

        data = {
            "last_updated": datetime.now().isoformat(),
            "total_cycles": self.current_cycle,
            "results": all_results,
        }

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        # Clear the current session results (they're now saved)
        self.test_results = []
