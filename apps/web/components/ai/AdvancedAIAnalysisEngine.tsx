// Advanced AI Analysis Engine for CodePal
// Features: AI-powered code analysis, intelligent suggestions, predictive capabilities, code quality assessment

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CodeAnalysis {
  id: string;
  filePath: string;
  language: string;
  analysisType: 'quality' | 'security' | 'performance' | 'maintainability' | 'complexity';
  status: 'analyzing' | 'completed' | 'failed';
  score: number;
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
  timestamp: string;
  processingTime: number;
}

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'suggestion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  column: number;
  message: string;
  category: string;
  fix: string;
  confidence: number;
  tags: string[];
}

interface CodeSuggestion {
  id: string;
  type: 'refactor' | 'optimization' | 'best_practice' | 'security' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  codeExample: string;
  reasoning: string;
  estimatedSavings: string;
}

interface CodeMetrics {
  complexity: number;
  maintainability: number;
  reliability: number;
  security: number;
  performance: number;
  testCoverage: number;
  documentation: number;
  codeDuplication: number;
  technicalDebt: number;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
  data: any;
  timestamp: string;
  actionable: boolean;
  actionItems: string[];
}

interface PredictiveAnalysis {
  id: string;
  target: string;
  prediction: string;
  confidence: number;
  factors: PredictionFactor[];
  timeframe: string;
  accuracy: number;
  lastUpdated: string;
}

interface PredictionFactor {
  name: string;
  weight: number;
  value: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'code_analysis' | 'prediction' | 'optimization' | 'security' | 'completion';
  status: 'active' | 'training' | 'deprecated' | 'beta';
  accuracy: number;
  performance: ModelPerformance;
  lastTrained: string;
  trainingData: string;
  features: string[];
}

interface ModelPerformance {
  responseTime: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
}

