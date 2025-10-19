import { test, expect, Page } from '@playwright/test';

/**
 * Global test fixtures that fail on console errors and 4xx/5xx network responses
 */

// Track console errors
const consoleErrors: string[] = [];
const networkErrors: Array<{ url: string; status: number }> = [];

test.beforeEach(async ({ page }) => {
  // Clear error arrays for each test
  consoleErrors.length = 0;
  networkErrors.length = 0;

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`Console error: ${msg.text()}`);
    }
  });

  // Listen for page errors (uncaught exceptions)
  page.on('pageerror', (error) => {
    consoleErrors.push(`Page error: ${error.message}`);
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
        !url.includes('_next/static') && // Next.js hot reload can sometimes 404
        !url.includes('__nextjs') // Next.js internal endpoints
      ) {
        networkErrors.push({ url, status });
      }
    }
  });
});

test.afterEach(async ({}, testInfo) => {
  // Fail the test if console errors were detected
  if (consoleErrors.length > 0) {
    console.error('Console errors detected:', consoleErrors);
    testInfo.fail();
    expect(consoleErrors, 'No console errors should be present').toHaveLength(0);
  }

  // Fail the test if network errors were detected
  if (networkErrors.length > 0) {
    console.error('Network errors detected:', networkErrors);
    testInfo.fail();
    expect(
      networkErrors,
      `No 4xx/5xx network errors should be present. Found: ${JSON.stringify(networkErrors)}`
    ).toHaveLength(0);
  }
});

/**
 * Helper to wait for network idle
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

/**
 * Helper to take visual snapshot with consistent settings
 */
export async function takeVisualSnapshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
): Promise<void> {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: options?.fullPage ?? false,
    maxDiffPixels: 100, // Allow minor rendering differences
    threshold: 0.2, // 20% threshold for visual changes
  });
}
