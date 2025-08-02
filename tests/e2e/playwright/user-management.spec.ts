import { test, expect } from '@playwright/test';

test.describe('User Management E2E Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const TEST_USER = {
    email: 'usermgmt@example.com',
    password: 'TestPassword123!',
    firstName: 'User',
    lastName: 'Management',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.click('text=Sign Up');
    await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
    await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
    await page.click('[data-testid="register-button"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test.describe('Profile Management', () => {
    test('should update user profile', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="profile-settings"]');
      
      await page.fill('[data-testid="firstName-input"]', 'Updated First');
      await page.fill('[data-testid="lastName-input"]', 'Updated Last');
      await page.click('[data-testid="save-profile-button"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Updated First Updated Last');
    });

    test('should change password', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="profile-settings"]');
      await page.click('[data-testid="change-password-tab"]');
      
      await page.fill('[data-testid="current-password-input"]', TEST_USER.password);
      await page.fill('[data-testid="new-password-input"]', 'NewPassword123!');
      await page.fill('[data-testid="confirm-password-input"]', 'NewPassword123!');
      await page.click('[data-testid="change-password-button"]');
      
      await expect(page.locator('[data-testid="password-success-message"]')).toBeVisible();
    });
  });

  test.describe('Account Settings', () => {
    test('should update notification preferences', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="account-settings"]');
      
      await page.click('[data-testid="email-notifications-toggle"]');
      await page.click('[data-testid="push-notifications-toggle"]');
      await page.click('[data-testid="save-settings-button"]');
      
      await expect(page.locator('[data-testid="settings-success-message"]')).toBeVisible();
    });

    test('should manage API keys', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="account-settings"]');
      await page.click('[data-testid="api-keys-tab"]');
      
      await page.click('[data-testid="generate-api-key-button"]');
      await page.fill('[data-testid="api-key-name-input"]', 'Test API Key');
      await page.click('[data-testid="create-api-key-button"]');
      
      await expect(page.locator('[data-testid="api-key-created"]')).toBeVisible();
      await expect(page.locator('[data-testid="api-key-list"]')).toContainText('Test API Key');
    });
  });

  test.describe('Account Security', () => {
    test('should enable two-factor authentication', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="security-settings"]');
      
      await page.click('[data-testid="enable-2fa-button"]');
      
      await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
      await expect(page.locator('[data-testid="backup-codes"]')).toBeVisible();
      
      await page.fill('[data-testid="2fa-verification-code"]', '123456');
      await page.click('[data-testid="verify-2fa-button"]');
      
      await expect(page.locator('[data-testid="2fa-enabled-message"]')).toBeVisible();
    });

    test('should view login history', async ({ page }) => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="security-settings"]');
      await page.click('[data-testid="login-history-tab"]');
      
      await expect(page.locator('[data-testid="login-history-table"]')).toBeVisible();
      const loginEntries = page.locator('[data-testid="login-entry"]');
      await expect(loginEntries.first()).toBeVisible();
    });
  });
});
