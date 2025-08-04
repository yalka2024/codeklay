'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🚀 CodePal Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign In
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'projects', label: 'Projects', icon: '📁' },
              { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
              { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
              { id: 'learning', label: 'Learning', icon: '📚' },
              { id: 'collaboration', label: 'Collaboration', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    🎉 Welcome to CodePal Platform
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900">✅ Server Status</h4>
                      <p className="text-blue-700">Next.js running on port 3005</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900">🗄️ Database</h4>
                      <p className="text-green-700">Prisma SQLite ready</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900">🔐 Authentication</h4>
                      <p className="text-purple-700">NextAuth.js configured</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    🚀 Platform Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🤖 AI Code Assistant</h4>
                      <p className="text-gray-600">Intelligent code suggestions and completion</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">👥 Collaborative Coding</h4>
                      <p className="text-gray-600">Real-time collaboration with team members</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">🛒 Code Marketplace</h4>
                      <p className="text-gray-600">Buy and sell code snippets and components</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">📚 Learning Paths</h4>
                      <p className="text-gray-600">Personalized learning journeys</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📁 Your Projects</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Project
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai-assistant' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🤖 AI Assistant</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">AI features coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🛒 Code Marketplace</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">Marketplace features coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📚 Learning Paths</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">Learning features coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === 'collaboration' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">👥 Collaboration</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">Collaboration features coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
