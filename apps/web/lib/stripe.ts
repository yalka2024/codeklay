// Stripe Payment Integration for CodePal Marketplace
// Handles payment processing for code snippet purchases

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  message?: string;
}

export interface SnippetPurchase {
  snippetId: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

class StripeManager {
  private stripe: Stripe | null = null;
  private publishableKey: string;

  constructor() {
    this.publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    if (!this.publishableKey) {
      console.warn('Stripe publishable key not found. Payment features will be disabled.');
    }
  }

  // Initialize Stripe
  async initialize(): Promise<Stripe | null> {
    if (!this.publishableKey) {
      return null;
    }

    if (!this.stripe) {
      this.stripe = await loadStripe(this.publishableKey);
    }

    return this.stripe;
  }

  // Get Stripe instance
  getStripe(): Stripe | null {
    return this.stripe;
  }

  // Check if Stripe is available
  isAvailable(): boolean {
    return this.stripe !== null && this.publishableKey !== '';
  }

  // Create a payment intent for snippet purchase
  async createPaymentIntent(purchase: SnippetPurchase): Promise<PaymentIntent> {
    const response = await fetch('/api/marketplace/enhanced/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippetId: purchase.snippetId,
        amount: purchase.amount,
        currency: purchase.currency,
        description: purchase.description,
        metadata: purchase.metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
  }

  // Confirm payment with Stripe
  async confirmPayment(
    clientSecret: string,
    paymentMethod?: any
  ): Promise<PaymentResult> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Payment failed',
        };
      }

      if (result.paymentIntent) {
        return {
          success: true,
          paymentIntentId: result.paymentIntent.id,
          message: 'Payment successful',
        };
      }

      return {
        success: false,
        error: 'Payment confirmation failed',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment error',
      };
    }
  }

  // Create payment method
  async createPaymentMethod(cardElement: any): Promise<PaymentMethod> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const result = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Failed to create payment method');
    }

    return {
      id: result.paymentMethod.id,
      type: result.paymentMethod.type,
      card: result.paymentMethod.card ? {
        brand: result.paymentMethod.card.brand,
        last4: result.paymentMethod.card.last4,
        exp_month: result.paymentMethod.card.exp_month,
        exp_year: result.paymentMethod.card.exp_year,
      } : undefined,
    };
  }

  // Process payment with saved payment method
  async processPaymentWithSavedMethod(
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/marketplace/enhanced/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          amount,
          currency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Payment processing failed',
        };
      }

      return {
        success: true,
        paymentIntentId: result.paymentIntentId,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing error',
      };
    }
  }

  // Get payment intent status
  async getPaymentIntentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    created: number;
  }> {
    const response = await fetch(`/api/marketplace/enhanced/payment-status/${paymentIntentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return response.json();
  }

  // Refund payment
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/marketplace/enhanced/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Refund failed',
        };
      }

      return {
        success: true,
        refundId: result.refundId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund error',
      };
    }
  }

  // Get user's payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch('/api/marketplace/enhanced/payment-methods');
    
    if (!response.ok) {
      throw new Error('Failed to get payment methods');
    }

    return response.json();
  }

  // Save payment method
  async savePaymentMethod(paymentMethodId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/marketplace/enhanced/save-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Failed to save payment method',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Save payment method error',
      };
    }
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/marketplace/enhanced/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        return {
          success: false,
          error: result.message || 'Failed to delete payment method',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete payment method error',
      };
    }
  }

  // Get payment history
  async getPaymentHistory(limit: number = 10, offset: number = 0): Promise<{
    payments: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created: number;
      description: string;
    }>;
    total: number;
  }> {
    const response = await fetch(`/api/marketplace/enhanced/payment-history?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Failed to get payment history');
    }

    return response.json();
  }

  // Utility functions

  // Format amount for display
  formatAmount(amount: number, currency: string = 'usd'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount / 100); // Stripe amounts are in cents
  }

  // Parse amount from display format
  parseAmount(displayAmount: string): number {
    const numericAmount = parseFloat(displayAmount.replace(/[^0-9.-]+/g, ''));
    return Math.round(numericAmount * 100); // Convert to cents
  }

  // Validate card number (basic Luhn algorithm)
  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate expiry date
  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      return false;
    }

    if (expYear < currentYear) {
      return false;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }

    return true;
  }

  // Validate CVC
  validateCVC(cvc: string): boolean {
    const cvcRegex = /^[0-9]{3,4}$/;
    return cvcRegex.test(cvc);
  }

  // Get card brand from number
  getCardBrand(cardNumber: string): string {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(digits)) return 'visa';
    if (/^5[1-5]/.test(digits)) return 'mastercard';
    if (/^3[47]/.test(digits)) return 'amex';
    if (/^6/.test(digits)) return 'discover';
    if (/^(?:2131|1800|35\d{3})/.test(digits)) return 'jcb';
    if (/^3[0-9]/.test(digits)) return 'diners';
    
    return 'unknown';
  }

  // Mask card number for display
  maskCardNumber(cardNumber: string): string {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 4) return digits;
    
    const last4 = digits.slice(-4);
    const masked = '*'.repeat(digits.length - 4);
    return masked + last4;
  }
}

// Create singleton instance
export const stripeManager = new StripeManager();

// Export types
export type {
  PaymentIntent,
  PaymentMethod,
  PaymentResult,
  SnippetPurchase,
}; 