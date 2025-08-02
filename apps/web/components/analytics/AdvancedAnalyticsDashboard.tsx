// Advanced Analytics Dashboard for CodePal
// Features: Real-time metrics, predictive analytics, interactive visualizations

import React, { useState, useEffect, useMemo } from 'react';
import { useAnalytics, useUserMetrics, useProjectMetrics, useAIMetrics } from '../../hooks/useApi';

interface AnalyticsData {
  users: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    retentionRate: number;
    churnRate: number;
  };
  projects: {
    totalProjects: number;
    activeProjects: number;
    averageContributors: number;
    projectGrowth: number;
    completionRate: number;
    averageDuration: number;
  };
  ai: {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    popularFeatures: string[];
    accuracyRate: number;
    userSatisfaction: number;
  };
  performance: {
    averageLoadTime: number;
    uptime: number;
    errorRate: number;
    peakConcurrentUsers: number;
    apiResponseTime: number;
    databasePerformance: number;
  };
  engagement: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    returningUsers: number;
    featureUsage: Record<string, number>;
    userJourney: any[];
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
    customerLifetimeValue: number;
    revenueGrowth: number;
  };
  learning: {
    totalTutorials: number;
    averageCompletionRate: number;
    popularTopics: string[];
    skillImprovements: number;
    learningPathSuccess: number;
    knowledgeRetention: number;
  };
  collaboration: {
    totalCollaborations: number;
    averageTeamSize: number;
    successfulProjects: number;
    collaborationGrowth: number;
    codeReviewEfficiency: number;
    teamProductivity: number;
  };
}

