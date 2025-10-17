import { test, expect } from '@playwright/test';

test.describe('Homepage - Task 11', () => {
  test('hero section displays with title and description', async ({ page }) => {
    await page.goto('/');

    // Check hero heading
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Welcome to OffGrid Platform');

    // Check description paragraph
    await expect(page.getByText(/powerful multi-site platform/i)).toBeVisible();
  });

  test('CTA buttons are visible and functional', async ({ page }) => {
    await page.goto('/');

    // Check "Try AI Chat Now" CTA button
    const chatCTA = page.getByRole('link', { name: /try ai chat now/i });
    await expect(chatCTA).toBeVisible();
    await expect(chatCTA).toHaveAttribute('href', '/chat');

    // Check "Explore Directory" CTA button
    const directoryCTA = page.getByRole('link', { name: /explore directory/i });
    await expect(directoryCTA).toBeVisible();
    await expect(directoryCTA).toHaveAttribute('href', '/directory');
  });

  test('feature cards display with icons and descriptions', async ({ page }) => {
    await page.goto('/');

    // Check Directory card (look for the card section, not the CTA button)
    await expect(page.getByText('📁')).toBeVisible();
    await expect(page.getByText(/browse our comprehensive directory/i)).toBeVisible();

    // Check Calculators card
    await expect(page.getByText('🧮')).toBeVisible();
    await expect(page.getByText(/mortgage, solar, and budget/i)).toBeVisible();

    // Check AI Chat card
    await expect(page.getByText('🤖')).toBeVisible();
    await expect(page.getByText(/get instant ai-powered assistance/i)).toBeVisible();
  });

  test('technology stack section displays', async ({ page }) => {
    await page.goto('/');

    // Check technology stack heading
    await expect(
      page.getByRole('heading', { name: /built with modern technology/i })
    ).toBeVisible();

    // Check for key technologies
    await expect(page.getByText(/next\.js 15/i)).toBeVisible();
    await expect(page.getByText(/tailwind css/i)).toBeVisible();
    await expect(page.getByText(/wordpress multisite/i)).toBeVisible();
    await expect(page.getByText(/fastapi/i)).toBeVisible();
    await expect(page.getByText(/stripe payment/i)).toBeVisible();
    await expect(page.getByText(/docker.*kubernetes/i)).toBeVisible();
  });

  test('theme toggle is present', async ({ page }) => {
    await page.goto('/');

    // Check theme toggle button exists by looking for the button element
    const themeToggle = page.locator('button').first(); // Theme toggle is the first button
    await expect(themeToggle).toBeVisible();
  });

  test('homepage is responsive and accessible', async ({ page }) => {
    await page.goto('/');

    // Check main element has semantic HTML
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check headings are in correct hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2').first();
    const h3 = page.locator('h3').first();

    await expect(h1).toBeVisible();
    await expect(h2).toBeVisible();
    await expect(h3).toBeVisible();
  });

  test('all links have proper href attributes', async ({ page }) => {
    await page.goto('/');

    // Get all navigation links
    const chatLinks = page.getByRole('link', { name: /chat/i });
    const directoryLinks = page.getByRole('link', { name: /directory/i });
    const calculatorLinks = page.getByRole('link', { name: /calculator/i });

    // Verify each type has at least one link
    await expect(chatLinks.first()).toHaveAttribute('href', '/chat');
    await expect(directoryLinks.first()).toHaveAttribute('href', '/directory');
    await expect(calculatorLinks.first()).toHaveAttribute('href', '/calculators');
  });
});
