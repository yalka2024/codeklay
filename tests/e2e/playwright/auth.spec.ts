import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const TEST_USER = {
    email: `e2etest${Date.now()}@example.com`,
    password: 'SecurePassword123!',
    firstName: 'E2E',
    lastName: 'Test',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('User Registration', () => {
    test('should register a new user successfully', async ({ page }) => {
      // Navigate to registration page
      await page.click('text=Sign Up');
      
      // Fill registration form
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      
      // Submit form
      await page.click('[data-testid="register-button"]');
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Account created successfully');
      
      // Verify redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.click('text=Sign Up');
      
      // Try to submit empty form
      await page.click('[data-testid="register-button"]');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="firstName-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="lastName-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    test('should show error for weak password', async ({ page }) => {
      await page.click('text=Sign Up');
      
      // Fill form with weak password
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', '123');
      await page.fill('[data-testid="confirmPassword-input"]', '123');
      
      await page.click('[data-testid="register-button"]');
      
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toContainText('Password must be at least 8 characters');
    });

    test('should show error for password mismatch', async ({ page }) => {
      await page.click('text=Sign Up');
      
      // Fill form with mismatched passwords
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', 'DifferentPassword123!');
      
      await page.click('[data-testid="register-button"]');
      
      await expect(page.locator('[data-testid="confirmPassword-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="confirmPassword-error"]')).toContainText('Passwords do not match');
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.click('text=Sign Up');
      
      // Fill form with invalid email
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      
      await page.click('[data-testid="register-button"]');
      
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Please enter a valid email');
    });

    test('should show error for duplicate email', async ({ page }) => {
      // First registration
      await page.click('text=Sign Up');
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      await page.click('[data-testid="register-button"]');
      
      // Wait for redirect and logout
      await expect(page).toHaveURL(/.*dashboard/);
      await page.click('[data-testid="logout-button"]');
      
      // Try to register with same email
      await page.click('text=Sign Up');
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      await page.click('[data-testid="register-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('User with this email already exists');
    });
  });

  test.describe('User Login', () => {
    test.beforeEach(async ({ page }) => {
      // Register a test user first
      await page.click('text=Sign Up');
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      await page.click('[data-testid="register-button"]');
      await expect(page).toHaveURL(/.*dashboard/);
      await page.click('[data-testid="logout-button"]');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Wait for redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    });

    test('should show error for non-existent user', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.fill('[data-testid="email-input"]', 'nonexistent@example.com');
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.click('[data-testid="login-button"]');
      
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    test('should show loading state during login', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Check for loading state
      await expect(page.locator('[data-testid="login-button"]')).toBeDisabled();
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    });
  });

  test.describe('Password Reset', () => {
    test('should request password reset successfully', async ({ page }) => {
      await page.click('text=Sign In');
      await page.click('text=Forgot Password?');
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.click('[data-testid="reset-password-button"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Password reset email sent');
    });

    test('should show error for non-existent email', async ({ page }) => {
      await page.click('text=Sign In');
      await page.click('text=Forgot Password?');
      
      await page.fill('[data-testid="email-input"]', 'nonexistent@example.com');
      await page.click('[data-testid="reset-password-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Email not found');
    });
  });

  test.describe('User Profile', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign Up');
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      await page.click('[data-testid="register-button"]');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should display user profile information', async ({ page }) => {
      await page.click('[data-testid="user-profile"]');
      
      await expect(page.locator('[data-testid="profile-email"]')).toContainText(TEST_USER.email);
      await expect(page.locator('[data-testid="profile-firstName"]')).toContainText(TEST_USER.firstName);
      await expect(page.locator('[data-testid="profile-lastName"]')).toContainText(TEST_USER.lastName);
    });

    test('should update profile information', async ({ page }) => {
      await page.click('[data-testid="user-profile"]');
      await page.click('[data-testid="edit-profile-button"]');
      
      const newFirstName = 'Updated';
      const newLastName = 'Name';
      
      await page.fill('[data-testid="edit-firstName-input"]', newFirstName);
      await page.fill('[data-testid="edit-lastName-input"]', newLastName);
      await page.click('[data-testid="save-profile-button"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-firstName"]')).toContainText(newFirstName);
      await expect(page.locator('[data-testid="profile-lastName"]')).toContainText(newLastName);
    });

    test('should change password successfully', async ({ page }) => {
      await page.click('[data-testid="user-profile"]');
      await page.click('[data-testid="change-password-button"]');
      
      const newPassword = 'NewSecurePassword123!';
      
      await page.fill('[data-testid="current-password-input"]', TEST_USER.password);
      await page.fill('[data-testid="new-password-input"]', newPassword);
      await page.fill('[data-testid="confirm-new-password-input"]', newPassword);
      await page.click('[data-testid="save-password-button"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Password changed successfully');
    });

    test('should show error for incorrect current password', async ({ page }) => {
      await page.click('[data-testid="user-profile"]');
      await page.click('[data-testid="change-password-button"]');
      
      await page.fill('[data-testid="current-password-input"]', 'wrongpassword');
      await page.fill('[data-testid="new-password-input"]', 'NewSecurePassword123!');
      await page.fill('[data-testid="confirm-new-password-input"]', 'NewSecurePassword123!');
      await page.click('[data-testid="save-password-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Current password is incorrect');
    });
  });

  test.describe('Session Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign Up');
      await page.fill('[data-testid="firstName-input"]', TEST_USER.firstName);
      await page.fill('[data-testid="lastName-input"]', TEST_USER.lastName);
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.fill('[data-testid="confirmPassword-input"]', TEST_USER.password);
      await page.click('[data-testid="register-button"]');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should logout successfully', async ({ page }) => {
      await page.click('[data-testid="logout-button"]');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    });

    test('should maintain session on page refresh', async ({ page }) => {
      // Refresh the page
      await page.reload();
      
      // Should still be logged in
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    });

    test('should redirect to login when accessing protected pages without auth', async ({ page }) => {
      // Clear cookies to simulate no session
      await page.context().clearCookies();
      
      // Try to access dashboard
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper keyboard navigation', async ({ page }) => {
      await page.click('text=Sign In');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="email-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="password-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="login-button"]')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.click('text=Sign In');
      
      await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('aria-label', 'Email address');
      await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('aria-label', 'Password');
      await expect(page.locator('[data-testid="login-button"]')).toHaveAttribute('aria-label', 'Sign in to your account');
    });

    test('should show focus indicators', async ({ page }) => {
      await page.click('text=Sign In');
      
      await page.locator('[data-testid="email-input"]').focus();
      await expect(page.locator('[data-testid="email-input"]')).toHaveCSS('outline', /none/);
      
      // Check for custom focus styles
      await expect(page.locator('[data-testid="email-input"]')).toHaveCSS('border-color', /rgb\(59, 130, 246\)/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error
      await page.route('**/api/auth/login', route => route.abort());
      
      await page.click('text=Sign In');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Network error');
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Mock server error
      await page.route('**/api/auth/login', route => route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }));
      
      await page.click('text=Sign In');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Something went wrong');
    });
  });
}); 