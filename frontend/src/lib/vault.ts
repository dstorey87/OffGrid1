// Vault client for server-side secret management
import vault from 'node-vault';

interface VaultConfig {
  apiVersion: string;
  endpoint: string;
  token?: string;
}

interface VaultSecrets {
  [key: string]: string;
}

class VaultClient {
  private client: any;
  private roleId: string;
  private secretId: string;
  private authenticated: boolean = false;

  constructor() {
    const vaultAddr = process.env.VAULT_ADDR || 'http://localhost:8200';
    this.roleId = process.env.FRONTEND_ROLE_ID || '';
    this.secretId = process.env.FRONTEND_SECRET_ID || '';

    const config: VaultConfig = {
      apiVersion: 'v1',
      endpoint: vaultAddr,
    };

    this.client = vault(config);
  }

  async authenticate(): Promise<void> {
    if (!this.roleId || !this.secretId) {
      throw new Error(
        'FRONTEND_ROLE_ID and FRONTEND_SECRET_ID must be set'
      );
    }

    try {
      const response = await this.client.approleLogin({
        role_id: this.roleId,
        secret_id: this.secretId,
      });

      this.client.token = response.auth.client_token;
      this.authenticated = true;
    } catch (error) {
      throw new Error(
        `Failed to authenticate with Vault: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async readSecret(path: string): Promise<VaultSecrets> {
    if (!this.authenticated) {
      await this.authenticate();
    }

    try {
      const response = await this.client.read(`offgrid/data/${path}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to read secret from ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getFrontendConfig(): Promise<VaultSecrets> {
    return this.readSecret('frontend/config');
  }

  async getStripeKeys(): Promise<VaultSecrets> {
    return this.readSecret('frontend/stripe');
  }

  async getAICredentials(): Promise<VaultSecrets> {
    return this.readSecret('ai-service/api-keys');
  }

  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.client.health();
      return health.initialized && !health.sealed;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let vaultClient: VaultClient | null = null;

export function getVaultClient(): VaultClient {
  if (!vaultClient) {
    vaultClient = new VaultClient();
  }
  return vaultClient;
}

export default VaultClient;
