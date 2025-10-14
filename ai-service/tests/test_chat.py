"""
Tests for chat API
"""

import pytest
from httpx import AsyncClient

from main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "service" in data


@pytest.mark.asyncio
async def test_list_models():
    """Test models listing endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/chat/models")
        assert response.status_code == 200
        data = response.json()
        assert "openai" in data
        assert "anthropic" in data
