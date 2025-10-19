"""
Configuration settings for the AI service
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Environment
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"

    # Vault Configuration
    VAULT_ADDR: str = "http://localhost:8200"
    AI_SERVICE_ROLE_ID: str | None = None
    AI_SERVICE_SECRET_ID: str | None = None
    USE_VAULT: bool = True

    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_TTL: int = 3600  # 1 hour

    # AI Providers - Local AI only
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_PROVIDER: str = "ollama"
    DEFAULT_MODEL: str = "llama2"  # or mistral, codellama, etc.

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    # Security - JWT Secret loaded from Vault if enabled
    JWT_SECRET: str = "fallback-secret-only-for-testing"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 3600

    class Config:
        env_file = ".env.vault"
        case_sensitive = True

    def load_secrets(self) -> None:
        """Load secrets from Vault if enabled."""
        if not self.USE_VAULT:
            return

        try:
            from app.core.vault import get_vault_client

            vault_client = get_vault_client()

            # Verify Vault connectivity (no cloud AI credentials needed)
            vault_client.get_ai_credentials()

        except (ConnectionError, ValueError, RuntimeError) as e:
            if self.ENVIRONMENT == "production":
                raise RuntimeError(f"Failed to load secrets from Vault: {e}") from e
            else:
                # In development, warn but continue with fallback values
                print(f"Warning: Could not connect to Vault: {e}")
                print("Using fallback configuration values")


settings = Settings()

# Load secrets from Vault on startup
if settings.USE_VAULT:
    settings.load_secrets()
