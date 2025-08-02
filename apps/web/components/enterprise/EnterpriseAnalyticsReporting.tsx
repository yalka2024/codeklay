// Enterprise Analytics & Reporting for CodePal
// Features: Advanced analytics dashboard, custom reporting engine, data visualization tools, business intelligence

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: 'up' | 'down' | 'stable';
  category: 'performance' | 'usage' | 'revenue' | 'security' | 'compliance';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastUpdated: string;
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'technical' | 'compliance' | 'custom';
  status: 'active' | 'draft' | 'archived';
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand';
  recipients: string[];
  lastGenerated: string;
  nextGeneration: string;
  dataSources: string[];
  visualizations: Visualization[];
}

interface Visualization {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'gauge' | 'map' | 'heatmap';
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: any[];
  config: VisualizationConfig;
  lastUpdated: string;
}

interface VisualizationConfig {
  title: string;
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  showLegend: boolean;
  showGrid: boolean;
  animate: boolean;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'manager' | 'analyst' | 'custom';
  status: 'active' | 'draft' | 'archived';
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  lastModified: string;
  createdBy: string;
}

interface DashboardLayout {
  columns: number;
  rows: number;
  grid: GridItem[];
}

interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  widgetId: string;
}

interface DashboardWidget {
  id: string;
  name: string;
  type: 'metric' | 'chart' | 'table' | 'list' | 'status';
  dataSource: string;
  refreshInterval: number;
  config: WidgetConfig;
  lastUpdated: string;
}

interface WidgetConfig {
  title: string;
  subtitle?: string;
  showHeader: boolean;
  showFooter: boolean;
  backgroundColor?: string;
  borderColor?: string;
  chartConfig?: VisualizationConfig;
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  connection: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  tables: string[];
  schema: DataSchema[];
}

interface DataSchema {
  table: string;
  columns: SchemaColumn[];
  rowCount: number;
  lastUpdated: string;
}

interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
}

interface BusinessIntelligence {
  id: string;
  name: string;
  type: 'kpi' | 'dashboard' | 'report' | 'alert';
  category: 'sales' | 'operations' | 'finance' | 'customer' | 'product';
  status: 'active' | 'inactive' | 'draft';
  dataSource: string;
  query: string;
  schedule: string;
  recipients: string[];
  lastExecuted: string;
  nextExecution: string;
}

