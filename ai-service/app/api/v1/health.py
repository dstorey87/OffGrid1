"""
Health check endpoints
"""

from datetime import datetime

import redis.asyncio as redis
from fastapi import APIRouter, Depends

from app.core.redis_client import get_redis_client

router = APIRouter()


@router.get("")
async def health_check(redis_client: redis.Redis = Depends(get_redis_client)):
    """
    Health check endpoint
    Returns the service status and dependencies
    """
    redis_status = "healthy"
    try:
        await redis_client.ping()
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if redis_status == "healthy" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai-service",
        "dependencies": {"redis": redis_status},
    }


@router.get("/ready")
async def readiness_check(redis_client: redis.Redis = Depends(get_redis_client)):
    """
    Readiness check for Kubernetes
    """
    try:
        await redis_client.ping()
        return {"status": "ready"}
    except Exception:
        return {"status": "not ready"}


@router.get("/live")
async def liveness_check():
    """
    Liveness check for Kubernetes
    """
    return {"status": "alive"}
