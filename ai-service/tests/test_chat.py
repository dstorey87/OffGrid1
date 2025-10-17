"""
Tests for chat API
"""

from unittest.mock import AsyncMock, patch

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


@pytest.mark.asyncio
async def test_chat_endpoint_valid_request():
    """Test chat endpoint with valid request"""
    # Mock the AI provider service
    mock_response = {
        "message": "This is a test response from the AI",
        "provider": "openai",
        "model": "gpt-4",
        "usage": {
            "prompt_tokens": 10,
            "completion_tokens": 20,
            "total_tokens": 30,
        },
    }

    with patch("app.api.v1.chat.AIProviderService") as mock_service:
        mock_instance = AsyncMock()
        mock_instance.get_completion.return_value = mock_response
        mock_service.return_value = mock_instance

        async with AsyncClient(app=app, base_url="http://test") as client:
            request_data = {
                "messages": [
                    {"role": "user", "content": "Hello, AI!"},
                ],
                "provider": "openai",
                "model": "gpt-4",
                "temperature": 0.7,
                "max_tokens": 1000,
            }

            response = await client.post("/api/v1/chat/", json=request_data)
            assert response.status_code == 200

            data = response.json()
            # Validate response structure
            assert "message" in data
            assert "provider" in data
            assert "model" in data
            assert "usage" in data

            # Validate response values
            assert data["message"] == "This is a test response from the AI"
            assert data["provider"] == "openai"
            assert data["model"] == "gpt-4"
            assert data["usage"]["total_tokens"] == 30


@pytest.mark.asyncio
async def test_chat_endpoint_anthropic_provider():
    """Test chat endpoint with Anthropic provider"""
    mock_response = {
        "message": "Claude response here",
        "provider": "anthropic",
        "model": "claude-3-sonnet-20240229",
        "usage": {
            "input_tokens": 15,
            "output_tokens": 25,
        },
    }

    with patch("app.api.v1.chat.AIProviderService") as mock_service:
        mock_instance = AsyncMock()
        mock_instance.get_completion.return_value = mock_response
        mock_service.return_value = mock_instance

        async with AsyncClient(app=app, base_url="http://test") as client:
            request_data = {
                "messages": [
                    {"role": "user", "content": "Hello, Claude!"},
                ],
                "provider": "anthropic",
            }

            response = await client.post("/api/v1/chat/", json=request_data)
            assert response.status_code == 200

            data = response.json()
            assert data["provider"] == "anthropic"
            assert data["model"] == "claude-3-sonnet-20240229"


@pytest.mark.asyncio
async def test_chat_endpoint_invalid_provider():
    """Test chat endpoint with invalid provider"""
    with patch("app.api.v1.chat.AIProviderService") as mock_service:
        mock_instance = AsyncMock()
        mock_instance.get_completion.side_effect = ValueError("Unsupported provider: invalid")
        mock_service.return_value = mock_instance

        async with AsyncClient(app=app, base_url="http://test") as client:
            request_data = {
                "messages": [
                    {"role": "user", "content": "Test"},
                ],
                "provider": "invalid",
            }

            response = await client.post("/api/v1/chat/", json=request_data)
            assert response.status_code == 400
            assert "Unsupported provider" in response.json()["detail"]


@pytest.mark.asyncio
async def test_chat_endpoint_invalid_temperature():
    """Test chat endpoint with invalid temperature (out of range)"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        request_data = {
            "messages": [
                {"role": "user", "content": "Test"},
            ],
            "temperature": 3.0,  # Invalid: > 2.0
        }

        response = await client.post("/api/v1/chat/", json=request_data)
        assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_chat_endpoint_invalid_max_tokens():
    """Test chat endpoint with invalid max_tokens (out of range)"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        request_data = {
            "messages": [
                {"role": "user", "content": "Test"},
            ],
            "max_tokens": 5000,  # Invalid: > 4000
        }

        response = await client.post("/api/v1/chat/", json=request_data)
        assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_chat_endpoint_missing_messages():
    """Test chat endpoint with missing messages field"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        request_data = {
            "provider": "openai",
        }

        response = await client.post("/api/v1/chat/", json=request_data)
        assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_chat_endpoint_empty_messages():
    """Test chat endpoint with empty messages array"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        request_data = {
            "messages": [],
        }

        response = await client.post("/api/v1/chat/", json=request_data)
        # Should accept empty array (Pydantic allows it), but AI provider may fail
        assert response.status_code in [200, 400, 500]


@pytest.mark.asyncio
async def test_chat_endpoint_system_message():
    """Test chat endpoint with system message"""
    mock_response = {
        "message": "Response with system context",
        "provider": "openai",
        "model": "gpt-4",
        "usage": {"prompt_tokens": 20, "completion_tokens": 15, "total_tokens": 35},
    }

    with patch("app.api.v1.chat.AIProviderService") as mock_service:
        mock_instance = AsyncMock()
        mock_instance.get_completion.return_value = mock_response
        mock_service.return_value = mock_instance

        async with AsyncClient(app=app, base_url="http://test") as client:
            request_data = {
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant"},
                    {"role": "user", "content": "Hello!"},
                ],
            }

            response = await client.post("/api/v1/chat/", json=request_data)
            assert response.status_code == 200
            data = response.json()
            assert "message" in data


@pytest.mark.asyncio
async def test_chat_endpoint_internal_error():
    """Test chat endpoint handling internal errors"""
    with patch("app.api.v1.chat.AIProviderService") as mock_service:
        mock_instance = AsyncMock()
        mock_instance.get_completion.side_effect = Exception("AI service error")
        mock_service.return_value = mock_instance

        async with AsyncClient(app=app, base_url="http://test") as client:
            request_data = {
                "messages": [
                    {"role": "user", "content": "Test"},
                ],
            }

            response = await client.post("/api/v1/chat/", json=request_data)
            assert response.status_code == 500
            assert "Internal server error" in response.json()["detail"]
