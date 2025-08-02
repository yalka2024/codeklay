// Enterprise Integration Platform for CodePal
// Features: API management, webhook system, custom connector framework, integration marketplace

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface APIManagement {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  endpoints: APIEndpoint[];
  documentation: APIDocumentation;
  rateLimits: RateLimit;
  lastUpdated: string;
}

interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  status: 'active' | 'deprecated' | 'maintenance';
  responseTime: number;
  successRate: number;
  calls: number;
  lastCall: string;
}

interface APIDocumentation {
  version: string;
  lastUpdated: string;
  examples: DocumentationExample[];
  schemas: APISchema[];
}

interface DocumentationExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'javascript' | 'python' | 'curl' | 'typescript';
}

interface APISchema {
  id: string;
  name: string;
  type: 'request' | 'response';
  schema: string;
  description: string;
}

interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  currentUsage: number;
  resetTime: string;
}

interface WebhookSystem {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: 'active' | 'inactive' | 'error';
  retryPolicy: RetryPolicy;
  lastTriggered: string;
  successRate: number;
}

interface WebhookEvent {
  id: string;
  name: string;
  type: 'user.created' | 'project.updated' | 'code.analyzed' | 'payment.processed';
  description: string;
  payload: string;
  triggers: number;
  lastTriggered: string;
}

interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  currentRetries: number;
}

interface CustomConnector {
  id: string;
  name: string;
  description: string;
  category: 'database' | 'api' | 'file' | 'streaming';
  status: 'active' | 'inactive' | 'error';
  configuration: ConnectorConfig;
  usage: ConnectorUsage;
  lastUsed: string;
}

interface ConnectorConfig {
  connectionString: string;
  authentication: string;
  timeout: number;
  maxConnections: number;
  sslEnabled: boolean;
}

interface ConnectorUsage {
  connections: number;
  queries: number;
  dataTransferred: number;
  errors: number;
  lastQuery: string;
}

interface IntegrationMarketplace {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'communication' | 'development' | 'analytics';
  status: 'published' | 'draft' | 'archived';
  rating: number;
  downloads: number;
  price: number;
  currency: string;
  developer: string;
  lastUpdated: string;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  requirements: string[];
  steps: IntegrationStep[];
}

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  type: 'configuration' | 'authentication' | 'mapping' | 'testing';
  status: 'pending' | 'completed' | 'failed';
  estimatedTime: number;
}

interface APIGateway {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'offline';
  routes: GatewayRoute[];
  policies: GatewayPolicy[];
  metrics: GatewayMetrics;
}

interface GatewayRoute {
  id: string;
  path: string;
  target: string;
  method: string;
  status: 'active' | 'inactive';
  requests: number;
  errors: number;
  lastRequest: string;
}

interface GatewayPolicy {
  id: string;
  name: string;
  type: 'rate_limit' | 'authentication' | 'cors' | 'logging';
  status: 'active' | 'inactive';
  configuration: string;
}

interface GatewayMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeConnections: number;
}

