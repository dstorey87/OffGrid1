import { test, expect } from '@playwright/test';

test('homepage loads and shows header', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/OffGrid/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('core routes render without errors', async ({ page }) => {
  const routes = ['/', '/blog', '/visa', '/directory', '/prices', '/tools'];
  for (const r of routes) {
    const response = await page.goto(`http://localhost:3000${r}`);
    expect(response?.status()).toBeLessThan(400);
    // Just verify the page loads - no visual regression
    await expect(page.locator('body')).toBeVisible();
  }
});
