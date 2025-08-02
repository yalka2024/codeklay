import { test, expect } from '@playwright/test';

test.describe('Enterprise Features E2E Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const ADMIN_USER = {
    email: 'admin@enterprise.com',
    password: 'AdminPassword123!',
    firstName: 'Admin',
    lastName: 'User',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('SSO Authentication', () => {
    test('should display SSO login option', async ({ page }) => {
      await expect(page.locator('[data-testid="sso-login-button"]')).toBeVisible();
    });

    test('should redirect to SSO provider', async ({ page }) => {
      await page.click('[data-testid="sso-login-button"]');
      
      await expect(page).toHaveURL(/.*sso/);
    });
  });

  test.describe('Organization Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Sign In');
      await page.fill('[data-testid="email-input"]', ADMIN_USER.email);
      await page.fill('[data-testid="password-input"]', ADMIN_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should access organization settings', async ({ page }) => {
      await page.click('[data-testid="organization-menu"]');
      await page.click('[data-testid="organization-settings"]');
      
      await expect(page.locator('[data-testid="organization-form"]')).toBeVisible();
    });

    test('should manage team members', async ({ page }) => {
      await page.click('[data-testid="organization-menu"]');
      await page.click('[data-testid="team-management"]');
      
      await expect(page.locator('[data-testid="team-members-list"]')).toBeVisible();
      
      await page.click('[data-testid="invite-member-button"]');
      await page.fill('[data-testid="member-email-input"]', 'newmember@enterprise.com');
      await page.selectOption('[data-testid="member-role-select"]', 'developer');
      await page.click('[data-testid="send-invite-button"]');
      
      await expect(page.locator('[data-testid="invite-success-message"]')).toBeVisible();
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('should enforce project access permissions', async ({ page }) => {
      await page.click('text=Sign In');
      await page.fill('[data-testid="email-input"]', 'viewer@enterprise.com');
      await page.fill('[data-testid="password-input"]', 'ViewerPassword123!');
      await page.click('[data-testid="login-button"]');
      
      await page.click('[data-testid="project-card"]');
      
      await expect(page.locator('[data-testid="edit-project-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="delete-project-button"]')).not.toBeVisible();
    });
  });

  test.describe('Audit Logging', () => {
    test('should display audit logs for admin users', async ({ page }) => {
      await page.click('text=Sign In');
      await page.fill('[data-testid="email-input"]', ADMIN_USER.email);
      await page.fill('[data-testid="password-input"]', ADMIN_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await page.click('[data-testid="admin-menu"]');
      await page.click('[data-testid="audit-logs"]');
      
      await expect(page.locator('[data-testid="audit-logs-table"]')).toBeVisible();
      const auditEntries = page.locator('[data-testid="audit-log-entry"]');
      await expect(auditEntries.first()).toBeVisible();
    });
  });
});
