"""
Centralized settings for the AI service
All configuration and environment variables are managed here
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "OffGrid AI Service"
    app_version: str = "0.1.0"
    environment: Literal["development", "production", "test"] = "development"
    debug: bool = False
    log_level: str = "INFO"

    # API Configuration
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default=["http://localhost:3000", "http://localhost:3001"])
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = Field(default=["*"])
    cors_allow_headers: list[str] = Field(default=["*"])

    # AI Provider API Keys
    openai_api_key: str = Field(default="", description="OpenAI API Key")
    anthropic_api_key: str = Field(default="", description="Anthropic API Key")

    # Redis Configuration
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str = ""
    cache_ttl: int = 3600  # 1 hour

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_period: int = 60  # seconds

    # Request Configuration
    default_timeout: int = 30
    max_retries: int = 3

    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.environment == "production"

    @property
    def is_test(self) -> bool:
        """Check if running in test mode"""
        return self.environment == "test"

    def validate_required_keys(self) -> list[str]:
        """Validate that required API keys are present"""
        errors: list[str] = []

        if not self.openai_api_key and not self.anthropic_api_key:
            errors.append(
                "At least one AI provider API key must be set "
                "(OPENAI_API_KEY or ANTHROPIC_API_KEY)"
            )

        return errors


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance
    Using lru_cache ensures we only instantiate Settings once
    """
    return Settings()


# Convenience export
settings = get_settings()
