// Real-Time Analytics & Streaming for CodePal
// Features: Real-time data streaming, live dashboards, streaming analytics, event processing

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface StreamEvent {
  id: string;
  timestamp: string;
  type: 'user_action' | 'system_event' | 'error' | 'performance' | 'business';
  source: string;
  data: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
  processingTime?: number;
}

interface StreamProcessor {
  id: string;
  name: string;
  type: 'filter' | 'aggregate' | 'transform' | 'enrich' | 'alert';
  status: 'active' | 'inactive' | 'error';
  inputStream: string;
  outputStream: string;
  config: ProcessorConfig;
  metrics: ProcessorMetrics;
  lastProcessed: string;
}

interface ProcessorConfig {
  filterCondition?: string;
  aggregationWindow?: number;
  transformationRules?: Record<string, string>;
  enrichmentSources?: string[];
  alertThresholds?: AlertThreshold[];
}

interface AlertThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ProcessorMetrics {
  eventsProcessed: number;
  eventsPerSecond: number;
  averageLatency: number;
  errorRate: number;
  uptime: number;
}

interface LiveDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  refreshInterval: number;
  lastUpdated: string;
  status: 'active' | 'paused' | 'error';
  viewers: number;
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'heatmap';
  title: string;
  dataSource: string;
  config: WidgetConfig;
  position: WidgetPosition;
  lastUpdate: string;
}

interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  timeRange?: string;
  aggregation?: string;
  thresholds?: ThresholdConfig[];
  colors?: string[];
  refreshRate?: number;
}

interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ThresholdConfig {
  value: number;
  color: string;
  label: string;
}

interface StreamAnalytics {
  id: string;
  name: string;
  query: string;
  type: 'continuous' | 'windowed' | 'pattern' | 'anomaly';
  status: 'running' | 'stopped' | 'error';
  results: AnalyticsResult[];
  config: AnalyticsConfig;
  performance: AnalyticsPerformance;
}

interface AnalyticsResult {
  timestamp: string;
  value: number;
  metadata: Record<string, any>;
  confidence?: number;
}

interface AnalyticsConfig {
  windowSize: number;
  slideInterval: number;
  aggregationFunction: string;
  groupBy?: string[];
  having?: string;
}

interface AnalyticsPerformance {
  queryExecutionTime: number;
  resultLatency: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface EventSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'message_queue' | 'file' | 'stream';
  status: 'connected' | 'disconnected' | 'error';
  connection: ConnectionConfig;
  eventsPerSecond: number;
  totalEvents: number;
  lastEvent: string;
  errors: EventError[];
}

interface ConnectionConfig {
  url: string;
  protocol: string;
  authentication: AuthConfig;
  retryPolicy: RetryPolicy;
  timeout: number;
}

interface AuthConfig {
  type: 'none' | 'basic' | 'oauth' | 'api_key';
  credentials: Record<string, string>;
}

interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
}

interface EventError {
  timestamp: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  resolved: boolean;
}

interface StreamAlert {
  id: string;
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'triggered' | 'acknowledged' | 'resolved';
  lastTriggered?: string;
  triggerCount: number;
  actions: AlertAction[];
  recipients: string[];
}

interface AlertAction {
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'notification';
  target: string;
  message: string;
  enabled: boolean;
}

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  lastUpdated: string;
  history: MetricPoint[];
}

interface MetricPoint {
  timestamp: string;
  value: number;
}

