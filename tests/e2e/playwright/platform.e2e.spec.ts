import { test, expect } from '@playwright/test';

// E2E: Auth Flows

test.describe('Authentication', () => {
  test('User can sign up, login, and see RBAC-protected content', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.fill('input[name="email"]', 'e2euser@example.com');
    await page.fill('input[name="password"]', 'E2eTestPassword123!');
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'User');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/profile|dashboard/);
    // Logout and login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'e2euser@example.com');
    await page.fill('input[name="password"]', 'E2eTestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/profile|dashboard/);
    // RBAC: Try to access admin page
    await page.goto('/admin');
    await expect(page.locator('body')).not.toContainText('Access Denied');
  });
});

// E2E: AI Codegen and Credits

test.describe('AI Codegen and Credits', () => {
  test('User can request AI codegen and is blocked after exceeding credits', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'e2euser@example.com');
    await page.fill('input[name="password"]', 'E2eTestPassword123!');
    await page.click('button[type="submit"]');
    await page.goto('/ai-chat');
    for (let i = 0; i < 51; i++) {
      await page.fill('textarea[name="prompt"]', `Generate code example #${i}`);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('.alert')).toContainText('AI usage quota exceeded');
  });
});

// E2E: Plugin Management

test.describe('Plugin Marketplace', () => {
  test('User can enable and disable plugins', async ({ page }) => {
    await page.goto('/plugins');
    await page.click('button[aria-label="Enable plugin"]');
    await expect(page.locator('.plugin-status')).toContainText('Enabled');
    await page.click('button[aria-label="Disable plugin"]');
    await expect(page.locator('.plugin-status')).toContainText('Disabled');
  });
});

// E2E: Real-Time Collaboration

test.describe('Real-Time Collaboration', () => {
  test('Multiple users can edit and see changes in real time', async ({ browser }) => {
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();
    await page1.goto('/collaborative-workspace');
    await page2.goto('/collaborative-workspace');
    await page1.fill('.monaco-editor textarea', 'console.log("User 1 edit");');
    await expect(page2.locator('.monaco-editor')).toContainText('User 1 edit');
    await page2.fill('.monaco-editor textarea', 'console.log("User 2 edit");');
    await expect(page1.locator('.monaco-editor')).toContainText('User 2 edit');
    await page1.close();
    await page2.close();
  });
});

// E2E: Stripe Checkout

test.describe('Stripe Checkout', () => {
  test('User can upgrade plan via Stripe', async ({ page }) => {
    await page.goto('/pricing');
    await page.click('a[href*="upgrade?plan=pro"]');
    await expect(page).toHaveURL(/stripe/);
    // Simulate Stripe checkout (mock or test mode)
    // ...
  });
});

// E2E: Language Switching

test.describe('Language Switcher', () => {
  test('User can switch languages and see translated content', async ({ page }) => {
    await page.goto('/');
    await page.click('button[aria-label="Switch language"]');
    await page.click('text=Español');
    await expect(page.locator('body')).toContainText('Bienvenido');
    await page.click('button[aria-label="Switch language"]');
    await page.click('text=English');
    await expect(page.locator('body')).toContainText('Welcome');
  });
}); 