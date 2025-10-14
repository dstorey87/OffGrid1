"""
FastAPI AI Service for OffGrid Platform
Provides chat proxy for multiple AI providers (OpenAI, Anthropic)
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import chat, health
from app.core.config import settings
from app.core.redis_client import get_redis_client

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL.upper(), format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting AI Service...")
    # Startup
    redis_client = await get_redis_client()
    await redis_client.ping()
    logger.info("Redis connection established")
    yield
    # Shutdown
    logger.info("Shutting down AI Service...")
    await redis_client.close()


app = FastAPI(
    title="OffGrid AI Service",
    description="AI chat proxy service with multi-provider support",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"service": "OffGrid AI Service", "version": "0.1.0", "status": "running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.ENVIRONMENT == "development")
