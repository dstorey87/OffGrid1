import { test, expect } from '@playwright/test';

test('homepage loads and shows header', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/OffGrid/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('core routes render', async ({ page }) => {
  const routes = ['/', '/blog', '/visa', '/directory', '/prices', '/tools'];
  for (const r of routes) {
    await page.goto(`http://localhost:3000${r}`);
    await expect(page).toHaveScreenshot(`${r.replace(/\//g,'_')}.png`, { maxDiffPixelRatio: 0.02 });
  }
});
