// Enterprise API Management Platform for CodePal
// Features: API versioning, rate limiting, documentation, monitoring, webhooks

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  version: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  rateLimit: RateLimit;
  authentication: AuthenticationType[];
  status: 'active' | 'deprecated' | 'beta' | 'internal';
  createdAt: string;
  updatedAt: string;
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

interface APIResponse {
  code: number;
  description: string;
  schema: any;
  examples: {
    [contentType: string]: any;
  };
}

interface RateLimit {
  requests: number;
  window: string; // e.g., "1m", "1h", "1d"
  burst: number;
  scope: 'user' | 'ip' | 'global';
}

type AuthenticationType = 'api_key' | 'bearer' | 'oauth2' | 'saml' | 'none';

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  rateLimit: RateLimit;
  status: 'active' | 'inactive' | 'expired';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive' | 'failed';
  retryCount: number;
  maxRetries: number;
  timeout: number;
  createdAt: string;
  lastTriggered?: string;
  lastSuccess?: string;
  lastFailure?: string;
}

interface APIMetric {
  id: string;
  endpointId: string;
  timestamp: string;
  requests: number;
  responses: {
    [statusCode: string]: number;
  };
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  errors: number;
  bandwidth: number;
}

interface APIVersion {
  id: string;
  version: string;
  status: 'current' | 'deprecated' | 'sunset';
  releaseDate: string;
  sunsetDate?: string;
  changelog: string;
  breakingChanges: boolean;
  migrationGuide?: string;
}

interface APIDocumentation {
  id: string;
  version: string;
  content: string;
  format: 'markdown' | 'html' | 'openapi';
  sections: DocumentationSection[];
  lastUpdated: string;
}

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  order: number;
  parentId?: string;
}

