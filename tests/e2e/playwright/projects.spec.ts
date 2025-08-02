import { test, expect } from '@playwright/test';

test.describe('Project Management E2E Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const TEST_USER = {
    email: 'projecte2e@example.com',
    password: 'TestPassword123!',
    firstName: 'Project',
    lastName: 'E2E',
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

  test.describe('Project Creation', () => {
    test('should create a new project successfully', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      
      await page.fill('[data-testid="project-name-input"]', 'Test Project');
      await page.fill('[data-testid="project-description-input"]', 'A test project for E2E testing');
      
      await page.click('[data-testid="create-project-submit"]');
      
      await expect(page.locator('[data-testid="project-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="project-title"]')).toContainText('Test Project');
    });

    test('should show validation errors for empty project name', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      
      await page.fill('[data-testid="project-description-input"]', 'Project without name');
      await page.click('[data-testid="create-project-submit"]');
      
      await expect(page.locator('[data-testid="project-name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="project-name-error"]')).toContainText('Project name is required');
    });
  });

  test.describe('Project Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name-input"]', 'Management Test Project');
      await page.fill('[data-testid="project-description-input"]', 'Project for management testing');
      await page.click('[data-testid="create-project-submit"]');
      
      await expect(page.locator('[data-testid="project-card"]')).toBeVisible();
    });

    test('should open project details', async ({ page }) => {
      await page.click('[data-testid="project-card"]');
      
      await expect(page).toHaveURL(/.*project\/.*$/);
      await expect(page.locator('[data-testid="project-header"]')).toContainText('Management Test Project');
    });

    test('should edit project details', async ({ page }) => {
      await page.click('[data-testid="project-settings-button"]');
      
      await page.fill('[data-testid="edit-project-name"]', 'Updated Project Name');
      await page.click('[data-testid="save-project-button"]');
      
      await expect(page.locator('[data-testid="project-title"]')).toContainText('Updated Project Name');
    });

    test('should delete project', async ({ page }) => {
      await page.click('[data-testid="project-settings-button"]');
      await page.click('[data-testid="delete-project-button"]');
      
      await page.click('[data-testid="confirm-delete-button"]');
      
      await expect(page.locator('[data-testid="project-card"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="no-projects-message"]')).toBeVisible();
    });
  });

  test.describe('Project Collaboration', () => {
    test('should invite team member to project', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name-input"]', 'Collaboration Project');
      await page.click('[data-testid="create-project-submit"]');
      
      await page.click('[data-testid="project-card"]');
      await page.click('[data-testid="invite-member-button"]');
      
      await page.fill('[data-testid="member-email-input"]', 'teammate@example.com');
      await page.selectOption('[data-testid="member-role-select"]', 'editor');
      await page.click('[data-testid="send-invite-button"]');
      
      await expect(page.locator('[data-testid="invite-success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-invites"]')).toContainText('teammate@example.com');
    });
  });
});