export default function EnterpriseAnalyticsReporting() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'reports' | 'dashboards' | 'datasources' | 'bi'>('overview');
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockMetrics: AnalyticsMetric[] = [
        {
          id: '1',
          name: 'Active Users',
          value: 15420,
          unit: 'users',
          change: 12.5,
          changeType: 'increase',
          trend: 'up',
          category: 'usage',
          period: 'daily',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'API Response Time',
          value: 245,
          unit: 'ms',
          change: -8.2,
          changeType: 'decrease',
          trend: 'up',
          category: 'performance',
          period: 'hourly',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '3',
          name: 'Monthly Revenue',
          value: 1250000,
          unit: 'USD',
          change: 15.3,
          changeType: 'increase',
          trend: 'up',
          category: 'revenue',
          period: 'monthly',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '4',
          name: 'Security Incidents',
          value: 3,
          unit: 'incidents',
          change: -50.0,
          changeType: 'decrease',
          trend: 'up',
          category: 'security',
          period: 'weekly',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '5',
          name: 'Code Quality Score',
          value: 92.5,
          unit: '%',
          change: 2.1,
          changeType: 'increase',
          trend: 'up',
          category: 'performance',
          period: 'daily',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '6',
          name: 'Deployment Success Rate',
          value: 98.7,
          unit: '%',
          change: 0.5,
          changeType: 'increase',
          trend: 'up',
          category: 'performance',
          period: 'daily',
          lastUpdated: '2024-03-20T10:00:00Z'
        }
      ];

      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Executive Summary Report',
          description: 'High-level overview of key business metrics and performance indicators',
          type: 'executive',
          status: 'active',
          schedule: 'weekly',
          recipients: ['ceo@company.com', 'cto@company.com', 'cfo@company.com'],
          lastGenerated: '2024-03-20T09:00:00Z',
          nextGeneration: '2024-03-27T09:00:00Z',
          dataSources: ['user_analytics', 'revenue_data', 'performance_metrics'],
          visualizations: [
            {
              id: '1',
              name: 'Revenue Trend',
              type: 'chart',
              chartType: 'line',
              data: [
                { month: 'Jan', revenue: 950000 },
                { month: 'Feb', revenue: 1100000 },
                { month: 'Mar', revenue: 1250000 }
              ],
              config: {
                title: 'Monthly Revenue Trend',
                xAxis: 'month',
                yAxis: 'revenue',
                colors: ['#3B82F6'],
                showLegend: true,
                showGrid: true,
                animate: true
              },
              lastUpdated: '2024-03-20T09:00:00Z'
            }
          ]
        },
        {
          id: '2',
          name: 'Technical Performance Report',
          description: 'Detailed analysis of system performance, uptime, and technical metrics',
          type: 'technical',
          status: 'active',
          schedule: 'daily',
          recipients: ['devops@company.com', 'engineering@company.com'],
          lastGenerated: '2024-03-20T08:00:00Z',
          nextGeneration: '2024-03-21T08:00:00Z',
          dataSources: ['performance_metrics', 'system_logs', 'monitoring_data'],
          visualizations: [
            {
              id: '2',
              name: 'API Response Times',
              type: 'chart',
              chartType: 'area',
              data: [
                { time: '00:00', responseTime: 220 },
                { time: '06:00', responseTime: 180 },
                { time: '12:00', responseTime: 245 },
                { time: '18:00', responseTime: 210 }
              ],
              config: {
                title: 'API Response Times (24h)',
                xAxis: 'time',
                yAxis: 'responseTime',
                colors: ['#10B981'],
                showLegend: true,
                showGrid: true,
                animate: true
              },
              lastUpdated: '2024-03-20T08:00:00Z'
            }
          ]
        }
      ];

      const mockDashboards: Dashboard[] = [
        {
          id: '1',
          name: 'Executive Dashboard',
          description: 'High-level business metrics and KPIs for executive leadership',
          type: 'executive',
          status: 'active',
          layout: {
            columns: 4,
            rows: 3,
            grid: [
              { id: '1', x: 0, y: 0, width: 2, height: 1, widgetId: '1' },
              { id: '2', x: 2, y: 0, width: 2, height: 1, widgetId: '2' },
              { id: '3', x: 0, y: 1, width: 4, height: 2, widgetId: '3' }
            ]
          },
          widgets: [
            {
              id: '1',
              name: 'Revenue Overview',
              type: 'metric',
              dataSource: 'revenue_data',
              refreshInterval: 3600,
              config: {
                title: 'Monthly Revenue',
                subtitle: 'Current month performance',
                showHeader: true,
                showFooter: true,
                backgroundColor: '#F0F9FF'
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            },
            {
              id: '2',
              name: 'User Growth',
              type: 'chart',
              dataSource: 'user_analytics',
              refreshInterval: 1800,
              config: {
                title: 'Active Users',
                subtitle: 'Daily active users trend',
                showHeader: true,
                showFooter: false,
                chartConfig: {
                  title: 'Daily Active Users',
                  xAxis: 'date',
                  yAxis: 'users',
                  colors: ['#3B82F6'],
                  showLegend: true,
                  showGrid: true,
                  animate: true
                }
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            },
            {
              id: '3',
              name: 'Performance Metrics',
              type: 'table',
              dataSource: 'performance_metrics',
              refreshInterval: 900,
              config: {
                title: 'System Performance',
                subtitle: 'Key performance indicators',
                showHeader: true,
                showFooter: true,
                backgroundColor: '#FEF3C7'
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            }
          ],
          lastModified: '2024-03-20T09:30:00Z',
          createdBy: 'admin@company.com'
        },
        {
          id: '2',
          name: 'Operations Dashboard',
          description: 'Real-time operational metrics and system health monitoring',
          type: 'manager',
          status: 'active',
          layout: {
            columns: 3,
            rows: 2,
            grid: [
              { id: '4', x: 0, y: 0, width: 1, height: 1, widgetId: '4' },
              { id: '5', x: 1, y: 0, width: 1, height: 1, widgetId: '5' },
              { id: '6', x: 2, y: 0, width: 1, height: 1, widgetId: '6' },
              { id: '7', x: 0, y: 1, width: 3, height: 1, widgetId: '7' }
            ]
          },
          widgets: [
            {
              id: '4',
              name: 'System Uptime',
              type: 'gauge',
              dataSource: 'monitoring_data',
              refreshInterval: 300,
              config: {
                title: 'System Uptime',
                subtitle: 'Current uptime percentage',
                showHeader: true,
                showFooter: false,
                backgroundColor: '#ECFDF5'
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            },
            {
              id: '5',
              name: 'Error Rate',
              type: 'metric',
              dataSource: 'error_logs',
              refreshInterval: 300,
              config: {
                title: 'Error Rate',
                subtitle: 'Errors per minute',
                showHeader: true,
                showFooter: false,
                backgroundColor: '#FEF2F2'
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            },
            {
              id: '6',
              name: 'Deployment Status',
              type: 'status',
              dataSource: 'deployment_data',
              refreshInterval: 600,
              config: {
                title: 'Deployment Status',
                subtitle: 'Latest deployment information',
                showHeader: true,
                showFooter: true,
                backgroundColor: '#F0F9FF'
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            },
            {
              id: '7',
              name: 'Performance Trends',
              type: 'chart',
              dataSource: 'performance_metrics',
              refreshInterval: 900,
              config: {
                title: 'Performance Trends',
                subtitle: 'Response time and throughput',
                showHeader: true,
                showFooter: false,
                chartConfig: {
                  title: 'Performance Metrics',
                  xAxis: 'time',
                  yAxis: 'value',
                  colors: ['#3B82F6', '#10B981'],
                  showLegend: true,
                  showGrid: true,
                  animate: true
                }
              },
              lastUpdated: '2024-03-20T10:00:00Z'
            }
          ],
          lastModified: '2024-03-20T08:45:00Z',
          createdBy: 'ops@company.com'
        }
      ];

      const mockDataSources: DataSource[] = [
        {
          id: '1',
          name: 'User Analytics Database',
          type: 'database',
          connection: 'postgresql://analytics.company.com:5432/user_analytics',
          status: 'active',
          lastSync: '2024-03-20T10:00:00Z',
          tables: ['user_sessions', 'user_actions', 'user_profiles'],
          schema: [
            {
              table: 'user_sessions',
              columns: [
                { name: 'session_id', type: 'uuid', nullable: false, description: 'Unique session identifier' },
                { name: 'user_id', type: 'uuid', nullable: false, description: 'User identifier' },
                { name: 'start_time', type: 'timestamp', nullable: false, description: 'Session start time' },
                { name: 'end_time', type: 'timestamp', nullable: true, description: 'Session end time' }
              ],
              rowCount: 1542000,
              lastUpdated: '2024-03-20T10:00:00Z'
            }
          ]
        },
        {
          id: '2',
          name: 'Performance Metrics API',
          type: 'api',
          connection: 'https://api.company.com/metrics/v1',
          status: 'active',
          lastSync: '2024-03-20T10:00:00Z',
          tables: ['response_times', 'error_rates', 'throughput'],
          schema: [
            {
              table: 'response_times',
              columns: [
                { name: 'timestamp', type: 'timestamp', nullable: false, description: 'Measurement timestamp' },
                { name: 'endpoint', type: 'varchar', nullable: false, description: 'API endpoint' },
                { name: 'response_time', type: 'integer', nullable: false, description: 'Response time in ms' }
              ],
              rowCount: 864000,
              lastUpdated: '2024-03-20T10:00:00Z'
            }
          ]
        }
      ];

      const mockBusinessIntelligence: BusinessIntelligence[] = [
        {
          id: '1',
          name: 'Revenue KPI Dashboard',
          type: 'kpi',
          category: 'finance',
          status: 'active',
          dataSource: 'revenue_data',
          query: 'SELECT SUM(amount) FROM transactions WHERE date >= CURRENT_DATE - INTERVAL \'30 days\'',
          schedule: 'daily',
          recipients: ['finance@company.com', 'ceo@company.com'],
          lastExecuted: '2024-03-20T09:00:00Z',
          nextExecution: '2024-03-21T09:00:00Z'
        },
        {
          id: '2',
          name: 'Customer Churn Alert',
          type: 'alert',
          category: 'customer',
          status: 'active',
          dataSource: 'user_analytics',
          query: 'SELECT COUNT(*) FROM users WHERE last_login < CURRENT_DATE - INTERVAL \'30 days\'',
          schedule: 'weekly',
          recipients: ['product@company.com', 'customer_success@company.com'],
          lastExecuted: '2024-03-20T08:00:00Z',
          nextExecution: '2024-03-27T08:00:00Z'
        },
        {
          id: '3',
          name: 'System Performance Report',
          type: 'report',
          category: 'operations',
          status: 'active',
          dataSource: 'performance_metrics',
          query: 'SELECT AVG(response_time), MAX(response_time), COUNT(*) FROM api_calls WHERE timestamp >= CURRENT_DATE - INTERVAL \'24 hours\'',
          schedule: 'daily',
          recipients: ['devops@company.com', 'engineering@company.com'],
          lastExecuted: '2024-03-20T07:00:00Z',
          nextExecution: '2024-03-21T07:00:00Z'
        }
      ];

      setMetrics(mockMetrics);
      setReports(mockReports);
      setDashboards(mockDashboards);
      setDataSources(mockDataSources);
      setBusinessIntelligence(mockBusinessIntelligence);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      case 'archived': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (unit === 'users' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.slice(0, 6).map(metric => (
          <div key={metric.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
              <span className={`text-2xl ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-gray-900">
                {formatValue(metric.value, metric.unit)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {metric.period}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {reports.slice(0, 3).map(report => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.type} • {report.schedule}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Dashboards</h3>
          <div className="space-y-3">
            {dashboards.slice(0, 3).map(dashboard => (
              <div key={dashboard.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{dashboard.name}</p>
                  <p className="text-sm text-gray-600">{dashboard.type} • {dashboard.widgets.length} widgets</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dashboard.status)}`}>
                  {dashboard.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{metric.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{metric.category} • {metric.period}</p>
              </div>
              <span className={`text-2xl ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                {formatValue(metric.value, metric.unit)}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-sm text-gray-500">
                  vs previous {metric.period}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(metric.lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports Management</h3>
      <div className="space-y-6">
        {reports.map(report => (
          <div key={report.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {report.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Schedule</p>
                <p className="text-sm text-gray-900 capitalize">{report.schedule}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Recipients</p>
                <p className="text-sm text-gray-900">{report.recipients.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Generated</p>
                <p className="text-sm text-gray-900">{new Date(report.lastGenerated).toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Generation</p>
                <p className="text-sm text-gray-900">{new Date(report.nextGeneration).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Data Sources ({report.dataSources.length})</h5>
              <div className="flex flex-wrap gap-2">
                {report.dataSources.map(source => (
                  <span key={source} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {report.visualizations.length > 0 && (
              <div className="bg-white p-4 rounded mt-4">
                <h5 className="font-medium text-gray-900 mb-3">Visualizations ({report.visualizations.length})</h5>
                <div className="space-y-2">
                  {report.visualizations.map(viz => (
                    <div key={viz.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{viz.name}</p>
                        <p className="text-xs text-gray-600">{viz.type} • {viz.chartType}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(viz.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboards = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Management</h3>
      <div className="space-y-6">
        {dashboards.map(dashboard => (
          <div key={dashboard.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{dashboard.name}</h4>
                <p className="text-sm text-gray-600">{dashboard.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dashboard.status)}`}>
                  {dashboard.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                  {dashboard.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Layout</p>
                <p className="text-sm text-gray-900">{dashboard.layout.columns}x{dashboard.layout.rows}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Widgets</p>
                <p className="text-sm text-gray-900">{dashboard.widgets.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Created By</p>
                <p className="text-sm text-gray-900">{dashboard.createdBy}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Modified</p>
                <p className="text-sm text-gray-900">{new Date(dashboard.lastModified).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Widgets ({dashboard.widgets.length})</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dashboard.widgets.map(widget => (
                  <div key={widget.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{widget.name}</p>
                      <p className="text-xs text-gray-600">{widget.type} • {widget.dataSource}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{widget.refreshInterval}s</p>
                      <p className="text-xs text-gray-500">
                        {new Date(widget.lastUpdated).toLocaleString()}
                      </p>
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

  const renderDataSources = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h3>
      <div className="space-y-6">
        {dataSources.map(source => (
          <div key={source.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-600">{source.type} • {source.connection}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(source.status)}`}>
                {source.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-sm text-gray-900 capitalize">{source.type}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Tables</p>
                <p className="text-sm text-gray-900">{source.tables.length}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Sync</p>
                <p className="text-sm text-gray-900">{new Date(source.lastSync).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Schema ({source.schema.length} tables)</h5>
              <div className="space-y-3">
                {source.schema.map(table => (
                  <div key={table.table} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-gray-900">{table.table}</h6>
                      <span className="text-sm text-gray-500">{table.rowCount.toLocaleString()} rows</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {table.columns.slice(0, 4).map(column => (
                        <div key={column.name} className="text-xs text-gray-600">
                          <span className="font-medium">{column.name}</span>
                          <span className="ml-2 text-gray-500">({column.type})</span>
                        </div>
                      ))}
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

  const renderBusinessIntelligence = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Intelligence</h3>
      <div className="space-y-4">
        {businessIntelligence.map(bi => (
          <div key={bi.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{bi.name}</h4>
                <p className="text-sm text-gray-600">{bi.type} • {bi.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bi.status)}`}>
                  {bi.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                  {bi.category}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-sm text-gray-900 capitalize">{bi.type}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Data Source</p>
                <p className="text-sm text-gray-900">{bi.dataSource}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Schedule</p>
                <p className="text-sm text-gray-900 capitalize">{bi.schedule}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Recipients</p>
                <p className="text-sm text-gray-900">{bi.recipients.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Query</h5>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                {bi.query}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Executed</p>
                <p className="text-sm text-gray-900">{new Date(bi.lastExecuted).toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Execution</p>
                <p className="text-sm text-gray-900">{new Date(bi.nextExecution).toLocaleString()}</p>
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
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics & Reporting</h1>
          <p className="text-gray-600 mt-2">
            Advanced analytics dashboard, custom reporting engine, data visualization tools, and business intelligence
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'metrics', label: 'Metrics' },
              { id: 'reports', label: 'Reports' },
              { id: 'dashboards', label: 'Dashboards' },
              { id: 'datasources', label: 'Data Sources' },
              { id: 'bi', label: 'Business Intelligence' }
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
          {activeTab === 'metrics' && renderMetrics()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'dashboards' && renderDashboards()}
          {activeTab === 'datasources' && renderDataSources()}
          {activeTab === 'bi' && renderBusinessIntelligence()}
        </div>
      </div>
    </div>
  );
} 