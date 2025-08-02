// Enterprise SSO Integration for CodePal
// Features: SAML 2.0, OpenID Connect, enterprise identity providers

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oidc' | 'oauth';
  status: 'active' | 'inactive' | 'configuring';
  config: SSOConfig;
  metadata?: SSOMetadata;
  createdAt: string;
  updatedAt: string;
}

interface SSOConfig {
  // SAML Configuration
  entityId?: string;
  ssoUrl?: string;
  sloUrl?: string;
  x509Certificate?: string;
  privateKey?: string;
  
  // OIDC Configuration
  clientId?: string;
  clientSecret?: string;
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
  
  // General Configuration
  nameIdFormat?: string;
  signatureAlgorithm?: string;
  digestAlgorithm?: string;
  forceAuthn?: boolean;
  allowCreate?: boolean;
  relayState?: string;
  
  // Attribute Mapping
  attributeMapping: {
    email?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    groups?: string;
    roles?: string;
  };
  
  // Advanced Settings
  advanced: {
    enableSLO: boolean;
    enableForceAuthn: boolean;
    enableNameIdPolicy: boolean;
    enableRequestedAuthnContext: boolean;
    enableRelayState: boolean;
    enableAudienceRestriction: boolean;
    enableDelegation: boolean;
  };
}

interface SSOMetadata {
  entityId: string;
  ssoUrl: string;
  sloUrl?: string;
  x509Certificate: string;
  nameIdFormat: string;
  supportedProtocols: string[];
  organization?: {
    name: string;
    displayName: string;
    url: string;
  };
  contactPerson?: {
    givenName: string;
    emailAddress: string;
    contactType: string;
  };
}

interface SSOSession {
  id: string;
  userId: string;
  providerId: string;
  sessionIndex: string;
  nameId: string;
  nameIdFormat: string;
  notOnOrAfter: string;
  createdAt: string;
  lastActivity: string;
}

interface SSOEvent {
  id: string;
  type: 'login' | 'logout' | 'error' | 'config_change';
  providerId: string;
  userId?: string;
  details: {
    ipAddress: string;
    userAgent: string;
    success: boolean;
    errorMessage?: string;
    attributes?: Record<string, any>;
  };
  timestamp: string;
}

interface Organization {
  id: string;
  name: string;
  domain: string;
  ssoEnabled: boolean;
  defaultProvider?: string;
  allowedProviders: string[];
  settings: {
    enforceSSO: boolean;
    allowLocalAuth: boolean;
    autoProvisionUsers: boolean;
    syncGroups: boolean;
    syncRoles: boolean;
    sessionTimeout: number;
    maxSessions: number;
  };
}

