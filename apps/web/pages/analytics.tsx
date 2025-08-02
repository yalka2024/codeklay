import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface AnalyticsData {
  users: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
  };
  projects: {
    totalProjects: number;
    activeProjects: number;
    averageContributors: number;
    projectGrowth: number;
  };
  ai: {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    popularFeatures: string[];
  };
  performance: {
    averageLoadTime: number;
    uptime: number;
    errorRate: number;
    peakConcurrentUsers: number;
  };
  engagement: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    returningUsers: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  learning: {
    totalTutorials: number;
    averageCompletionRate: number;
    popularTopics: string[];
    skillImprovements: number;
  };
  collaboration: {
    totalCollaborations: number;
    averageTeamSize: number;
    successfulProjects: number;
    collaborationGrowth: number;
  };
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // TODO: Fetch analytics data from API
    const fetchAnalyticsData = async () => {
      try {
        // Simulated data
        setAnalyticsData({
          users: {
            totalUsers: 15420,
            activeUsers: 8923,
            newUsers: 342,
            userGrowth: 12.5
          },
          projects: {
            totalProjects: 8923,
            activeProjects: 3421,
            averageContributors: 4.2,
            projectGrowth: 8.7
          },
          ai: {
            totalRequests: 125000,
            averageResponseTime: 1.2,
            successRate: 98.5,
            popularFeatures: ['Code Completion', 'Bug Detection', 'Performance Analysis']
          },
          performance: {
            averageLoadTime: 0.8,
            uptime: 99.9,
            errorRate: 0.1,
            peakConcurrentUsers: 1250
          },
          engagement: {
            averageSessionDuration: 45,
            pagesPerSession: 8.2,
            bounceRate: 23.5,
            returningUsers: 78.2
          },
          revenue: {
            totalRevenue: 125000,
            monthlyRecurringRevenue: 45000,
            averageOrderValue: 25.50,
            conversionRate: 3.2
          },
          learning: {
            totalTutorials: 342,
            averageCompletionRate: 76.5,
            popularTopics: ['TypeScript', 'React', 'Python'],
            skillImprovements: 892
          },
          collaboration: {
            totalCollaborations: 1250,
            averageTeamSize: 3.8,
            successfulProjects: 892,
            collaborationGrowth: 15.3
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>Analytics Dashboard - CodePal</title>
        <meta name="description" content="Comprehensive analytics and insights" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">📊 Analytics Dashboard</h1>
            <span className="text-blue-300 text-sm">Comprehensive insights</span>
          </div>
          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
            >
              Dashboard
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📈' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'projects', label: 'Projects', icon: '📁' },
              { id: 'ai', label: 'AI', icon: '🤖' },
              { id: 'performance', label: 'Performance', icon: '⚡' },
              { id: 'engagement', label: 'Engagement', icon: '📊' },
              { id: 'revenue', label: 'Revenue', icon: '💰' },
              { id: 'learning', label: 'Learning', icon: '📚' },
              { id: 'collaboration', label: 'Collaboration', icon: '🤝' }
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
          {activeTab === 'overview' && <OverviewTab data={analyticsData} />}
          {activeTab === 'users' && <UsersTab data={analyticsData?.users} />}
          {activeTab === 'projects' && <ProjectsTab data={analyticsData?.projects} />}
          {activeTab === 'ai' && <AITab data={analyticsData?.ai} />}
          {activeTab === 'performance' && <PerformanceTab data={analyticsData?.performance} />}
          {activeTab === 'engagement' && <EngagementTab data={analyticsData?.engagement} />}
          {activeTab === 'revenue' && <RevenueTab data={analyticsData?.revenue} />}
          {activeTab === 'learning' && <LearningTab data={analyticsData?.learning} />}
          {activeTab === 'collaboration' && <CollaborationTab data={analyticsData?.collaboration} />}
        </div>
      </main>
    </div>
  );
}

function OverviewTab({ data }: { data: AnalyticsData | null }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Platform Overview</h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{data.users.totalUsers.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{data.users.userGrowth}% growth</p>
            </div>
            <div className="text-blue-400 text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-white">{data.projects.activeProjects.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{data.projects.projectGrowth}% growth</p>
            </div>
            <div className="text-green-400 text-3xl">📁</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">AI Requests</p>
              <p className="text-3xl font-bold text-white">{data.ai.totalRequests.toLocaleString()}</p>
              <p className="text-blue-400 text-sm">{data.ai.successRate}% success rate</p>
            </div>
            <div className="text-purple-400 text-3xl">🤖</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-white">${data.revenue.totalRevenue.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm">${data.revenue.monthlyRecurringRevenue.toLocaleString()} MRR</p>
            </div>
            <div className="text-yellow-400 text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Uptime</span>
              <span className="text-green-400 font-semibold">{data.performance.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Load Time</span>
              <span className="text-blue-400 font-semibold">{data.performance.averageLoadTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Error Rate</span>
              <span className="text-red-400 font-semibold">{data.performance.errorRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Session Duration</span>
              <span className="text-green-400 font-semibold">{data.engagement.averageSessionDuration}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pages per Session</span>
              <span className="text-blue-400 font-semibold">{data.engagement.pagesPerSession}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Returning Users</span>
              <span className="text-purple-400 font-semibold">{data.engagement.returningUsers}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ data }: { data: AnalyticsData['users'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed user analytics and insights.</p>
    </div>
  );
}

function ProjectsTab({ data }: { data: AnalyticsData['projects'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Project Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed project analytics and insights.</p>
    </div>
  );
}

function AITab({ data }: { data: AnalyticsData['ai'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed AI usage analytics and insights.</p>
    </div>
  );
}

function PerformanceTab({ data }: { data: AnalyticsData['performance'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed performance analytics and insights.</p>
    </div>
  );
}

function EngagementTab({ data }: { data: AnalyticsData['engagement'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Engagement Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed engagement analytics and insights.</p>
    </div>
  );
}

function RevenueTab({ data }: { data: AnalyticsData['revenue'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed revenue analytics and insights.</p>
    </div>
  );
}

function LearningTab({ data }: { data: AnalyticsData['learning'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Learning Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed learning analytics and insights.</p>
    </div>
  );
}

function CollaborationTab({ data }: { data: AnalyticsData['collaboration'] | undefined }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Collaboration Analytics</h2>
      <p className="text-gray-300">This tab will contain detailed collaboration analytics and insights.</p>
    </div>
  );
} 