interface PredictiveInsight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  timeframe: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [showPredictions, setShowPredictions] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const { data: analyticsData, loading: analyticsLoading, refetch: refetchAnalytics } = useAnalytics(timeRange);
  const { data: userMetrics, loading: userLoading } = useUserMetrics(timeRange);
  const { data: projectMetrics, loading: projectLoading } = useProjectMetrics(timeRange);
  const { data: aiMetrics, loading: aiLoading } = useAIMetrics(timeRange);

  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>({});

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAnalytics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refetchAnalytics]);

  // Generate predictive insights
  useEffect(() => {
    if (analyticsData) {
      generatePredictiveInsights(analyticsData);
    }
  }, [analyticsData]);

  // Real-time metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        concurrentSessions: Math.floor(Math.random() * 200) + 100,
        apiRequests: Math.floor(Math.random() * 1000) + 500,
        errorRate: (Math.random() * 2).toFixed(2),
        responseTime: (Math.random() * 100 + 50).toFixed(0)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generatePredictiveInsights = (data: AnalyticsData) => {
    const insights: PredictiveInsight[] = [];

    // User growth prediction
    if (data.users.userGrowth > 10) {
      insights.push({
        type: 'trend',
        title: 'Strong User Growth',
        description: `User base growing at ${data.users.userGrowth}% monthly`,
        confidence: 85,
        impact: 'high',
        recommendation: 'Consider scaling infrastructure to handle increased load',
        timeframe: 'Next 30 days'
      });
    }

    // Churn risk detection
    if (data.users.churnRate > 5) {
      insights.push({
        type: 'risk',
        title: 'High Churn Risk',
        description: `Churn rate at ${data.users.churnRate}% - above industry average`,
        confidence: 78,
        impact: 'high',
        recommendation: 'Implement retention strategies and user feedback collection',
        timeframe: 'Immediate action required'
      });
    }

    // AI performance opportunity
    if (data.ai.accuracyRate < 90) {
      insights.push({
        type: 'opportunity',
        title: 'AI Accuracy Improvement',
        description: `AI accuracy at ${data.ai.accuracyRate}% - room for improvement`,
        confidence: 92,
        impact: 'medium',
        recommendation: 'Review AI model training data and consider retraining',
        timeframe: 'Next 2 weeks'
      });
    }

    // Revenue opportunity
    if (data.revenue.conversionRate < 3) {
      insights.push({
        type: 'opportunity',
        title: 'Conversion Rate Optimization',
        description: `Conversion rate at ${data.revenue.conversionRate}% - below target`,
        confidence: 88,
        impact: 'high',
        recommendation: 'A/B test checkout flow and pricing strategies',
        timeframe: 'Next month'
      });
    }

    setPredictiveInsights(insights);
  };

  const getMetricValue = (metric: string) => {
    if (!analyticsData) return 0;
    
    const metricMap: Record<string, number> = {
      'total-users': analyticsData.users.totalUsers,
      'active-users': analyticsData.users.activeUsers,
      'user-growth': analyticsData.users.userGrowth,
      'total-projects': analyticsData.projects.totalProjects,
      'completion-rate': analyticsData.projects.completionRate,
      'ai-requests': analyticsData.ai.totalRequests,
      'ai-accuracy': analyticsData.ai.accuracyRate,
      'revenue': analyticsData.revenue.totalRevenue,
      'conversion-rate': analyticsData.revenue.conversionRate,
      'session-duration': analyticsData.engagement.averageSessionDuration,
      'error-rate': analyticsData.performance.errorRate,
      'uptime': analyticsData.performance.uptime
    };

    return metricMap[metric] || 0;
  };

  const getMetricTrend = (metric: string) => {
    // Simulate trend data
    const trends: Record<string, 'up' | 'down' | 'stable'> = {
      'total-users': 'up',
      'active-users': 'up',
      'user-growth': 'stable',
      'total-projects': 'up',
      'completion-rate': 'up',
      'ai-requests': 'up',
      'ai-accuracy': 'stable',
      'revenue': 'up',
      'conversion-rate': 'down',
      'session-duration': 'up',
      'error-rate': 'down',
      'uptime': 'stable'
    };

    return trends[metric] || 'stable';
  };

  const getMetricColor = (metric: string, value: number) => {
    const metricConfig: Record<string, { good: number; warning: number }> = {
      'error-rate': { good: 1, warning: 3 },
      'conversion-rate': { good: 5, warning: 3 },
      'ai-accuracy': { good: 95, warning: 90 },
      'uptime': { good: 99.9, warning: 99.5 }
    };

    const config = metricConfig[metric];
    if (!config) return 'text-gray-300';

    if (value >= config.good) return 'text-green-400';
    if (value >= config.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const MetricCard = ({ title, value, trend, color, subtitle }: {
    title: string;
    value: string | number;
    trend: 'up' | 'down' | 'stable';
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        <div className={`text-lg ${color} font-bold`}>
          {typeof value === 'number' && value > 1000 
            ? (value / 1000).toFixed(1) + 'K'
            : typeof value === 'number' && value < 1
            ? (value * 100).toFixed(1) + '%'
            : value}
        </div>
      </div>
      {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
      <div className="flex items-center mt-2">
        <span className={`text-xs ${
          trend === 'up' ? 'text-green-400' : 
          trend === 'down' ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trend}
        </span>
      </div>
    </div>
  );

  const PredictiveInsightCard = ({ insight }: { insight: PredictiveInsight }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      insight.type === 'trend' ? 'bg-blue-900 border-blue-400' :
      insight.type === 'anomaly' ? 'bg-yellow-900 border-yellow-400' :
      insight.type === 'opportunity' ? 'bg-green-900 border-green-400' :
      'bg-red-900 border-red-400'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-semibold text-sm">{insight.title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          insight.impact === 'high' ? 'bg-red-600' :
          insight.impact === 'medium' ? 'bg-yellow-600' :
          'bg-green-600'
        }`}>
          {insight.impact}
        </span>
      </div>
      <p className="text-gray-300 text-xs mb-2">{insight.description}</p>
      <p className="text-gray-400 text-xs mb-2">{insight.recommendation}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Confidence: {insight.confidence}%</span>
        <span className="text-gray-400">{insight.timeframe}</span>
      </div>
    </div>
  );

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading advanced analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-gray-300">Real-time insights and predictive analytics for CodePal platform</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="overview">Overview</option>
            <option value="users">Users</option>
            <option value="projects">Projects</option>
            <option value="ai">AI Performance</option>
            <option value="revenue">Revenue</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Predictions</span>
          </label>

          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value={10000}>10s refresh</option>
            <option value={30000}>30s refresh</option>
            <option value={60000}>1m refresh</option>
            <option value={300000}>5m refresh</option>
          </select>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 border border-green-400">
          <div className="text-green-400 text-sm">Active Users</div>
          <div className="text-white text-2xl font-bold">{realTimeMetrics.activeUsers || 0}</div>
          <div className="text-green-300 text-xs">Live</div>
        </div>
        <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 border border-blue-400">
          <div className="text-blue-400 text-sm">Sessions</div>
          <div className="text-white text-2xl font-bold">{realTimeMetrics.concurrentSessions || 0}</div>
          <div className="text-blue-300 text-xs">Concurrent</div>
        </div>
        <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 border border-purple-400">
          <div className="text-purple-400 text-sm">API Requests</div>
          <div className="text-white text-2xl font-bold">{realTimeMetrics.apiRequests || 0}</div>
          <div className="text-purple-300 text-xs">/min</div>
        </div>
        <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border border-red-400">
          <div className="text-red-400 text-sm">Error Rate</div>
          <div className="text-white text-2xl font-bold">{realTimeMetrics.errorRate || 0}%</div>
          <div className="text-red-300 text-xs">Current</div>
        </div>
        <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 border border-yellow-400">
          <div className="text-yellow-400 text-sm">Response Time</div>
          <div className="text-white text-2xl font-bold">{realTimeMetrics.responseTime || 0}ms</div>
          <div className="text-yellow-300 text-xs">Average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Users"
              value={getMetricValue('total-users')}
              trend={getMetricTrend('total-users')}
              color="text-blue-400"
            />
            <MetricCard
              title="Active Users"
              value={getMetricValue('active-users')}
              trend={getMetricTrend('active-users')}
              color="text-green-400"
            />
            <MetricCard
              title="User Growth"
              value={getMetricValue('user-growth')}
              trend={getMetricTrend('user-growth')}
              color="text-purple-400"
              subtitle="Monthly %"
            />
            <MetricCard
              title="Total Projects"
              value={getMetricValue('total-projects')}
              trend={getMetricTrend('total-projects')}
              color="text-indigo-400"
            />
            <MetricCard
              title="Completion Rate"
              value={getMetricValue('completion-rate')}
              trend={getMetricTrend('completion-rate')}
              color="text-green-400"
              subtitle="%"
            />
            <MetricCard
              title="AI Requests"
              value={getMetricValue('ai-requests')}
              trend={getMetricTrend('ai-requests')}
              color="text-purple-400"
            />
            <MetricCard
              title="AI Accuracy"
              value={getMetricValue('ai-accuracy')}
              trend={getMetricTrend('ai-accuracy')}
              color={getMetricColor('ai-accuracy', getMetricValue('ai-accuracy'))}
              subtitle="%"
            />
            <MetricCard
              title="Revenue"
              value={getMetricValue('revenue')}
              trend={getMetricTrend('revenue')}
              color="text-green-400"
              subtitle="$"
            />
          </div>

          {/* Performance Metrics */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h3 className="text-white font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Conversion Rate"
                value={getMetricValue('conversion-rate')}
                trend={getMetricTrend('conversion-rate')}
                color={getMetricColor('conversion-rate', getMetricValue('conversion-rate'))}
                subtitle="%"
              />
              <MetricCard
                title="Session Duration"
                value={getMetricValue('session-duration')}
                trend={getMetricTrend('session-duration')}
                color="text-blue-400"
                subtitle="min"
              />
              <MetricCard
                title="Error Rate"
                value={getMetricValue('error-rate')}
                trend={getMetricTrend('error-rate')}
                color={getMetricColor('error-rate', getMetricValue('error-rate'))}
                subtitle="%"
              />
              <MetricCard
                title="Uptime"
                value={getMetricValue('uptime')}
                trend={getMetricTrend('uptime')}
                color={getMetricColor('uptime', getMetricValue('uptime'))}
                subtitle="%"
              />
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        {showPredictions && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Predictive Insights</h3>
            <div className="space-y-3">
              {predictiveInsights.map((insight, index) => (
                <PredictiveInsightCard key={index} insight={insight} />
              ))}
              {predictiveInsights.length === 0 && (
                <div className="text-gray-400 text-sm p-4 bg-gray-800 rounded-lg">
                  No predictive insights available for the selected time range.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Analytics */}
      {selectedMetric !== 'overview' && (
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4 capitalize">{selectedMetric} Analytics</h3>
          <div className="text-gray-300">
            Detailed analytics for {selectedMetric} will be displayed here with charts and graphs.
          </div>
        </div>
      )}
    </div>
  );
} 