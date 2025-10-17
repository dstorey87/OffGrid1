import { NextResponse } from 'next/server';

export async function GET() {
  const healthStatus: {
    status: string;
    service: string;
    timestamp: string;
    vault_enabled: boolean;
    vault_status?: string;
    vault_error?: string;
    warning?: string;
  } = {
    status: 'healthy',
    service: 'frontend',
    timestamp: new Date().toISOString(),
    vault_enabled: Boolean(process.env.FRONTEND_ROLE_ID),
  };

  // Check Vault connectivity if credentials are provided
  if (process.env.FRONTEND_ROLE_ID && process.env.FRONTEND_SECRET_ID) {
    try {
      const { getVaultClient } = await import('@/lib/vault');
      const vaultClient = getVaultClient();

      const vaultHealthy = await vaultClient.isHealthy();

      healthStatus.vault_status = vaultHealthy ? 'connected' : 'disconnected';

      if (!vaultHealthy) {
        healthStatus.status = 'degraded';
        healthStatus.warning = 'Vault is not accessible';
      }
    } catch (error) {
      healthStatus.status = 'degraded';
      healthStatus.vault_status = 'error';
      healthStatus.vault_error = error instanceof Error ? error.message : 'Unknown error';
    }
  } else {
    healthStatus.vault_status = 'not_configured';
  }

  return NextResponse.json(healthStatus, { status: 200 });
}