export default function APIManagement() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [metrics, setMetrics] = useState<APIMetric[]>([]);
  const [versions, setVersions] = useState<APIVersion[]>([]);
  const [documentation, setDocumentation] = useState<APIDocumentation[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedVersion, setSelectedVersion] = useState('v1');

  // Load API data
  useEffect(() => {
    loadAPIData();
  }, [timeRange, selectedVersion]);

  const loadAPIData = async () => {
    setIsLoading(true);
    try {
      // Load endpoints
      const endpointsResponse = await fetch(`/api/enterprise/api/endpoints?version=${selectedVersion}`);
      if (endpointsResponse.ok) {
        const endpointsData = await endpointsResponse.json();
        setEndpoints(endpointsData);
      }

      // Load API keys
      const keysResponse = await fetch('/api/enterprise/api/keys');
      if (keysResponse.ok) {
        const keysData = await keysResponse.json();
        setApiKeys(keysData);
      }

      // Load webhooks
      const webhooksResponse = await fetch('/api/enterprise/api/webhooks');
      if (webhooksResponse.ok) {
        const webhooksData = await webhooksResponse.json();
        setWebhooks(webhooksData);
      }

      // Load metrics
      const metricsResponse = await fetch(`/api/enterprise/api/metrics?timeRange=${timeRange}`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      // Load versions
      const versionsResponse = await fetch('/api/enterprise/api/versions');
      if (versionsResponse.ok) {
        const versionsData = await versionsResponse.json();
        setVersions(versionsData);
      }

      // Load documentation
      const docsResponse = await fetch(`/api/enterprise/api/documentation?version=${selectedVersion}`);
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setDocumentation(docsData);
      }
    } catch (error) {
      console.error('Failed to load API data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API Key Management
  const createAPIKey = async (keyData: Omit<APIKey, 'id' | 'key' | 'prefix' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/enterprise/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData)
      });

      if (response.ok) {
        const newKey = await response.json();
        setApiKeys(prev => [...prev, newKey]);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const revokeAPIKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/enterprise/api/keys/${keyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  // Webhook Management
  const createWebhook = async (webhookData: Omit<Webhook, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/enterprise/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        const newWebhook = await response.json();
        setWebhooks(prev => [...prev, newWebhook]);
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const testWebhook = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/enterprise/api/webhooks/${webhookId}/test`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Webhook test result: ${result.success ? 'Success' : 'Failed'}`);
      }
    } catch (error) {
      console.error('Failed to test webhook:', error);
    }
  };

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-900 text-green-200';
      case 'POST': return 'bg-blue-900 text-blue-200';
      case 'PUT': return 'bg-yellow-900 text-yellow-200';
      case 'DELETE': return 'bg-red-900 text-red-200';
      case 'PATCH': return 'bg-purple-900 text-purple-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'deprecated': return 'text-yellow-400';
      case 'beta': return 'text-blue-400';
      case 'internal': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const APIOverview = () => (
    <div className="space-y-6">
      {/* Version and Time Range Selectors */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">API Overview</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            {versions.map(version => (
              <option key={version.id} value={version.version}>{version.version}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Total Endpoints</h3>
          <div className="text-3xl font-bold text-blue-400">{endpoints.length}</div>
          <p className="text-gray-400 text-sm">Active API endpoints</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">API Keys</h3>
          <div className="text-3xl font-bold text-green-400">
            {apiKeys.filter(key => key.status === 'active').length}
          </div>
          <p className="text-gray-400 text-sm">Active keys</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Webhooks</h3>
          <div className="text-3xl font-bold text-purple-400">
            {webhooks.filter(webhook => webhook.status === 'active').length}
          </div>
          <p className="text-gray-400 text-sm">Active webhooks</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Total Requests</h3>
          <div className="text-3xl font-bold text-orange-400">
            {metrics.reduce((sum, metric) => sum + metric.requests, 0).toLocaleString()}
          </div>
          <p className="text-gray-400 text-sm">Last {timeRange}</p>
        </div>
      </div>

      {/* Endpoint Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Top Endpoints</h3>
          <div className="space-y-3">
            {endpoints.slice(0, 5).map(endpoint => (
              <div key={endpoint.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="text-gray-300 font-mono text-sm">{endpoint.path}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${getStatusColor(endpoint.status)}`}>
                    {endpoint.status}
                  </div>
                  <div className="text-gray-400 text-xs">{endpoint.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">API Performance</h3>
          <div className="space-y-4">
            {metrics.slice(0, 5).map(metric => (
              <div key={metric.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-300 font-medium">
                    {endpoints.find(e => e.id === metric.endpointId)?.path || 'Unknown'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {metric.requests.toLocaleString()} requests
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-300 font-semibold">
                    {metric.responseTime.avg.toFixed(0)}ms
                  </div>
                  <div className="text-gray-400 text-xs">
                    {metric.errors} errors
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EndpointManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">API Endpoints</h3>
        <button
          onClick={() => setActiveTab('create-endpoint')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add Endpoint
        </button>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">Method</th>
                <th className="text-left text-gray-300 py-3 px-4">Path</th>
                <th className="text-left text-gray-300 py-3 px-4">Version</th>
                <th className="text-left text-gray-300 py-3 px-4">Status</th>
                <th className="text-left text-gray-300 py-3 px-4">Rate Limit</th>
                <th className="text-left text-gray-300 py-3 px-4">Auth</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(endpoint => (
                <tr key={endpoint.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-300 font-mono">{endpoint.path}</div>
                      <div className="text-gray-400 text-xs">{endpoint.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{endpoint.version}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${getStatusColor(endpoint.status)}`}>
                      {endpoint.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">
                    {endpoint.rateLimit.requests}/{endpoint.rateLimit.window}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {endpoint.authentication.map(auth => (
                        <span key={auth} className="px-1 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                          {auth}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setActiveTab('view-endpoint');
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setActiveTab('edit-endpoint');
                        }}
                        className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setActiveTab('test-endpoint');
                        }}
                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                      >
                        Test
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const APIKeyManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">API Keys</h3>
        <button
          onClick={() => setActiveTab('create-key')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Generate Key
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiKeys.map(key => (
          <div
            key={key.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{key.name}</h4>
                <p className="text-gray-400 text-sm">Prefix: {key.prefix}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                key.status === 'active' ? 'bg-green-900 text-green-200' :
                key.status === 'inactive' ? 'bg-gray-900 text-gray-200' :
                'bg-red-900 text-red-200'
              }`}>
                {key.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-300 text-xs">
                  {new Date(key.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Used:</span>
                <span className="text-gray-300 text-xs">
                  {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rate Limit:</span>
                <span className="text-gray-300 text-xs">
                  {key.rateLimit.requests}/{key.rateLimit.window}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(key.key);
                  alert('API key copied to clipboard!');
                }}
                className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                Copy Key
              </button>
              <button
                onClick={() => revokeAPIKey(key.id)}
                className="flex-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const WebhookManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Webhooks</h3>
        <button
          onClick={() => setActiveTab('create-webhook')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add Webhook
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webhooks.map(webhook => (
          <div
            key={webhook.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{webhook.name}</h4>
                <p className="text-gray-400 text-sm font-mono">{webhook.url}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                webhook.status === 'active' ? 'bg-green-900 text-green-200' :
                webhook.status === 'inactive' ? 'bg-gray-900 text-gray-200' :
                'bg-red-900 text-red-200'
              }`}>
                {webhook.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Events:</span>
                <span className="text-gray-300 text-xs">
                  {webhook.events.length} events
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Retries:</span>
                <span className="text-gray-300 text-xs">
                  {webhook.retryCount}/{webhook.maxRetries}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Triggered:</span>
                <span className="text-gray-300 text-xs">
                  {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => testWebhook(webhook.id)}
                className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                Test
              </button>
              <button
                onClick={() => {
                  setActiveTab('edit-webhook');
                }}
                className="flex-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  // Delete webhook
                }}
                className="flex-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Documentation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">API Documentation</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            {versions.map(version => (
              <option key={version.id} value={version.version}>{version.version}</option>
            ))}
          </select>
          <button
            onClick={() => setActiveTab('edit-docs')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Edit Docs
          </button>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        {documentation.length > 0 ? (
          <div className="prose prose-invert max-w-none">
            {documentation.map(doc => (
              <div key={doc.id} className="mb-8">
                <h2 className="text-white text-2xl font-bold mb-4">API Documentation - {doc.version}</h2>
                <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: doc.content }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 text-center py-8">
            <p>No documentation available for this version.</p>
            <button
              onClick={() => setActiveTab('create-docs')}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Create Documentation
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading API management...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">API Management Platform</h1>
        <p className="text-gray-300">Enterprise API management with versioning, rate limiting, and monitoring</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'endpoints', label: 'Endpoints', icon: '🔗' },
            { id: 'keys', label: 'API Keys', icon: '🔑' },
            { id: 'webhooks', label: 'Webhooks', icon: '🔔' },
            { id: 'documentation', label: 'Documentation', icon: '📚' },
            { id: 'monitoring', label: 'Monitoring', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        {activeTab === 'overview' && <APIOverview />}
        {activeTab === 'endpoints' && <EndpointManagement />}
        {activeTab === 'keys' && <APIKeyManagement />}
        {activeTab === 'webhooks' && <WebhookManagement />}
        {activeTab === 'documentation' && <Documentation />}
        {activeTab === 'monitoring' && (
          <div className="text-gray-300">
            API monitoring and analytics will be implemented here.
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-gray-300">
            API settings and configuration will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
} 