export default function SSOIntegration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [sessions, setSessions] = useState<SSOSession[]>([]);
  const [events, setEvents] = useState<SSOEvent[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<SSOProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Load SSO data
  useEffect(() => {
    loadSSOData();
  }, []);

  const loadSSOData = async () => {
    setIsLoading(true);
    try {
      // Load SSO providers
      const providersResponse = await fetch('/api/enterprise/sso/providers');
      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setProviders(providersData);
      }

      // Load active sessions
      const sessionsResponse = await fetch('/api/enterprise/sso/sessions');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
      }

      // Load SSO events
      const eventsResponse = await fetch('/api/enterprise/sso/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }

      // Load organizations
      const orgsResponse = await fetch('/api/enterprise/organizations');
      if (orgsResponse.ok) {
        const orgsData = await orgsResponse.json();
        setOrganizations(orgsData);
      }
    } catch (error) {
      console.error('Failed to load SSO data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Provider Management
  const createProvider = async (providerData: Omit<SSOProvider, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/enterprise/sso/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData)
      });

      if (response.ok) {
        const newProvider = await response.json();
        setProviders(prev => [...prev, newProvider]);
      }
    } catch (error) {
      console.error('Failed to create SSO provider:', error);
    }
  };

  const updateProvider = async (providerId: string, updates: Partial<SSOProvider>) => {
    try {
      const response = await fetch(`/api/enterprise/sso/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedProvider = await response.json();
        setProviders(prev => prev.map(provider => provider.id === providerId ? updatedProvider : provider));
      }
    } catch (error) {
      console.error('Failed to update SSO provider:', error);
    }
  };

  const deleteProvider = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this SSO provider? This will affect all users using this provider.')) {
      return;
    }

    try {
      const response = await fetch(`/api/enterprise/sso/providers/${providerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProviders(prev => prev.filter(provider => provider.id !== providerId));
      }
    } catch (error) {
      console.error('Failed to delete SSO provider:', error);
    }
  };

  // Test SSO Configuration
  const testProvider = async (providerId: string) => {
    try {
      const response = await fetch(`/api/enterprise/sso/providers/${providerId}/test`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        setTestResult(result);
      }
    } catch (error) {
      console.error('Failed to test SSO provider:', error);
    }
  };

  // Generate SAML Metadata
  const generateMetadata = async (providerId: string) => {
    try {
      const response = await fetch(`/api/enterprise/sso/providers/${providerId}/metadata`);
      if (response.ok) {
        const metadata = await response.text();
        // Download metadata file
        const blob = new Blob([metadata], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saml-metadata-${providerId}.xml`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate metadata:', error);
    }
  };

  // Get provider type icon
  const getProviderTypeIcon = (type: string) => {
    switch (type) {
      case 'saml': return '🔐';
      case 'oidc': return '🔑';
      case 'oauth': return '🔒';
      default: return '⚙️';
    }
  };

  // Get provider status color
  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-red-400';
      case 'configuring': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const SSOOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">SSO Providers</h3>
          <div className="text-3xl font-bold text-blue-400">{providers.length}</div>
          <p className="text-gray-400 text-sm">Active configurations</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Active Sessions</h3>
          <div className="text-3xl font-bold text-green-400">{sessions.length}</div>
          <p className="text-gray-400 text-sm">Current SSO sessions</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Organizations</h3>
          <div className="text-3xl font-bold text-purple-400">
            {organizations.filter(org => org.ssoEnabled).length}
          </div>
          <p className="text-gray-400 text-sm">with SSO enabled</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Recent Events</h3>
          <div className="text-3xl font-bold text-orange-400">{events.length}</div>
          <p className="text-gray-400 text-sm">Last 24 hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Provider Status</h3>
          <div className="space-y-3">
            {providers.map(provider => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getProviderTypeIcon(provider.type)}</span>
                  <div>
                    <div className="text-gray-300 font-medium">{provider.name}</div>
                    <div className="text-gray-400 text-sm">{provider.type.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${getProviderStatusColor(provider.status)}`}>
                    {provider.status}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(provider.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Recent SSO Events</h3>
          <div className="space-y-3">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-300 font-medium">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </div>
                  <div className="text-gray-400 text-sm">{event.details.ipAddress}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${event.details.success ? 'text-green-400' : 'text-red-400'}`}>
                    {event.details.success ? 'Success' : 'Failed'}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProviderManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">SSO Provider Management</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('create-saml')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Add SAML Provider
          </button>
          <button
            onClick={() => setActiveTab('create-oidc')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Add OIDC Provider
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map(provider => (
          <div
            key={provider.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setSelectedProvider(provider)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getProviderTypeIcon(provider.type)}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white">{provider.name}</h4>
                  <p className="text-gray-400 text-sm">{provider.type.toUpperCase()}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                provider.status === 'active' ? 'bg-green-900 text-green-200' :
                provider.status === 'inactive' ? 'bg-red-900 text-red-200' :
                'bg-yellow-900 text-yellow-200'
              }`}>
                {provider.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-gray-300">{provider.type.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Entity ID:</span>
                <span className="text-gray-300 text-xs truncate max-w-32">
                  {provider.config.entityId || provider.config.issuer || 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Updated:</span>
                <span className="text-gray-300 text-xs">
                  {new Date(provider.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  testProvider(provider.id);
                }}
                className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                Test
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  generateMetadata(provider.id);
                }}
                className="flex-1 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded"
              >
                Metadata
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProvider(provider);
                  setActiveTab('edit-provider');
                }}
                className="flex-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProvider(provider.id);
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

  const SessionManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Active SSO Sessions</h3>
        <button
          onClick={() => loadSSOData()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">User</th>
                <th className="text-left text-gray-300 py-3 px-4">Provider</th>
                <th className="text-left text-gray-300 py-3 px-4">Session Index</th>
                <th className="text-left text-gray-300 py-3 px-4">Name ID</th>
                <th className="text-left text-gray-300 py-3 px-4">Created</th>
                <th className="text-left text-gray-300 py-3 px-4">Last Activity</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4">
                    <div className="text-gray-300 font-medium">{session.userId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300">{session.providerId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 text-xs font-mono">{session.sessionIndex}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 text-xs font-mono">{session.nameId}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(session.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(session.lastActivity).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        // Terminate session
                        fetch(`/api/enterprise/sso/sessions/${session.id}`, {
                          method: 'DELETE'
                        }).then(() => loadSSOData());
                      }}
                      className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const EventLog = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">SSO Event Log</h3>
        <div className="flex items-center space-x-2">
          <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600">
            <option value="">All Events</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="error">Error</option>
            <option value="config_change">Config Change</option>
          </select>
          <button
            onClick={() => loadSSOData()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">Timestamp</th>
                <th className="text-left text-gray-300 py-3 px-4">Event Type</th>
                <th className="text-left text-gray-300 py-3 px-4">Provider</th>
                <th className="text-left text-gray-300 py-3 px-4">User</th>
                <th className="text-left text-gray-300 py-3 px-4">IP Address</th>
                <th className="text-left text-gray-300 py-3 px-4">Status</th>
                <th className="text-left text-gray-300 py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.type === 'login' ? 'bg-green-900 text-green-200' :
                      event.type === 'logout' ? 'bg-blue-900 text-blue-200' :
                      event.type === 'error' ? 'bg-red-900 text-red-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{event.providerId}</td>
                  <td className="py-3 px-4 text-gray-300">{event.userId || '-'}</td>
                  <td className="py-3 px-4 text-gray-300 text-xs">{event.details.ipAddress}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.details.success ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {event.details.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        // Show event details modal
                        alert(JSON.stringify(event.details, null, 2));
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading SSO integration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Enterprise SSO Integration</h1>
        <p className="text-gray-300">Single Sign-On configuration for enterprise identity providers</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'providers', label: 'Providers', icon: '🔐' },
            { id: 'sessions', label: 'Sessions', icon: '👥' },
            { id: 'events', label: 'Event Log', icon: '📝' },
            { id: 'organizations', label: 'Organizations', icon: '🏢' },
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
        {activeTab === 'overview' && <SSOOverview />}
        {activeTab === 'providers' && <ProviderManagement />}
        {activeTab === 'sessions' && <SessionManagement />}
        {activeTab === 'events' && <EventLog />}
        {activeTab === 'organizations' && (
          <div className="text-gray-300">
            Organization SSO settings will be implemented here.
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-gray-300">
            Global SSO settings will be implemented here.
          </div>
        )}
      </div>

      {/* Test Result Modal */}
      {testResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">SSO Test Results</h3>
              <button
                onClick={() => setTestResult(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="text-gray-300 text-sm overflow-auto max-h-96">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 