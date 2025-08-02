// AI Code Analysis Engine for CodePal
// Features: Automated code quality assessment, security detection, performance optimization

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CodeAnalysis {
  id: string;
  filePath: string;
  language: string;
  analysisType: 'quality' | 'security' | 'performance' | 'style' | 'complexity';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: AnalysisResult[];
  metadata: AnalysisMetadata;
  createdAt: string;
  completedAt?: string;
}

interface AnalysisResult {
  id: string;
  type: 'error' | 'warning' | 'info' | 'suggestion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  lineNumber?: number;
  columnNumber?: number;
  codeSnippet?: string;
  suggestion?: string;
  confidence: number;
  tags: string[];
  fixable: boolean;
  autoFix?: string;
}

interface AnalysisMetadata {
  totalLines: number;
  complexityScore: number;
  maintainabilityIndex: number;
  technicalDebt: number;
  securityScore: number;
  performanceScore: number;
  codeQualityScore: number;
  language: string;
  framework?: string;
  dependencies: string[];
  estimatedTimeToFix: number;
}

interface CodeQualityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  technicalDebtRatio: number;
  codeDuplication: number;
  testCoverage?: number;
  documentationCoverage?: number;
}

interface SecurityVulnerability {
  id: string;
  type: 'sql_injection' | 'xss' | 'csrf' | 'authentication' | 'authorization' | 'data_exposure' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  cveId?: string;
  description: string;
  impact: string;
  remediation: string;
  references: string[];
  affectedCode: string;
  lineNumber: number;
}

interface PerformanceIssue {
  id: string;
  type: 'memory_leak' | 'inefficient_algorithm' | 'database_query' | 'network_request' | 'resource_usage' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  optimization: string;
  estimatedImprovement: number;
  affectedCode: string;
  lineNumber: number;
}

interface CodeStyleIssue {
  id: string;
  type: 'naming' | 'formatting' | 'documentation' | 'structure' | 'best_practices' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
  affectedCode: string;
  lineNumber: number;
  autoFixable: boolean;
}

interface AISuggestion {
  id: string;
  type: 'refactoring' | 'optimization' | 'security' | 'style' | 'architecture' | 'other';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string;
  codeExample?: string;
  benefits: string[];
  risks: string[];
}

