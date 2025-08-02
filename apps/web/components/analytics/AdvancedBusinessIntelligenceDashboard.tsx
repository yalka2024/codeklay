// Advanced Business Intelligence Dashboard for CodePal
// Features: Comprehensive BI dashboard, KPI tracking, data visualization, business insights

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  category: 'revenue' | 'performance' | 'quality' | 'user' | 'technical';
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeding';
  lastUpdated: string;
}

interface BusinessMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  category: string;
  description: string;
  dataPoints: DataPoint[];
  forecast: ForecastData[];
}

interface DataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

interface ForecastData {
  timestamp: string;
  predictedValue: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'recommendation';
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  category: string;
  actionable: boolean;
  recommendations: string[];
  relatedMetrics: string[];
  createdAt: string;
  expiresAt?: string;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'heatmap';
  size: 'small' | 'medium' | 'large' | 'full';
  position: WidgetPosition;
  config: WidgetConfig;
  data: any;
  lastUpdated: string;
}

interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  timeRange?: string;
  refreshInterval?: number;
  thresholds?: ThresholdConfig[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}

interface ThresholdConfig {
  value: number;
  color: string;
  label: string;
}

interface BusinessReport {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'technical' | 'financial';
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  widgets: string[];
  lastGenerated: string;
  nextGeneration: string;
  status: 'active' | 'paused' | 'error';
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  connection: DataConnection;
  schema: DataSchema;
  refreshSchedule: string;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error';
  metrics: DataSourceMetric[];
}

interface DataConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  encrypted: boolean;
  ssl: boolean;
}

interface DataSchema {
  tables: SchemaTable[];
  views: SchemaView[];
  procedures: SchemaProcedure[];
}

interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  rowCount: number;
  size: string;
  lastUpdated: string;
}

interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
}

interface SchemaView {
  name: string;
  definition: string;
  columns: SchemaColumn[];
}

interface SchemaProcedure {
  name: string;
  parameters: ProcedureParameter[];
  returnType: string;
}

interface ProcedureParameter {
  name: string;
  type: string;
  direction: 'in' | 'out' | 'inout';
  defaultValue?: string;
}

interface DataSourceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  actions: AlertAction[];
  lastTriggered?: string;
  triggerCount: number;
}

interface AlertAction {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  target: string;
  message: string;
  enabled: boolean;
}

export default function AdvancedBusinessIntelligenceDashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'insights' | 'reports' | 'datasources' | 'alerts'>('overview');
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [businessInsights, setBusinessInsights] = useState<BusinessInsight[]>([]);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [businessReports, setBusinessReports] = useState<BusinessReport[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBIData();
  }, []);

  const loadBIData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockKPIMetrics: KPIMetric[] = [
        {
          id: '1',
          name: 'Monthly Recurring Revenue',
          value: 1250000,
          target: 1200000,
          unit: 'USD',
          trend: 'up',
          change: 4.2,
          period: 'month',
          category: 'revenue',
          status: 'exceeding',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'Customer Acquisition Cost',
          value: 150,
          target: 120,
          unit: 'USD',
          trend: 'down',
          change: -8.5,
          period: 'month',
          category: 'performance',
          status: 'on_track',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '3',
          name: 'Code Quality Score',
          value: 87,
          target: 90,
          unit: '%',
          trend: 'up',
          change: 2.1,
          period: 'week',
          category: 'quality',
          status: 'at_risk',
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '4',
          name: 'Active Users',
          value: 45000,
          target: 50000,
          unit: 'users',
          trend: 'up',
          change: 12.5,
          period: 'month',
          category: 'user',
          status: 'behind',
          lastUpdated: '2024-03-20T10:00:00Z'
        }
      ];

      const mockBusinessMetrics: BusinessMetric[] = [
        {
          id: '1',
          name: 'Revenue Growth',
          currentValue: 1250000,
          previousValue: 1200000,
          change: 50000,
          changePercent: 4.2,
          trend: 'increasing',
          category: 'Financial',
          description: 'Monthly recurring revenue growth',
          dataPoints: [
            { timestamp: '2024-01-01T00:00:00Z', value: 1100000 },
            { timestamp: '2024-02-01T00:00:00Z', value: 1150000 },
            { timestamp: '2024-03-01T00:00:00Z', value: 1200000 },
            { timestamp: '2024-03-20T00:00:00Z', value: 1250000 }
          ],
          forecast: [
            { timestamp: '2024-04-01T00:00:00Z', predictedValue: 1300000, confidence: 0.85, upperBound: 1350000, lowerBound: 1250000 },
            { timestamp: '2024-05-01T00:00:00Z', predictedValue: 1350000, confidence: 0.80, upperBound: 1400000, lowerBound: 1300000 }
          ]
        },
        {
          id: '2',
          name: 'User Engagement',
          currentValue: 78,
          previousValue: 75,
          change: 3,
          changePercent: 4.0,
          trend: 'increasing',
          category: 'User',
          description: 'Daily active user percentage',
          dataPoints: [
            { timestamp: '2024-01-01T00:00:00Z', value: 70 },
            { timestamp: '2024-02-01T00:00:00Z', value: 72 },
            { timestamp: '2024-03-01T00:00:00Z', value: 75 },
            { timestamp: '2024-03-20T00:00:00Z', value: 78 }
          ],
          forecast: [
            { timestamp: '2024-04-01T00:00:00Z', predictedValue: 80, confidence: 0.90, upperBound: 82, lowerBound: 78 },
            { timestamp: '2024-05-01T00:00:00Z', predictedValue: 82, confidence: 0.85, upperBound: 84, lowerBound: 80 }
          ]
        }
      ];

      const mockBusinessInsights: BusinessInsight[] = [
        {
          id: '1',
          title: 'Revenue Growth Opportunity',
          description: 'Enterprise segment shows 25% higher conversion rate than SMB segment',
          type: 'opportunity',
          impact: 'high',
          confidence: 0.92,
          category: 'Revenue',
          actionable: true,
          recommendations: [
            'Increase marketing spend on enterprise segment',
            'Develop enterprise-specific features',
            'Optimize pricing for enterprise customers'
          ],
          relatedMetrics: ['MRR', 'Conversion Rate', 'Customer Lifetime Value'],
          createdAt: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          title: 'Code Quality Decline Risk',
          description: 'Code quality score has decreased by 3% over the last month',
          type: 'risk',
          impact: 'medium',
          confidence: 0.88,
          category: 'Quality',
          actionable: true,
          recommendations: [
            'Implement stricter code review processes',
            'Add automated quality gates',
            'Provide developer training on best practices'
          ],
          relatedMetrics: ['Code Quality Score', 'Bug Rate', 'Technical Debt'],
          createdAt: '2024-03-20T10:00:00Z'
        }
      ];

      const mockDashboardWidgets: DashboardWidget[] = [
        {
          id: '1',
          title: 'Revenue Trend',
          type: 'chart',
          size: 'large',
          position: { x: 0, y: 0, width: 8, height: 4 },
          config: {
            chartType: 'line',
            timeRange: '30d',
            refreshInterval: 300,
            showLegend: true,
            showGrid: true
          },
          data: mockBusinessMetrics[0].dataPoints,
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          title: 'KPI Summary',
          type: 'metric',
          size: 'medium',
          position: { x: 8, y: 0, width: 4, height: 4 },
          config: {
            thresholds: [
              { value: 90, color: 'green', label: 'Excellent' },
              { value: 75, color: 'yellow', label: 'Good' },
              { value: 60, color: 'red', label: 'Needs Attention' }
            ]
          },
          data: mockKPIMetrics,
          lastUpdated: '2024-03-20T10:00:00Z'
        }
      ];

      const mockBusinessReports: BusinessReport[] = [
        {
          id: '1',
          name: 'Executive Dashboard',
          description: 'High-level business metrics for executive review',
          type: 'executive',
          schedule: 'daily',
          recipients: ['ceo@codepal.com', 'cto@codepal.com'],
          widgets: ['1', '2', '3'],
          lastGenerated: '2024-03-20T08:00:00Z',
          nextGeneration: '2024-03-21T08:00:00Z',
          status: 'active'
        },
        {
          id: '2',
          name: 'Operational Metrics',
          description: 'Daily operational performance metrics',
          type: 'operational',
          schedule: 'daily',
          recipients: ['ops@codepal.com'],
          widgets: ['4', '5', '6'],
          lastGenerated: '2024-03-20T06:00:00Z',
          nextGeneration: '2024-03-21T06:00:00Z',
          status: 'active'
        }
      ];

      const mockDataSources: DataSource[] = [
        {
          id: '1',
          name: 'Production Database',
          type: 'database',
          connection: {
            host: 'db.codepal.com',
            port: 5432,
            database: 'codepal_prod',
            username: 'bi_user',
            encrypted: true,
            ssl: true
          },
          schema: {
            tables: [
              {
                name: 'users',
                columns: [
                  { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
                  { name: 'email', type: 'varchar', nullable: false, primaryKey: false },
                  { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false }
                ],
                rowCount: 50000,
                size: '2.5GB',
                lastUpdated: '2024-03-20T10:00:00Z'
              }
            ],
            views: [],
            procedures: []
          },
          refreshSchedule: '5m',
          lastSync: '2024-03-20T10:00:00Z',
          status: 'connected',
          metrics: [
            {
              name: 'Row Count',
              value: 50000,
              unit: 'rows',
              trend: 'up',
              lastUpdated: '2024-03-20T10:00:00Z'
            }
          ]
        }
      ];

      const mockAlertRules: AlertRule[] = [
        {
          id: '1',
          name: 'Revenue Drop Alert',
          description: 'Alert when monthly revenue drops below threshold',
          metric: 'Monthly Recurring Revenue',
          condition: 'less_than',
          threshold: 1000000,
          severity: 'high',
          enabled: true,
          actions: [
            {
              type: 'email',
              target: 'ceo@codepal.com',
              message: 'Revenue has dropped below $1M threshold',
              enabled: true
            }
          ],
          triggerCount: 0
        },
        {
          id: '2',
          name: 'Code Quality Alert',
          description: 'Alert when code quality score drops below 80%',
          metric: 'Code Quality Score',
          condition: 'less_than',
          threshold: 80,
          severity: 'medium',
          enabled: true,
          actions: [
            {
              type: 'slack',
              target: '#engineering',
              message: 'Code quality score has dropped below 80%',
              enabled: true
            }
          ],
          triggerCount: 2,
          lastTriggered: '2024-03-19T15:30:00Z'
        }
      ];

      setKpiMetrics(mockKPIMetrics);
      setBusinessMetrics(mockBusinessMetrics);
      setBusinessInsights(mockBusinessInsights);
      setDashboardWidgets(mockDashboardWidgets);
      setBusinessReports(mockBusinessReports);
      setDataSources(mockDataSources);
      setAlertRules(mockAlertRules);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeding': return 'text-green-600 bg-green-100';
      case 'on_track': return 'text-blue-600 bg-blue-100';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'increasing': return 'text-green-600';
      case 'down':
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiMetrics.map(kpi => (
          <div key={kpi.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                {kpi.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                {kpi.unit === 'USD' ? formatCurrency(kpi.value) : formatNumber(kpi.value)}
                <span className="text-lg text-gray-500 ml-1">{kpi.unit}</span>
              </p>
              <p className="text-sm text-gray-600">Target: {kpi.unit === 'USD' ? formatCurrency(kpi.target) : formatNumber(kpi.target)}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {Math.abs(kpi.change)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last {kpi.period}</span>
              </div>
              <span className="text-xs text-gray-500 capitalize">{kpi.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Insights</h3>
          <div className="space-y-4">
            {businessInsights.slice(0, 3).map(insight => (
              <div key={insight.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{insight.category}</span>
                  <span>{Math.round(insight.confidence * 100)}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alertRules.filter(alert => alert.lastTriggered).slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{alert.name}</p>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-500">
                    Last triggered: {new Date(alert.lastTriggered!).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{alert.triggerCount} times</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderKPIs = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map(kpi => (
          <div key={kpi.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{kpi.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                {kpi.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">
                {kpi.unit === 'USD' ? formatCurrency(kpi.value) : formatNumber(kpi.value)}
                <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>
              </p>
              <p className="text-sm text-gray-600">Target: {kpi.unit === 'USD' ? formatCurrency(kpi.target) : formatNumber(kpi.target)}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trend</span>
                <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {Math.abs(kpi.change)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Period</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{kpi.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{kpi.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">{new Date(kpi.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Insights</h3>
      <div className="space-y-6">
        {businessInsights.map(insight => (
          <div key={insight.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(insight.impact)}`}>
                  {insight.impact} impact
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  insight.type === 'opportunity' ? 'text-green-600 bg-green-100' :
                  insight.type === 'risk' ? 'text-red-600 bg-red-100' :
                  insight.type === 'trend' ? 'text-blue-600 bg-blue-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {insight.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Confidence</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(insight.confidence * 100)}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-lg font-bold text-gray-900">{insight.category}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Actionable</p>
                <p className="text-lg font-bold text-gray-900">{insight.actionable ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {insight.recommendations.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                <ul className="space-y-1">
                  {insight.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created: {new Date(insight.createdAt).toLocaleDateString()}</span>
              {insight.expiresAt && (
                <span>Expires: {new Date(insight.expiresAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Reports</h3>
      <div className="space-y-6">
        {businessReports.map(report => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <p className="text-sm text-gray-500 mt-1">Type: {report.type} • Schedule: {report.schedule}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'active' ? 'text-green-600 bg-green-100' :
                  report.status === 'paused' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {report.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Recipients</p>
                <p className="text-lg font-bold text-gray-900">{report.recipients.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Widgets</p>
                <p className="text-lg font-bold text-gray-900">{report.widgets.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Generated</p>
                <p className="text-sm text-gray-900">{new Date(report.lastGenerated).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Generation</p>
                <p className="text-sm text-gray-900">{new Date(report.nextGeneration).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Recipients</h5>
              <div className="flex flex-wrap gap-2">
                {report.recipients.map((recipient, index) => (
                  <span key={index} className="px-2 py-1 bg-white rounded text-sm text-gray-700">
                    {recipient}
                  </span>
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
          <div key={source.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-600 mt-1">Type: {source.type} • Host: {source.connection.host}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  source.status === 'connected' ? 'text-green-600 bg-green-100' :
                  source.status === 'disconnected' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {source.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Tables</p>
                <p className="text-lg font-bold text-gray-900">{source.schema.tables.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Views</p>
                <p className="text-lg font-bold text-gray-900">{source.schema.views.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Refresh Schedule</p>
                <p className="text-lg font-bold text-gray-900">{source.refreshSchedule}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Sync</p>
                <p className="text-sm text-gray-900">{new Date(source.lastSync).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Tables</h5>
              <div className="space-y-2">
                {source.schema.tables.map(table => (
                  <div key={table.name} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="font-medium text-gray-900">{table.name}</p>
                      <p className="text-sm text-gray-600">{table.columns.length} columns</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatNumber(table.rowCount)} rows</p>
                      <p className="text-xs text-gray-500">{table.size}</p>
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

  const renderAlerts = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Rules</h3>
      <div className="space-y-6">
        {alertRules.map(alert => (
          <div key={alert.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{alert.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                <p className="text-sm text-gray-500 mt-1">Metric: {alert.metric}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${alert.enabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                  {alert.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Condition</p>
                <p className="text-lg font-bold text-gray-900">{alert.condition.replace('_', ' ')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Threshold</p>
                <p className="text-lg font-bold text-gray-900">{alert.threshold}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Actions</p>
                <p className="text-lg font-bold text-gray-900">{alert.actions.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Triggered</p>
                <p className="text-lg font-bold text-gray-900">{alert.triggerCount} times</p>
              </div>
            </div>

            {alert.lastTriggered && (
              <div className="bg-yellow-50 p-4 rounded mb-4">
                <h5 className="font-medium text-yellow-900 mb-2">Last Triggered</h5>
                <p className="text-sm text-yellow-800">{new Date(alert.lastTriggered).toLocaleString()}</p>
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
          <p className="mt-4 text-gray-600">Loading business intelligence data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Business Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive business intelligence with KPIs, insights, reports, and data analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'kpis', label: 'KPIs' },
              { id: 'insights', label: 'Insights' },
              { id: 'reports', label: 'Reports' },
              { id: 'datasources', label: 'Data Sources' },
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
          {activeTab === 'kpis' && renderKPIs()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'datasources' && renderDataSources()}
          {activeTab === 'alerts' && renderAlerts()}
        </div>
      </div>
    </div>
  );
} 