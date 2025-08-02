// Advanced Data Visualization & Reporting for CodePal
// Features: Advanced charting library, interactive visualizations, custom reporting engine, data export capabilities

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Chart {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'gauge' | 'funnel';
  dataSource: string;
  config: ChartConfig;
  data: ChartDataPoint[];
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  permissions: string[];
  createdBy: string;
  createdAt: string;
}

interface ChartConfig {
  title: string;
  subtitle?: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  colors: string[];
  animations: boolean;
  responsive: boolean;
  legend: LegendConfig;
  tooltips: TooltipConfig;
  grid: GridConfig;
}

interface AxisConfig {
  title: string;
  type: 'linear' | 'log' | 'category' | 'time';
  format?: string;
  min?: number;
  max?: number;
  ticks: number;
}

interface LegendConfig {
  enabled: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  orientation: 'horizontal' | 'vertical';
}

interface TooltipConfig {
  enabled: boolean;
  format: string;
  backgroundColor: string;
  borderColor: string;
}

interface GridConfig {
  enabled: boolean;
  color: string;
  opacity: number;
  dashArray: string;
}

interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

interface Visualization {
  id: string;
  name: string;
  type: 'dashboard' | 'report' | 'widget';
  charts: string[];
  layout: LayoutConfig;
  filters: FilterConfig[];
  refreshInterval: number;
  status: 'active' | 'draft' | 'archived';
  permissions: string[];
  createdBy: string;
  createdAt: string;
}

interface LayoutConfig {
  type: 'grid' | 'flexible' | 'responsive';
  columns: number;
  rows: number;
  items: LayoutItem[];
}

interface LayoutItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  chartId: string;
}

interface FilterConfig {
  id: string;
  name: string;
  type: 'date' | 'number' | 'string' | 'boolean';
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
  defaultValue?: any;
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'on-demand' | 'real-time';
  template: ReportTemplate;
  dataSources: string[];
  filters: FilterConfig[];
  schedule?: ScheduleConfig;
  format: 'pdf' | 'excel' | 'csv' | 'html';
  status: 'active' | 'draft' | 'archived';
  lastGenerated?: string;
  permissions: string[];
  createdBy: string;
  createdAt: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  sections: ReportSection[];
  styling: ReportStyling;
}

interface ReportSection {
  id: string;
  type: 'header' | 'content' | 'chart' | 'table' | 'summary';
  title?: string;
  content?: string;
  chartId?: string;
  tableConfig?: TableConfig;
  position: number;
}

interface TableConfig {
  columns: TableColumn[];
  data: any[];
  pagination: boolean;
  pageSize: number;
  sorting: boolean;
  filtering: boolean;
}

interface TableColumn {
  field: string;
  header: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
  sortable: boolean;
  filterable: boolean;
  width?: number;
}

interface ReportStyling {
  theme: 'light' | 'dark' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  logo?: string;
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone: string;
  enabled: boolean;
}

interface DataExport {
  id: string;
  name: string;
  type: 'chart' | 'report' | 'dataset';
  sourceId: string;
  format: 'csv' | 'excel' | 'json' | 'xml';
  filters: FilterConfig[];
  schedule?: ScheduleConfig;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
  completedAt?: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  visualizations: string[];
  layout: LayoutConfig;
  theme: DashboardTheme;
  refreshInterval: number;
  status: 'active' | 'draft' | 'archived';
  permissions: string[];
  createdBy: string;
  createdAt: string;
}

