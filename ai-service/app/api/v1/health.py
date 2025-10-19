"""
Health check endpoints
"""

from datetime import datetime
from typing import Any

import redis.asyncio as redis
from fastapi import APIRouter, Depends

from app.core.config import settings
from app.core.redis_client import get_redis_client

router = APIRouter()


@router.get("")
async def health_check(
    redis_client: redis.Redis = Depends(get_redis_client),
) -> dict[str, Any]:
    """
    Health check endpoint
    Returns the service status and dependencies including Vault
    """
    redis_status = "healthy"
    try:
        await redis_client.ping()
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    health_response = {
        "status": "healthy" if redis_status == "healthy" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai-service",
        "environment": settings.ENVIRONMENT,
        "vault_enabled": settings.USE_VAULT,
        "dependencies": {"redis": redis_status},
    }

    # Check Vault connectivity if enabled
    if settings.USE_VAULT:
        try:
            from app.core.vault import VaultClient

            vault_client = VaultClient()
            vault_healthy = vault_client.is_healthy()

            health_response["dependencies"]["vault"] = (
                "connected" if vault_healthy else "disconnected"
            )

            if not vault_healthy:
                health_response["status"] = "degraded"

        except Exception as e:
            health_response["status"] = "degraded"
            health_response["dependencies"]["vault"] = f"error: {str(e)}"

    return health_response


@router.get("/ready")
async def readiness_check(
    redis_client: redis.Redis = Depends(get_redis_client),
) -> dict[str, str]:
    """
    Readiness check for Kubernetes
    """
    try:
        await redis_client.ping()
        return {"status": "ready"}
    except Exception:
        return {"status": "not ready"}


@router.get("/live")
async def liveness_check() -> dict[str, str]:
    """
    Liveness check for Kubernetes
    """
    return {"status": "alive"}
