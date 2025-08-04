import Stripe from 'stripe';

export interface PlatformPaymentConfig {
  platformName: string;
  platformId: string;
  businessName: string;
  taxId?: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export class PlatformPaymentService {
  private stripe: Stripe;
  private platformConfig: PlatformPaymentConfig;

  constructor(platformConfig: PlatformPaymentConfig) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-08-16',
    });
    this.platformConfig = platformConfig;
  }

  /**
   * Create a payment intent with platform-specific metadata
   */
  async createPaymentIntent(request: PaymentIntentRequest) {
    const metadata = {
      platform: this.platformConfig.platformName,
      platformId: this.platformConfig.platformId,
      businessName: this.platformConfig.businessName,
      ...request.metadata,
    };

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      metadata,
      receipt_email: request.customerEmail,
      // Add business information for tax purposes
      ...(this.platformConfig.taxId && {
        tax_id_data: [
          {
            type: 'tax_id',
            value: this.platformConfig.taxId,
          },
        ],
      }),
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      metadata: paymentIntent.metadata,
    };
  }

  /**
   * Create a checkout session for subscriptions
   */
  async createCheckoutSession(params: {
    priceId: string;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        platform: this.platformConfig.platformName,
        platformId: this.platformConfig.platformId,
        businessName: this.platformConfig.businessName,
        ...params.metadata,
      },
    });

    return session;
  }

  /**
   * Get platform-specific payment analytics
   */
  async getPlatformAnalytics(startDate: Date, endDate: Date) {
    const payments = await this.stripe.paymentIntents.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000),
      },
      limit: 100,
    });

    // Filter payments for this platform
    const platformPayments = payments.data.filter(
      (payment) => payment.metadata?.platform === this.platformConfig.platformName
    );

    const totalRevenue = platformPayments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);

    const successfulPayments = platformPayments.filter(
      (payment) => payment.status === 'succeeded'
    );

    return {
      totalPayments: platformPayments.length,
      successfulPayments: successfulPayments.length,
      totalRevenue: totalRevenue / 100, // Convert from cents
      currency: 'usd',
      platform: this.platformConfig.platformName,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  /**
   * Process refund for platform-specific payment
   */
  async processRefund(paymentIntentId: string, amount?: number, reason?: string) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      reason: reason as any,
      metadata: {
        platform: this.platformConfig.platformName,
        platformId: this.platformConfig.platformId,
      },
    });

    return {
      id: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      reason: refund.reason,
    };
  }

  /**
   * Get customer information for tax purposes
   */
  async getCustomerInfo(customerId: string) {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer;
  }

  /**
   * Create tax report for LLC
   */
  async generateTaxReport(startDate: Date, endDate: Date) {
    const analytics = await this.getPlatformAnalytics(startDate, endDate);
    
    return {
      platform: this.platformConfig.platformName,
      businessName: this.platformConfig.businessName,
      taxId: this.platformConfig.taxId,
      period: {
        start: startDate,
        end: endDate,
      },
      revenue: analytics.totalRevenue,
      transactionCount: analytics.totalPayments,
      currency: analytics.currency,
      // Add tax calculation logic here
      estimatedTax: analytics.totalRevenue * 0.3, // Example 30% tax rate
    };
  }
}

// Platform-specific configuration for CodeKlay
export const codeklayPaymentConfig: PlatformPaymentConfig = {
  platformName: 'codeklay',
  platformId: 'ck_001',
  businessName: 'Your LLC Name',
  taxId: 'XX-XXXXXXX', // Your LLC's tax ID
  address: {
    line1: 'Your LLC Address',
    city: 'Your City',
    state: 'Your State',
    postal_code: 'Your ZIP',
    country: 'US',
  },
};

// Export the CodeKlay payment service instance
export const codeklayPaymentService = new PlatformPaymentService(codeklayPaymentConfig); 