export default function RealTimeAnalyticsStreaming() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'processors' | 'dashboards' | 'analytics' | 'sources' | 'alerts'>('overview');
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [streamProcessors, setStreamProcessors] = useState<StreamProcessor[]>([]);
  const [liveDashboards, setLiveDashboards] = useState<LiveDashboard[]>([]);
  const [streamAnalytics, setStreamAnalytics] = useState<StreamAnalytics[]>([]);
  const [eventSources, setEventSources] = useState<EventSource[]>([]);
  const [streamAlerts, setStreamAlerts] = useState<StreamAlert[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealTimeData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRealTimeData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockStreamEvents: StreamEvent[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'user_action',
          source: 'web_app',
          data: { action: 'code_completion', language: 'typescript', accuracy: 0.95 },
          severity: 'low',
          processed: true,
          processingTime: 15
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000).toISOString(),
          type: 'system_event',
          source: 'api_gateway',
          data: { endpoint: '/api/analytics', response_time: 245, status: 200 },
          severity: 'low',
          processed: true,
          processingTime: 8
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 2000).toISOString(),
          type: 'error',
          source: 'database',
          data: { error: 'connection_timeout', retry_count: 3 },
          severity: 'high',
          processed: false
        }
      ];

      const mockStreamProcessors: StreamProcessor[] = [
        {
          id: '1',
          name: 'Error Filter',
          type: 'filter',
          status: 'active',
          inputStream: 'raw_events',
          outputStream: 'error_events',
          config: {
            filterCondition: 'type == "error"'
          },
          metrics: {
            eventsProcessed: 1250,
            eventsPerSecond: 45,
            averageLatency: 12,
            errorRate: 0.02,
            uptime: 99.8
          },
          lastProcessed: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Performance Aggregator',
          type: 'aggregate',
          status: 'active',
          inputStream: 'system_events',
          outputStream: 'performance_metrics',
          config: {
            aggregationWindow: 60,
            transformationRules: { 'response_time': 'avg(response_time)' }
          },
          metrics: {
            eventsProcessed: 8900,
            eventsPerSecond: 120,
            averageLatency: 8,
            errorRate: 0.01,
            uptime: 99.9
          },
          lastProcessed: new Date().toISOString()
        }
      ];

      const mockLiveDashboards: LiveDashboard[] = [
        {
          id: '1',
          name: 'Real-Time System Monitor',
          description: 'Live monitoring of system performance and user activity',
          widgets: [
            {
              id: '1',
              type: 'metric',
              title: 'Active Users',
              dataSource: 'user_activity_stream',
              config: { refreshRate: 5 },
              position: { x: 0, y: 0, width: 4, height: 2 },
              lastUpdate: new Date().toISOString()
            },
            {
              id: '2',
              type: 'chart',
              title: 'Response Time Trend',
              dataSource: 'performance_stream',
              config: { chartType: 'line', timeRange: '1h', refreshRate: 10 },
              position: { x: 4, y: 0, width: 8, height: 4 },
              lastUpdate: new Date().toISOString()
            }
          ],
          refreshInterval: 5000,
          lastUpdated: new Date().toISOString(),
          status: 'active',
          viewers: 12
        }
      ];

      const mockStreamAnalytics: StreamAnalytics[] = [
        {
          id: '1',
          name: 'User Engagement Analysis',
          query: 'SELECT user_id, COUNT(*) as actions FROM user_events GROUP BY user_id HAVING actions > 10',
          type: 'continuous',
          status: 'running',
          results: [
            { timestamp: new Date().toISOString(), value: 156, metadata: { active_users: 156 } },
            { timestamp: new Date(Date.now() - 60000).toISOString(), value: 142, metadata: { active_users: 142 } }
          ],
          config: {
            windowSize: 300,
            slideInterval: 60,
            aggregationFunction: 'COUNT',
            groupBy: ['user_id']
          },
          performance: {
            queryExecutionTime: 45,
            resultLatency: 12,
            throughput: 1000,
            memoryUsage: 256,
            cpuUsage: 15
          }
        }
      ];

      const mockEventSources: EventSource[] = [
        {
          id: '1',
          name: 'Web Application Events',
          type: 'api',
          status: 'connected',
          connection: {
            url: 'https://api.codepal.com/events',
            protocol: 'https',
            authentication: { type: 'api_key', credentials: { api_key: '***' } },
            retryPolicy: { maxRetries: 3, backoffMultiplier: 2, initialDelay: 1000 },
            timeout: 5000
          },
          eventsPerSecond: 45,
          totalEvents: 1250000,
          lastEvent: new Date().toISOString(),
          errors: []
        },
        {
          id: '2',
          name: 'Database Change Stream',
          type: 'database',
          status: 'connected',
          connection: {
            url: 'mongodb://db.codepal.com:27017',
            protocol: 'mongodb',
            authentication: { type: 'basic', credentials: { username: 'stream_user' } },
            retryPolicy: { maxRetries: 5, backoffMultiplier: 1.5, initialDelay: 500 },
            timeout: 3000
          },
          eventsPerSecond: 120,
          totalEvents: 8900000,
          lastEvent: new Date().toISOString(),
          errors: []
        }
      ];

      const mockStreamAlerts: StreamAlert[] = [
        {
          id: '1',
          name: 'High Error Rate Alert',
          condition: 'error_rate > 0.05',
          severity: 'high',
          status: 'active',
          triggerCount: 0,
          actions: [
            {
              type: 'slack',
              target: '#alerts',
              message: 'Error rate has exceeded 5% threshold',
              enabled: true
            }
          ],
          recipients: ['ops@codepal.com']
        },
        {
          id: '2',
          name: 'Response Time Alert',
          condition: 'avg_response_time > 500',
          severity: 'medium',
          status: 'triggered',
          lastTriggered: new Date(Date.now() - 300000).toISOString(),
          triggerCount: 3,
          actions: [
            {
              type: 'email',
              target: 'engineering@codepal.com',
              message: 'Average response time has exceeded 500ms',
              enabled: true
            }
          ],
          recipients: ['engineering@codepal.com']
        }
      ];

      const mockRealTimeMetrics: RealTimeMetric[] = [
        {
          id: '1',
          name: 'Active Users',
          value: 1247,
          unit: 'users',
          trend: 'up',
          change: 2.3,
          lastUpdated: new Date().toISOString(),
          history: [
            { timestamp: new Date(Date.now() - 60000).toISOString(), value: 1219 },
            { timestamp: new Date(Date.now() - 30000).toISOString(), value: 1234 },
            { timestamp: new Date().toISOString(), value: 1247 }
          ]
        },
        {
          id: '2',
          name: 'Events Per Second',
          value: 156,
          unit: 'events/s',
          trend: 'stable',
          change: 0.5,
          lastUpdated: new Date().toISOString(),
          history: [
            { timestamp: new Date(Date.now() - 60000).toISOString(), value: 155 },
            { timestamp: new Date(Date.now() - 30000).toISOString(), value: 156 },
            { timestamp: new Date().toISOString(), value: 156 }
          ]
        }
      ];

      setStreamEvents(mockStreamEvents);
      setStreamProcessors(mockStreamProcessors);
      setLiveDashboards(mockLiveDashboards);
      setStreamAnalytics(mockStreamAnalytics);
      setEventSources(mockEventSources);
      setStreamAlerts(mockStreamAlerts);
      setRealTimeMetrics(mockRealTimeMetrics);
      setLoading(false);
    }, 1000);
  };

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setStreamEvents(prev => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'user_action',
        source: 'web_app',
        data: { action: 'code_review', language: 'javascript', accuracy: 0.92 },
        severity: 'low',
        processed: true,
        processingTime: Math.floor(Math.random() * 20) + 5
      },
      ...prev.slice(0, 9) // Keep only 10 most recent events
    ]);

    setRealTimeMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + Math.floor(Math.random() * 10) - 5,
      lastUpdated: new Date().toISOString(),
      history: [
        ...metric.history.slice(1),
        { timestamp: new Date().toISOString(), value: metric.value }
      ]
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'running': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'disconnected':
      case 'stopped': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Active Processors</h3>
          <p className="text-3xl font-bold text-blue-600">
            {streamProcessors.filter(p => p.status === 'active').length}
          </p>
          <p className="text-sm text-blue-700">Stream processors</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Events/Second</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatNumber(streamProcessors.reduce((acc, p) => acc + p.metrics.eventsPerSecond, 0))}
          </p>
          <p className="text-sm text-green-700">Total throughput</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Live Dashboards</h3>
          <p className="text-3xl font-bold text-purple-600">
            {liveDashboards.filter(d => d.status === 'active').length}
          </p>
          <p className="text-sm text-purple-700">Active dashboards</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Connected Sources</h3>
          <p className="text-3xl font-bold text-orange-600">
            {eventSources.filter(s => s.status === 'connected').length}
          </p>
          <p className="text-sm text-orange-700">Event sources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Metrics</h3>
          <div className="space-y-4">
            {realTimeMetrics.map(metric => (
              <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{metric.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatNumber(metric.value)} {metric.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {Math.abs(metric.change)}%
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(metric.lastUpdated)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-3">
            {streamEvents.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {event.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{event.source}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(event.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                  {event.processed && (
                    <p className="text-xs text-gray-500 mt-1">
                      {event.processingTime}ms
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Events</h3>
      <div className="space-y-4">
        {streamEvents.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 capitalize">
                  {event.type.replace('_', ' ')}
                </h4>
                <p className="text-sm text-gray-600">Source: {event.source}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(event.severity)}`}>
                  {event.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.processed ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                }`}>
                  {event.processed ? 'Processed' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Event Data</h5>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-x-auto">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </div>

            {event.processed && event.processingTime && (
              <div className="mt-4 text-sm text-gray-600">
                Processing time: {event.processingTime}ms
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessors = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Processors</h3>
      <div className="space-y-6">
        {streamProcessors.map(processor => (
          <div key={processor.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{processor.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{processor.type} processor</p>
                <p className="text-sm text-gray-500 mt-1">
                  {processor.inputStream} → {processor.outputStream}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(processor.status)}`}>
                  {processor.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Events Processed</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(processor.metrics.eventsProcessed)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Events/Second</p>
                <p className="text-lg font-bold text-gray-900">{processor.metrics.eventsPerSecond}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Avg Latency</p>
                <p className="text-lg font-bold text-gray-900">{processor.metrics.averageLatency}ms</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Error Rate</p>
                <p className="text-lg font-bold text-gray-900">{(processor.metrics.errorRate * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Uptime</p>
                <p className="text-lg font-bold text-gray-900">{processor.metrics.uptime}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Configuration</h5>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-x-auto">
                {JSON.stringify(processor.config, null, 2)}
              </pre>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Last processed: {formatTime(processor.lastProcessed)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboards = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Dashboards</h3>
      <div className="space-y-6">
        {liveDashboards.map(dashboard => (
          <div key={dashboard.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{dashboard.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Refresh: {dashboard.refreshInterval}ms • Widgets: {dashboard.widgets.length}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dashboard.status)}`}>
                  {dashboard.status}
                </span>
                <span className="text-sm text-gray-600">
                  {dashboard.viewers} viewers
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {dashboard.widgets.map(widget => (
                <div key={widget.id} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{widget.title}</h5>
                    <span className="text-xs text-gray-500 capitalize">{widget.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">Source: {widget.dataSource}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last update: {formatTime(widget.lastUpdate)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Position: {widget.position.x},{widget.position.y} • Size: {widget.position.width}x{widget.position.height}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              Last updated: {formatTime(dashboard.lastUpdated)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Analytics</h3>
      <div className="space-y-6">
        {streamAnalytics.map(analytics => (
          <div key={analytics.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{analytics.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{analytics.type} analytics</p>
                <p className="text-sm text-gray-500 mt-1">Query: {analytics.query}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analytics.status)}`}>
                  {analytics.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Execution Time</p>
                <p className="text-lg font-bold text-gray-900">{analytics.performance.queryExecutionTime}ms</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Result Latency</p>
                <p className="text-lg font-bold text-gray-900">{analytics.performance.resultLatency}ms</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Throughput</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.performance.throughput)}/s</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Memory Usage</p>
                <p className="text-lg font-bold text-gray-900">{analytics.performance.memoryUsage}MB</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">CPU Usage</p>
                <p className="text-lg font-bold text-gray-900">{analytics.performance.cpuUsage}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Recent Results</h5>
              <div className="space-y-2">
                {analytics.results.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="font-medium text-gray-900">{formatNumber(result.value)}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(result.timestamp)}
                      </p>
                    </div>
                    {result.confidence && (
                      <span className="text-sm text-gray-500">
                        {(result.confidence * 100).toFixed(1)}% confidence
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Configuration</h5>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-x-auto">
                {JSON.stringify(analytics.config, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSources = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Sources</h3>
      <div className="space-y-6">
        {eventSources.map(source => (
          <div key={source.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{source.type} source</p>
                <p className="text-sm text-gray-500 mt-1">URL: {source.connection.url}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Events/Second</p>
                <p className="text-lg font-bold text-gray-900">{source.eventsPerSecond}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Total Events</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(source.totalEvents)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Protocol</p>
                <p className="text-lg font-bold text-gray-900">{source.connection.protocol}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Timeout</p>
                <p className="text-lg font-bold text-gray-900">{source.connection.timeout}ms</p>
              </div>
            </div>

            {source.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded mb-4">
                <h5 className="font-medium text-red-900 mb-2">Recent Errors</h5>
                <div className="space-y-2">
                  {source.errors.slice(0, 3).map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-gray-900">{error.message}</p>
                        <p className="text-sm text-gray-600">
                          {formatTime(error.timestamp)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Last event: {formatTime(source.lastEvent)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Alerts</h3>
      <div className="space-y-6">
        {streamAlerts.map(alert => (
          <div key={alert.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{alert.name}</h4>
                <p className="text-sm text-gray-600">Condition: {alert.condition}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Recipients: {alert.recipients.join(', ')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  alert.status === 'active' ? 'text-green-600 bg-green-100' :
                  alert.status === 'triggered' ? 'text-red-600 bg-red-100' :
                  alert.status === 'acknowledged' ? 'text-yellow-600 bg-yellow-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Trigger Count</p>
                <p className="text-lg font-bold text-gray-900">{alert.triggerCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Actions</p>
                <p className="text-lg font-bold text-gray-900">{alert.actions.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Recipients</p>
                <p className="text-lg font-bold text-gray-900">{alert.recipients.length}</p>
              </div>
            </div>

            {alert.lastTriggered && (
              <div className="bg-yellow-50 p-4 rounded mb-4">
                <h5 className="font-medium text-yellow-900 mb-2">Last Triggered</h5>
                <p className="text-sm text-yellow-800">
                  {new Date(alert.lastTriggered).toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Actions</h5>
              <div className="space-y-2">
                {alert.actions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{action.type}</p>
                      <p className="text-sm text-gray-600">{action.target}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.enabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                      {action.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
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
          <p className="mt-4 text-gray-600">Loading real-time analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics & Streaming</h1>
          <p className="text-gray-600 mt-2">
            Live data streaming, real-time dashboards, and streaming analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'events', label: 'Events' },
              { id: 'processors', label: 'Processors' },
              { id: 'dashboards', label: 'Dashboards' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'sources', label: 'Sources' },
              { id: 'alerts', label: 'Alerts' }
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
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'processors' && renderProcessors()}
          {activeTab === 'dashboards' && renderDashboards()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'sources' && renderSources()}
          {activeTab === 'alerts' && renderAlerts()}
        </div>
      </div>
    </div>
  );
} 