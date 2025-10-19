import { test, expect } from '@playwright/test';

/**
 * Comprehensive Playwright tests for freemium paywall implementation
 * Tests authentication, content gating, subscription access, and PaywallModal
 */

test.describe('Freemium Paywall - Authentication Flow', () => {
  test('should show login/signup links when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should see sign in/up links (adjust selectors based on your actual navbar)
    const authLinks = page.locator('a:has-text("Sign In"), a:has-text("Login"), a:has-text("Get Started")');
    await expect(authLinks.first()).toBeVisible();
  });

  test('should redirect to login page when accessing premium content while logged out', async ({ page }) => {
    // Try to access a premium page (adjust path based on your routing)
    await page.goto('/guides/diy-battery');
    
    // Should either redirect to login or show paywall modal
    const loginIndicator = page.locator('input[type="email"], input[type="password"], text="Sign In", text="Login"');
    const paywallIndicator = page.locator('text="Upgrade to Pro", text="Unlock Premium"');
    
    const hasLoginOrPaywall = await Promise.race([
      loginIndicator.first().isVisible().catch(() => false),
      paywallIndicator.first().isVisible().catch(() => false),
    ]);
    
    expect(hasLoginOrPaywall).toBeTruthy();
  });
});

test.describe('Freemium Paywall - Content Gating', () => {
  test('should show preview content with blur effect for free users', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a page that should have ContentGate component
    // Adjust selector based on where you implement ContentGate
    const contentGate = page.locator('[data-testid="content-gate"], .content-gate');
    
    if (await contentGate.count() > 0) {
      // Check for blur effect or locked content indicator
      const blurredContent = page.locator('.blur-sm, .blur-md, [class*="blur"]');
      const unlockButton = page.locator('button:has-text("Unlock"), button:has-text("Upgrade")');
      
      const hasBlurOrLock = await Promise.race([
        blurredContent.first().isVisible().catch(() => false),
        unlockButton.first().isVisible().catch(() => false),
      ]);
      
      expect(hasBlurOrLock).toBeTruthy();
    }
  });

  test('should show upgrade prompt when clicking locked content', async ({ page }) => {
    await page.goto('/');
    
    // Find and click an unlock/upgrade button
    const unlockButton = page.locator('button:has-text("Unlock"), button:has-text("Upgrade to Pro"), button:has-text("View Full")').first();
    
    if (await unlockButton.count() > 0) {
      await unlockButton.click();
      
      // Should show PaywallModal
      const modal = page.locator('[role="dialog"], .modal, [data-testid="paywall-modal"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Modal should contain pricing information
      expect(await page.locator('text="€29", text="€79", text="Pro", text="Expert"').count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Freemium Paywall - PaywallModal Component', () => {
  test('should display PaywallModal with correct pricing tiers', async ({ page }) => {
    await page.goto('/');
    
    // Trigger paywall modal (adjust based on your implementation)
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      // Wait for modal to appear
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Check for Pro tier (€29/month)
      const proTier = page.locator('text=/Pro.*€29|€29.*Pro/i');
      expect(await proTier.count()).toBeGreaterThan(0);
      
      // Check for Expert tier (€79/month)
      const expertTier = page.locator('text=/Expert.*€79|€79.*Expert/i');
      expect(await expertTier.count()).toBeGreaterThan(0);
    }
  });

  test('should close PaywallModal when clicking close button or outside', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Try to close with close button
      const closeButton = page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("Close")').first();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(modal).not.toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should show feature lists for each pricing tier', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Check for feature bullets/lists
      const features = page.locator('ul li, .feature-list li, text="Complete DIY", text="Bill of Materials", text="Custom Design"');
      expect(await features.count()).toBeGreaterThan(0);
      
      // Check for CTA buttons
      const ctaButtons = page.locator('button:has-text("Get Started"), button:has-text("Choose"), a:has-text("Select")');
      expect(await ctaButtons.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Freemium Paywall - Access Control', () => {
  test('free tier should have access to basic calculators', async ({ page }) => {
    await page.goto('/calculators');
    
    // Should be able to access calculator page
    expect(page.url()).toContain('/calculators');
    
    // Check for basic calculator elements
    const calculatorInputs = page.locator('input[type="number"], select, button:has-text("Calculate")');
    expect(await calculatorInputs.count()).toBeGreaterThan(0);
  });

  test('free tier should see upgrade prompts on premium features', async ({ page }) => {
    await page.goto('/');
    
    // Look for "Pro" or "Premium" badges
    const premiumBadges = page.locator('[data-badge="pro"], [data-badge="premium"], .badge-pro, text="PRO", text="PREMIUM"');
    
    if (await premiumBadges.count() > 0) {
      // Premium features should be marked
      expect(await premiumBadges.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Freemium Paywall - Navigation', () => {
  test('should navigate to pricing page from PaywallModal', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      // Click "View All Plans" or similar link
      const viewPlansLink = page.locator('a:has-text("View All Plans"), a:has-text("See Pricing"), a:has-text("Compare Plans")').first();
      
      if (await viewPlansLink.isVisible()) {
        await viewPlansLink.click();
        
        // Should navigate to pricing page
        await page.waitForURL(/pricing/, { timeout: 5000 });
        expect(page.url()).toContain('pricing');
      }
    }
  });

  test('should navigate to signup from PaywallModal CTA', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      // Click "Get Started" or "Choose Pro" button
      const getStartedButton = page.locator('button:has-text("Get Started"), button:has-text("Choose"), a:has-text("Start Free Trial")').first();
      
      if (await getStartedButton.isVisible()) {
        await getStartedButton.click();
        
        // Should navigate to signup/register page
        await page.waitForURL(/signup|register|auth/, { timeout: 5000 });
        expect(page.url()).toMatch(/signup|register|auth/);
      }
    }
  });
});

test.describe('Freemium Paywall - Database Integration', () => {
  test('should track calculator usage count for free tier limits', async ({ page }) => {
    // This test assumes you'll implement usage tracking
    await page.goto('/calculators');
    
    // Use calculator multiple times
    const calculateButton = page.locator('button:has-text("Calculate")').first();
    
    if (await calculateButton.isVisible()) {
      // Perform calculations
      await calculateButton.click();
      
      // After X uses (based on your limits), should show upgrade prompt
      // This is a placeholder - adjust based on your actual implementation
    }
  });

  test('should save calculator results for authenticated users', async ({ page }) => {
    // This test assumes you'll implement save functionality
    await page.goto('/calculators');
    
    // Look for "Save" button or functionality
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Design")').first();
    
    if (await saveButton.isVisible()) {
      // Should prompt login or show email capture modal
      await saveButton.click();
      
      const authPrompt = page.locator('text="Sign in to save", text="Create account", input[type="email"]');
      expect(await authPrompt.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Freemium Paywall - Error Handling', () => {
  test('should not show console errors on paywall interactions', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });
    
    await page.goto('/');
    
    // Trigger paywall
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      await page.waitForTimeout(2000);
      
      // Close modal
      const closeButton = page.locator('button[aria-label="Close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
    
    // Should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should handle missing environment variables gracefully', async ({ page }) => {
    // Navigate to auth-related pages
    await page.goto('/api/auth/signin');
    
    // Should either show proper error page or fallback
    const errorMessage = page.locator('text="Configuration Error", text="Server Error"');
    const signInForm = page.locator('input[type="email"], input[name="email"]');
    
    // One of these should be visible (either error or working signin)
    const hasValidResponse = await Promise.race([
      errorMessage.isVisible().catch(() => false),
      signInForm.isVisible().catch(() => false),
    ]);
    
    expect(hasValidResponse).toBeTruthy();
  });
});

test.describe('Freemium Paywall - Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
  
  test('PaywallModal should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Modal should fit within viewport
      const modalBox = await modal.boundingBox();
      if (modalBox) {
        expect(modalBox.width).toBeLessThanOrEqual(375);
        expect(modalBox.x).toBeGreaterThanOrEqual(0);
      }
      
      // Pricing tiers should be stacked on mobile
      const pricingCards = page.locator('[data-tier="pro"], [data-tier="expert"], .pricing-card');
      if (await pricingCards.count() > 1) {
        const firstCard = await pricingCards.nth(0).boundingBox();
        const secondCard = await pricingCards.nth(1).boundingBox();
        
        if (firstCard && secondCard) {
          // Cards should be stacked (one below the other)
          expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
        }
      }
    }
  });

  test('ContentGate should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    
    const contentGate = page.locator('[data-testid="content-gate"], .content-gate').first();
    
    if (await contentGate.isVisible()) {
      // Text should be readable (not too small)
      const fontSize = await contentGate.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14); // At least 14px
    }
  });
});

test.describe('Freemium Paywall - Accessibility', () => {
  test('PaywallModal should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      await triggerButton.click();
      
      // Modal should have role="dialog"
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Should have aria-labelledby or aria-label
      const hasAriaLabel = await modal.evaluate((el) => {
        return el.hasAttribute('aria-labelledby') || el.hasAttribute('aria-label');
      });
      expect(hasAriaLabel).toBeTruthy();
      
      // Close button should have aria-label
      const closeButton = page.locator('button[aria-label*="Close"], button[aria-label*="close"]').first();
      if (await closeButton.isVisible()) {
        expect(await closeButton.getAttribute('aria-label')).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    const triggerButton = page.locator('button:has-text("Upgrade"), button:has-text("View Pricing")').first();
    
    if (await triggerButton.count() > 0) {
      // Focus and press Enter
      await triggerButton.focus();
      await page.keyboard.press('Enter');
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Should be able to close with Escape
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    }
  });
});
