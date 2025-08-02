import React from 'react';
import Head from 'next/head';
import { CodePalButton } from '@codepal/ui';

export default function Home() {
  const handleGitHubLogin = () => {
    // TODO: Implement GitHub OAuth with NextAuth.js
    console.log('GitHub login clicked');
  };

  const handleSignOut = () => {
    // TODO: Implement sign out functionality
    console.log('Sign out clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>CodePal - Next-Gen AI Coding Platform</title>
        <meta name="description" content="AI-powered development with personalized learning and collaboration." />
        <meta name="keywords" content="AI coding, development platform, collaboration, AR/VR, blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="p-6 bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">CodePal</h1>
            <span className="text-blue-300 text-sm">Next-Gen AI Platform</span>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#features" className="text-white hover:text-blue-300 transition">Features</a>
            <a href="#pricing" className="text-white hover:text-blue-300 transition">Pricing</a>
            <a href="#docs" className="text-white hover:text-blue-300 transition">Docs</a>
            <CodePalButton onClick={handleGitHubLogin} className="bg-blue-600 hover:bg-blue-700">
              Sign in with GitHub
            </CodePalButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Welcome to <span className="text-blue-400">CodePal</span>
          </h2>
          <p className="text-xl mb-8 text-gray-300 leading-relaxed">
            Build, collaborate, and learn with AI-powered tools. Experience the future of development 
            with personalized learning, decentralized collaboration, AR/VR coding, and cross-platform fusion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <CodePalButton 
              onClick={() => window.location.href = '/dashboard'} 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              Get Started
            </CodePalButton>
            <CodePalButton 
              onClick={() => window.location.href = '/demos'} 
              className="bg-gray-800 hover:bg-gray-900 text-lg px-8 py-4"
            >
              View Demos
            </CodePalButton>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-blue-400 text-2xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Contextual Learning</h3>
              <p className="text-gray-300">Personalized tutorials based on your coding patterns and skill level.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-green-400 text-2xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-white mb-2">Decentralized Collaboration</h3>
              <p className="text-gray-300">Blockchain-based coding pods with tokenized rewards and privacy.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-purple-400 text-2xl mb-4">🥽</div>
              <h3 className="text-xl font-semibold text-white mb-2">AR/VR Coding</h3>
              <p className="text-gray-300">3D code visualization and virtual pair programming experiences.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-yellow-400 text-2xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Social Marketplace</h3>
              <p className="text-gray-300">Share and monetize AI-verified code snippets with trust scores.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-red-400 text-2xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-2">Code Time Machine</h3>
              <p className="text-gray-300">Predict bugs and tech debt with AI-powered analysis.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="text-indigo-400 text-2xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-white mb-2">Cross-Platform Fusion</h3>
              <p className="text-gray-300">Transpile code across languages and platforms seamlessly.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-40 p-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 CodePal. Next-generation AI-powered development platform.</p>
          <div className="mt-4 space-x-4">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
            <a href="/support" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 