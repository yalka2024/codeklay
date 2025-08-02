// Enterprise Integration & API Management for CodePal
// Features: Comprehensive API management, integration workflows, webhook management, enterprise connectivity

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  version: string;
  status: 'active' | 'deprecated' | 'beta' | 'maintenance';
  rateLimit: number;
  responseTime: number;
  uptime: number;
  lastUpdated: string;
  documentation: string;
  parameters: APIParameter[];
  responses: APIResponse[];
}

interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface APIResponse {
  code: number;
  description: string;
  schema: string;
  example: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'webhook' | 'api' | 'sdk' | 'connector';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'configuring';
  category: 'crm' | 'payment' | 'communication' | 'analytics' | 'storage' | 'custom';
  config: IntegrationConfig;
  lastSync: string;
  nextSync: string;
  metrics: IntegrationMetrics;
}

interface IntegrationConfig {
  endpoint: string;
  authentication: string;
  headers: Record<string, string>;
  timeout: number;
  retryAttempts: number;
  webhookUrl?: string;
  apiKey?: string;
  oauthConfig?: OAuthConfig;
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  tokenUrl: string;
}

interface IntegrationMetrics {
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  errorCount: number;
  lastCall: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  secret: string;
  retryPolicy: RetryPolicy;
  deliveryHistory: WebhookDelivery[];
  createdAt: string;
  lastTriggered: string;
}

interface RetryPolicy {
  maxAttempts: number;
  backoffDelay: number;
  timeout: number;
}

interface WebhookDelivery {
  id: string;
  event: string;
  payload: string;
  status: 'success' | 'failed' | 'pending';
  responseCode: number;
  responseTime: number;
  timestamp: string;
  retryCount: number;
}

interface APIGateway {
  id: string;
  name: string;
  description: string;
  environment: 'development' | 'staging' | 'production';
  status: 'active' | 'maintenance' | 'deprecated';
  endpoints: string[];
  rateLimiting: RateLimitConfig;
  authentication: AuthConfig;
  monitoring: MonitoringConfig;
  lastDeployed: string;
}

interface RateLimitConfig {
  requestsPerMinute: number;
  burstLimit: number;
  windowSize: number;
}

interface AuthConfig {
  type: 'api_key' | 'oauth' | 'jwt' | 'none';
  required: boolean;
  scopes: string[];
}

interface MonitoringConfig {
  enabled: boolean;
  alertThreshold: number;
  metrics: string[];
}

interface SDK {
  id: string;
  name: string;
  language: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  downloadUrl: string;
  documentation: string;
  examples: string[];
  lastUpdated: string;
  features: string[];
}

