// Global Payment & Billing Systems for CodePal
// Features: Multi-currency support, real-time currency conversion, local payment methods, regional pricing, tax calculation, invoice localization, enterprise billing

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  lastUpdated: string;
  isBase: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet' | 'crypto' | 'local';
  provider: string;
  name: string;
  country: string;
  currency: string;
  isActive: boolean;
  processingFee: number;
  settlementTime: string;
  supportedCurrencies: string[];
}

interface RegionalPricing {
  id: string;
  region: string;
  country: string;
  currency: string;
  plans: PricingPlan[];
  taxRates: TaxRate[];
  localPaymentMethods: string[];
  pricingTier: 'standard' | 'premium' | 'enterprise';
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  features: string[];
  isPopular: boolean;
  discount?: number;
}

interface TaxRate {
  country: string;
  region?: string;
  rate: number;
  type: 'VAT' | 'GST' | 'Sales_Tax' | 'Custom';
  isActive: boolean;
  effectiveDate: string;
}

interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: CustomerAddress;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  locale: string;
  template: string;
}

interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  taxAmount: number;
}

interface BillingSubscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  quantity: number;
  unitPrice: number;
  currency: string;
  nextBillingDate: string;
  trialEnd?: string;
}

interface EnterpriseBilling {
  id: string;
  organizationId: string;
  organizationName: string;
  billingType: 'usage_based' | 'subscription' | 'hybrid';
  contractTerms: ContractTerms;
  usageMetrics: UsageMetric[];
  billingCycles: BillingCycle[];
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  currency: string;
}

interface ContractTerms {
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  noticePeriod: number;
  minimumCommitment: number;
  currency: string;
}

interface UsageMetric {
  id: string;
  name: string;
  unit: string;
  currentUsage: number;
  limit: number;
  cost: number;
  currency: string;
  period: string;
}

interface BillingCycle {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'billed' | 'paid';
  invoiceId?: string;
}

