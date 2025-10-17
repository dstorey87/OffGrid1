"""Vault client for reading secrets from HashiCorp Vault."""
import os
import hvac
from functools import lru_cache
from typing import Dict, Any, Optional


class VaultClient:
    """HashiCorp Vault client for secret management."""
    
    def __init__(self):
        self.vault_addr = os.getenv("VAULT_ADDR", "http://localhost:8200")
        self.role_id = os.getenv("AI_SERVICE_ROLE_ID")
        self.secret_id = os.getenv("AI_SERVICE_SECRET_ID")
        self.client: Optional[hvac.Client] = None
        self._authenticated = False
        
    def authenticate(self) -> bool:
        """Authenticate with Vault using AppRole."""
        if not self.role_id or not self.secret_id:
            raise ValueError(
                "AI_SERVICE_ROLE_ID and AI_SERVICE_SECRET_ID must be set"
            )
        
        try:
            self.client = hvac.Client(url=self.vault_addr)
            
            # Authenticate using AppRole
            response = self.client.auth.approle.login(
                role_id=self.role_id,
                secret_id=self.secret_id,
            )
            
            self._authenticated = True
            return True
            
        except Exception as e:
            raise ConnectionError(f"Failed to authenticate with Vault: {e}")
    
    def read_secret(self, path: str) -> Dict[str, Any]:
        """
        Read a secret from Vault KV v2 engine.
        
        Args:
            path: Secret path without mount point (e.g., "ai-service/api-keys")
            
        Returns:
            Dictionary containing secret data
        """
        if not self._authenticated:
            self.authenticate()
        
        try:
            # Read from KV v2 (offgrid mount point)
            secret = self.client.secrets.kv.v2.read_secret_version(
                path=path,
                mount_point="offgrid"
            )
            
            return secret["data"]["data"]
            
        except Exception as e:
            raise ValueError(f"Failed to read secret from {path}: {e}")
    
    def get_ai_credentials(self) -> Dict[str, str]:
        """Get AI service API keys from Vault."""
        return self.read_secret("ai-service/api-keys")
    
    def is_healthy(self) -> bool:
        """Check if Vault connection is healthy."""
        try:
            if not self.client:
                self.client = hvac.Client(url=self.vault_addr)
            return self.client.sys.is_initialized() and not self.client.sys.is_sealed()
        except Exception:
            return False


@lru_cache()
def get_vault_client() -> VaultClient:
    """Get singleton Vault client instance."""
    client = VaultClient()
    client.authenticate()
    return client
