import { test, expect } from '@playwright/test';

/**
 * Visual regression tests
 * Takes screenshots of key pages and compares them against baselines
 */

test.describe('Visual Regression Tests', () => {
  test('Home page visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('Directory page visual snapshot', async ({ page }) => {
    await page.goto('/directory');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('directory-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('Calculators page visual snapshot', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('calculators-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('AI Chat page visual snapshot', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('chat-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('Local Services page visual snapshot', async ({ page }) => {
    await page.goto('/local-services');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('local-services-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('Mobile view - Home page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('Dark mode - Home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Toggle dark mode (assuming a theme toggle button exists)
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }

    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });
});
