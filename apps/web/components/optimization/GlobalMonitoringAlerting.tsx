// Global Monitoring & Alerting for CodePal
// Features: Global monitoring, alerting, incident management, and system health tracking

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface MonitoringService {
  id: string;
  name: string;
  type: 'application' | 'infrastructure' | 'database' | 'network' | 'security' | 'custom';
  status: 'healthy' | 'warning' | 'critical' | 'down' | 'maintenance';
  region: string;
  endpoint: string;
  responseTime: number;
  uptime: number;
  lastCheck: string;
  metrics: ServiceMetrics;
  alerts: Alert[];
}

interface ServiceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  errors: number;
  requests: number;
  latency: number;
}

interface Alert {
  id: string;
  serviceId: string;
  type: 'error' | 'warning' | 'info' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedServices: string[];
  impact: string;
  timeline: IncidentTimeline[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface IncidentTimeline {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  actor: string;
}

interface MonitoringDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  lastUpdated: string;
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'status' | 'alert' | 'incident';
  title: string;
  data: any;
  position: { x: number; y: number; w: number; h: number };
}

interface GlobalMetrics {
  totalServices: number;
  healthyServices: number;
  warningServices: number;
  criticalServices: number;
  activeAlerts: number;
  openIncidents: number;
  averageResponseTime: number;
  globalUptime: number;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
  status: 'active' | 'inactive' | 'testing';
  configuration: NotificationConfig;
  lastTest: string;
}

interface NotificationConfig {
  recipients?: string[];
  webhookUrl?: string;
  channel?: string;
  apiKey?: string;
  frequency: 'immediate' | '5min' | '15min' | '1hour';
}

export default function GlobalMonitoringAlerting() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'alerts' | 'incidents' | 'dashboards' | 'notifications'>('overview');
  const [services, setServices] = useState<MonitoringService[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dashboards, setDashboards] = useState<MonitoringDashboard[]>([]);
  const [notifications, setNotifications] = useState<NotificationChannel[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockServices: MonitoringService[] = [
        {
          id: '1',
          name: 'API Gateway',
          type: 'application',
          status: 'healthy',
          region: 'us-east-1',
          endpoint: 'https://api.codepal.com/health',
          responseTime: 45,
          uptime: 99.98,
          lastCheck: '2024-01-15T10:00:00Z',
          metrics: {
            cpu: 25,
            memory: 45,
            disk: 30,
            network: 60,
            errors: 0,
            requests: 1250,
            latency: 45
          },
          alerts: []
        },
        {
          id: '2',
          name: 'Database Cluster',
          type: 'database',
          status: 'warning',
          region: 'us-east-1',
          endpoint: 'https://db.codepal.com/health',
          responseTime: 120,
          uptime: 99.95,
          lastCheck: '2024-01-15T10:00:00Z',
          metrics: {
            cpu: 75,
            memory: 85,
            disk: 65,
            network: 40,
            errors: 5,
            requests: 850,
            latency: 120
          },
          alerts: [
            {
              id: '1',
              serviceId: '2',
              type: 'warning',
              severity: 'medium',
              title: 'High CPU Usage',
              description: 'CPU usage is above 75% for the last 10 minutes',
              status: 'active',
              createdAt: '2024-01-15T09:45:00Z',
              updatedAt: '2024-01-15T09:45:00Z'
            }
          ]
        },
        {
          id: '3',
          name: 'CDN Edge',
          type: 'infrastructure',
          status: 'critical',
          region: 'eu-west-1',
          endpoint: 'https://cdn.codepal.com/health',
          responseTime: 500,
          uptime: 98.5,
          lastCheck: '2024-01-15T10:00:00Z',
          metrics: {
            cpu: 95,
            memory: 90,
            disk: 80,
            network: 95,
            errors: 25,
            requests: 2000,
            latency: 500
          },
          alerts: [
            {
              id: '2',
              serviceId: '3',
              type: 'critical',
              severity: 'critical',
              title: 'Service Unavailable',
              description: 'CDN service is experiencing high latency and errors',
              status: 'active',
              createdAt: '2024-01-15T09:30:00Z',
              updatedAt: '2024-01-15T09:30:00Z'
            }
          ]
        }
      ];

      const mockAlerts: Alert[] = [
        {
          id: '1',
          serviceId: '2',
          type: 'warning',
          severity: 'medium',
          title: 'High CPU Usage',
          description: 'CPU usage is above 75% for the last 10 minutes',
          status: 'active',
          createdAt: '2024-01-15T09:45:00Z',
          updatedAt: '2024-01-15T09:45:00Z'
        },
        {
          id: '2',
          serviceId: '3',
          type: 'critical',
          severity: 'critical',
          title: 'Service Unavailable',
          description: 'CDN service is experiencing high latency and errors',
          status: 'active',
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-01-15T09:30:00Z'
        },
        {
          id: '3',
          serviceId: '1',
          type: 'info',
          severity: 'low',
          title: 'Scheduled Maintenance',
          description: 'API Gateway maintenance scheduled for tonight',
          status: 'acknowledged',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-15T08:00:00Z',
          assignedTo: 'admin@codepal.com'
        }
      ];

      const mockIncidents: Incident[] = [
        {
          id: '1',
          title: 'CDN Performance Degradation',
          description: 'CDN service experiencing high latency and increased error rates',
          severity: 'high',
          status: 'investigating',
          affectedServices: ['CDN Edge', 'API Gateway'],
          impact: 'Increased response times for users in EU region',
          timeline: [
            {
              id: '1',
              timestamp: '2024-01-15T09:30:00Z',
              action: 'Incident Created',
              description: 'CDN performance degradation detected',
              actor: 'Monitoring System'
            },
            {
              id: '2',
              timestamp: '2024-01-15T09:35:00Z',
              action: 'Investigation Started',
              description: 'Engineering team investigating root cause',
              actor: 'John Engineer'
            }
          ],
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-01-15T09:35:00Z'
        }
      ];

      const mockDashboards: MonitoringDashboard[] = [
        {
          id: '1',
          name: 'Global Operations',
          description: 'Overview of all global services and infrastructure',
          widgets: [
            {
              id: '1',
              type: 'metric',
              title: 'Global Uptime',
              data: { value: 99.95, unit: '%' },
              position: { x: 0, y: 0, w: 3, h: 2 }
            },
            {
              id: '2',
              type: 'chart',
              title: 'Response Times',
              data: { chartType: 'line', data: [] },
              position: { x: 3, y: 0, w: 6, h: 2 }
            }
          ],
          lastUpdated: '2024-01-15T10:00:00Z'
        }
      ];

      const mockNotifications: NotificationChannel[] = [
        {
          id: '1',
          name: 'Engineering Team',
          type: 'slack',
          status: 'active',
          configuration: {
            channel: '#alerts',
            frequency: 'immediate'
          },
          lastTest: '2024-01-15T09:00:00Z'
        },
        {
          id: '2',
          name: 'On-Call Pager',
          type: 'pagerduty',
          status: 'active',
          configuration: {
            apiKey: '***',
            frequency: 'immediate'
          },
          lastTest: '2024-01-15T08:00:00Z'
        }
      ];

      const mockGlobalMetrics: GlobalMetrics = {
        totalServices: 3,
        healthyServices: 1,
        warningServices: 1,
        criticalServices: 1,
        activeAlerts: 2,
        openIncidents: 1,
        averageResponseTime: 222,
        globalUptime: 99.95
      };

      setServices(mockServices);
      setAlerts(mockAlerts);
      setIncidents(mockIncidents);
      setDashboards(mockDashboards);
      setNotifications(mockNotifications);
      setGlobalMetrics(mockGlobalMetrics);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredServices = services.filter(service => {
    const matchesRegion = selectedRegion === 'all' || service.region === selectedRegion;
    return matchesRegion;
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesSeverity;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Uptime</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {globalMetrics?.globalUptime || 0}%
          </div>
          <p className="text-sm text-gray-600">Overall system availability</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Alerts</h3>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {globalMetrics?.activeAlerts || 0}
          </div>
          <p className="text-sm text-gray-600">Alerts requiring attention</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Incidents</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {globalMetrics?.openIncidents || 0}
          </div>
          <p className="text-sm text-gray-600">Active incidents</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Response Time</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {globalMetrics?.averageResponseTime || 0}ms
          </div>
          <p className="text-sm text-gray-600">Global average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.region} • {service.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{service.responseTime}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{alert.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="us-east-1">US East 1</option>
              <option value="eu-west-1">EU West 1</option>
              <option value="ap-southeast-1">AP Southeast 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.type} • {service.region}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Service Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Response Time:</span>
                      <span className="font-medium">{service.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Uptime:</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Check:</span>
                      <span className="font-medium">{new Date(service.lastCheck).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Resource Usage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">CPU</span>
                        <span className="font-medium">{service.metrics.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${service.metrics.cpu > 80 ? 'bg-red-500' : service.metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${service.metrics.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Memory</span>
                        <span className="font-medium">{service.metrics.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${service.metrics.memory > 80 ? 'bg-red-500' : service.metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${service.metrics.memory}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {service.alerts.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Active Alerts</h4>
                  <div className="space-y-2">
                    {service.alerts.map(alert => (
                      <div key={alert.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-red-900">{alert.title}</h5>
                            <p className="text-sm text-red-700">{alert.description}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Configure Alerts
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-4">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {filteredAlerts.map(alert => {
          const service = services.find(s => s.id === alert.serviceId);
          return (
            <div key={alert.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">Service: {service?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`ml-2 px-3 py-1 text-sm rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Alert Details</h4>
                    <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Updated:</span>
                        <span className="font-medium">{new Date(alert.updatedAt).toLocaleString()}</span>
                      </div>
                      {alert.assignedTo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Assigned To:</span>
                          <span className="font-medium">{alert.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Acknowledge Alert
                      </button>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Mark as Resolved
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                        View Service
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      {incidents.map(incident => (
        <div key={incident.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                <p className="text-sm text-gray-600">{incident.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`ml-2 px-3 py-1 text-sm rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Incident Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Impact:</span>
                    <p className="text-sm font-medium">{incident.impact}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Affected Services:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {incident.affectedServices.map(service => (
                        <span key={service} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{new Date(incident.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Updated:</span>
                    <span className="font-medium">{new Date(incident.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                <div className="space-y-3">
                  {incident.timeline.map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{event.action}</span>
                        <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">By: {event.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Update Status
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Resolve Incident
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboards = () => (
    <div className="space-y-6">
      {dashboards.map(dashboard => (
        <div key={dashboard.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dashboard.name}</h3>
                <p className="text-sm text-gray-600">{dashboard.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.widgets.map(widget => (
                <div key={widget.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">{widget.title}</h4>
                  {widget.type === 'metric' && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {widget.data.value} {widget.data.unit}
                      </div>
                    </div>
                  )}
                  {widget.type === 'status' && (
                    <div className="text-center">
                      <div className="text-2xl">📊</div>
                      <p className="text-sm text-gray-600">Status Widget</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Dashboard
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Add Widget
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {notifications.map(channel => (
        <div key={channel.id} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                <p className="text-sm text-gray-600">{channel.type} notification channel</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(channel.status)}`}>
                  {channel.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{channel.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="font-medium">{channel.configuration.frequency}</span>
                  </div>
                  {channel.configuration.channel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Channel:</span>
                      <span className="font-medium">{channel.configuration.channel}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Test:</span>
                    <span className="font-medium">{new Date(channel.lastTest).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Test Channel
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    Edit Configuration
                  </button>
                  <button className="w-full px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50">
                    Disable Channel
                  </button>
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
          <p className="mt-4 text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Global Monitoring & Alerting</h1>
          <p className="text-gray-600 mt-2">
            Global monitoring, alerting, incident management, and system health tracking
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'services', label: 'Services' },
              { id: 'alerts', label: 'Alerts' },
              { id: 'incidents', label: 'Incidents' },
              { id: 'dashboards', label: 'Dashboards' },
              { id: 'notifications', label: 'Notifications' }
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
          {activeTab === 'services' && renderServices()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'incidents' && renderIncidents()}
          {activeTab === 'dashboards' && renderDashboards()}
          {activeTab === 'notifications' && renderNotifications()}
        </div>
      </div>
    </div>
  );
} 