export default function AdvancedAIAnalysisEngine() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'insights' | 'predictions' | 'models'>('overview');
  const [codeAnalyses, setCodeAnalyses] = useState<CodeAnalysis[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [predictiveAnalyses, setPredictiveAnalyses] = useState<PredictiveAnalysis[]>([]);
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIAnalysisData();
  }, []);

  const loadAIAnalysisData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockCodeAnalyses: CodeAnalysis[] = [
        {
          id: '1',
          filePath: '/src/components/UserProfile.tsx',
          language: 'TypeScript',
          analysisType: 'quality',
          status: 'completed',
          score: 87,
          issues: [
            {
              id: '1',
              type: 'warning',
              severity: 'medium',
              line: 45,
              column: 12,
              message: 'Consider using React.memo for performance optimization',
              category: 'performance',
              fix: 'Wrap component with React.memo()',
              confidence: 0.92,
              tags: ['react', 'performance', 'optimization']
            },
            {
              id: '2',
              type: 'suggestion',
              severity: 'low',
              line: 23,
              column: 8,
              message: 'Unused import detected',
              category: 'maintainability',
              fix: 'Remove unused import',
              confidence: 0.98,
              tags: ['import', 'cleanup']
            }
          ],
          suggestions: [
            {
              id: '1',
              type: 'optimization',
              title: 'Implement React.memo for performance',
              description: 'This component re-renders frequently. Consider using React.memo to prevent unnecessary re-renders.',
              impact: 'high',
              effort: 'low',
              priority: 1,
              codeExample: 'export default React.memo(UserProfile);',
              reasoning: 'Component has no props changes but re-renders on parent updates',
              estimatedSavings: '15% performance improvement'
            }
          ],
          metrics: {
            complexity: 3,
            maintainability: 85,
            reliability: 92,
            security: 95,
            performance: 78,
            testCoverage: 88,
            documentation: 75,
            codeDuplication: 5,
            technicalDebt: 12
          },
          timestamp: '2024-03-20T10:00:00Z',
          processingTime: 2.3
        },
        {
          id: '2',
          filePath: '/src/utils/api.ts',
          language: 'TypeScript',
          analysisType: 'security',
          status: 'completed',
          score: 94,
          issues: [
            {
              id: '3',
              type: 'warning',
              severity: 'low',
              line: 67,
              column: 15,
              message: 'Consider adding input validation for API parameters',
              category: 'security',
              fix: 'Add input validation before API calls',
              confidence: 0.85,
              tags: ['security', 'validation', 'api']
            }
          ],
          suggestions: [
            {
              id: '2',
              type: 'security',
              title: 'Add input validation',
              description: 'Implement comprehensive input validation for all API parameters to prevent injection attacks.',
              impact: 'medium',
              effort: 'medium',
              priority: 2,
              codeExample: 'if (!isValidInput(params)) throw new Error("Invalid input");',
              reasoning: 'Current implementation lacks input validation',
              estimatedSavings: 'Reduced security vulnerabilities'
            }
          ],
          metrics: {
            complexity: 2,
            maintainability: 90,
            reliability: 95,
            security: 94,
            performance: 88,
            testCoverage: 92,
            documentation: 80,
            codeDuplication: 3,
            technicalDebt: 8
          },
          timestamp: '2024-03-20T09:45:00Z',
          processingTime: 1.8
        }
      ];

      const mockAIInsights: AIInsight[] = [
        {
          id: '1',
          type: 'pattern',
          title: 'Performance Pattern Detected',
          description: 'Multiple components are missing React.memo optimization. This pattern appears in 23% of your codebase.',
          confidence: 0.89,
          impact: 'negative',
          category: 'performance',
          data: { affectedFiles: 15, potentialImprovement: '20%' },
          timestamp: '2024-03-20T10:00:00Z',
          actionable: true,
          actionItems: ['Review components for React.memo usage', 'Implement performance optimizations', 'Add performance monitoring']
        },
        {
          id: '2',
          type: 'trend',
          title: 'Code Quality Improving',
          description: 'Your code quality score has improved by 15% over the last 30 days.',
          confidence: 0.94,
          impact: 'positive',
          category: 'quality',
          data: { improvement: '15%', timeframe: '30 days' },
          timestamp: '2024-03-20T09:30:00Z',
          actionable: false,
          actionItems: []
        },
        {
          id: '3',
          type: 'anomaly',
          title: 'Unusual Error Pattern',
          description: 'Detected an unusual pattern of API errors in the authentication module.',
          confidence: 0.76,
          impact: 'negative',
          category: 'reliability',
          data: { errorRate: '8%', normalRate: '2%' },
          timestamp: '2024-03-20T09:15:00Z',
          actionable: true,
          actionItems: ['Investigate authentication errors', 'Review error handling', 'Check API endpoints']
        }
      ];

      const mockPredictiveAnalyses: PredictiveAnalysis[] = [
        {
          id: '1',
          target: 'Project Success Probability',
          prediction: '85% success probability',
          confidence: 0.82,
          factors: [
            { name: 'Code Quality', weight: 0.3, value: 'High (87/100)', impact: 'positive' },
            { name: 'Test Coverage', weight: 0.25, value: 'Good (88%)', impact: 'positive' },
            { name: 'Team Velocity', weight: 0.2, value: 'Above Average', impact: 'positive' },
            { name: 'Technical Debt', weight: 0.15, value: 'Low (12%)', impact: 'positive' },
            { name: 'Documentation', weight: 0.1, value: 'Needs Improvement', impact: 'negative' }
          ],
          timeframe: 'Next 3 months',
          accuracy: 0.78,
          lastUpdated: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          target: 'Bug Prediction',
          prediction: '3-5 bugs expected',
          confidence: 0.71,
          factors: [
            { name: 'Code Complexity', weight: 0.4, value: 'Medium (3.2)', impact: 'neutral' },
            { name: 'Recent Changes', weight: 0.3, value: 'High Activity', impact: 'negative' },
            { name: 'Test Coverage', weight: 0.2, value: 'Good (88%)', impact: 'positive' },
            { name: 'Code Review Quality', weight: 0.1, value: 'Excellent', impact: 'positive' }
          ],
          timeframe: 'Next 2 weeks',
          accuracy: 0.65,
          lastUpdated: '2024-03-20T09:45:00Z'
        }
      ];

      const mockAIModels: AIModel[] = [
        {
          id: '1',
          name: 'Code Quality Analyzer',
          version: '2.1.0',
          type: 'code_analysis',
          status: 'active',
          accuracy: 0.92,
          performance: {
            responseTime: 1.2,
            throughput: 150,
            memoryUsage: 45,
            cpuUsage: 30,
            errorRate: 0.02
          },
          lastTrained: '2024-03-15T00:00:00Z',
          trainingData: '1.2M code samples',
          features: ['syntax analysis', 'complexity metrics', 'best practices', 'security patterns']
        },
        {
          id: '2',
          name: 'Bug Predictor',
          version: '1.8.0',
          type: 'prediction',
          status: 'active',
          accuracy: 0.78,
          performance: {
            responseTime: 2.1,
            throughput: 80,
            memoryUsage: 60,
            cpuUsage: 45,
            errorRate: 0.05
          },
          lastTrained: '2024-03-10T00:00:00Z',
          trainingData: '800K bug reports',
          features: ['code patterns', 'change history', 'complexity analysis', 'team metrics']
        },
        {
          id: '3',
          name: 'Performance Optimizer',
          version: '1.5.0',
          type: 'optimization',
          status: 'beta',
          accuracy: 0.85,
          performance: {
            responseTime: 3.5,
            throughput: 50,
            memoryUsage: 75,
            cpuUsage: 60,
            errorRate: 0.08
          },
          lastTrained: '2024-03-05T00:00:00Z',
          trainingData: '500K performance profiles',
          features: ['performance profiling', 'bottleneck detection', 'optimization suggestions']
        }
      ];

      setCodeAnalyses(mockCodeAnalyses);
      setAiInsights(mockAIInsights);
      setPredictiveAnalyses(mockPredictiveAnalyses);
      setAiModels(mockAIModels);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Code Quality Score</h3>
          <p className="text-3xl font-bold text-blue-600">87/100</p>
          <p className="text-sm text-blue-700">Average across all files</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">AI Insights</h3>
          <p className="text-3xl font-bold text-green-600">{aiInsights.length}</p>
          <p className="text-sm text-green-700">Active insights</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Predictions</h3>
          <p className="text-3xl font-bold text-purple-600">{predictiveAnalyses.length}</p>
          <p className="text-sm text-purple-700">Active predictions</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">AI Models</h3>
          <p className="text-3xl font-bold text-orange-600">{aiModels.filter(m => m.status === 'active').length}</p>
          <p className="text-sm text-orange-700">Active models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Insights</h3>
          <div className="space-y-4">
            {aiInsights.slice(0, 3).map(insight => (
              <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <div className={`w-3 h-3 rounded-full mt-2 ${insight.impact === 'positive' ? 'bg-green-500' : insight.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{insight.title}</p>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Confidence: {Math.round(insight.confidence * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
          <div className="space-y-4">
            {predictiveAnalyses.slice(0, 2).map(prediction => (
              <div key={prediction.id} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{prediction.target}</p>
                  <span className="text-sm text-gray-500">{Math.round(prediction.confidence * 100)}% confidence</span>
                </div>
                <p className="text-lg font-semibold text-blue-600">{prediction.prediction}</p>
                <p className="text-xs text-gray-500 mt-1">{prediction.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Analysis Results</h3>
      <div className="space-y-6">
        {codeAnalyses.map(analysis => (
          <div key={analysis.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{analysis.filePath}</h4>
                <p className="text-sm text-gray-600">{analysis.language} • {analysis.analysisType}</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </span>
                <p className="text-sm text-gray-500">{analysis.processingTime}s</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-white p-4 rounded">
                <h5 className="font-medium text-gray-900 mb-3">Issues ({analysis.issues.length})</h5>
                <div className="space-y-2">
                  {analysis.issues.map(issue => (
                    <div key={issue.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                        <p className="text-xs text-gray-600">Line {issue.line}:{issue.column} • {issue.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded">
                <h5 className="font-medium text-gray-900 mb-3">Suggestions ({analysis.suggestions.length})</h5>
                <div className="space-y-2">
                  {analysis.suggestions.map(suggestion => (
                    <div key={suggestion.id} className="p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact} impact
                        </span>
                        <span className="text-xs text-gray-500">{suggestion.effort} effort</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Metrics</h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analysis.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-lg font-bold text-gray-900">{typeof value === 'number' ? value : `${value}%`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
      <div className="space-y-6">
        {aiInsights.map(insight => (
          <div key={insight.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(insight.impact)}`}>
                  {insight.impact}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                  {insight.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Confidence</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(insight.confidence * 100)}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{insight.category}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Actionable</p>
                <p className="text-lg font-bold text-gray-900">{insight.actionable ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {insight.actionable && insight.actionItems.length > 0 && (
              <div className="bg-white p-4 rounded">
                <h5 className="font-medium text-gray-900 mb-3">Recommended Actions</h5>
                <div className="space-y-2">
                  {insight.actionItems.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
      <div className="space-y-6">
        {predictiveAnalyses.map(prediction => (
          <div key={prediction.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{prediction.target}</h4>
                <p className="text-sm text-gray-600">{prediction.timeframe}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{prediction.prediction}</p>
                <p className="text-sm text-gray-500">{Math.round(prediction.confidence * 100)}% confidence</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-3">Prediction Factors</h5>
              <div className="space-y-3">
                {prediction.factors.map(factor => (
                  <div key={factor.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' : factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                      <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{factor.value}</p>
                      <p className="text-xs text-gray-500">Weight: {Math.round(factor.weight * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Accuracy</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(prediction.accuracy * 100)}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900">{new Date(prediction.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Models</h3>
      <div className="space-y-6">
        {aiModels.map(model => (
          <div key={model.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-600">v{model.version} • {model.type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${model.status === 'active' ? 'text-green-600 bg-green-100' : model.status === 'beta' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'}`}>
                  {model.status}
                </span>
                <span className="text-sm text-gray-500">{Math.round(model.accuracy * 100)}% accuracy</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Response Time</p>
                <p className="text-lg font-bold text-gray-900">{model.performance.responseTime}s</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Throughput</p>
                <p className="text-lg font-bold text-gray-900">{model.performance.throughput}/min</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Memory Usage</p>
                <p className="text-lg font-bold text-gray-900">{model.performance.memoryUsage}%</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Error Rate</p>
                <p className="text-lg font-bold text-gray-900">{Math.round(model.performance.errorRate * 100)}%</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Features ({model.features.length})</h5>
              <div className="flex flex-wrap gap-2">
                {model.features.map(feature => (
                  <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {feature}
                  </span>
                ))}
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
          <p className="mt-4 text-gray-600">Loading AI analysis data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced AI Analysis Engine</h1>
          <p className="text-gray-600 mt-2">
            AI-powered code analysis, intelligent suggestions, predictive capabilities, and code quality assessment
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analysis', label: 'Code Analysis' },
              { id: 'insights', label: 'AI Insights' },
              { id: 'predictions', label: 'Predictions' },
              { id: 'models', label: 'AI Models' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analysis' && renderAnalysis()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'predictions' && renderPredictions()}
          {activeTab === 'models' && renderModels()}
        </div>
      </div>
    </div>
  );
} 