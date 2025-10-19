import { test, expect } from '@playwright/test';

/**
 * Comprehensive smoke tests with console/network error detection
 * Tests all routable pages and ensures no errors occur
 */

// Track errors globally
const testErrors: Map<string, { console: string[]; network: Array<{ url: string; status: number }> }> = new Map();

test.beforeEach(async ({ page }, testInfo) => {
  const testId = testInfo.titlePath.join(' > ');
  testErrors.set(testId, { console: [], network: [] });

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      testErrors.get(testId)?.console.push(`Console error: ${msg.text()}`);
    }
  });

  // Listen for page errors (uncaught exceptions)
  page.on('pageerror', (error) => {
    testErrors.get(testId)?.console.push(`Page error: ${error.message}`);
  });

  // Listen for failed network requests
  page.on('response', (response) => {
    const status = response.status();
    const url = response.url();
    
    // Fail on 4xx and 5xx responses (excluding common acceptable failures)
    if (status >= 400) {
      // Allow 404 for favicon and other non-critical assets
      if (
        !url.includes('favicon.ico') &&
        !url.includes('_next/static') &&
        !url.includes('__nextjs')
      ) {
        testErrors.get(testId)?.network.push({ url, status });
      }
    }
  });
});

test.afterEach(async ({}, testInfo) => {
  const testId = testInfo.titlePath.join(' > ');
  const errors = testErrors.get(testId);

  if (!errors) {
    return;
  }

  // Fail the test if console errors were detected
  if (errors.console.length > 0) {
    console.error('Console errors detected:', errors.console);
    expect(errors.console, 'No console errors should be present').toHaveLength(0);
  }

  // Fail the test if network errors were detected
  if (errors.network.length > 0) {
    console.error('Network errors detected:', errors.network);
    expect(
      errors.network,
      `No 4xx/5xx network errors should be present. Found: ${JSON.stringify(errors.network)}`
    ).toHaveLength(0);
  }

  // Clean up
  testErrors.delete(testId);
});

const ROUTABLE_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/directory', name: 'Directory' },
  { path: '/calculators', name: 'Calculators' },
  { path: '/chat', name: 'AI Chat' },
  { path: '/local-services', name: 'Local Services' },
  { path: '/legal-guide', name: 'Legal Guide' },
  { path: '/price-comparison', name: 'Price Comparison' },
] as const;

test.describe('Comprehensive Route Smoke Tests', () => {
  for (const route of ROUTABLE_PAGES) {
    test(`${route.name} page loads successfully`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      // Wait for network idle
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Verify page has content
      const body = await page.locator('body');
      await expect(body).toBeVisible();

      // Verify page has title
      await expect(page).toHaveTitle(/.+/);
    });
  }
});
