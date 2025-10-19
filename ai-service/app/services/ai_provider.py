"""
AI Provider Service - Local Ollama only (no cloud AI providers)
"""

import logging
from typing import Any

from app.core.ollama_client import get_ollama_client

logger = logging.getLogger(__name__)


class AIProviderService:
    """Service for interacting with local Ollama AI"""

    def __init__(self) -> None:
        """Initialize service - only local Ollama is supported"""
        self.ollama_client = get_ollama_client()

    async def get_completion(
        self,
        messages: list[dict[str, str]],
        provider: str = "ollama",
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> dict[str, Any]:
        """
        Get completion from local Ollama

        Args:
            messages: List of message dicts with 'role' and 'content'
            provider: Must be 'ollama' (only local AI supported)
            model: Ollama model name (defaults to qwen2.5:7b)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate

        Returns:
            Dict with 'message', 'provider', 'model', and 'usage' keys
        """
        if provider != "ollama":
            raise ValueError(
                f"Only 'ollama' provider is supported (local AI only), got: {provider}"
            )

        model = model or self.ollama_client.model

        # Convert messages to prompt format
        prompt_parts = []
        system_prompt = None
        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            elif msg["role"] == "user":
                prompt_parts.append(f"User: {msg['content']}")
            elif msg["role"] == "assistant":
                prompt_parts.append(f"Assistant: {msg['content']}")

        prompt = "\n".join(prompt_parts)

        # Use Ollama generate method
        response = self.ollama_client.generate(
            prompt=prompt,
            system=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return {
            "message": response.text,
            "provider": "ollama",
            "model": model,
            "usage": {},
        }
