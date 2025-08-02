import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CodePalButton } from '@codepal/ui';
import { useAuthContext } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useDashboard, useAnalytics } from '../hooks/useApi';

interface User {
  id: string;
  name: string;
  email: string;
  skillLevel: string;
  preferredLanguages: string[];
}

interface DashboardStats {
  totalProjects: number;
  totalContributions: number;
  learningProgress: number;
  marketplaceEarnings: number;
  podMemberships: number;
  totalRewards: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const { isConnected: web3Connected, address: walletAddress, connect: connectWallet } = useWeb3();
  const { stats, recentActivity, loading: dashboardLoading } = useDashboard();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics('7d');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state based on all data sources
    setLoading(authLoading || dashboardLoading || analyticsLoading);
  }, [authLoading, dashboardLoading, analyticsLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/auth/signin';
    }
  }, [authLoading, isAuthenticated]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>CodePal Dashboard</title>
        <meta name="description" content="Your CodePal development dashboard" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">CodePal Dashboard</h1>
            <span className="text-blue-300 text-sm">Welcome back, {user?.name}</span>
          </div>
          <nav className="flex items-center space-x-4">
            {web3Connected ? (
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-sm">●</span>
                <span className="text-gray-300 text-sm">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connected'}
                </span>
              </div>
            ) : (
              <CodePalButton onClick={handleConnectWallet} className="bg-purple-600 hover:bg-purple-700">
                Connect Wallet
              </CodePalButton>
            )}
            <CodePalButton onClick={() => window.location.href = '/'} className="bg-gray-700 hover:bg-gray-800">
              Home
            </CodePalButton>
            <CodePalButton onClick={() => console.log('Settings')} className="bg-blue-600 hover:bg-blue-700">
              Settings
            </CodePalButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
              </div>
              <div className="text-blue-400 text-2xl">📁</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Learning Progress</p>
                <p className="text-2xl font-bold text-white">{stats.learningProgress}%</p>
              </div>
              <div className="text-green-400 text-2xl">📚</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Marketplace Earnings</p>
                <p className="text-2xl font-bold text-white">${stats.marketplaceEarnings}</p>
              </div>
              <div className="text-yellow-400 text-2xl">💰</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Rewards</p>
                <p className="text-2xl font-bold text-white">{stats.totalRewards}</p>
              </div>
              <div className="text-purple-400 text-2xl">🏆</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'learning', label: 'AI Learning', icon: '🤖' },
              { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
              { id: 'pods', label: 'Blockchain Pods', icon: '🔗' },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'collaboration', label: 'Collaboration', icon: '👥' }
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
          {activeTab === 'overview' && <OverviewTab user={user} stats={stats} analyticsData={analyticsData} />}
          {activeTab === 'learning' && <LearningTab />}
          {activeTab === 'marketplace' && <MarketplaceTab />}
          {activeTab === 'pods' && <PodsTab />}
          {activeTab === 'analytics' && <AnalyticsTab analyticsData={analyticsData} />}
          {activeTab === 'collaboration' && <CollaborationTab />}
        </div>
      </main>
    </div>
  );
}

// Tab Components
function OverviewTab({ 
  user, 
  stats, 
  analyticsData 
}: { 
  user: User | null; 
  stats: DashboardStats; 
  analyticsData: any;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Welcome to CodePal</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <CodePalButton onClick={() => window.location.href = '/learning'} className="bg-blue-600 hover:bg-blue-700">
              Start Learning
            </CodePalButton>
            <CodePalButton onClick={() => window.location.href = '/marketplace'} className="bg-green-600 hover:bg-green-700">
              Browse Marketplace
            </CodePalButton>
            <CodePalButton onClick={() => window.location.href = '/pods'} className="bg-purple-600 hover:bg-purple-700">
              Join Pod
            </CodePalButton>
            <CodePalButton onClick={() => window.location.href = '/collaboration'} className="bg-orange-600 hover:bg-orange-700">
              Collaborate
            </CodePalButton>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-300">
              <span>📚</span>
              <span>Completed "Advanced TypeScript" tutorial</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span>💰</span>
              <span>Earned $45 from marketplace sales</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span>🏆</span>
              <span>Received 150 POD tokens for contribution</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <span>👥</span>
              <span>Joined "React Masters" coding pod</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      {analyticsData && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Platform Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{analyticsData?.users?.activeUsers || 0}</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">AI Requests</p>
              <p className="text-2xl font-bold text-white">{analyticsData?.ai?.totalRequests || 0}</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">${analyticsData?.revenue?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LearningTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">AI Learning Engine</h2>
      <p className="text-gray-300">This tab will contain the AI Learning Engine interface.</p>
      <CodePalButton onClick={() => window.location.href = '/learning'} className="bg-blue-600 hover:bg-blue-700">
        Go to Learning Engine
      </CodePalButton>
    </div>
  );
}

function MarketplaceTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Social Marketplace</h2>
      <p className="text-gray-300">This tab will contain the Marketplace interface.</p>
      <CodePalButton onClick={() => window.location.href = '/marketplace'} className="bg-green-600 hover:bg-green-700">
        Go to Marketplace
      </CodePalButton>
    </div>
  );
}

function PodsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Blockchain Pods</h2>
      <p className="text-gray-300">This tab will contain the Blockchain Pods interface.</p>
      <CodePalButton onClick={() => window.location.href = '/pods'} className="bg-purple-600 hover:bg-purple-700">
        Go to Pods
      </CodePalButton>
    </div>
  );
}

function AnalyticsTab({ analyticsData }: { analyticsData: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
      {analyticsData ? (
        <div className="space-y-4">
          <p className="text-gray-300">Real-time analytics data is available.</p>
          <CodePalButton onClick={() => window.location.href = '/analytics'} className="bg-indigo-600 hover:bg-indigo-700">
            View Full Analytics
          </CodePalButton>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300">This tab will contain the Analytics interface.</p>
          <CodePalButton onClick={() => window.location.href = '/analytics'} className="bg-indigo-600 hover:bg-indigo-700">
            Go to Analytics
          </CodePalButton>
        </div>
      )}
    </div>
  );
}

function CollaborationTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Collaboration</h2>
      <p className="text-gray-300">This tab will contain the Collaboration interface.</p>
      <CodePalButton onClick={() => window.location.href = '/collaboration'} className="bg-orange-600 hover:bg-orange-700">
        Go to Collaboration
      </CodePalButton>
    </div>
  );
} 