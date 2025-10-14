"""
AI Provider Service - handles communication with different AI providers
"""

import logging
from typing import Any, Dict, List, Optional

from anthropic import AsyncAnthropic
from openai import AsyncOpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


class AIProviderService:
    """Service for interacting with AI providers"""
    
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def get_completion(
        self,
        messages: List[Dict[str, str]],
        provider: str = "openai",
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> Dict[str, Any]:
        """
        Get completion from specified AI provider
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            provider: AI provider name ('openai' or 'anthropic')
            model: Model name (provider-specific)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Dict with 'message', 'provider', 'model', and 'usage' keys
        """
        if provider == "openai":
            return await self._openai_completion(messages, model, temperature, max_tokens)
        elif provider == "anthropic":
            return await self._anthropic_completion(messages, model, temperature, max_tokens)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    async def _openai_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str],
        temperature: float,
        max_tokens: int,
    ) -> Dict[str, Any]:
        """Get completion from OpenAI"""
        if not self.openai_client:
            raise ValueError("OpenAI API key not configured")
        
        model = model or "gpt-4"
        
        try:
            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            return {
                "message": response.choices[0].message.content,
                "provider": "openai",
                "model": model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                },
            }
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
    
    async def _anthropic_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str],
        temperature: float,
        max_tokens: int,
    ) -> Dict[str, Any]:
        """Get completion from Anthropic Claude"""
        if not self.anthropic_client:
            raise ValueError("Anthropic API key not configured")
        
        model = model or "claude-3-sonnet-20240229"
        
        # Extract system message if present
        system_message = None
        chat_messages = []
        
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                chat_messages.append(msg)
        
        try:
            response = await self.anthropic_client.messages.create(
                model=model,
                messages=chat_messages,
                system=system_message,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            return {
                "message": response.content[0].text,
                "provider": "anthropic",
                "model": model,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                },
            }
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise
