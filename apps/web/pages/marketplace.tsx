import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CodePalButton } from '@codepal/ui';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  price: number;
  isPublic: boolean;
  isVerified: boolean;
  trustScore: number;
  averageRating: number;
  downloadCount: number;
  author: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  createdAt: string;
}

interface MarketplaceStats {
  totalSnippets: number;
  totalDownloads: number;
  totalRevenue: number;
  activeAuthors: number;
  averageRating: number;
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    // TODO: Fetch marketplace data from API
    const fetchMarketplaceData = async () => {
      try {
        // Simulated data
        setSnippets([
          {
            id: '1',
            title: 'Advanced TypeScript Utility Types',
            description: 'A comprehensive collection of utility types for TypeScript development',
            code: 'type DeepPartial<T> = {\n  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];\n};',
            language: 'typescript',
            category: 'utilities',
            tags: ['typescript', 'utility-types', 'advanced'],
            price: 15.99,
            isPublic: false,
            isVerified: true,
            trustScore: 95,
            averageRating: 4.8,
            downloadCount: 1247,
            author: {
              id: 'author-1',
              name: 'TypeScript Master',
              isVerified: true
            },
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            title: 'React Performance Hook',
            description: 'Custom hook for optimizing React component performance',
            code: 'const usePerformance = (callback: Function, deps: any[]) => {\n  return useCallback(callback, deps);\n};',
            language: 'javascript',
            category: 'react',
            tags: ['react', 'performance', 'hooks'],
            price: 9.99,
            isPublic: true,
            isVerified: true,
            trustScore: 88,
            averageRating: 4.6,
            downloadCount: 892,
            author: {
              id: 'author-2',
              name: 'React Expert',
              isVerified: true
            },
            createdAt: '2024-01-10'
          },
          {
            id: '3',
            title: 'Python Data Processing Pipeline',
            description: 'Efficient data processing pipeline using pandas and numpy',
            code: 'import pandas as pd\nimport numpy as np\n\ndef process_data(df):\n    return df.groupby("category").agg({"value": "sum"})',
            language: 'python',
            category: 'data-science',
            tags: ['python', 'pandas', 'data-processing'],
            price: 19.99,
            isPublic: false,
            isVerified: true,
            trustScore: 92,
            averageRating: 4.9,
            downloadCount: 567,
            author: {
              id: 'author-3',
              name: 'Data Scientist Pro',
              isVerified: true
            },
            createdAt: '2024-01-08'
          }
        ]);

        setStats({
          totalSnippets: 15420,
          totalDownloads: 89234,
          totalRevenue: 125000,
          activeAuthors: 342,
          averageRating: 4.7
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
        setLoading(false);
      }
    };

    fetchMarketplaceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>Social Marketplace - CodePal</title>
        <meta name="description" content="AI-verified code snippets with trust scores" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">🛒 Social Marketplace</h1>
            <span className="text-blue-300 text-sm">AI-verified code snippets</span>
          </div>
          <nav className="flex items-center space-x-4">
            <CodePalButton onClick={() => window.location.href = '/dashboard'} className="bg-gray-700 hover:bg-gray-800">
              Dashboard
            </CodePalButton>
            <CodePalButton onClick={() => setActiveTab('upload')} className="bg-green-600 hover:bg-green-700">
              Upload Snippet
            </CodePalButton>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Total Snippets</p>
              <p className="text-2xl font-bold text-white">{stats?.totalSnippets.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Downloads</p>
              <p className="text-2xl font-bold text-white">{stats?.totalDownloads.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">${stats?.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Authors</p>
              <p className="text-2xl font-bold text-white">{stats?.activeAuthors}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{stats?.averageRating}⭐</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'browse', label: 'Browse', icon: '🔍' },
              { id: 'upload', label: 'Upload', icon: '📤' },
              { id: 'my-snippets', label: 'My Snippets', icon: '📁' },
              { id: 'purchases', label: 'Purchases', icon: '🛒' },
              { id: 'earnings', label: 'Earnings', icon: '💰' }
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
          {activeTab === 'browse' && <BrowseTab snippets={snippets} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} sortBy={sortBy} setSortBy={setSortBy} />}
          {activeTab === 'upload' && <UploadTab />}
          {activeTab === 'my-snippets' && <MySnippetsTab />}
          {activeTab === 'purchases' && <PurchasesTab />}
          {activeTab === 'earnings' && <EarningsTab />}
        </div>
      </main>
    </div>
  );
}

function BrowseTab({ 
  snippets, 
  searchTerm, 
  setSearchTerm, 
  selectedLanguage, 
  setSelectedLanguage, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy 
}: { 
  snippets: CodeSnippet[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Browse Code Snippets</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search snippets..."
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="react">React</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="utilities">Utilities</option>
            <option value="react">React</option>
            <option value="data-science">Data Science</option>
            <option value="algorithms">Algorithms</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {snippets.map((snippet) => (
          <div key={snippet.id} className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{snippet.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{snippet.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-300">{snippet.language}</span>
                  <span className="text-green-300">{snippet.category}</span>
                  <span className="text-yellow-300">{snippet.downloadCount} downloads</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">${snippet.price}</div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white text-sm">{snippet.averageRating}</span>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{snippet.code.substring(0, 100)}...</code>
              </pre>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {snippet.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            {/* Trust Score and Author */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Trust Score:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${snippet.trustScore}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{snippet.trustScore}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">by</span>
                <span className="text-blue-300 text-sm">{snippet.author.name}</span>
                {snippet.author.isVerified && <span className="text-blue-400">✓</span>}
              </div>
            </div>

            <div className="flex space-x-2">
              <CodePalButton 
                onClick={() => console.log('View snippet', snippet.id)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Details
              </CodePalButton>
              <CodePalButton 
                onClick={() => console.log('Purchase snippet', snippet.id)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Purchase
              </CodePalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Upload Code Snippet</h2>
      <p className="text-gray-300">This tab will contain the snippet upload form with AI verification.</p>
      <CodePalButton onClick={() => console.log('Upload snippet')} className="bg-green-600 hover:bg-green-700">
        Upload Snippet
      </CodePalButton>
    </div>
  );
}

function MySnippetsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Snippets</h2>
      <p className="text-gray-300">This tab will contain the user's uploaded snippets and their performance.</p>
      <CodePalButton onClick={() => console.log('View my snippets')} className="bg-blue-600 hover:bg-blue-700">
        View My Snippets
      </CodePalButton>
    </div>
  );
}

function PurchasesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Purchases</h2>
      <p className="text-gray-300">This tab will contain the user's purchased snippets and download history.</p>
      <CodePalButton onClick={() => console.log('View purchases')} className="bg-purple-600 hover:bg-purple-700">
        View Purchases
      </CodePalButton>
    </div>
  );
}

function EarningsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Earnings</h2>
      <p className="text-gray-300">This tab will contain the user's marketplace earnings and analytics.</p>
      <CodePalButton onClick={() => console.log('View earnings')} className="bg-yellow-600 hover:bg-yellow-700">
        View Earnings
      </CodePalButton>
    </div>
  );
} 