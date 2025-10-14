"""
Chat API endpoints
"""

import logging
from typing import List, Literal, Optional

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

    messages: List[Message]
    provider: Optional[str] = Field(default="openai", description="AI provider (openai, anthropic)")
    model: Optional[str] = Field(default=None, description="Model name")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1000, ge=1, le=4000)
    stream: bool = Field(default=False, description="Enable streaming response")


class ChatResponse(BaseModel):
    """Chat response model"""

    message: str
    provider: str
    model: str
    usage: dict


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, redis_client: redis.Redis = Depends(get_redis_client)):
    """
    Chat endpoint - proxy to AI providers

    Supports:
    - OpenAI (GPT-4, GPT-3.5-turbo)
    - Anthropic (Claude)
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
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/models")
async def list_models():
    """
    List available models from all providers
    """
    return {
        "openai": [
            "gpt-4",
            "gpt-4-turbo-preview",
            "gpt-3.5-turbo",
        ],
        "anthropic": [
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307",
        ],
    }