export default function GlobalPaymentBilling() {
  const { user } = useAuthContext();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [regionalPricing, setRegionalPricing] = useState<RegionalPricing[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<BillingSubscription[]>([]);
  const [enterpriseBilling, setEnterpriseBilling] = useState<EnterpriseBilling[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'currencies' | 'payments' | 'pricing' | 'invoices' | 'subscriptions' | 'enterprise'>('overview');

  // Load global payment data
  const loadPaymentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockCurrencies: Currency[] = [
        { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, lastUpdated: '2024-01-15T12:00:00Z', isBase: true },
        { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.5, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.25, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.35, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 74.5, lastUpdated: '2024-01-15T12:00:00Z', isBase: false },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', exchangeRate: 5.45, lastUpdated: '2024-01-15T12:00:00Z', isBase: false }
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'credit_card',
          provider: 'Stripe',
          name: 'Visa/Mastercard',
          country: 'Global',
          currency: 'USD',
          isActive: true,
          processingFee: 2.9,
          settlementTime: '2-3 business days',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
        },
        {
          id: '2',
          type: 'digital_wallet',
          provider: 'PayPal',
          name: 'PayPal',
          country: 'Global',
          currency: 'USD',
          isActive: true,
          processingFee: 3.5,
          settlementTime: '1-2 business days',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
        },
        {
          id: '3',
          type: 'local',
          provider: 'iDEAL',
          name: 'iDEAL',
          country: 'Netherlands',
          currency: 'EUR',
          isActive: true,
          processingFee: 0.29,
          settlementTime: 'Same day',
          supportedCurrencies: ['EUR']
        },
        {
          id: '4',
          type: 'local',
          provider: 'Boleto',
          name: 'Boleto Bancário',
          country: 'Brazil',
          currency: 'BRL',
          isActive: true,
          processingFee: 1.99,
          settlementTime: '3-5 business days',
          supportedCurrencies: ['BRL']
        }
      ];

      const mockRegionalPricing: RegionalPricing[] = [
        {
          id: '1',
          region: 'North America',
          country: 'US',
          currency: 'USD',
          plans: [
            {
              id: 'basic-us',
              name: 'Basic Plan',
              price: 29.99,
              currency: 'USD',
              billingCycle: 'monthly',
              features: ['Code Analysis', 'Basic AI Features', '5 Projects'],
              isPopular: false
            },
            {
              id: 'pro-us',
              name: 'Pro Plan',
              price: 99.99,
              currency: 'USD',
              billingCycle: 'monthly',
              features: ['Advanced AI', 'Unlimited Projects', 'Team Collaboration'],
              isPopular: true,
              discount: 20
            }
          ],
          taxRates: [
            { country: 'US', rate: 0, type: 'Sales_Tax', isActive: true, effectiveDate: '2024-01-01' }
          ],
          localPaymentMethods: ['credit_card', 'paypal'],
          pricingTier: 'standard'
        },
        {
          id: '2',
          region: 'Europe',
          country: 'DE',
          currency: 'EUR',
          plans: [
            {
              id: 'basic-eu',
              name: 'Basic Plan',
              price: 24.99,
              currency: 'EUR',
              billingCycle: 'monthly',
              features: ['Code Analysis', 'Basic AI Features', '5 Projects'],
              isPopular: false
            },
            {
              id: 'pro-eu',
              name: 'Pro Plan',
              price: 84.99,
              currency: 'EUR',
              billingCycle: 'monthly',
              features: ['Advanced AI', 'Unlimited Projects', 'Team Collaboration'],
              isPopular: true,
              discount: 15
            }
          ],
          taxRates: [
            { country: 'DE', rate: 19, type: 'VAT', isActive: true, effectiveDate: '2024-01-01' }
          ],
          localPaymentMethods: ['credit_card', 'paypal', 'ideal'],
          pricingTier: 'premium'
        }
      ];

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          number: 'INV-2024-001',
          customerId: 'cust-001',
          customerName: 'Acme Corporation',
          customerEmail: 'billing@acme.com',
          customerAddress: {
            street: '123 Business St',
            city: 'New York',
            state: 'NY',
            country: 'US',
            postalCode: '10001'
          },
          items: [
            {
              id: 'item-1',
              description: 'Pro Plan - Monthly Subscription',
              quantity: 1,
              unitPrice: 99.99,
              total: 99.99,
              taxRate: 0,
              taxAmount: 0
            }
          ],
          subtotal: 99.99,
          taxAmount: 0,
          discountAmount: 0,
          total: 99.99,
          currency: 'USD',
          status: 'paid',
          dueDate: '2024-01-31',
          issueDate: '2024-01-01',
          paidDate: '2024-01-02',
          paymentMethod: 'credit_card',
          locale: 'en-US',
          template: 'professional'
        }
      ];

      const mockSubscriptions: BillingSubscription[] = [
        {
          id: 'sub-001',
          customerId: 'cust-001',
          planId: 'pro-us',
          planName: 'Pro Plan',
          status: 'active',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          cancelAtPeriodEnd: false,
          quantity: 1,
          unitPrice: 99.99,
          currency: 'USD',
          nextBillingDate: '2024-02-01'
        }
      ];

      const mockEnterpriseBilling: EnterpriseBilling[] = [
        {
          id: 'ent-001',
          organizationId: 'org-001',
          organizationName: 'TechCorp Enterprise',
          billingType: 'usage_based',
          contractTerms: {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            autoRenew: true,
            noticePeriod: 30,
            minimumCommitment: 5000,
            currency: 'USD'
          },
          usageMetrics: [
            {
              id: 'metric-1',
              name: 'API Calls',
              unit: 'calls',
              currentUsage: 150000,
              limit: 200000,
              cost: 1500,
              currency: 'USD',
              period: 'current_month'
            },
            {
              id: 'metric-2',
              name: 'Storage',
              unit: 'GB',
              currentUsage: 500,
              limit: 1000,
              cost: 250,
              currency: 'USD',
              period: 'current_month'
            }
          ],
          billingCycles: [
            {
              id: 'cycle-1',
              startDate: '2024-01-01',
              endDate: '2024-01-31',
              totalAmount: 1750,
              currency: 'USD',
              status: 'billed',
              invoiceId: 'inv-001'
            }
          ],
          paymentTerms: 'Net 30',
          creditLimit: 10000,
          currentBalance: 1750,
          currency: 'USD'
        }
      ];

      setCurrencies(mockCurrencies);
      setPaymentMethods(mockPaymentMethods);
      setRegionalPricing(mockRegionalPricing);
      setInvoices(mockInvoices);
      setSubscriptions(mockSubscriptions);
      setEnterpriseBilling(mockEnterpriseBilling);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert currency
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  // Update exchange rates
  const updateExchangeRates = async () => {
    try {
      setIsLoading(true);
      // Simulate API call to update rates
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        exchangeRate: currency.isBase ? 1.0 : currency.exchangeRate * (0.95 + Math.random() * 0.1),
        lastUpdated: new Date().toISOString()
      })));
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create invoice
  const createInvoice = async (customerData: any, items: any[]) => {
    try {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        customerId: customerData.id,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerAddress: customerData.address,
        items,
        subtotal: items.reduce((sum, item) => sum + item.total, 0),
        taxAmount: 0, // Calculate based on tax rates
        discountAmount: 0,
        total: items.reduce((sum, item) => sum + item.total, 0),
        currency: selectedCurrency,
        status: 'draft',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        locale: 'en-US',
        template: 'professional'
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  useEffect(() => {
    loadPaymentData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Supported Currencies</h3>
          <p className="text-2xl font-bold text-blue-600">{currencies.length}</p>
          <p className="text-xs text-gray-400">Global currencies</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Payment Methods</h3>
          <p className="text-2xl font-bold text-green-600">{paymentMethods.filter(p => p.isActive).length}</p>
          <p className="text-xs text-gray-400">Active methods</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Regions</h3>
          <p className="text-2xl font-bold text-purple-600">{regionalPricing.length}</p>
          <p className="text-xs text-gray-400">Pricing regions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-orange-600">{subscriptions.filter(s => s.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Billing subscriptions</p>
        </div>
      </div>

      {/* Currency Exchange Rates */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Exchange Rates</h3>
          <button
            onClick={updateExchangeRates}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Update Rates
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currencies.filter(c => !c.isBase).slice(0, 8).map(currency => (
              <div key={currency.code} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{currency.code}</p>
                <p className="text-lg font-bold text-blue-600">{currency.exchangeRate.toFixed(4)}</p>
                <p className="text-xs text-gray-500">{currency.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
        </div>
        <div className="p-6">
          {invoices.slice(0, 5).map(invoice => (
            <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{invoice.number}</h4>
                <p className="text-sm text-gray-500">{invoice.customerName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{invoice.currency} {invoice.total.toFixed(2)}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrencies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Currency Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Currency
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currencies.map(currency => (
                  <tr key={currency.code}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{currency.code}</div>
                        <div className="text-sm text-gray-500">{currency.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currency.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currency.exchangeRate.toFixed(4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(currency.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        currency.isBase ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {currency.isBase ? 'Base' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Disable</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map(method => (
          <div key={method.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.provider} • {method.country}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {method.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Processing Fee</p>
                <p className="text-lg font-semibold text-gray-900">{method.processingFee}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Settlement Time</p>
                <p className="text-sm font-medium text-gray-900">{method.settlementTime}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Supported Currencies</p>
              <div className="flex flex-wrap gap-1">
                {method.supportedCurrencies.map(currency => (
                  <span key={currency} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {currency}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Configure
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                {method.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Regional Pricing</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Region
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regionalPricing.map(region => (
          <div key={region.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{region.region}</h3>
              <p className="text-sm text-gray-500">{region.country} • {region.currency}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Pricing Plans</p>
              <div className="space-y-2">
                {region.plans.map(plan => (
                  <div key={plan.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-500">{plan.billingCycle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{plan.currency} {plan.price}</p>
                      {plan.discount && (
                        <p className="text-sm text-green-600">{plan.discount}% off</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Tax Rates</p>
              <div className="space-y-1">
                {region.taxRates.map((tax, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{tax.type}</span>
                    <span className="font-medium">{tax.rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Pricing
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                      <div className="text-sm text-gray-500">{invoice.issueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900 mr-3">Send</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Billing Subscriptions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subscriptions.map(subscription => (
          <div key={subscription.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{subscription.planName}</h3>
                <p className="text-sm text-gray-500">Customer ID: {subscription.customerId}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                subscription.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Current Period</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Billing</p>
                <p className="text-sm font-medium text-gray-900">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{subscription.quantity}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Unit Price</span>
                <span className="font-medium">{subscription.currency} {subscription.unitPrice}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{subscription.currency} {(subscription.quantity * subscription.unitPrice).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                {subscription.cancelAtPeriodEnd ? 'Resume' : 'Cancel'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnterprise = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Enterprise Billing</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enterpriseBilling.map(billing => (
          <div key={billing.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{billing.organizationName}</h3>
                <p className="text-sm text-gray-500">Billing Type: {billing.billingType.replace('_', ' ')}</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Enterprise
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Contract Terms</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Start:</span>
                  <span className="ml-1 font-medium">{new Date(billing.contractTerms.startDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">End:</span>
                  <span className="ml-1 font-medium">{new Date(billing.contractTerms.endDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Min Commitment:</span>
                  <span className="ml-1 font-medium">{billing.contractTerms.currency} {billing.contractTerms.minimumCommitment}</span>
                </div>
                <div>
                  <span className="text-gray-500">Notice Period:</span>
                  <span className="ml-1 font-medium">{billing.contractTerms.noticePeriod} days</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Usage Metrics</p>
              <div className="space-y-2">
                {billing.usageMetrics.map(metric => (
                  <div key={metric.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                      <p className="text-xs text-gray-500">{metric.currentUsage} / {metric.limit} {metric.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{metric.currency} {metric.cost}</p>
                      <p className="text-xs text-gray-500">{((metric.currentUsage / metric.limit) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Credit Limit</span>
                <span className="font-medium">{billing.currency} {billing.creditLimit}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-medium">{billing.currency} {billing.currentBalance}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-900">Available Credit</span>
                <span className="text-gray-900">{billing.currency} {billing.creditLimit - billing.currentBalance}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Manage Billing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Global Payment & Billing</h1>
          <p className="text-gray-600 mt-2">
            Multi-currency payment processing, regional pricing, and enterprise billing management
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'currencies', label: 'Currencies' },
              { id: 'payments', label: 'Payment Methods' },
              { id: 'pricing', label: 'Regional Pricing' },
              { id: 'invoices', label: 'Invoices' },
              { id: 'subscriptions', label: 'Subscriptions' },
              { id: 'enterprise', label: 'Enterprise' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'currencies' && renderCurrencies()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'pricing' && renderPricing()}
            {activeTab === 'invoices' && renderInvoices()}
            {activeTab === 'subscriptions' && renderSubscriptions()}
            {activeTab === 'enterprise' && renderEnterprise()}
          </div>
        )}
      </div>
    </div>
  );
} 