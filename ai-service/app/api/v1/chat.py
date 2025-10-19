"""
Chat API endpoints
"""

import logging
from typing import Literal

import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.redis_client import get_redis_client
from app.services.ai_provider import AIProviderService

router = APIRouter()
logger = logging.getLogger(__name__)


class Message(BaseModel):
    """Chat message model"""

    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Chat request model"""

    messages: list[Message]
    provider: str | None = Field(default="openai", description="AI provider (openai, anthropic)")
    model: str | None = Field(default=None, description="Model name")
    temperature: float | None = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int | None = Field(default=1000, ge=1, le=4000)
    stream: bool = Field(default=False, description="Enable streaming response")


class ChatResponse(BaseModel):
    """Chat response model"""

    message: str
    provider: str
    model: str
    usage: dict


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest, redis_client: redis.Redis = Depends(get_redis_client)
) -> ChatResponse:
    """
    Chat endpoint - Local Ollama only

    Supports:
    - Ollama (qwen2.5:7b, llama3.2, mistral, etc.)
    """
    try:
        ai_service = AIProviderService()

        # Convert messages to dict
        messages = [msg.model_dump() for msg in request.messages]

        # Get response from AI provider
        response = await ai_service.get_completion(
            messages=messages,
            provider=request.provider,  # type: ignore[arg-type]
            model=request.model,
            temperature=request.temperature,  # type: ignore[arg-type]
            max_tokens=request.max_tokens,  # type: ignore[arg-type]
        )

        logger.info(
            f"Chat request processed: provider={request.provider}, model={response.get('model')}"
        )

        return ChatResponse(
            message=response["message"],
            provider=response["provider"],
            model=response["model"],
            usage=response.get("usage", {}),
        )

    except ValueError as e:
        logger.error(f"Invalid request: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/models")
async def list_models() -> dict[str, list[str]]:
    """
    List available models - only local Ollama models
    """
    return {
        "ollama": [
            "qwen2.5:7b",
            "llama3.2:latest",
            "mistral:latest",
        ],
    }
