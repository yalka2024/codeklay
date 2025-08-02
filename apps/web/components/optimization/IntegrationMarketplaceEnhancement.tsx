// Integration Marketplace Enhancement for CodePal
// Features: Enhanced marketplace for integrations, plugins, extensions, and custom solutions

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface MarketplaceIntegration {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'productivity' | 'analytics' | 'security' | 'communication' | 'automation';
  type: 'plugin' | 'extension' | 'connector' | 'template' | 'workflow';
  status: 'active' | 'beta' | 'deprecated' | 'preview';
  rating: number;
  downloads: number;
  price: 'free' | 'premium' | 'enterprise';
  author: string;
  version: string;
  lastUpdated: string;
  tags: string[];
  features: string[];
  requirements: string[];
  documentation: string;
  support: string;
}

interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  featured: boolean;
}

interface MarketplaceReview {
  id: string;
  integrationId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: string;
}

interface MarketplaceAnalytics {
  id: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface MarketplaceSubscription {
  id: string;
  integrationId: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  usage: SubscriptionUsage;
}

interface SubscriptionUsage {
  current: number;
  limit: number;
  resetDate: string;
}

interface MarketplaceRecommendation {
  id: string;
  integrationId: string;
  reason: string;
  confidence: number;
  basedOn: string[];
}

export default function IntegrationMarketplaceEnhancement() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'categories' | 'reviews' | 'analytics' | 'subscriptions' | 'recommendations'>('overview');
  const [integrations, setIntegrations] = useState<MarketplaceIntegration[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics[]>([]);
  const [subscriptions, setSubscriptions] = useState<MarketplaceSubscription[]>([]);
  const [recommendations, setRecommendations] = useState<MarketplaceRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockIntegrations: MarketplaceIntegration[] = [
        {
          id: '1',
          name: 'GitHub Integration Pro',
          description: 'Advanced GitHub integration with automated workflows and code review features',
          category: 'development',
          type: 'connector',
          status: 'active',
          rating: 4.8,
          downloads: 15420,
          price: 'premium',
          author: 'CodePal Team',
          version: '2.1.0',
          lastUpdated: '2024-01-15T10:00:00Z',
          tags: ['github', 'git', 'workflow', 'automation'],
          features: ['Automated PR reviews', 'Code quality checks', 'Team collaboration'],
          requirements: ['GitHub account', 'Admin permissions'],
          documentation: 'https://docs.codepal.com/github-integration',
          support: 'support@codepal.com'
        },
        {
          id: '2',
          name: 'Security Scanner',
          description: 'Comprehensive security scanning for code vulnerabilities and compliance',
          category: 'security',
          type: 'plugin',
          status: 'active',
          rating: 4.9,
          downloads: 8920,
          price: 'enterprise',
          author: 'SecurityLabs',
          version: '1.5.2',
          lastUpdated: '2024-01-14T15:30:00Z',
          tags: ['security', 'vulnerability', 'compliance', 'scanning'],
          features: ['Vulnerability detection', 'Compliance reporting', 'Real-time alerts'],
          requirements: ['Code repository access', 'Security permissions'],
          documentation: 'https://docs.codepal.com/security-scanner',
          support: 'security@codepal.com'
        },
        {
          id: '3',
          name: 'Analytics Dashboard',
          description: 'Advanced analytics and reporting for development metrics',
          category: 'analytics',
          type: 'extension',
          status: 'beta',
          rating: 4.6,
          downloads: 5670,
          price: 'free',
          author: 'AnalyticsPro',
          version: '1.0.0',
          lastUpdated: '2024-01-13T09:15:00Z',
          tags: ['analytics', 'metrics', 'reporting', 'dashboard'],
          features: ['Custom dashboards', 'Real-time metrics', 'Export capabilities'],
          requirements: ['Data access permissions'],
          documentation: 'https://docs.codepal.com/analytics-dashboard',
          support: 'analytics@codepal.com'
        }
      ];

      const mockCategories: MarketplaceCategory[] = [
        {
          id: 'development',
          name: 'Development Tools',
          description: 'Git integrations, code quality tools, and development workflows',
          icon: '🔧',
          count: 45,
          featured: true
        },
        {
          id: 'productivity',
          name: 'Productivity',
          description: 'Time tracking, project management, and team collaboration tools',
          icon: '⚡',
          count: 32,
          featured: true
        },
        {
          id: 'analytics',
          name: 'Analytics',
          description: 'Data visualization, reporting, and performance monitoring',
          icon: '📊',
          count: 28,
          featured: false
        },
        {
          id: 'security',
          name: 'Security',
          description: 'Vulnerability scanning, compliance, and security monitoring',
          icon: '🔒',
          count: 23,
          featured: true
        }
      ];

      const mockReviews: MarketplaceReview[] = [
        {
          id: '1',
          integrationId: '1',
          userId: 'user1',
          userName: 'John Developer',
          rating: 5,
          title: 'Excellent GitHub Integration',
          comment: 'This integration has significantly improved our workflow. The automated PR reviews are a game-changer.',
          helpful: 12,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          integrationId: '2',
          userId: 'user2',
          userName: 'Sarah Security',
          rating: 4,
          title: 'Great Security Features',
          comment: 'Very comprehensive security scanning. Helped us identify several vulnerabilities.',
          helpful: 8,
          createdAt: '2024-01-14T15:30:00Z'
        }
      ];

      const mockAnalytics: MarketplaceAnalytics[] = [
        {
          id: '1',
          metric: 'Total Downloads',
          value: 15420,
          unit: 'count',
          trend: 'up',
          period: '30d'
        },
        {
          id: '2',
          metric: 'Active Integrations',
          value: 128,
          unit: 'count',
          trend: 'up',
          period: '30d'
        },
        {
          id: '3',
          metric: 'Average Rating',
          value: 4.7,
          unit: 'stars',
          trend: 'stable',
          period: '30d'
        },
        {
          id: '4',
          metric: 'Revenue',
          value: 45000,
          unit: 'USD',
          trend: 'up',
          period: '30d'
        }
      ];

      const mockSubscriptions: MarketplaceSubscription[] = [
        {
          id: '1',
          integrationId: '1',
          userId: user?.id || 'user1',
          plan: 'pro',
          status: 'active',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-02-01T00:00:00Z',
          autoRenew: true,
          usage: {
            current: 85,
            limit: 100,
            resetDate: '2024-02-01T00:00:00Z'
          }
        }
      ];

      const mockRecommendations: MarketplaceRecommendation[] = [
        {
          id: '1',
          integrationId: '2',
          reason: 'Based on your security focus',
          confidence: 0.92,
          basedOn: ['Security category', 'Team size', 'Previous downloads']
        },
        {
          id: '2',
          integrationId: '3',
          reason: 'Popular with similar teams',
          confidence: 0.85,
          basedOn: ['Team size', 'Usage patterns', 'Category preference']
        }
      ];

      setIntegrations(mockIntegrations);
      setCategories(mockCategories);
      setReviews(mockReviews);
      setAnalytics(mockAnalytics);
      setSubscriptions(mockSubscriptions);
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'beta':
        return 'text-blue-600 bg-blue-100';
      case 'preview':
        return 'text-purple-600 bg-purple-100';
      case 'deprecated':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free':
        return 'text-green-600 bg-green-100';
      case 'premium':
        return 'text-blue-600 bg-blue-100';
      case 'enterprise':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedIntegrations = [...filteredIntegrations].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price':
        const priceOrder = { free: 0, premium: 1, enterprise: 2 };
        return priceOrder[a.price as keyof typeof priceOrder] - priceOrder[b.price as keyof typeof priceOrder];
      default:
        return 0;
    }
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Integrations</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {integrations.length}
          </div>
          <p className="text-sm text-gray-600">Available integrations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Downloads</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analytics.find(a => a.metric === 'Total Downloads')?.value.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600">All time downloads</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Rating</h3>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {analytics.find(a => a.metric === 'Average Rating')?.value || 0}
          </div>
          <p className="text-sm text-gray-600">Overall rating</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Subscriptions</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {subscriptions.filter(s => s.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Your subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Featured Integrations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {integrations.slice(0, 3).map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-sm">{renderStars(integration.rating)}</span>
                      <span className="text-sm text-gray-600 ml-2">({integration.rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriceColor(integration.price)}`}>
                      {integration.price}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{integration.downloads.toLocaleString()} downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Subscriptions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {subscriptions.map(subscription => {
                const integration = integrations.find(i => i.id === subscription.integrationId);
                return (
                  <div key={subscription.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{integration?.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Plan:</span>
                        <span className="ml-1 font-medium">{subscription.plan}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Usage:</span>
                        <span className="ml-1 font-medium">{subscription.usage.current}/{subscription.usage.limit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedIntegrations.map(integration => (
          <div key={integration.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.author}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriceColor(integration.price)}`}>
                    {integration.price}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-sm">{renderStars(integration.rating)}</span>
                  <span className="text-sm text-gray-600 ml-2">({integration.rating})</span>
                </div>
                <span className="text-sm text-gray-500">{integration.downloads.toLocaleString()} downloads</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {integration.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Install
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{category.icon}</div>
                {category.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.count} integrations</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Browse
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      {reviews.map(review => {
        const integration = integrations.find(i => i.id === review.integrationId);
        return (
          <div key={review.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.title}</h3>
                  <p className="text-sm text-gray-600">for {integration?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-yellow-500 text-sm">{renderStars(review.rating)}</div>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">by {review.userName}</span>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Marketplace Analytics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analytics.map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                  <div className="text-lg">
                    {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '→'}
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value.toLocaleString()} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-600">Last {metric.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      {subscriptions.map(subscription => {
        const integration = integrations.find(i => i.id === subscription.integrationId);
        return (
          <div key={subscription.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration?.name}</h3>
                  <p className="text-sm text-gray-600">{integration?.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Subscription Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Plan:</span>
                      <span className="font-medium">{subscription.plan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">End Date:</span>
                      <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Auto Renew:</span>
                      <span className="font-medium">{subscription.autoRenew ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Usage:</span>
                      <span className="font-medium">{subscription.usage.current}/{subscription.usage.limit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(subscription.usage.current / subscription.usage.limit) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Reset Date:</span>
                      <span className="font-medium">{new Date(subscription.usage.resetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Manage Subscription
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  View Usage
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      {recommendations.map(recommendation => {
        const integration = integrations.find(i => i.id === recommendation.integrationId);
        return (
          <div key={recommendation.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration?.name}</h3>
                  <p className="text-sm text-gray-600">{recommendation.reason}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {Math.round(recommendation.confidence * 100)}% match
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Based on:</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.basedOn.map(factor => (
                    <span key={factor} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Install
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Learn More
                </button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integration Marketplace Enhancement</h1>
          <p className="text-gray-600 mt-2">
            Enhanced marketplace for integrations, plugins, extensions, and custom solutions
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'integrations', label: 'Integrations' },
              { id: 'categories', label: 'Categories' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'subscriptions', label: 'Subscriptions' },
              { id: 'recommendations', label: 'Recommendations' }
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

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'integrations' && renderIntegrations()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'subscriptions' && renderSubscriptions()}
          {activeTab === 'recommendations' && renderRecommendations()}
        </div>
      </div>
    </div>
  );
} 