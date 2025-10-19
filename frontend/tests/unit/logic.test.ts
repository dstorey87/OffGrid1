import { config, validateConfig } from '../../config';

/**
 * Logic tests for configuration utilities
 */

describe('Configuration', () => {
  describe('config object', () => {
    it('should have app metadata', () => {
      expect(config.app).toBeDefined();
      expect(config.app.name).toBe('OffGrid Platform');
      expect(config.app.description).toBeTruthy();
      expect(config.app.version).toBeTruthy();
    });

    it('should have API endpoints', () => {
      expect(config.api).toBeDefined();
      expect(config.api.wordpress).toBeDefined();
      expect(config.api.aiService).toBeDefined();
      expect(config.api.wordpress.baseUrl).toBeTruthy();
      expect(config.api.aiService.baseUrl).toBeTruthy();
    });

    it('should have feature flags', () => {
      expect(config.features).toBeDefined();
      expect(typeof config.features.aiChat).toBe('boolean');
      expect(typeof config.features.stripe).toBe('boolean');
      expect(typeof config.features.analytics).toBe('boolean');
    });

    it('should have pagination defaults', () => {
      expect(config.pagination).toBeDefined();
      expect(config.pagination.defaultPageSize).toBe(12);
      expect(config.pagination.maxPageSize).toBe(100);
    });

    it('should have environment checks', () => {
      expect(config.env).toBeDefined();
      expect(typeof config.env.isDevelopment).toBe('boolean');
      expect(typeof config.env.isProduction).toBe('boolean');
      expect(typeof config.env.isTest).toBe('boolean');
    });
  });

  describe('validateConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment variables
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should not throw when configuration is valid', () => {
      // Note: Cannot modify process.env.NODE_ENV in tests as it's read-only
      // The test runs in the configured NODE_ENV
      process.env = { ...originalEnv, NEXT_PUBLIC_FEATURE_STRIPE: 'false' };

      expect(() => validateConfig()).not.toThrow();
    });

    it('should validate configuration without throwing', () => {
      // Note: In the current implementation, validateConfig doesn't throw
      // It logs warnings to console instead
      expect(() => validateConfig()).not.toThrow();
    });
  });
});

/**
 * Example API utility tests
 */

// Mock fetch
global.fetch = jest.fn();

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WordPress API', () => {
    it('should construct correct API URL', () => {
      const baseUrl = config.api.wordpress.baseUrl;
      const restBase = config.api.wordpress.restBase;
      const expectedUrl = `${baseUrl}${restBase}/posts`;

      expect(expectedUrl).toContain('/wp-json/wp/v2/posts');
    });
  });

  describe('AI Service API', () => {
    it('should have correct timeout setting', () => {
      expect(config.api.aiService.timeout).toBe(30000);
    });
  });
});

/**
 * Example utility function tests
 */

describe('Utility Functions', () => {
  describe('formatDate', () => {
    function formatDate(date: Date): string {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    it('should format date correctly', () => {
      const date = new Date('2025-10-19');
      const formatted = formatDate(date);

      expect(formatted).toContain('2025');
      expect(formatted).toMatch(/October|Oct/i);
    });
  });

  describe('slugify', () => {
    function slugify(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test  Multiple   Spaces')).toBe('test-multiple-spaces');
      expect(slugify('Special!@#$%Characters')).toBe('special-characters');
    });
  });

  describe('truncate', () => {
    function truncate(text: string, maxLength: number): string {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength - 3) + '...';
    }

    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short';
      expect(truncate(shortText, 20)).toBe('Short');
    });
  });
});
