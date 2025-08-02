// Enterprise Analytics Dashboard for CodePal
// Features: Advanced BI, custom dashboards, executive reporting, data export

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'percentage' | 'currency' | 'duration' | 'ratio';
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  unit: string;
  category: string;
  timeRange: string;
  lastUpdated: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'custom';
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'heatmap' | 'gauge' | 'funnel';
  title: string;
  config: WidgetConfig;
  data: any;
  position: { x: number; y: number; w: number; h: number };
}

interface WidgetConfig {
  metricId?: string;
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  timeRange?: string;
  filters?: Record<string, any>;
  refreshInterval?: number;
  thresholds?: {
    warning: number;
    critical: number;
  };
}

interface DashboardLayout {
  columns: number;
  rows: number;
  cellSize: { width: number; height: number };
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'on-demand' | 'real-time';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    timezone: string;
    recipients: string[];
  };
  filters: Record<string, any>;
  createdAt: string;
  lastRun?: string;
  nextRun?: string;
}

interface DataExport {
  id: string;
  name: string;
  description: string;
  query: string;
  format: 'csv' | 'excel' | 'json' | 'xml';
  filters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
}

interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  owner: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export default function EnterpriseAnalytics() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [exports, setExports] = useState<DataExport[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load metrics
      const metricsResponse = await fetch(`/api/enterprise/analytics/metrics?timeRange=${timeRange}`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      // Load dashboards
      const dashboardsResponse = await fetch('/api/enterprise/analytics/dashboards');
      if (dashboardsResponse.ok) {
        const dashboardsData = await dashboardsResponse.json();
        setDashboards(dashboardsData);
      }

      // Load reports
      const reportsResponse = await fetch('/api/enterprise/analytics/reports');
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
      }

      // Load exports
      const exportsResponse = await fetch('/api/enterprise/analytics/exports');
      if (exportsResponse.ok) {
        const exportsData = await exportsResponse.json();
        setExports(exportsData);
      }

      // Load KPIs
      const kpisResponse = await fetch('/api/enterprise/analytics/kpis');
      if (kpisResponse.ok) {
        const kpisData = await kpisResponse.json();
        setKpis(kpisData);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dashboard Management
  const createDashboard = async (dashboardData: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/enterprise/analytics/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboardData)
      });

      if (response.ok) {
        const newDashboard = await response.json();
        setDashboards(prev => [...prev, newDashboard]);
      }
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const updateDashboard = async (dashboardId: string, updates: Partial<Dashboard>) => {
    try {
      const response = await fetch(`/api/enterprise/analytics/dashboards/${dashboardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedDashboard = await response.json();
        setDashboards(prev => prev.map(dashboard => dashboard.id === dashboardId ? updatedDashboard : dashboard));
      }
    } catch (error) {
      console.error('Failed to update dashboard:', error);
    }
  };

  const deleteDashboard = async (dashboardId: string) => {
    if (!confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }

    try {
      const response = await fetch(`/api/enterprise/analytics/dashboards/${dashboardId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDashboards(prev => prev.filter(dashboard => dashboard.id !== dashboardId));
      }
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
    }
  };

  // Report Management
  const createReport = async (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/enterprise/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports(prev => [...prev, newReport]);
      }
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const runReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/enterprise/analytics/reports/${reportId}/run`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        // Handle report generation result
        console.log('Report generated:', result);
      }
    } catch (error) {
      console.error('Failed to run report:', error);
    }
  };

  // Data Export
  const createExport = async (exportData: Omit<DataExport, 'id' | 'createdAt' | 'status'>) => {
    try {
      const response = await fetch('/api/enterprise/analytics/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData)
      });

      if (response.ok) {
        const newExport = await response.json();
        setExports(prev => [...prev, newExport]);
      }
    } catch (error) {
      console.error('Failed to create export:', error);
    }
  };

  // Get metric change color
  const getMetricChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-400';
      case 'decrease': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get KPI status color
  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-400';
      case 'at-risk': return 'text-yellow-400';
      case 'behind': return 'text-red-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  // Get export status color
  const getExportStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const AnalyticsOverview = () => (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Analytics Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
        >
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.slice(0, 8).map(metric => (
          <div key={metric.id} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">{metric.name}</h4>
              <span className={`text-sm ${getMetricChangeColor(metric.changeType)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {metric.value.toLocaleString()}{metric.unit}
            </div>
            <p className="text-gray-400 text-sm">{metric.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              {metric.category} • {metric.timeRange}
            </div>
          </div>
        ))}
      </div>

      {/* KPI Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">KPI Performance</h3>
          <div className="space-y-4">
            {kpis.slice(0, 5).map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-300 font-medium">{kpi.name}</div>
                  <div className="text-gray-400 text-sm">{kpi.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-300 font-semibold">
                    {kpi.current.toLocaleString()}{kpi.unit}
                  </div>
                  <div className={`text-sm ${getKPIStatusColor(kpi.status)}`}>
                    {kpi.status.replace('-', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {reports.slice(0, 5).map(report => (
              <div key={report.id} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-300 font-medium">{report.name}</div>
                  <div className="text-gray-400 text-sm">{report.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-300 text-sm">
                    {report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="text-gray-400 text-xs">{report.format.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Dashboard Builder</h3>
        <button
          onClick={() => setActiveTab('create-dashboard')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map(dashboard => (
          <div
            key={dashboard.id}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setSelectedDashboard(dashboard)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{dashboard.name}</h4>
                <p className="text-gray-400 text-sm">{dashboard.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                dashboard.type === 'executive' ? 'bg-purple-900 text-purple-200' :
                dashboard.type === 'operational' ? 'bg-blue-900 text-blue-200' :
                'bg-green-900 text-green-200'
              }`}>
                {dashboard.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Widgets:</span>
                <span className="text-gray-300">{dashboard.widgets.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Visibility:</span>
                <span className="text-gray-300">{dashboard.isPublic ? 'Public' : 'Private'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Updated:</span>
                <span className="text-gray-300 text-xs">
                  {new Date(dashboard.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDashboard(dashboard);
                  setActiveTab('edit-dashboard');
                }}
                className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDashboard(dashboard);
                  setActiveTab('view-dashboard');
                }}
                className="flex-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDashboard(dashboard.id);
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

  const ReportCenter = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Report Center</h3>
        <button
          onClick={() => setActiveTab('create-report')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create Report
        </button>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">Report Name</th>
                <th className="text-left text-gray-300 py-3 px-4">Type</th>
                <th className="text-left text-gray-300 py-3 px-4">Format</th>
                <th className="text-left text-gray-300 py-3 px-4">Schedule</th>
                <th className="text-left text-gray-300 py-3 px-4">Last Run</th>
                <th className="text-left text-gray-300 py-3 px-4">Next Run</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-300 font-medium">{report.name}</div>
                      <div className="text-gray-400 text-xs">{report.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.type === 'scheduled' ? 'bg-blue-900 text-blue-200' :
                      report.type === 'on-demand' ? 'bg-green-900 text-green-200' :
                      'bg-purple-900 text-purple-200'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{report.format.toUpperCase()}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {report.schedule ? `${report.schedule.frequency} at ${report.schedule.time}` : 'Manual'}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {report.lastRun ? new Date(report.lastRun).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {report.nextRun ? new Date(report.nextRun).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => runReport(report.id)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        Run
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('edit-report');
                        }}
                        className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                      >
                        Edit
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

  const DataExports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Data Exports</h3>
        <button
          onClick={() => setActiveTab('create-export')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create Export
        </button>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-3 px-4">Export Name</th>
                <th className="text-left text-gray-300 py-3 px-4">Format</th>
                <th className="text-left text-gray-300 py-3 px-4">Status</th>
                <th className="text-left text-gray-300 py-3 px-4">Created</th>
                <th className="text-left text-gray-300 py-3 px-4">Completed</th>
                <th className="text-left text-gray-300 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exports.map(exportItem => (
                <tr key={exportItem.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-300 font-medium">{exportItem.name}</div>
                      <div className="text-gray-400 text-xs">{exportItem.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{exportItem.format.toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getExportStatusColor(exportItem.status)}`}>
                      {exportItem.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(exportItem.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {exportItem.completedAt ? new Date(exportItem.completedAt).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {exportItem.status === 'completed' && exportItem.downloadUrl && (
                      <a
                        href={exportItem.downloadUrl}
                        download
                        className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                      >
                        Download
                      </a>
                    )}
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
        <div className="text-white text-xl">Loading enterprise analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Enterprise Analytics</h1>
        <p className="text-gray-300">Advanced business intelligence and reporting for enterprise organizations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'dashboards', label: 'Dashboards', icon: '📈' },
            { id: 'reports', label: 'Reports', icon: '📋' },
            { id: 'exports', label: 'Data Exports', icon: '📤' },
            { id: 'kpis', label: 'KPIs', icon: '🎯' },
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
        {activeTab === 'overview' && <AnalyticsOverview />}
        {activeTab === 'dashboards' && <DashboardBuilder />}
        {activeTab === 'reports' && <ReportCenter />}
        {activeTab === 'exports' && <DataExports />}
        {activeTab === 'kpis' && (
          <div className="text-gray-300">
            KPI management interface will be implemented here.
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-gray-300">
            Analytics settings will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
} 