interface DashboardTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export default function AdvancedDataVisualizationReporting() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'visualizations' | 'reports' | 'exports' | 'dashboards'>('overview');
  const [charts, setCharts] = useState<Chart[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataExports, setDataExports] = useState<DataExport[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisualizationData();
  }, []);

  const loadVisualizationData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCharts: Chart[] = [
        {
          id: 'chart-1',
          name: 'Revenue Trends',
          type: 'line',
          dataSource: 'sales_data',
          config: {
            title: 'Monthly Revenue Trends',
            subtitle: 'Last 12 months',
            xAxis: { title: 'Month', type: 'category', ticks: 12 },
            yAxis: { title: 'Revenue ($)', type: 'linear', format: 'currency' },
            colors: ['#3B82F6', '#10B981', '#F59E0B'],
            animations: true,
            responsive: true,
            legend: { enabled: true, position: 'top', orientation: 'horizontal' },
            tooltips: { enabled: true, format: 'currency', backgroundColor: '#1F2937', borderColor: '#374151' },
            grid: { enabled: true, color: '#E5E7EB', opacity: 0.5, dashArray: '5,5' }
          },
          data: [
            { x: 'Jan', y: 45000, label: 'January' },
            { x: 'Feb', y: 52000, label: 'February' },
            { x: 'Mar', y: 48000, label: 'March' },
            { x: 'Apr', y: 61000, label: 'April' },
            { x: 'May', y: 55000, label: 'May' },
            { x: 'Jun', y: 67000, label: 'June' }
          ],
          lastUpdated: '2024-01-15T10:30:00Z',
          status: 'active',
          permissions: ['view', 'edit'],
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'chart-2',
          name: 'User Distribution',
          type: 'pie',
          dataSource: 'user_data',
          config: {
            title: 'User Distribution by Region',
            xAxis: { title: 'Region', type: 'category', ticks: 5 },
            yAxis: { title: 'Users', type: 'linear' },
            colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
            animations: true,
            responsive: true,
            legend: { enabled: true, position: 'right', orientation: 'vertical' },
            tooltips: { enabled: true, format: 'number', backgroundColor: '#1F2937', borderColor: '#374151' },
            grid: { enabled: false, color: '#E5E7EB', opacity: 0.5, dashArray: '5,5' }
          },
          data: [
            { x: 'North America', y: 45, label: 'North America' },
            { x: 'Europe', y: 30, label: 'Europe' },
            { x: 'Asia Pacific', y: 15, label: 'Asia Pacific' },
            { x: 'Latin America', y: 7, label: 'Latin America' },
            { x: 'Africa', y: 3, label: 'Africa' }
          ],
          lastUpdated: '2024-01-15T09:15:00Z',
          status: 'active',
          permissions: ['view'],
          createdBy: 'analyst',
          createdAt: '2024-01-05T00:00:00Z'
        }
      ];

      const mockVisualizations: Visualization[] = [
        {
          id: 'viz-1',
          name: 'Executive Dashboard',
          type: 'dashboard',
          charts: ['chart-1', 'chart-2'],
          layout: {
            type: 'grid',
            columns: 2,
            rows: 2,
            items: [
              { id: 'item-1', x: 0, y: 0, width: 1, height: 1, chartId: 'chart-1' },
              { id: 'item-2', x: 1, y: 0, width: 1, height: 1, chartId: 'chart-2' }
            ]
          },
          filters: [
            { id: 'filter-1', name: 'Date Range', type: 'date', field: 'date', operator: 'between', value: ['2024-01-01', '2024-12-31'] }
          ],
          refreshInterval: 300,
          status: 'active',
          permissions: ['view'],
          createdBy: 'admin',
          createdAt: '2024-01-10T00:00:00Z'
        }
      ];

      const mockReports: Report[] = [
        {
          id: 'report-1',
          name: 'Monthly Performance Report',
          description: 'Comprehensive monthly performance analysis',
          type: 'scheduled',
          template: {
            id: 'template-1',
            name: 'Standard Monthly Report',
            sections: [
              { id: 'section-1', type: 'header', title: 'Monthly Performance Report', position: 1 },
              { id: 'section-2', type: 'chart', chartId: 'chart-1', position: 2 },
              { id: 'section-3', type: 'summary', content: 'Key insights and recommendations', position: 3 }
            ],
            styling: {
              theme: 'light',
              primaryColor: '#3B82F6',
              secondaryColor: '#1F2937',
              fontFamily: 'Inter',
              fontSize: 12
            }
          },
          dataSources: ['sales_data', 'user_data'],
          filters: [],
          schedule: {
            frequency: 'monthly',
            time: '09:00',
            dayOfMonth: 1,
            timezone: 'UTC',
            enabled: true
          },
          format: 'pdf',
          status: 'active',
          permissions: ['view', 'edit'],
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      const mockExports: DataExport[] = [
        {
          id: 'export-1',
          name: 'Revenue Data Export',
          type: 'dataset',
          sourceId: 'sales_data',
          format: 'excel',
          filters: [],
          status: 'completed',
          fileUrl: '/exports/revenue_data.xlsx',
          fileSize: 2048576,
          createdAt: '2024-01-15T08:00:00Z',
          completedAt: '2024-01-15T08:05:00Z'
        }
      ];

      const mockDashboards: Dashboard[] = [
        {
          id: 'dashboard-1',
          name: 'Executive Overview',
          description: 'High-level business metrics and KPIs',
          visualizations: ['viz-1'],
          layout: {
            type: 'responsive',
            columns: 3,
            rows: 2,
            items: []
          },
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1F2937',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            accentColor: '#10B981',
            fontFamily: 'Inter'
          },
          refreshInterval: 300,
          status: 'active',
          permissions: ['view'],
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      setCharts(mockCharts);
      setVisualizations(mockVisualizations);
      setReports(mockReports);
      setDataExports(mockExports);
      setDashboards(mockDashboards);
    } catch (error) {
      console.error('Error loading visualization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChartTypeIcon = (type: string) => {
    switch (type) {
      case 'line': return '📈';
      case 'bar': return '📊';
      case 'pie': return '🥧';
      case 'scatter': return '🔍';
      case 'area': return '📊';
      case 'heatmap': return '🔥';
      case 'gauge': return '🎯';
      case 'funnel': return '🫖';
      default: return '📊';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Charts</p>
              <p className="text-2xl font-bold text-gray-900">{charts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dashboards</p>
              <p className="text-2xl font-bold text-gray-900">{dashboards.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🖥️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">15% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Exports</p>
              <p className="text-2xl font-bold text-gray-900">{dataExports.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">📤</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500">↗</span>
              <span className="ml-1">5% from last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Charts</h3>
          <div className="space-y-3">
            {charts.slice(0, 3).map((chart) => (
              <div key={chart.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getChartTypeIcon(chart.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{chart.name}</p>
                    <p className="text-sm text-gray-500">{chart.dataSource}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chart.status)}`}>
                  {chart.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Charts Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create New Chart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <div key={chart.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getChartTypeIcon(chart.type)}</span>
                <h3 className="font-semibold text-gray-900">{chart.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chart.status)}`}>
                {chart.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{chart.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data Source:</span>
                <span className="font-medium">{chart.config.dataSource}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data Points:</span>
                <span className="font-medium">{chart.data.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium">{new Date(chart.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View
                </button>
                <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVisualizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Visualizations</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Visualization
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizations.map((viz) => (
          <div key={viz.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🖥️</span>
                <h3 className="font-semibold text-gray-900">{viz.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viz.status)}`}>
                {viz.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{viz.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Charts:</span>
                <span className="font-medium">{viz.charts.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Layout:</span>
                <span className="font-medium">{viz.layout.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Refresh:</span>
                <span className="font-medium">{viz.refreshInterval}s</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-semibold text-gray-900">{report.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{report.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{report.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Format:</span>
                <span className="font-medium uppercase">{report.format}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data Sources:</span>
                <span className="font-medium">{report.dataSources.length}</span>
              </div>
              {report.lastGenerated && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Generated:</span>
                  <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Generate
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Exports</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Export
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataExports.map((export_) => (
              <tr key={export_.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{export_.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{export_.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 uppercase">{export_.format}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(export_.status)}`}>
                    {export_.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {export_.fileSize ? formatFileSize(export_.fileSize) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(export_.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Download</button>
                    <button className="text-gray-600 hover:text-gray-900">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDashboards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Dashboards</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🖥️</span>
                <h3 className="font-semibold text-gray-900">{dashboard.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dashboard.status)}`}>
                {dashboard.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{dashboard.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Visualizations:</span>
                <span className="font-medium">{dashboard.visualizations.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Layout:</span>
                <span className="font-medium">{dashboard.layout.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Refresh:</span>
                <span className="font-medium">{dashboard.refreshInterval}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Theme:</span>
                <span className="font-medium capitalize">{dashboard.theme.primaryColor}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  View
                </button>
                <button className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors">
                  Share
                </button>
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
          <p className="mt-4 text-gray-600">Loading visualization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Data Visualization & Reporting</h1>
          <p className="mt-2 text-gray-600">
            Create, manage, and share advanced charts, reports, and interactive dashboards
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'charts', name: 'Charts', icon: '📈' },
                { id: 'visualizations', name: 'Visualizations', icon: '🖥️' },
                { id: 'reports', name: 'Reports', icon: '📋' },
                { id: 'exports', name: 'Data Exports', icon: '📤' },
                { id: 'dashboards', name: 'Dashboards', icon: '🖥️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'charts' && renderCharts()}
            {activeTab === 'visualizations' && renderVisualizations()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'exports' && renderExports()}
            {activeTab === 'dashboards' && renderDashboards()}
          </div>
        </div>
      </div>
    </div>
  );
} 