export default function EnterpriseIntegrationAPIManagement() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'apis' | 'integrations' | 'webhooks' | 'gateway' | 'sdks'>('overview');
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiGateways, setApiGateways] = useState<APIGateway[]>([]);
  const [sdks, setSdks] = useState<SDK[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockAPIEndpoints: APIEndpoint[] = [
        {
          id: '1',
          name: 'Get User Profile',
          path: '/api/v1/users/{id}',
          method: 'GET',
          version: 'v1',
          status: 'active',
          rateLimit: 1000,
          responseTime: 150,
          uptime: 99.9,
          lastUpdated: '2024-03-20T10:00:00Z',
          documentation: 'Retrieve user profile information by ID',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'User ID' },
            { name: 'include', type: 'string', required: false, description: 'Additional fields to include' }
          ],
          responses: [
            { code: 200, description: 'Success', schema: 'UserProfile', example: '{"id": "123", "name": "John Doe"}' },
            { code: 404, description: 'User not found', schema: 'Error', example: '{"error": "User not found"}' }
          ]
        },
        {
          id: '2',
          name: 'Create Project',
          path: '/api/v1/projects',
          method: 'POST',
          version: 'v1',
          status: 'active',
          rateLimit: 500,
          responseTime: 200,
          uptime: 99.8,
          lastUpdated: '2024-03-20T09:30:00Z',
          documentation: 'Create a new project',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Project name' },
            { name: 'description', type: 'string', required: false, description: 'Project description' }
          ],
          responses: [
            { code: 201, description: 'Created', schema: 'Project', example: '{"id": "456", "name": "New Project"}' },
            { code: 400, description: 'Bad request', schema: 'Error', example: '{"error": "Invalid input"}' }
          ]
        }
      ];

      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Salesforce CRM',
          description: 'Integration with Salesforce CRM for customer data synchronization',
          type: 'connector',
          provider: 'Salesforce',
          status: 'active',
          category: 'crm',
          config: {
            endpoint: 'https://api.salesforce.com/services/data/v52.0',
            authentication: 'oauth2',
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
            retryAttempts: 3,
            oauthConfig: {
              clientId: 'sf_client_id',
              clientSecret: 'sf_client_secret',
              redirectUri: 'https://codepal.com/oauth/callback',
              scopes: ['api', 'refresh_token'],
              tokenUrl: 'https://login.salesforce.com/services/oauth2/token'
            }
          },
          lastSync: '2024-03-20T10:00:00Z',
          nextSync: '2024-03-20T11:00:00Z',
          metrics: {
            totalCalls: 15420,
            successRate: 98.5,
            averageResponseTime: 450,
            errorCount: 231,
            lastCall: '2024-03-20T10:00:00Z'
          }
        },
        {
          id: '2',
          name: 'Stripe Payments',
          description: 'Payment processing integration with Stripe',
          type: 'api',
          provider: 'Stripe',
          status: 'active',
          category: 'payment',
          config: {
            endpoint: 'https://api.stripe.com/v1',
            authentication: 'api_key',
            headers: { 'Authorization': 'Bearer sk_test_...' },
            timeout: 15000,
            retryAttempts: 2,
            apiKey: 'sk_test_...'
          },
          lastSync: '2024-03-20T09:45:00Z',
          nextSync: '2024-03-20T10:45:00Z',
          metrics: {
            totalCalls: 8920,
            successRate: 99.2,
            averageResponseTime: 320,
            errorCount: 71,
            lastCall: '2024-03-20T09:45:00Z'
          }
        }
      ];

      const mockWebhooks: Webhook[] = [
        {
          id: '1',
          name: 'User Registration Webhook',
          url: 'https://webhook.company.com/user-registration',
          events: ['user.created', 'user.updated'],
          status: 'active',
          secret: 'whsec_...',
          retryPolicy: {
            maxAttempts: 3,
            backoffDelay: 5000,
            timeout: 10000
          },
          deliveryHistory: [
            {
              id: '1',
              event: 'user.created',
              payload: '{"user_id": "123", "email": "user@example.com"}',
              status: 'success',
              responseCode: 200,
              responseTime: 150,
              timestamp: '2024-03-20T10:00:00Z',
              retryCount: 0
            }
          ],
          createdAt: '2024-01-15T00:00:00Z',
          lastTriggered: '2024-03-20T10:00:00Z'
        }
      ];

      const mockAPIGateways: APIGateway[] = [
        {
          id: '1',
          name: 'Production API Gateway',
          description: 'Main API gateway for production environment',
          environment: 'production',
          status: 'active',
          endpoints: ['/api/v1/*', '/api/v2/*'],
          rateLimiting: {
            requestsPerMinute: 1000,
            burstLimit: 100,
            windowSize: 60
          },
          authentication: {
            type: 'jwt',
            required: true,
            scopes: ['read', 'write', 'admin']
          },
          monitoring: {
            enabled: true,
            alertThreshold: 500,
            metrics: ['response_time', 'error_rate', 'throughput']
          },
          lastDeployed: '2024-03-20T08:00:00Z'
        }
      ];

      const mockSDKs: SDK[] = [
        {
          id: '1',
          name: 'CodePal JavaScript SDK',
          language: 'JavaScript',
          version: '2.1.0',
          status: 'active',
          downloadUrl: 'https://npmjs.com/package/codepal-sdk',
          documentation: 'https://docs.codepal.com/sdk/javascript',
          examples: ['authentication', 'api-calls', 'webhooks'],
          lastUpdated: '2024-03-15T00:00:00Z',
          features: ['TypeScript support', 'Promise-based', 'Error handling']
        },
        {
          id: '2',
          name: 'CodePal Python SDK',
          language: 'Python',
          version: '1.8.0',
          status: 'active',
          downloadUrl: 'https://pypi.org/project/codepal-sdk',
          documentation: 'https://docs.codepal.com/sdk/python',
          examples: ['client-setup', 'async-operations', 'data-processing'],
          lastUpdated: '2024-03-10T00:00:00Z',
          features: ['Async/await support', 'Type hints', 'Comprehensive docs']
        }
      ];

      setApiEndpoints(mockAPIEndpoints);
      setIntegrations(mockIntegrations);
      setWebhooks(mockWebhooks);
      setApiGateways(mockAPIGateways);
      setSdks(mockSDKs);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'deprecated': return 'text-yellow-600 bg-yellow-100';
      case 'beta': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      case 'configuring': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-orange-600 bg-orange-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'PATCH': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600';
    if (uptime >= 99.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Active APIs</h3>
          <p className="text-3xl font-bold text-blue-600">{apiEndpoints.filter(api => api.status === 'active').length}</p>
          <p className="text-sm text-blue-700">Production endpoints</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Integrations</h3>
          <p className="text-3xl font-bold text-green-600">{integrations.filter(i => i.status === 'active').length}</p>
          <p className="text-sm text-green-700">Active integrations</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Webhooks</h3>
          <p className="text-3xl font-bold text-purple-600">{webhooks.filter(w => w.status === 'active').length}</p>
          <p className="text-sm text-purple-700">Active webhooks</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">SDKs</h3>
          <p className="text-3xl font-bold text-orange-600">{sdks.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-orange-700">Available SDKs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performance</h3>
          <div className="space-y-4">
            {apiEndpoints.slice(0, 3).map(api => (
              <div key={api.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{api.name}</p>
                  <p className="text-sm text-gray-600">{api.path}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(api.method)}`}>
                    {api.method}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className={getUptimeColor(api.uptime)}>{api.uptime}%</span> uptime
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
          <div className="space-y-4">
            {integrations.slice(0, 3).map(integration => (
              <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{integration.name}</p>
                  <p className="text-sm text-gray-600">{integration.provider} • {integration.category}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {integration.metrics.successRate}% success
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIs = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
      <div className="space-y-6">
        {apiEndpoints.map(api => (
          <div key={api.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{api.name}</h4>
                <p className="text-sm text-gray-600">{api.documentation}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(api.method)}`}>
                  {api.method}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(api.status)}`}>
                  {api.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Path</p>
                <p className="text-sm text-gray-900 font-mono">{api.path}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Version</p>
                <p className="text-sm text-gray-900">{api.version}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Rate Limit</p>
                <p className="text-sm text-gray-900">{api.rateLimit}/min</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Response Time</p>
                <p className="text-sm text-gray-900">{api.responseTime}ms</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Parameters ({api.parameters.length})</h5>
              <div className="space-y-2">
                {api.parameters.map(param => (
                  <div key={param.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{param.name}</p>
                      <p className="text-xs text-gray-600">{param.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{param.type}</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${param.required ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'}`}>
                        {param.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
      <div className="space-y-6">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{integration.name}</h4>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {integration.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Provider</p>
                <p className="text-sm text-gray-900">{integration.provider}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-sm text-gray-900 capitalize">{integration.category}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Sync</p>
                <p className="text-sm text-gray-900">{new Date(integration.lastSync).toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Success Rate</p>
                <p className="text-sm text-gray-900">{integration.metrics.successRate}%</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Configuration</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Endpoint:</span>
                  <span className="text-sm text-gray-900 font-mono">{integration.config.endpoint}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Authentication:</span>
                  <span className="text-sm text-gray-900">{integration.config.authentication}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Timeout:</span>
                  <span className="text-sm text-gray-900">{integration.config.timeout}ms</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
      <div className="space-y-6">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{webhook.name}</h4>
                <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(webhook.status)}`}>
                {webhook.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Events</p>
                <p className="text-sm text-gray-900">{webhook.events.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Max Retries</p>
                <p className="text-sm text-gray-900">{webhook.retryPolicy.maxAttempts}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Triggered</p>
                <p className="text-sm text-gray-900">{new Date(webhook.lastTriggered).toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Deliveries</p>
                <p className="text-sm text-gray-900">{webhook.deliveryHistory.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Recent Deliveries</h5>
              <div className="space-y-2">
                {webhook.deliveryHistory.slice(0, 3).map(delivery => (
                  <div key={delivery.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{delivery.event}</p>
                      <p className="text-xs text-gray-600">{delivery.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${delivery.status === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                        {delivery.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{delivery.responseCode} • {delivery.responseTime}ms</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGateway = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Gateway</h3>
      <div className="space-y-6">
        {apiGateways.map(gateway => (
          <div key={gateway.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{gateway.name}</h4>
                <p className="text-sm text-gray-600">{gateway.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gateway.status)}`}>
                  {gateway.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                  {gateway.environment}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Endpoints</p>
                <p className="text-sm text-gray-900">{gateway.endpoints.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Rate Limit</p>
                <p className="text-sm text-gray-900">{gateway.rateLimiting.requestsPerMinute}/min</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Auth Type</p>
                <p className="text-sm text-gray-900">{gateway.authentication.type}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Deployed</p>
                <p className="text-sm text-gray-900">{new Date(gateway.lastDeployed).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Configuration</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Rate Limiting</h6>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Requests: {gateway.rateLimiting.requestsPerMinute}/min</div>
                    <div>Burst: {gateway.rateLimiting.burstLimit}</div>
                    <div>Window: {gateway.rateLimiting.windowSize}s</div>
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Authentication</h6>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Type: {gateway.authentication.type}</div>
                    <div>Required: {gateway.authentication.required ? 'Yes' : 'No'}</div>
                    <div>Scopes: {gateway.authentication.scopes.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSDKs = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Software Development Kits</h3>
      <div className="space-y-6">
        {sdks.map(sdk => (
          <div key={sdk.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{sdk.name}</h4>
                <p className="text-sm text-gray-600">{sdk.language} • v{sdk.version}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sdk.status)}`}>
                {sdk.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Download</p>
                <p className="text-sm text-gray-900 font-mono">{sdk.downloadUrl}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Documentation</p>
                <p className="text-sm text-gray-900 font-mono">{sdk.documentation}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900">{new Date(sdk.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Features ({sdk.features.length})</h5>
              <div className="flex flex-wrap gap-2">
                {sdk.features.map(feature => (
                  <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Integration & API Management</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive API management, integration workflows, webhook management, and enterprise connectivity
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'apis', label: 'APIs' },
              { id: 'integrations', label: 'Integrations' },
              { id: 'webhooks', label: 'Webhooks' },
              { id: 'gateway', label: 'API Gateway' },
              { id: 'sdks', label: 'SDKs' }
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
          {activeTab === 'apis' && renderAPIs()}
          {activeTab === 'integrations' && renderIntegrations()}
          {activeTab === 'webhooks' && renderWebhooks()}
          {activeTab === 'gateway' && renderGateway()}
          {activeTab === 'sdks' && renderSDKs()}
        </div>
      </div>
    </div>
  );
} 