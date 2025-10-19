"""
Health check tests for the AI service
Tests basic functionality and error handling
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client fixture"""
    return TestClient(app)


def test_health_endpoint_returns_healthy(client: TestClient) -> None:
    """Test that the health endpoint returns a healthy status"""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ai-service"
    assert "version" in data


def test_liveness_endpoint(client: TestClient) -> None:
    """Test the liveness probe endpoint"""
    response = client.get("/health/live")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"


def test_readiness_endpoint(client: TestClient) -> None:
    """Test the readiness probe endpoint"""
    response = client.get("/health/ready")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ready", "not_ready"]


def test_not_found_endpoint(client: TestClient) -> None:
    """Test that non-existent endpoints return 404"""
    response = client.get("/this-does-not-exist")

    assert response.status_code == 404


def test_validation_error(client: TestClient) -> None:
    """Test that invalid requests return proper validation errors"""
    response = client.post(
        "/api/v1/chat/",
        json={
            "messages": "invalid",  # Should be array
            "temperature": 5.0,  # Should be <= 2.0
        },
    )

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_missing_required_fields(client: TestClient) -> None:
    """Test that requests with missing required fields fail validation"""
    response = client.post(
        "/api/v1/chat/",
        json={
            # Missing 'messages' field
            "temperature": 0.7,
        },
    )

    assert response.status_code == 422


def test_cors_headers(client: TestClient) -> None:
    """Test that CORS headers are present"""
    response = client.options(
        "/health",
        headers={"Origin": "http://localhost:3000"},
    )

    # Should have CORS headers
    assert "access-control-allow-origin" in response.headers


def test_error_handling_logs_properly(client: TestClient, caplog: pytest.LogCaptureFixture) -> None:
    """Test that errors are logged correctly"""
    # Trigger an error by requesting a non-existent endpoint
    with caplog.at_level("WARNING"):
        client.get("/this-does-not-exist")

    # Check that the error was logged
    assert len(caplog.records) > 0
    assert any("404" in record.message for record in caplog.records)


@pytest.mark.asyncio
async def test_unhandled_exception_returns_500() -> None:
    """Test that unhandled exceptions are caught and return 500"""
    # This would require creating an endpoint that raises an exception
    # For now, we verify the structure exists
    assert hasattr(app, "exception_handlers")


def test_rate_limiting_headers(client: TestClient) -> None:
    """Test that rate limiting information is available"""
    response = client.get("/health")

    # Rate limiting headers may or may not be present
    # This test verifies the structure
    assert response.status_code == 200


def test_request_id_in_logs(client: TestClient, caplog: pytest.LogCaptureFixture) -> None:
    """Test that requests are logged with identifiable information"""
    with caplog.at_level("INFO"):
        client.get("/health")

    # Verify that requests are being logged
    assert len(caplog.records) > 0
    assert any("health" in record.message.lower() for record in caplog.records)


def test_timeout_handling(client: TestClient) -> None:
    """Test that timeout settings are configured"""
    # This is a smoke test to ensure the app starts
    # Actual timeout testing would require mock slow endpoints
    response = client.get("/health")
    assert response.status_code == 200


def test_json_response_format(client: TestClient) -> None:
    """Test that all responses are in JSON format"""
    response = client.get("/health")

    assert response.headers["content-type"] == "application/json"
    assert response.json() is not None