export default function EnterpriseIntegrationPlatform() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'api_management' | 'webhooks' | 'connectors' | 'marketplace' | 'gateway'>('overview');
  const [apiManagement, setApiManagement] = useState<APIManagement[]>([]);
  const [webhookSystem, setWebhookSystem] = useState<WebhookSystem[]>([]);
  const [customConnectors, setCustomConnectors] = useState<CustomConnector[]>([]);
  const [marketplace, setMarketplace] = useState<IntegrationMarketplace[]>([]);
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([]);
  const [apiGateway, setApiGateway] = useState<APIGateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnterpriseData();
  }, []);

  const loadEnterpriseData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockApiManagement: APIManagement[] = [
        {
          id: '1',
          name: 'CodePal Core API',
          version: 'v2.1.0',
          status: 'active',
          endpoints: [
            {
              id: '1',
              path: '/api/v2/users',
              method: 'GET',
              description: 'Retrieve user information',
              status: 'active',
              responseTime: 125,
              successRate: 99.8,
              calls: 15420,
              lastCall: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              path: '/api/v2/projects',
              method: 'POST',
              description: 'Create new project',
              status: 'active',
              responseTime: 85,
              successRate: 99.9,
              calls: 8920,
              lastCall: '2024-01-15T09:45:00Z'
            }
          ],
          documentation: {
            version: '2.1.0',
            lastUpdated: '2024-01-15T10:00:00Z',
            examples: [
              {
                id: '1',
                title: 'Get User Profile',
                description: 'Retrieve user profile information',
                code: 'curl -X GET "https://api.codepal.com/v2/users/me" -H "Authorization: Bearer YOUR_TOKEN"',
                language: 'curl'
              }
            ],
            schemas: [
              {
                id: '1',
                name: 'User',
                type: 'response',
                schema: '{"id": "string", "name": "string", "email": "string"}',
                description: 'User object schema'
              }
            ]
          },
          rateLimits: {
            requestsPerMinute: 1000,
            requestsPerHour: 50000,
            requestsPerDay: 1000000,
            currentUsage: 450,
            resetTime: '2024-01-15T10:01:00Z'
          },
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockWebhookSystem: WebhookSystem[] = [
        {
          id: '1',
          name: 'User Activity Webhook',
          url: 'https://webhook.site/codepal-user-activity',
          events: [
            {
              id: '1',
              name: 'User Created',
              type: 'user.created',
              description: 'Triggered when a new user is created',
              payload: '{"user_id": "string", "email": "string", "created_at": "datetime"}',
              triggers: 1250,
              lastTriggered: '2024-01-15T10:00:00Z'
            }
          ],
          status: 'active',
          retryPolicy: {
            maxRetries: 3,
            retryDelay: 5000,
            backoffMultiplier: 2,
            currentRetries: 0
          },
          lastTriggered: '2024-01-15T10:00:00Z',
          successRate: 99.5
        }
      ];

      const mockCustomConnectors: CustomConnector[] = [
        {
          id: '1',
          name: 'PostgreSQL Connector',
          description: 'Connect to PostgreSQL databases',
          category: 'database',
          status: 'active',
          configuration: {
            connectionString: 'postgresql://user:pass@localhost:5432/db',
            authentication: 'password',
            timeout: 30000,
            maxConnections: 10,
            sslEnabled: true
          },
          usage: {
            connections: 5,
            queries: 1250,
            dataTransferred: 5000000,
            errors: 2,
            lastQuery: '2024-01-15T10:00:00Z'
          },
          lastUsed: '2024-01-15T10:00:00Z'
        }
      ];

      const mockMarketplace: IntegrationMarketplace[] = [
        {
          id: '1',
          name: 'Slack Integration',
          description: 'Send notifications to Slack channels',
          category: 'communication',
          status: 'published',
          rating: 4.8,
          downloads: 1250,
          price: 0,
          currency: 'USD',
          developer: 'CodePal Team',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'GitHub Actions Connector',
          description: 'Integrate with GitHub Actions workflows',
          category: 'development',
          status: 'published',
          rating: 4.9,
          downloads: 890,
          price: 0,
          currency: 'USD',
          developer: 'CodePal Team',
          lastUpdated: '2024-01-15T09:30:00Z'
        }
      ];

      const mockTemplates: IntegrationTemplate[] = [
        {
          id: '1',
          name: 'CRM Integration Template',
          description: 'Template for integrating with CRM systems',
          category: 'business',
          complexity: 'medium',
          estimatedTime: '2-4 hours',
          requirements: ['API access', 'Authentication credentials', 'Data mapping'],
          steps: [
            {
              id: '1',
              title: 'Configure Authentication',
              description: 'Set up API credentials and authentication',
              type: 'authentication',
              status: 'pending',
              estimatedTime: 30
            },
            {
              id: '2',
              title: 'Map Data Fields',
              description: 'Define field mappings between systems',
              type: 'mapping',
              status: 'pending',
              estimatedTime: 60
            }
          ]
        }
      ];

      const mockApiGateway: APIGateway[] = [
        {
          id: '1',
          name: 'Main API Gateway',
          status: 'active',
          routes: [
            {
              id: '1',
              path: '/api/v2/*',
              target: 'backend-service',
              method: 'ALL',
              status: 'active',
              requests: 15420,
              errors: 25,
              lastRequest: '2024-01-15T10:00:00Z'
            }
          ],
          policies: [
            {
              id: '1',
              name: 'Rate Limiting',
              type: 'rate_limit',
              status: 'active',
              configuration: '{"limit": 1000, "window": "1m"}'
            }
          ],
          metrics: {
            totalRequests: 15420,
            successfulRequests: 15395,
            failedRequests: 25,
            averageResponseTime: 125,
            activeConnections: 150
          }
        }
      ];

      setApiManagement(mockApiManagement);
      setWebhookSystem(mockWebhookSystem);
      setCustomConnectors(mockCustomConnectors);
      setMarketplace(mockMarketplace);
      setTemplates(mockTemplates);
      setApiGateway(mockApiGateway);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'draft':
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'deprecated':
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Endpoints</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {apiManagement.flatMap(a => a.endpoints).filter(e => e.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Active endpoints</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Webhooks</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {webhookSystem.filter(w => w.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Active webhooks</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connectors</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {customConnectors.filter(c => c.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Active connectors</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {marketplace.filter(m => m.status === 'published').length}
          </div>
          <p className="text-sm text-gray-600">Published integrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">API Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {apiManagement.flatMap(a => a.endpoints).slice(0, 5).map(endpoint => (
                <div key={endpoint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{endpoint.method} {endpoint.path}</h4>
                    <p className="text-sm text-gray-600">{endpoint.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{endpoint.responseTime}ms</div>
                    <div className="text-sm text-gray-600">{endpoint.successRate}% success</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Popular Integrations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {marketplace.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">{item.downloads} downloads</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIManagement = () => (
    <div className="space-y-6">
      {apiManagement.map(api => (
        <div key={api.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
                <p className="text-sm text-gray-600">Version {api.version}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(api.status)}`}>
                  {api.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Endpoints</h4>
                <div className="space-y-3">
                  {api.endpoints.map(endpoint => (
                    <div key={endpoint.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{endpoint.method} {endpoint.path}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(endpoint.status)}`}>
                          {endpoint.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Response:</span>
                          <span className="ml-1 font-medium">{endpoint.responseTime}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Success:</span>
                          <span className="ml-1 font-medium">{endpoint.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Rate Limits</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Per Minute</span>
                      <span className="font-medium">{api.rateLimits.requestsPerMinute}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(api.rateLimits.currentUsage / api.rateLimits.requestsPerMinute) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Per Hour</span>
                      <span className="font-medium">{api.rateLimits.requestsPerHour.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Per Day</span>
                      <span className="font-medium">{api.rateLimits.requestsPerDay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Documentation</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">Version {api.documentation.version}</h5>
                    <p className="text-sm text-gray-600">Last updated: {new Date(api.documentation.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">{api.documentation.examples.length} Examples</h5>
                    <p className="text-sm text-gray-600">Code samples available</p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">{api.documentation.schemas.length} Schemas</h5>
                    <p className="text-sm text-gray-600">API schemas defined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      {webhookSystem.map(webhook => (
        <div key={webhook.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                <p className="text-sm text-gray-600">{webhook.url}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(webhook.status)}`}>
                  {webhook.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">{webhook.successRate}% success</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Events</h4>
                <div className="space-y-3">
                  {webhook.events.map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900">{event.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Triggers:</span>
                          <span className="ml-1 font-medium">{event.triggers.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last:</span>
                          <span className="ml-1 font-medium">{new Date(event.lastTriggered).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Retry Policy</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Max Retries</span>
                      <span className="font-medium">{webhook.retryPolicy.maxRetries}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Retry Delay</span>
                      <span className="font-medium">{webhook.retryPolicy.retryDelay}ms</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Backoff Multiplier</span>
                      <span className="font-medium">{webhook.retryPolicy.backoffMultiplier}x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderConnectors = () => (
    <div className="space-y-6">
      {customConnectors.map(connector => (
        <div key={connector.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{connector.name}</h3>
                <p className="text-sm text-gray-600">{connector.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(connector.status)}`}>
                  {connector.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Timeout:</span>
                        <span className="ml-1 font-medium">{connector.configuration.timeout}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Connections:</span>
                        <span className="ml-1 font-medium">{connector.configuration.maxConnections}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">SSL:</span>
                        <span className="ml-1 font-medium">{connector.configuration.sslEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Usage Statistics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Active Connections</span>
                      <span className="font-medium">{connector.usage.connections}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Total Queries</span>
                      <span className="font-medium">{connector.usage.queries.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Data Transferred</span>
                      <span className="font-medium">{(connector.usage.dataTransferred / 1000000).toFixed(2)}MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Integration Marketplace</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplace.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{item.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{item.downloads} downloads</div>
                  <div className="text-sm font-medium">
                    {item.price === 0 ? 'Free' : `$${item.price}`}
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Install
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGateway = () => (
    <div className="space-y-6">
      {apiGateway.map(gateway => (
        <div key={gateway.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{gateway.name}</h3>
                <p className="text-sm text-gray-600">API Gateway</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(gateway.status)}`}>
                  {gateway.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Routes</h4>
                <div className="space-y-3">
                  {gateway.routes.map(route => (
                    <div key={route.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{route.path}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(route.status)}`}>
                          {route.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <span className="ml-1 font-medium">{route.target}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Requests:</span>
                          <span className="ml-1 font-medium">{route.requests.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Policies</h4>
                <div className="space-y-3">
                  {gateway.policies.map(policy => (
                    <div key={policy.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{policy.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(policy.status)}`}>
                          {policy.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{policy.type}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">{gateway.metrics.totalRequests.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium">
                        {((gateway.metrics.successfulRequests / gateway.metrics.totalRequests) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Avg Response Time</span>
                      <span className="font-medium">{gateway.metrics.averageResponseTime}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enterprise data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Integration Platform</h1>
          <p className="text-gray-600 mt-2">
            API management, webhook system, custom connector framework, and integration marketplace
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'api_management', label: 'API Management' },
              { id: 'webhooks', label: 'Webhooks' },
              { id: 'connectors', label: 'Connectors' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'gateway', label: 'API Gateway' }
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
          {activeTab === 'api_management' && renderAPIManagement()}
          {activeTab === 'webhooks' && renderWebhooks()}
          {activeTab === 'connectors' && renderConnectors()}
          {activeTab === 'marketplace' && renderMarketplace()}
          {activeTab === 'gateway' && renderGateway()}
        </div>
      </div>
    </div>
  );
} 