/**
 * Centralized configuration for the frontend application
 * All environment variables and app-wide settings are defined here
 */

export const config = {
  /**
   * Application metadata
   */
  app: {
    name: 'OffGrid Platform',
    description: 'Comprehensive platform for sustainable living enthusiasts',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  },

  /**
   * API endpoints
   */
  api: {
    wordpress: {
      baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080',
      restBase: '/wp-json/wp/v2',
    },
    aiService: {
      baseUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000',
      timeout: 30000, // 30 seconds
    },
  },

  /**
   * Feature flags
   */
  features: {
    aiChat: process.env.NEXT_PUBLIC_FEATURE_AI_CHAT === 'true',
    stripe: process.env.NEXT_PUBLIC_FEATURE_STRIPE === 'true',
    analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
  },

  /**
   * Stripe configuration (if enabled)
   */
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },

  /**
   * Pagination defaults
   */
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },

  /**
   * Environment checks
   */
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;

/**
 * Validate required environment variables
 * Throws error if critical config is missing
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (config.features.stripe && !config.stripe.publishableKey) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required when Stripe is enabled');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate on module load in production
if (config.env.isProduction) {
  validateConfig();
}
