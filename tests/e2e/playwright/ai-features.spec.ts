import { test, expect } from '@playwright/test';

test.describe('AI Features E2E Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const TEST_USER = {
    email: 'aie2e@example.com',
    password: 'TestPassword123!',
    firstName: 'AI',
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

  test.describe('Code Generation', () => {
    test('should generate code with AI assistant', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name-input"]', 'AI Test Project');
      await page.click('[data-testid="create-project-submit"]');
      
      await page.click('[data-testid="project-card"]');
      await page.click('[data-testid="ai-assistant-button"]');
      
      await page.fill('[data-testid="ai-prompt-input"]', 'Create a React component for user profile');
      await page.click('[data-testid="generate-code-button"]');
      
      await expect(page.locator('[data-testid="generated-code"]')).toBeVisible();
      await expect(page.locator('[data-testid="code-preview"]')).toContainText('function');
    });

    test('should show error for empty prompt', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name-input"]', 'AI Test Project');
      await page.click('[data-testid="create-project-submit"]');
      
      await page.click('[data-testid="project-card"]');
      await page.click('[data-testid="ai-assistant-button"]');
      
      await page.click('[data-testid="generate-code-button"]');
      
      await expect(page.locator('[data-testid="prompt-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="prompt-error"]')).toContainText('Please enter a prompt');
    });
  });

  test.describe('Code Review', () => {
    test('should review code with AI', async ({ page }) => {
      await page.click('[data-testid="create-project-button"]');
      await page.fill('[data-testid="project-name-input"]', 'Review Test Project');
      await page.click('[data-testid="create-project-submit"]');
      
      await page.click('[data-testid="project-card"]');
      await page.click('[data-testid="create-file-button"]');
      
      await page.fill('[data-testid="file-name-input"]', 'test.js');
      await page.fill('[data-testid="file-content-textarea"]', 'function test() { return "hello"; }');
      await page.click('[data-testid="save-file-button"]');
      
      await page.click('[data-testid="ai-review-button"]');
      
      await expect(page.locator('[data-testid="review-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="code-score"]')).toBeVisible();
    });
  });

  test.describe('AI Chat', () => {
    test('should chat with AI assistant', async ({ page }) => {
      await page.click('[data-testid="ai-chat-button"]');
      
      await page.fill('[data-testid="chat-input"]', 'How do I create a React component?');
      await page.click('[data-testid="send-message-button"]');
      
      await expect(page.locator('[data-testid="chat-messages"]')).toContainText('React component');
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible();
    });

    test('should maintain chat history', async ({ page }) => {
      await page.click('[data-testid="ai-chat-button"]');
      
      await page.fill('[data-testid="chat-input"]', 'What is JavaScript?');
      await page.click('[data-testid="send-message-button"]');
      
      await page.fill('[data-testid="chat-input"]', 'Tell me more about functions');
      await page.click('[data-testid="send-message-button"]');
      
      const messages = page.locator('[data-testid="chat-message"]');
      await expect(messages).toHaveCount(4);
    });
  });
});
