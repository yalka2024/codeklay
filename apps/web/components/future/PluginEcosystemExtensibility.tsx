// Plugin Ecosystem & Extensibility Framework for CodePal
// Features: Plugin management, marketplace, extensibility APIs, developer tools

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  status: 'enabled' | 'disabled' | 'update-available' | 'error';
  installedAt: string;
  lastUpdated: string;
  categories: string[];
  rating: number;
  downloads: number;
  homepage?: string;
  repository?: string;
}

interface MarketplacePlugin extends Plugin {
  featured: boolean;
  price: number;
  license: string;
  tags: string[];
}

interface DeveloperTool {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'sdk' | 'cli' | 'template' | 'docs';
  link: string;
}

export default function PluginEcosystemExtensibility() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'installed' | 'marketplace' | 'developer'>('overview');
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);
  const [marketplacePlugins, setMarketplacePlugins] = useState<MarketplacePlugin[]>([]);
  const [developerTools, setDeveloperTools] = useState<DeveloperTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPluginData();
  }, []);

  const loadPluginData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstalledPlugins([
        {
          id: 'plugin-1',
          name: 'Slack Integration',
          description: 'Connect CodePal with Slack for notifications and collaboration.',
          version: '1.2.0',
          author: 'CodePal Team',
          status: 'enabled',
          installedAt: '2024-01-10T10:00:00Z',
          lastUpdated: '2024-01-15T09:00:00Z',
          categories: ['communication', 'collaboration'],
          rating: 4.7,
          downloads: 1200,
          homepage: 'https://codepal.com/plugins/slack',
          repository: 'https://github.com/codepal/plugins-slack'
        },
        {
          id: 'plugin-2',
          name: 'Jira Issue Sync',
          description: 'Sync issues and tasks with Jira Cloud.',
          version: '2.0.1',
          author: 'Atlassian',
          status: 'update-available',
          installedAt: '2024-01-12T14:00:00Z',
          lastUpdated: '2024-01-20T08:00:00Z',
          categories: ['project-management'],
          rating: 4.5,
          downloads: 950,
          homepage: 'https://codepal.com/plugins/jira',
          repository: 'https://github.com/atlassian/codepal-jira'
        }
      ]);
      setMarketplacePlugins([
        {
          id: 'plugin-3',
          name: 'GitHub Actions Runner',
          description: 'Integrate GitHub Actions workflows directly into CodePal.',
          version: '1.0.0',
          author: 'GitHub',
          status: 'enabled',
          installedAt: '',
          lastUpdated: '2024-01-18T12:00:00Z',
          categories: ['ci/cd', 'automation'],
          rating: 4.8,
          downloads: 2100,
          homepage: 'https://codepal.com/plugins/github-actions',
          repository: 'https://github.com/github/codepal-actions',
          featured: true,
          price: 0,
          license: 'MIT',
          tags: ['ci', 'automation', 'github']
        },
        {
          id: 'plugin-4',
          name: 'AWS Lambda Deployer',
          description: 'Deploy and manage AWS Lambda functions from CodePal.',
          version: '1.3.2',
          author: 'AWS',
          status: 'disabled',
          installedAt: '',
          lastUpdated: '2024-01-19T11:00:00Z',
          categories: ['cloud', 'deployment'],
          rating: 4.6,
          downloads: 800,
          homepage: 'https://codepal.com/plugins/aws-lambda',
          repository: 'https://github.com/aws/codepal-lambda',
          featured: false,
          price: 9.99,
          license: 'Apache-2.0',
          tags: ['aws', 'lambda', 'cloud']
        }
      ]);
      setDeveloperTools([
        {
          id: 'tool-1',
          name: 'CodePal Plugin SDK',
          description: 'SDK for building and testing CodePal plugins.',
          type: 'sdk',
          link: 'https://codepal.com/developer/sdk'
        },
        {
          id: 'tool-2',
          name: 'Plugin API Docs',
          description: 'Comprehensive API documentation for plugin development.',
          type: 'docs',
          link: 'https://codepal.com/developer/docs'
        },
        {
          id: 'tool-3',
          name: 'CLI Tool',
          description: 'Command-line interface for plugin management and deployment.',
          type: 'cli',
          link: 'https://codepal.com/developer/cli'
        }
      ]);
    } catch (error) {
      console.error('Error loading plugin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'text-green-600 bg-green-100';
      case 'disabled': return 'text-gray-600 bg-gray-100';
      case 'update-available': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Installed Plugins</p>
              <p className="text-2xl font-bold text-gray-900">{installedPlugins.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🔌</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Marketplace Plugins</p>
              <p className="text-2xl font-bold text-gray-900">{marketplacePlugins.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Developer Tools</p>
              <p className="text-2xl font-bold text-gray-900">{developerTools.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured Plugins</p>
              <p className="text-2xl font-bold text-gray-900">{marketplacePlugins.filter(p => p.featured).length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Installed Plugins</h3>
          <div className="space-y-3">
            {installedPlugins.slice(0, 3).map((plugin) => (
              <div key={plugin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔌</span>
                  <div>
                    <p className="font-medium text-gray-900">{plugin.name}</p>
                    <p className="text-sm text-gray-500">{plugin.version}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plugin.status)}`}>{plugin.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Marketplace Plugins</h3>
          <div className="space-y-3">
            {marketplacePlugins.filter(p => p.featured).slice(0, 3).map((plugin) => (
              <div key={plugin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="font-medium text-gray-900">{plugin.name}</p>
                    <p className="text-sm text-gray-500">{plugin.version}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plugin.status)}`}>{plugin.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstalled = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Installed Plugins</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add Plugin</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {installedPlugins.map((plugin) => (
          <div key={plugin.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔌</span>
                <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plugin.status)}`}>{plugin.status}</span>
            </div>
            <p className="text-gray-600 mb-4">{plugin.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium">{plugin.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Author:</span>
                <span className="font-medium">{plugin.author}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Categories:</span>
                <span className="font-medium">{plugin.categories.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Downloads:</span>
                <span className="font-medium">{plugin.downloads}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">Disable</button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">Update</button>
                <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Plugin Marketplace</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Browse All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplacePlugins.map((plugin) => (
          <div key={plugin.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{plugin.featured ? '⭐' : '🛒'}</span>
                <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plugin.status)}`}>{plugin.status}</span>
            </div>
            <p className="text-gray-600 mb-4">{plugin.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium">{plugin.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Author:</span>
                <span className="font-medium">{plugin.author}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Categories:</span>
                <span className="font-medium">{plugin.categories.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Downloads:</span>
                <span className="font-medium">{plugin.downloads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">{plugin.price === 0 ? 'Free' : `$${plugin.price}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">License:</span>
                <span className="font-medium">{plugin.license}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">Install</button>
                <a href={plugin.homepage} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors text-center">Homepage</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeveloper = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Developer Tools & APIs</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">View Docs</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developerTools.map((tool) => (
          <div key={tool.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛠️</span>
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{tool.type.toUpperCase()}</span>
            </div>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors text-center block">Open</a>
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
          <p className="mt-4 text-gray-600">Loading plugin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plugin Ecosystem & Extensibility Framework</h1>
          <p className="mt-2 text-gray-600">
            Discover, install, and manage plugins to extend CodePal. Access developer tools and APIs to build your own extensions.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '🔎' },
                { id: 'installed', name: 'Installed', icon: '🔌' },
                { id: 'marketplace', name: 'Marketplace', icon: '🛒' },
                { id: 'developer', name: 'Developer', icon: '🛠️' }
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
            {activeTab === 'installed' && renderInstalled()}
            {activeTab === 'marketplace' && renderMarketplace()}
            {activeTab === 'developer' && renderDeveloper()}
          </div>
        </div>
      </div>
    </div>
  );
} 