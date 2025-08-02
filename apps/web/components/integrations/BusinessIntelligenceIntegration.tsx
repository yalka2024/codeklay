// Business Intelligence Integration for CodePal
// Features: Tableau, Power BI, Looker, Google Analytics, Mixpanel, Salesforce, HubSpot, custom APIs

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface BIPlatform {
  id: string;
  name: string;
  type: 'tableau' | 'powerbi' | 'looker' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  dashboards: Dashboard[];
  dataSources: DataSource[];
  users: BIUser[];
  lastSync: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  views: number;
  lastViewed: string;
  owner: string;
  tags: string[];
  refreshSchedule: string;
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'streaming';
  status: 'connected' | 'disconnected' | 'error';
  lastRefresh: string;
  rowCount: number;
  size: number;
  refreshSchedule: string;
}

interface BIUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'viewer';
  lastAccess: string;
  dashboards: number;
  permissions: string[];
}

interface AnalyticsPlatform {
  id: string;
  name: string;
  type: 'google_analytics' | 'mixpanel' | 'amplitude' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  metrics: AnalyticsMetric[];
  events: AnalyticsEvent[];
  audiences: AnalyticsAudience[];
  lastSync: string;
}

interface AnalyticsMetric {
  id: string;
  name: string;
  type: 'pageview' | 'event' | 'conversion' | 'custom';
  value: number;
  change: number;
  period: 'day' | 'week' | 'month' | 'quarter';
  lastUpdated: string;
}

interface AnalyticsEvent {
  id: string;
  name: string;
  category: string;
  action: string;
  label: string;
  count: number;
  uniqueUsers: number;
  lastOccurred: string;
}

interface AnalyticsAudience {
  id: string;
  name: string;
  description: string;
  size: number;
  criteria: string[];
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface CRMSystem {
  id: string;
  name: string;
  type: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  contacts: CRMContact[];
  deals: CRMDeal[];
  activities: CRMActivity[];
  pipelines: CRMPipeline[];
  lastSync: string;
}

interface CRMContact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  lastContact: string;
  value: number;
  tags: string[];
}

interface CRMDeal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  closeDate: string;
  owner: string;
  contacts: string[];
  lastActivity: string;
}

interface CRMActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task';
  subject: string;
  contact: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  notes: string;
}

interface CRMPipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  totalValue: number;
  activeDeals: number;
  conversionRate: number;
}

interface PipelineStage {
  id: string;
  name: string;
  deals: number;
  value: number;
  conversionRate: number;
}

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  responseTime: number;
  successRate: number;
  lastCall: string;
  documentation: string;
}

interface DataIntegration {
  id: string;
  name: string;
  source: string;
  destination: string;
  type: 'etl' | 'real_time' | 'batch';
  status: 'running' | 'stopped' | 'error';
  lastRun: string;
  nextRun: string;
  recordsProcessed: number;
  successRate: number;
}