export default function AICodeAnalysis() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [analyses, setAnalyses] = useState<CodeAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<string>('quality');
  const [filters, setFilters] = useState({
    severity: 'all',
    category: 'all',
    status: 'all'
  });

  // Load analysis data
  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      const response = await fetch('/api/ai/code-analysis');
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    }
  };

  // Start code analysis
  const startAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('analysisType', analysisType);

    try {
      const response = await fetch('/api/ai/code-analysis/analyze', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newAnalysis = await response.json();
        setAnalyses(prev => [newAnalysis, ...prev]);
        setSelectedAnalysis(newAnalysis);
        setActiveTab('results');
      }
    } catch (error) {
      console.error('Failed to start analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply auto-fix
  const applyAutoFix = async (resultId: string, fix: string) => {
    try {
      const response = await fetch(`/api/ai/code-analysis/fix/${resultId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fix })
      });

      if (response.ok) {
        // Refresh analysis data
        loadAnalysisData();
      }
    } catch (error) {
      console.error('Failed to apply auto-fix:', error);
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // Get severity background color
  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900 text-red-200';
      case 'high': return 'bg-orange-900 text-orange-200';
      case 'medium': return 'bg-yellow-900 text-yellow-200';
      case 'low': return 'bg-blue-900 text-blue-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'suggestion': return '💡';
      default: return '📝';
    }
  };

  const AnalysisOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">AI Code Analysis Overview</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={() => setActiveTab('new-analysis')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Analysis Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Total Analyses</h3>
          <div className="text-3xl font-bold text-blue-400">{analyses.length}</div>
          <p className="text-gray-400 text-sm">Code quality assessments</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Critical Issues</h3>
          <div className="text-3xl font-bold text-red-400">
            {analyses.reduce((sum, analysis) => 
              sum + analysis.results.filter(r => r.severity === 'critical').length, 0
            )}
          </div>
          <p className="text-gray-400 text-sm">High priority fixes</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Security Issues</h3>
          <div className="text-3xl font-bold text-orange-400">
            {analyses.reduce((sum, analysis) => 
              sum + analysis.results.filter(r => r.category === 'security').length, 0
            )}
          </div>
          <p className="text-gray-400 text-sm">Vulnerabilities found</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-2">Auto-Fixable</h3>
          <div className="text-3xl font-bold text-green-400">
            {analyses.reduce((sum, analysis) => 
              sum + analysis.results.filter(r => r.fixable).length, 0
            )}
          </div>
          <p className="text-gray-400 text-sm">Automated fixes available</p>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">Recent Analyses</h3>
        <div className="space-y-4">
          {analyses.slice(0, 5).map(analysis => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg hover:bg-white hover:bg-opacity-10 cursor-pointer"
              onClick={() => {
                setSelectedAnalysis(analysis);
                setActiveTab('results');
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {analysis.language === 'javascript' ? '🔷' :
                   analysis.language === 'python' ? '🐍' :
                   analysis.language === 'java' ? '☕' :
                   analysis.language === 'typescript' ? '🔶' : '📄'}
                </div>
                <div>
                  <div className="text-gray-300 font-medium">{analysis.filePath}</div>
                  <div className="text-gray-400 text-sm">{analysis.language.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-xs ${getSeverityBgColor(
                  analysis.results.length > 0 ? 
                  analysis.results.reduce((max, r) => 
                    ['critical', 'high', 'medium', 'low'].indexOf(r.severity) < 
                    ['critical', 'high', 'medium', 'low'].indexOf(max) ? r.severity : max, 'low'
                  ) : 'low'
                )}`}>
                  {analysis.status}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {analysis.results.length} issues
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NewAnalysis = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">New Code Analysis</h3>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-gray-300 mb-2">Select Code File</label>
            <input
              type="file"
              accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          {/* Analysis Type */}
          <div>
            <label className="block text-gray-300 mb-2">Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="quality">Code Quality</option>
              <option value="security">Security Analysis</option>
              <option value="performance">Performance Analysis</option>
              <option value="style">Code Style</option>
              <option value="complexity">Complexity Analysis</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>

          {/* Analysis Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Include Auto-Fixes</label>
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-gray-300">Generate automatic fixes</span>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Detailed Report</label>
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-gray-300">Include detailed explanations</span>
            </div>
          </div>

          {/* Start Analysis Button */}
          <button
            onClick={startAnalysis}
            disabled={!selectedFile || isAnalyzing}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-semibold"
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>
      </div>

      {/* Analysis Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">🔍 Code Quality</h4>
          <p className="text-gray-400 text-sm">Analyzes code structure, complexity, and maintainability</p>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">🛡️ Security</h4>
          <p className="text-gray-400 text-sm">Detects vulnerabilities and security best practices</p>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">⚡ Performance</h4>
          <p className="text-gray-400 text-sm">Identifies performance bottlenecks and optimizations</p>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">🎨 Code Style</h4>
          <p className="text-gray-400 text-sm">Checks coding standards and style consistency</p>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">🧮 Complexity</h4>
          <p className="text-gray-400 text-sm">Measures code complexity and technical debt</p>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">📊 Comprehensive</h4>
          <p className="text-gray-400 text-sm">Full analysis including all aspects</p>
        </div>
      </div>
    </div>
  );

  const AnalysisResults = () => {
    if (!selectedAnalysis) return <div className="text-gray-300">No analysis selected</div>;

    const filteredResults = selectedAnalysis.results.filter(result => {
      if (filters.severity !== 'all' && result.severity !== filters.severity) return false;
      if (filters.category !== 'all' && result.category !== filters.category) return false;
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Analysis Results</h3>
            <p className="text-gray-400">{selectedAnalysis.filePath}</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="all">All Categories</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="quality">Quality</option>
              <option value="style">Style</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-2xl font-bold text-blue-400">{selectedAnalysis.metadata.totalLines}</div>
            <div className="text-gray-400 text-sm">Total Lines</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-2xl font-bold text-green-400">{selectedAnalysis.metadata.codeQualityScore}%</div>
            <div className="text-gray-400 text-sm">Quality Score</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-2xl font-bold text-orange-400">{selectedAnalysis.metadata.securityScore}%</div>
            <div className="text-gray-400 text-sm">Security Score</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="text-2xl font-bold text-purple-400">{selectedAnalysis.metadata.performanceScore}%</div>
            <div className="text-gray-400 text-sm">Performance Score</div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredResults.map(result => (
            <div
              key={result.id}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(result.type)}</span>
                  <div>
                    <h4 className="text-white font-semibold">{result.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityBgColor(result.severity)}`}>
                        {result.severity}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                        {result.category}
                      </span>
                      {result.fixable && (
                        <span className="px-2 py-1 rounded text-xs bg-green-700 text-green-300">
                          Auto-fixable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">
                    Line {result.lineNumber}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {result.confidence}% confidence
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 mb-3">{result.description}</p>
                {result.codeSnippet && (
                  <div className="bg-gray-800 rounded p-3 mb-3">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{result.codeSnippet}</code>
                    </pre>
                  </div>
                )}
                {result.suggestion && (
                  <div className="bg-blue-900 bg-opacity-30 rounded p-3 mb-3">
                    <p className="text-blue-300 text-sm">
                      <strong>Suggestion:</strong> {result.suggestion}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {result.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                {result.fixable && result.autoFix && (
                  <button
                    onClick={() => applyAutoFix(result.id, result.autoFix!)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Apply Fix
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Code Analysis Engine</h1>
        <p className="text-gray-300">Intelligent code quality assessment, security detection, and optimization recommendations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'new-analysis', label: 'New Analysis', icon: '🔍' },
            { id: 'results', label: 'Results', icon: '📋' },
            { id: 'insights', label: 'Insights', icon: '💡' },
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
        {activeTab === 'overview' && <AnalysisOverview />}
        {activeTab === 'new-analysis' && <NewAnalysis />}
        {activeTab === 'results' && <AnalysisResults />}
        {activeTab === 'insights' && (
          <div className="text-gray-300">
            AI insights and recommendations will be implemented here.
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-gray-300">
            AI analysis settings and configuration will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
} 