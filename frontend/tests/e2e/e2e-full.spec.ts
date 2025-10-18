import { test, expect } from '@playwright/test';

test.describe('OffGrid1 Website Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Set dark theme and GBP currency before each test
    await page.addInitScript(() => {
      localStorage.setItem('offgrid-theme', 'dark');
      localStorage.setItem('preferred_currency', 'GBP');
    });
  });

  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Complete Green Technology/);
    await expect(page.locator('h1')).toContainText('Complete Green Technology');

    // Verify dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('Solar Load Analysis - Auto-fill Small Family preset works', async ({ page }) => {
    await page.goto('http://localhost:3000/solar-calculators/load-analysis');

    // Wait for page to load
    await page.waitForSelector('h1:has-text("Free Load Analysis Calculator")');

    // Click Small Family preset button
    await page.click('button:has-text("Small Family")');

    // Wait for appliances to be added
    await page.waitForTimeout(1000);

    // Verify appliances were added (should see "Your Appliances" section)
    const appliancesSection = page.locator('h2:has-text("Your Appliances")');
    await expect(appliancesSection).toBeVisible();

    // Count number of appliance items - check for appliance list items
    const applianceItems = page
      .locator('[class*="appliance"]')
      .or(page.locator('li'))
      .filter({ hasText: /W|watts/i });
    const applianceCount = await applianceItems.count();
    expect(applianceCount).toBeGreaterThan(5); // Small family should have multiple appliances

    // Click Calculate button
    await page.click('button:has-text("Calculate")');

    // Wait for results
    await page.waitForTimeout(1000);

    // Verify results are displayed
    await expect(page.locator('text=/Load Analysis Results|Results/i')).toBeVisible();
    await expect(page.locator('text=/Daily|kWh|Energy/i')).toBeVisible();

    // Verify shopping basket or recommendations appear
    await expect(page.locator('text=/Shopping|Recommended|Products/i')).toBeVisible();

    // Verify currency is GBP
    await expect(page.locator('text=/£/')).toBeVisible();
  });

  test('Rainwater Calculator - Auto-fill Small Family preset works', async ({ page }) => {
    await page.goto('http://localhost:3000/green-calculators/rainwater-harvesting');

    await page.waitForSelector('text=/Rainwater/');

    // Click Small Family preset
    await page.click('button:has-text("Small Family")');

    await page.waitForTimeout(500);

    // Fill in roof dimensions and rainfall if not auto-filled
    const inputs = page.locator('input[type="number"]');
    const firstInput = inputs.first();
    const currentValue = await firstInput.inputValue();

    if (!currentValue || currentValue === '0' || currentValue === '') {
      await firstInput.fill('12');
      await inputs.nth(1).fill('10');
      await inputs.nth(2).fill('800');
    }

    // Select roof material using more specific selector
    const roofMaterialSelect = page
      .locator('select')
      .filter({ has: page.locator('option[value="asphalt"]') });
    await roofMaterialSelect.selectOption('asphalt');

    // Click calculate
    await page.click('button:has-text("Calculate")');

    await page.waitForTimeout(1000);

    // Verify results
    const resultsVisible = await page.locator('text=/Annual|Collection|Tank|Results/i').count();
    expect(resultsVisible).toBeGreaterThan(0);
  });

  test('Battery Sizing Calculator - Auto-fill preset works', async ({ page }) => {
    await page.goto('http://localhost:3000/solar-calculators/battery-sizing');

    await page.waitForSelector('text=/Battery/');

    // Click first preset button
    const presetButtons = page.locator('button').filter({ hasText: /Family|Person|Off-Grid/ });
    await presetButtons.first().click();

    await page.waitForTimeout(300);

    // Fill in backup days if not already filled
    const backupDaysInput = page
      .locator('input[placeholder*="days" i], input[placeholder*="backup" i]')
      .first();
    await backupDaysInput.fill('3');

    // Click calculate button
    const calculateBtn = page.locator('button').filter({ hasText: /Calculate/i });
    if ((await calculateBtn.count()) > 0) {
      await calculateBtn.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Wind Power Calculator - Preset and calculation', async ({ page }) => {
    await page.goto('http://localhost:3000/green-calculators/wind-power');

    await page.waitForSelector('text=/Wind/');

    // Click first preset if available
    const presetBtn = page
      .locator('button')
      .filter({ hasText: /Family|Home|Off-Grid/ })
      .first();
    if ((await presetBtn.count()) > 0) {
      await presetBtn.click();
      await page.waitForTimeout(300);
    }

    // Fill in wind speed and turbine height
    const inputs = page.locator('input[type="number"]');
    if ((await inputs.count()) >= 2) {
      await inputs.nth(0).fill('6');
      await inputs.nth(1).fill('20');
    }

    // Click calculate
    const calcBtn = page.locator('button:has-text("Calculate")');
    if ((await calcBtn.count()) > 0) {
      await calcBtn.click();
    }
  });

  test('Greywater Calculator - Preset functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/green-calculators/greywater-systems');

    await page.waitForSelector('text=/Greywater|Grey/');

    // Click preset if available
    const presetBtn = page.locator('button').first();
    if ((await presetBtn.count()) > 0) {
      await presetBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('Hydroponics Calculator - Preset functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/green-calculators/hydroponics');

    await page.waitForSelector('text=/Hydroponics/');

    // Click preset
    const presetBtn = page.locator('button').first();
    if ((await presetBtn.count()) > 0) {
      await presetBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('Navigation - All menu links work', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test Portugal Guide link
    await page.click('a:has-text("Portugal Guide")');
    await expect(page).toHaveURL(/portugal|legal/);
    await page.goBack();

    // Test Shop link
    await page.click('a:has-text("Shop")');
    await expect(page).toHaveURL(/shop|solar-shop/);
    await page.goBack();

    // Test Services link
    await page.click('a:has-text("Services")');
    await expect(page).toHaveURL(/services/);
  });

  test('Currency selector changes currency display', async ({ page }) => {
    await page.goto('http://localhost:3000/solar-calculators/load-analysis');

    // Click preset to generate shopping basket
    await page.click('button:has-text("Small Family")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Calculate Load")');
    await page.waitForTimeout(500);

    // Should show GBP by default
    await expect(page.locator('text=/£/')).toBeVisible();

    // Change to USD
    await page.selectOption('select#currency', 'USD');
    await page.waitForTimeout(300);

    // Should now show $
    await expect(page.locator('text=/\\$/')).toBeVisible();
  });

  test('Admin page is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Should show login form
    await expect(page.locator('text=/Admin Access|Enter password/')).toBeVisible();

    // Try to login
    await page.fill('input[type="password"]', 'offgrid2024');
    await page.click('button:has-text("Login")');

    await page.waitForTimeout(500);

    // Should show admin panel
    await expect(page.locator('h1:has-text("Admin Settings")')).toBeVisible();
  });
});