export default function BusinessIntelligenceIntegration() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'bi_platforms' | 'analytics' | 'crm' | 'apis' | 'integrations'>('overview');
  const [biPlatforms, setBiPlatforms] = useState<BIPlatform[]>([]);
  const [analyticsPlatforms, setAnalyticsPlatforms] = useState<AnalyticsPlatform[]>([]);
  const [crmSystems, setCrmSystems] = useState<CRMSystem[]>([]);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);
  const [dataIntegrations, setDataIntegrations] = useState<DataIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBIData();
  }, []);

  const loadBIData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockBiPlatforms: BIPlatform[] = [
        {
          id: '1',
          name: 'Tableau',
          type: 'tableau',
          status: 'connected',
          dashboards: [
            {
              id: '1',
              name: 'CodePal Performance Dashboard',
              description: 'Comprehensive view of platform performance metrics',
              status: 'active',
              views: 1250,
              lastViewed: '2024-01-15T10:00:00Z',
              owner: 'analytics@codepal.com',
              tags: ['performance', 'metrics', 'kpi'],
              refreshSchedule: 'Daily at 6 AM'
            },
            {
              id: '2',
              name: 'User Engagement Analytics',
              description: 'User behavior and engagement patterns',
              status: 'active',
              views: 890,
              lastViewed: '2024-01-15T09:30:00Z',
              owner: 'product@codepal.com',
              tags: ['engagement', 'users', 'behavior'],
              refreshSchedule: 'Real-time'
            }
          ],
          dataSources: [
            {
              id: '1',
              name: 'CodePal Database',
              type: 'database',
              status: 'connected',
              lastRefresh: '2024-01-15T06:00:00Z',
              rowCount: 1500000,
              size: 2500,
              refreshSchedule: 'Daily'
            }
          ],
          users: [
            {
              id: '1',
              name: 'Analytics Team',
              email: 'analytics@codepal.com',
              role: 'admin',
              lastAccess: '2024-01-15T10:00:00Z',
              dashboards: 5,
              permissions: ['read', 'write', 'admin']
            }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockAnalyticsPlatforms: AnalyticsPlatform[] = [
        {
          id: '1',
          name: 'Google Analytics',
          type: 'google_analytics',
          status: 'connected',
          metrics: [
            {
              id: '1',
              name: 'Active Users',
              type: 'custom',
              value: 15420,
              change: 12.5,
              period: 'day',
              lastUpdated: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: 'Page Views',
              type: 'pageview',
              value: 89250,
              change: 8.3,
              period: 'day',
              lastUpdated: '2024-01-15T10:00:00Z'
            },
            {
              id: '3',
              name: 'Conversion Rate',
              type: 'conversion',
              value: 3.2,
              change: -0.5,
              period: 'day',
              lastUpdated: '2024-01-15T10:00:00Z'
            }
          ],
          events: [
            {
              id: '1',
              name: 'Code Analysis Started',
              category: 'engagement',
              action: 'start',
              label: 'code_analysis',
              count: 1250,
              uniqueUsers: 890,
              lastOccurred: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: 'Project Created',
              category: 'conversion',
              action: 'create',
              label: 'project',
              count: 45,
              uniqueUsers: 42,
              lastOccurred: '2024-01-15T09:45:00Z'
            }
          ],
          audiences: [
            {
              id: '1',
              name: 'Active Developers',
              description: 'Users who have performed code analysis in the last 30 days',
              size: 8500,
              criteria: ['code_analysis_events > 0', 'last_activity < 30_days'],
              lastUpdated: '2024-01-15T10:00:00Z',
              status: 'active'
            }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockCrmSystems: CRMSystem[] = [
        {
          id: '1',
          name: 'Salesforce',
          type: 'salesforce',
          status: 'connected',
          contacts: [
            {
              id: '1',
              name: 'John Smith',
              email: 'john.smith@techcorp.com',
              company: 'TechCorp Inc',
              status: 'prospect',
              source: 'website',
              lastContact: '2024-01-15T09:00:00Z',
              value: 50000,
              tags: ['enterprise', 'decision_maker']
            },
            {
              id: '2',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@startup.io',
              company: 'Startup.io',
              status: 'lead',
              source: 'referral',
              lastContact: '2024-01-14T16:30:00Z',
              value: 15000,
              tags: ['startup', 'early_adopter']
            }
          ],
          deals: [
            {
              id: '1',
              name: 'TechCorp Enterprise License',
              amount: 50000,
              stage: 'Proposal',
              probability: 75,
              closeDate: '2024-02-15',
              owner: 'sales@codepal.com',
              contacts: ['John Smith'],
              lastActivity: '2024-01-15T09:00:00Z'
            }
          ],
          activities: [
            {
              id: '1',
              type: 'call',
              subject: 'Product Demo',
              contact: 'John Smith',
              date: '2024-01-15T09:00:00Z',
              status: 'completed',
              notes: 'Demonstrated AI code analysis features'
            }
          ],
          pipelines: [
            {
              id: '1',
              name: 'Enterprise Sales',
              stages: [
                { id: '1', name: 'Lead', deals: 25, value: 125000, conversionRate: 20 },
                { id: '2', name: 'Qualified', deals: 15, value: 450000, conversionRate: 40 },
                { id: '3', name: 'Proposal', deals: 8, value: 320000, conversionRate: 60 },
                { id: '4', name: 'Negotiation', deals: 3, value: 150000, conversionRate: 80 },
                { id: '5', name: 'Closed Won', deals: 12, value: 480000, conversionRate: 100 }
              ],
              totalValue: 1525000,
              activeDeals: 51,
              conversionRate: 35
            }
          ],
          lastSync: '2024-01-15T10:00:00Z'
        }
      ];

      const mockCustomAPIs: CustomAPI[] = [
        {
          id: '1',
          name: 'CodePal Analytics API',
          endpoint: 'https://api.codepal.com/analytics',
          method: 'GET',
          status: 'active',
          responseTime: 125,
          successRate: 99.8,
          lastCall: '2024-01-15T10:00:00Z',
          documentation: 'https://docs.codepal.com/api/analytics'
        },
        {
          id: '2',
          name: 'User Management API',
          endpoint: 'https://api.codepal.com/users',
          method: 'POST',
          status: 'active',
          responseTime: 85,
          successRate: 99.9,
          lastCall: '2024-01-15T09:45:00Z',
          documentation: 'https://docs.codepal.com/api/users'
        }
      ];

      const mockDataIntegrations: DataIntegration[] = [
        {
          id: '1',
          name: 'Analytics to BI Pipeline',
          source: 'Google Analytics',
          destination: 'Tableau',
          type: 'etl',
          status: 'running',
          lastRun: '2024-01-15T06:00:00Z',
          nextRun: '2024-01-16T06:00:00Z',
          recordsProcessed: 150000,
          successRate: 99.5
        },
        {
          id: '2',
          name: 'CRM Real-time Sync',
          source: 'Salesforce',
          destination: 'CodePal Database',
          type: 'real_time',
          status: 'running',
          lastRun: '2024-01-15T10:00:00Z',
          nextRun: '2024-01-15T10:01:00Z',
          recordsProcessed: 2500,
          successRate: 99.8
        }
      ];

      setBiPlatforms(mockBiPlatforms);
      setAnalyticsPlatforms(mockAnalyticsPlatforms);
      setCrmSystems(mockCrmSystems);
      setCustomAPIs(mockCustomAPIs);
      setDataIntegrations(mockDataIntegrations);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'running':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'inactive':
      case 'stopped':
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'error':
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">BI Dashboards</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {biPlatforms.flatMap(p => p.dashboards).filter(d => d.status === 'active').length}
          </div>
          <p className="text-sm text-gray-600">Active dashboards</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analyticsPlatforms.flatMap(a => a.metrics).find(m => m.name === 'Active Users')?.value.toLocaleString() || '0'}
          </div>
          <p className="text-sm text-gray-600">Today's active users</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">CRM Contacts</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {crmSystems.flatMap(c => c.contacts).length}
          </div>
          <p className="text-sm text-gray-600">Total contacts</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Value</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${crmSystems.flatMap(c => c.pipelines).reduce((sum, p) => sum + p.totalValue, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Total pipeline value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsPlatforms.flatMap(a => a.metrics).slice(0, 5).map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{metric.name}</h4>
                    <p className="text-sm text-gray-600">{metric.type} metric</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{metric.value.toLocaleString()}</div>
                    <span className={`text-sm ${getChangeColor(metric.change)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {crmSystems.flatMap(c => c.activities).slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                    <p className="text-sm text-gray-600">{activity.contact} • {activity.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBIPlatforms = () => (
    <div className="space-y-6">
      {biPlatforms.map(platform => (
        <div key={platform.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600">Business Intelligence Platform</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Dashboards</h4>
                <div className="space-y-3">
                  {platform.dashboards.map(dashboard => (
                    <div key={dashboard.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{dashboard.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dashboard.status)}`}>
                          {dashboard.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dashboard.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Views:</span>
                          <span className="ml-1 font-medium">{dashboard.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Owner:</span>
                          <span className="ml-1 font-medium">{dashboard.owner}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Data Sources</h4>
                <div className="space-y-3">
                  {platform.dataSources.map(source => (
                    <div key={source.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{source.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-1 font-medium">{source.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rows:</span>
                          <span className="ml-1 font-medium">{source.rowCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1 font-medium">{source.size}MB</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Users</h4>
                <div className="space-y-3">
                  {platform.users.map(user => (
                    <div key={user.id} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900">{user.name}</h5>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Role:</span>
                          <span className="ml-1 font-medium">{user.role}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dashboards:</span>
                          <span className="ml-1 font-medium">{user.dashboards}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {analyticsPlatforms.map(platform => (
        <div key={platform.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                <p className="text-sm text-gray-600">Analytics Platform</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Key Metrics</h4>
                <div className="space-y-3">
                  {platform.metrics.map(metric => (
                    <div key={metric.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{metric.name}</h5>
                        <span className={`text-sm ${getChangeColor(metric.change)}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{metric.value.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">{metric.type} • {metric.period}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Top Events</h4>
                <div className="space-y-3">
                  {platform.events.slice(0, 5).map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900">{event.name}</h5>
                      <p className="text-sm text-gray-600">{event.category} • {event.action}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Count:</span>
                          <span className="ml-1 font-medium">{event.count.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Users:</span>
                          <span className="ml-1 font-medium">{event.uniqueUsers.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Audiences</h4>
                <div className="space-y-3">
                  {platform.audiences.map(audience => (
                    <div key={audience.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{audience.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(audience.status)}`}>
                          {audience.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{audience.description}</p>
                      <div className="text-sm">
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-1 font-medium">{audience.size.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCRM = () => (
    <div className="space-y-6">
      {crmSystems.map(crm => (
        <div key={crm.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{crm.name}</h3>
                <p className="text-sm text-gray-600">Customer Relationship Management</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(crm.status)}`}>
                  {crm.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Pipeline Overview</h4>
                <div className="space-y-3">
                  {crm.pipelines.map(pipeline => (
                    <div key={pipeline.id} className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">{pipeline.name}</h5>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">${pipeline.totalValue.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{pipeline.activeDeals}</div>
                          <div className="text-sm text-gray-600">Active Deals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{pipeline.conversionRate}%</div>
                          <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {pipeline.stages.map(stage => (
                          <div key={stage.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{stage.name}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium">{stage.deals} deals</div>
                              <div className="text-xs text-gray-600">${stage.value.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Recent Contacts</h4>
                <div className="space-y-3">
                  {crm.contacts.slice(0, 5).map(contact => (
                    <div key={contact.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{contact.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <span className="ml-1 font-medium">${contact.value.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Source:</span>
                          <span className="ml-1 font-medium">{contact.source}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAPIs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Custom API Integrations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {customAPIs.map(api => (
              <div key={api.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{api.name}</h4>
                    <p className="text-sm text-gray-600">{api.method} {api.endpoint}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Response Time:</p>
                    <p className="text-sm text-gray-900">{api.responseTime}ms</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Success Rate:</p>
                    <p className="text-sm text-gray-900">{api.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Last Call:</p>
                    <p className="text-sm text-gray-900">{new Date(api.lastCall).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <a href={api.documentation} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                    View Documentation
                  </a>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Test API
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Integrations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dataIntegrations.map(integration => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.source} → {integration.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Type:</p>
                    <p className="text-sm text-gray-900">{integration.type.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Records Processed:</p>
                    <p className="text-sm text-gray-900">{integration.recordsProcessed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Success Rate:</p>
                    <p className="text-sm text-gray-900">{integration.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Next Run:</p>
                    <p className="text-sm text-gray-900">{new Date(integration.nextRun).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Last run: {new Date(integration.lastRun).toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                      Run Now
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading BI data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Integration</h1>
          <p className="text-gray-600 mt-2">
            Tableau, Power BI, Looker, Google Analytics, Mixpanel, Salesforce, HubSpot, and custom API integrations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bi_platforms', label: 'BI Platforms' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'crm', label: 'CRM Systems' },
              { id: 'apis', label: 'Custom APIs' },
              { id: 'integrations', label: 'Data Integrations' }
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
          {activeTab === 'bi_platforms' && renderBIPlatforms()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'crm' && renderCRM()}
          {activeTab === 'apis' && renderAPIs()}
          {activeTab === 'integrations' && renderIntegrations()}
        </div>
      </div>
    </div>
  );
} 