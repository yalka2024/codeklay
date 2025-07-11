import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../../components/auth/AuthForm';
import { useAuth } from '../../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AuthForm', () => {
  const defaultProps = {
    mode: 'login' as const,
    onSubmit: jest.fn(),
  };

  const mockAuthContext = {
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue(mockAuthContext);
    jest.clearAllMocks();
  });

  describe('Login Mode', () => {
    it('should render login form correctly', () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('should handle login form submission', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        login: mockLogin,
      });

      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show validation errors for invalid email', async () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should show validation errors for empty password', async () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show loading state during login', async () => {
      const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        login: mockLogin,
        isLoading: true,
      });

      render(<AuthForm {...defaultProps} mode="login" />);

      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    it('should show error message from auth context', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        error: 'Invalid credentials',
      });

      render(<AuthForm {...defaultProps} mode="login" />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('Register Mode', () => {
    it('should render register form correctly', () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('should handle register form submission', async () => {
      const mockRegister = jest.fn().mockResolvedValue({ success: true });
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        register: mockRegister,
      });

      render(<AuthForm {...defaultProps} mode="register" />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show validation error for password mismatch', async () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for weak password', async () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for empty required fields', async () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Test invalid email formats
      const invalidEmails = ['test', 'test@', '@example.com', 'test@example'];

      for (const email of invalidEmails) {
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
        });

        // Clear the error for next test
        fireEvent.change(emailInput, { target: { value: '' } });
      }
    });

    it('should validate password strength', async () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // Test weak passwords
      const weakPasswords = ['123', 'abc', 'password', '12345678'];

      for (const password of weakPasswords) {
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.change(confirmPasswordInput, { target: { value: password } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });

        // Clear the error for next test
        fireEvent.change(passwordInput, { target: { value: '' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '' } });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });

    it('should have proper form structure', () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('aria-label', 'Sign in form');
    });

    it('should handle keyboard navigation', () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Tab navigation
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      fireEvent.keyDown(emailInput, { key: 'Tab' });
      expect(passwordInput).toHaveFocus();

      fireEvent.keyDown(passwordInput, { key: 'Tab' });
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Network error'));
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        login: mockLogin,
      });

      render(<AuthForm {...defaultProps} mode="login" />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
      });
    });

    it('should clear errors when user starts typing', async () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthContext,
        error: 'Invalid credentials',
      });

      render(<AuthForm {...defaultProps} mode="login" />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Error should be cleared when user starts typing
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  describe('Form State Management', () => {
    it('should disable submit button when form is invalid', async () => {
      render(<AuthForm {...defaultProps} mode="login" />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeDisabled();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Button should still be disabled without password
      expect(submitButton).toBeDisabled();

      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Button should be enabled with valid form
      expect(submitButton).toBeEnabled();
    });

    it('should show password strength indicator', () => {
      render(<AuthForm {...defaultProps} mode="register" />);

      const passwordInput = screen.getByLabelText(/password/i);

      // Test different password strengths
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } });
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });
}); 