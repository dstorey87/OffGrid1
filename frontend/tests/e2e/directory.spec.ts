import { test, expect } from '@playwright/test';

test.describe('Directory Page', () => {
  test('should load the directory page successfully', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');
    await expect(page).toHaveTitle(/OffGrid/);
    await expect(page.locator('h1')).toContainText('Content Directory');
  });

  test('should fetch and display posts from WordPress API', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');

    // Wait for posts to load
    await page.waitForSelector('[data-testid="posts-grid"]', { timeout: 30000 });

    // Check that at least one post card is displayed
    const postCards = page.locator('[data-testid^="post-card-"]');
    await expect(postCards.first()).toBeVisible();

    // Verify post card has required elements
    await expect(postCards.first().locator('.line-clamp-2')).toBeVisible(); // Title
  });

  test('should display search input and category filter', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');

    // Check search input exists
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search posts/i);

    // Check category filter exists
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await expect(categoryFilter).toBeVisible();
  });

  test('should filter posts by search query', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');
    await page.waitForSelector('[data-testid="posts-grid"]', { timeout: 30000 });

    // Get initial post count
    const initialPosts = await page.locator('[data-testid^="post-card-"]').count();

    // Search for "Hello"
    await page.fill('[data-testid="search-input"]', 'Hello');

    // Wait for filtering to happen
    await page.waitForTimeout(500);

    // Check that posts are filtered (should have at least 1 result for "Hello world")
    const filteredPosts = await page.locator('[data-testid^="post-card-"]').count();
    expect(filteredPosts).toBeGreaterThan(0);
  });

  test('should display "no posts" message when search has no results', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');
    await page.waitForSelector('[data-testid="posts-grid"]', { timeout: 30000 });

    // Search for something that doesn't exist
    await page.fill('[data-testid="search-input"]', 'xyzabc123nonexistent');

    // Wait for filtering
    await page.waitForTimeout(500);

    // Check for "no posts" message
    await expect(page.locator('text=/No posts match your search criteria/i')).toBeVisible();
  });

  test('should show pagination when there are many posts', async ({ page }) => {
    await page.goto('http://localhost:3001/directory');
    await page.waitForSelector('[data-testid="posts-grid"]', { timeout: 30000 });

    const postCount = await page.locator('[data-testid^="post-card-"]').count();

    // If we have more than 12 posts, pagination should appear
    if (postCount > 12) {
      const pagination = page.locator('[data-testid="pagination"]');
      await expect(pagination).toBeVisible();

      // Check page info
      const pageInfo = page.locator('[data-testid="page-info"]');
      await expect(pageInfo).toContainText(/Page \d+ of \d+/);
    } else {
      // Otherwise, pagination should not be visible or we should be on page 1 of 1
      const pageInfo = page.locator('[data-testid="page-info"]');
      if (await pageInfo.isVisible()) {
        await expect(pageInfo).toContainText('Page 1 of 1');
      }
    }
  });

  test('should handle API errors gracefully', async ({ page, context }) => {
    // Block WordPress API requests to simulate error
    await context.route('**/wp-json/wp/v2/posts**', (route) => route.abort());

    await page.goto('http://localhost:3001/directory');

    // Wait for error message
    await expect(page.locator('text=/Error Loading Content/i')).toBeVisible({ timeout: 30000 });

    // Check that "Try Again" button exists
    await expect(page.locator('button', { hasText: /Try Again/i })).toBeVisible();
  });
});
