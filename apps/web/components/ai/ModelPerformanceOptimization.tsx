// Model Performance Optimization for CodePal
// Features: AI model optimization, performance monitoring, A/B testing, continuous learning

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'code_completion' | 'code_analysis' | 'learning' | 'prediction' | 'nlp';
  status: 'active' | 'training' | 'evaluating' | 'deployed' | 'archived';
  performance: ModelPerformance;
  optimization: ModelOptimization;
  training: TrainingMetrics;
  deployment: DeploymentInfo;
  lastUpdated: string;
}

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number; // milliseconds
  throughput: number; // requests per second
  errorRate: number;
  userSatisfaction: number; // 1-5 scale
  costPerRequest: number; // USD
  resourceUtilization: number; // percentage
}

interface ModelOptimization {
  isOptimized: boolean;
  optimizationTechniques: string[];
  performanceGain: number; // percentage improvement
  costReduction: number; // percentage
  latencyImprovement: number; // percentage
  lastOptimized: string;
  nextOptimization: string;
  autoOptimization: boolean;
}

interface TrainingMetrics {
  datasetSize: number;
  trainingTime: number; // hours
  epochs: number;
  batchSize: number;
  learningRate: number;
  loss: number;
  validationAccuracy: number;
  overfittingScore: number;
  convergenceRate: number;
}

interface DeploymentInfo {
  environment: 'development' | 'staging' | 'production' | 'canary';
  replicas: number;
  resources: ResourceAllocation;
  scaling: ScalingConfig;
  health: HealthStatus;
  uptime: number; // percentage
}

interface ResourceAllocation {
  cpu: string;
  memory: string;
  gpu?: string;
  storage: string;
}

interface ScalingConfig {
  minReplicas: number;
  maxReplicas: number;
  targetCPUUtilization: number;
  targetMemoryUtilization: number;
  autoScaling: boolean;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: string;
  responseTime: number;
  errorCount: number;
  successRate: number;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  models: ABTestModel[];
  trafficSplit: Record<string, number>;
  metrics: ABTestMetrics;
  startDate: string;
  endDate?: string;
  duration: number; // days
}

interface ABTestModel {
  id: string;
  name: string;
  version: string;
  trafficPercentage: number;
  performance: ModelPerformance;
}

interface ABTestMetrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  userSatisfaction: number;
  costEfficiency: number;
  statisticalSignificance: number;
  winner?: string;
}

interface ContinuousLearning {
  id: string;
  modelId: string;
  status: 'active' | 'paused' | 'completed';
  learningRate: number;
  dataCollection: DataCollection;
  feedbackLoop: FeedbackLoop;
  performance: ContinuousLearningMetrics;
}

interface DataCollection {
  enabled: boolean;
  sources: string[];
  dataTypes: string[];
  privacyCompliance: boolean;
  dataRetention: number; // days
  lastCollection: string;
}

interface FeedbackLoop {
  enabled: boolean;
  feedbackTypes: string[];
  processingInterval: number; // hours
  qualityThreshold: number;
  lastProcessing: string;
}

interface ContinuousLearningMetrics {
  dataPointsCollected: number;
  feedbackProcessed: number;
  modelUpdates: number;
  performanceImprovement: number;
  lastUpdate: string;
}

interface PerformanceAlert {
  id: string;
  modelId: string;
  type: 'latency' | 'accuracy' | 'error_rate' | 'cost' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export default function ModelPerformanceOptimization() {
  const { user } = useAuthContext();
  const [models, setModels] = useState<AIModel[]>([]);
  const [abTests, setABTests] = useState<ABTest[]>([]);
  const [continuousLearning, setContinuousLearning] = useState<ContinuousLearning[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'abtesting' | 'learning' | 'alerts' | 'optimization'>('overview');

  // Load model performance data
  const loadPerformanceData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockModels: AIModel[] = [
        {
          id: '1',
          name: 'Code Completion Model v2.1',
          version: '2.1.0',
          type: 'code_completion',
          status: 'active',
          performance: {
            accuracy: 0.94,
            precision: 0.92,
            recall: 0.95,
            f1Score: 0.93,
            latency: 45,
            throughput: 1200,
            errorRate: 0.02,
            userSatisfaction: 4.6,
            costPerRequest: 0.0012,
            resourceUtilization: 78
          },
          optimization: {
            isOptimized: true,
            optimizationTechniques: ['quantization', 'pruning', 'knowledge_distillation'],
            performanceGain: 15.5,
            costReduction: 23.4,
            latencyImprovement: 28.7,
            lastOptimized: '2024-01-15T10:30:00Z',
            nextOptimization: '2024-01-22T10:30:00Z',
            autoOptimization: true
          },
          training: {
            datasetSize: 5000000,
            trainingTime: 48,
            epochs: 100,
            batchSize: 64,
            learningRate: 0.001,
            loss: 0.08,
            validationAccuracy: 0.94,
            overfittingScore: 0.12,
            convergenceRate: 0.85
          },
          deployment: {
            environment: 'production',
            replicas: 5,
            resources: {
              cpu: '4',
              memory: '8Gi',
              gpu: '1',
              storage: '20Gi'
            },
            scaling: {
              minReplicas: 2,
              maxReplicas: 10,
              targetCPUUtilization: 70,
              targetMemoryUtilization: 80,
              autoScaling: true
            },
            health: {
              status: 'healthy',
              lastCheck: '2024-01-15T12:00:00Z',
              responseTime: 45,
              errorCount: 12,
              successRate: 0.998
            },
            uptime: 99.9
          },
          lastUpdated: '2024-01-15T12:00:00Z'
        },
        {
          id: '2',
          name: 'Code Analysis Model v1.8',
          version: '1.8.2',
          type: 'code_analysis',
          status: 'training',
          performance: {
            accuracy: 0.89,
            precision: 0.87,
            recall: 0.91,
            f1Score: 0.89,
            latency: 120,
            throughput: 800,
            errorRate: 0.05,
            userSatisfaction: 4.2,
            costPerRequest: 0.0021,
            resourceUtilization: 65
          },
          optimization: {
            isOptimized: false,
            optimizationTechniques: [],
            performanceGain: 0,
            costReduction: 0,
            latencyImprovement: 0,
            lastOptimized: '2024-01-10T15:45:00Z',
            nextOptimization: '2024-01-17T15:45:00Z',
            autoOptimization: false
          },
          training: {
            datasetSize: 3000000,
            trainingTime: 72,
            epochs: 150,
            batchSize: 32,
            learningRate: 0.0005,
            loss: 0.15,
            validationAccuracy: 0.89,
            overfittingScore: 0.18,
            convergenceRate: 0.72
          },
          deployment: {
            environment: 'staging',
            replicas: 2,
            resources: {
              cpu: '8',
              memory: '16Gi',
              gpu: '2',
              storage: '40Gi'
            },
            scaling: {
              minReplicas: 1,
              maxReplicas: 5,
              targetCPUUtilization: 60,
              targetMemoryUtilization: 70,
              autoScaling: true
            },
            health: {
              status: 'degraded',
              lastCheck: '2024-01-15T12:00:00Z',
              responseTime: 120,
              errorCount: 45,
              successRate: 0.95
            },
            uptime: 98.5
          },
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      ];

      const mockABTests: ABTest[] = [
        {
          id: '1',
          name: 'Code Completion Model Comparison',
          description: 'Comparing v2.1 vs v2.0 for code completion accuracy',
          status: 'running',
          models: [
            {
              id: 'model-1',
              name: 'Code Completion v2.1',
              version: '2.1.0',
              trafficPercentage: 50,
              performance: {
                accuracy: 0.94,
                precision: 0.92,
                recall: 0.95,
                f1Score: 0.93,
                latency: 45,
                throughput: 1200,
                errorRate: 0.02,
                userSatisfaction: 4.6,
                costPerRequest: 0.0012,
                resourceUtilization: 78
              }
            },
            {
              id: 'model-2',
              name: 'Code Completion v2.0',
              version: '2.0.0',
              trafficPercentage: 50,
              performance: {
                accuracy: 0.91,
                precision: 0.89,
                recall: 0.92,
                f1Score: 0.90,
                latency: 52,
                throughput: 1100,
                errorRate: 0.03,
                userSatisfaction: 4.3,
                costPerRequest: 0.0015,
                resourceUtilization: 82
              }
            }
          ],
          trafficSplit: { 'model-1': 50, 'model-2': 50 },
          metrics: {
            totalRequests: 150000,
            successRate: 0.985,
            averageLatency: 48.5,
            userSatisfaction: 4.45,
            costEfficiency: 0.92,
            statisticalSignificance: 0.95
          },
          startDate: '2024-01-10T00:00:00Z',
          duration: 5
        }
      ];

      const mockContinuousLearning: ContinuousLearning[] = [
        {
          id: '1',
          modelId: '1',
          status: 'active',
          learningRate: 0.0001,
          dataCollection: {
            enabled: true,
            sources: ['user_feedback', 'code_patterns', 'error_logs'],
            dataTypes: ['completion_accuracy', 'user_satisfaction', 'performance_metrics'],
            privacyCompliance: true,
            dataRetention: 90,
            lastCollection: '2024-01-15T11:00:00Z'
          },
          feedbackLoop: {
            enabled: true,
            feedbackTypes: ['acceptance_rate', 'correction_frequency', 'user_ratings'],
            processingInterval: 24,
            qualityThreshold: 0.8,
            lastProcessing: '2024-01-15T10:00:00Z'
          },
          performance: {
            dataPointsCollected: 25000,
            feedbackProcessed: 18000,
            modelUpdates: 12,
            performanceImprovement: 8.5,
            lastUpdate: '2024-01-15T09:00:00Z'
          }
        }
      ];

      const mockAlerts: PerformanceAlert[] = [
        {
          id: '1',
          modelId: '2',
          type: 'latency',
          severity: 'high',
          message: 'Response time exceeded threshold',
          threshold: 100,
          currentValue: 120,
          timestamp: '2024-01-15T11:30:00Z',
          status: 'active'
        },
        {
          id: '2',
          modelId: '1',
          type: 'accuracy',
          severity: 'medium',
          message: 'Accuracy dropped below target',
          threshold: 0.95,
          currentValue: 0.94,
          timestamp: '2024-01-15T10:15:00Z',
          status: 'acknowledged'
        }
      ];

      setModels(mockModels);
      setABTests(mockABTests);
      setContinuousLearning(mockContinuousLearning);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optimize model
  const optimizeModel = async (modelId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? {
              ...model,
              optimization: {
                ...model.optimization,
                isOptimized: true,
                performanceGain: model.optimization.performanceGain + 5,
                costReduction: model.optimization.costReduction + 3,
                latencyImprovement: model.optimization.latencyImprovement + 4,
                lastOptimized: new Date().toISOString(),
                nextOptimization: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              },
              performance: {
                ...model.performance,
                latency: model.performance.latency * 0.9,
                throughput: model.performance.throughput * 1.1,
                costPerRequest: model.performance.costPerRequest * 0.95
              }
            }
          : model
      ));
    } catch (error) {
      console.error('Error optimizing model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start A/B test
  const startABTest = async (testId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setABTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'running' }
          : test
      ));
    } catch (error) {
      console.error('Error starting A/B test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged' }
          : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Models</h3>
          <p className="text-2xl font-bold text-blue-600">{models.filter(m => m.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Deployed models</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Accuracy</h3>
          <p className="text-2xl font-bold text-green-600">
            {(models.reduce((acc, m) => acc + m.performance.accuracy, 0) / models.length * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400">Model performance</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Latency</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(models.reduce((acc, m) => acc + m.performance.latency, 0) / models.length)}ms
          </p>
          <p className="text-xs text-gray-400">Response time</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
          <p className="text-2xl font-bold text-orange-600">{alerts.filter(a => a.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Performance alerts</p>
        </div>
      </div>

      {/* Model Performance Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Model Performance Overview</h3>
        </div>
        <div className="p-6">
          {models.slice(0, 3).map(model => (
            <div key={model.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-500">v{model.version} • {model.type.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{(model.performance.accuracy * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">{model.performance.latency}ms</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  model.status === 'active' ? 'bg-green-100 text-green-800' :
                  model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {model.status}
                </span>
                <button
                  onClick={() => optimizeModel(model.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Optimize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active A/B Tests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active A/B Tests</h3>
        </div>
        <div className="p-6">
          {abTests.filter(test => test.status === 'running').map(test => (
            <div key={test.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{test.name}</h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Running
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{test.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Requests</p>
                  <p className="font-medium">{test.metrics.totalRequests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Success Rate</p>
                  <p className="font-medium">{(test.metrics.successRate * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Significance</p>
                  <p className="font-medium">{(test.metrics.statisticalSignificance * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">AI Models</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map(model => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">v{model.version} • {model.type.replace('_', ' ')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                model.status === 'active' ? 'bg-green-100 text-green-800' :
                model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {model.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-lg font-semibold text-gray-900">{(model.performance.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Latency</p>
                <p className="text-lg font-semibold text-gray-900">{model.performance.latency}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Throughput</p>
                <p className="text-lg font-semibold text-gray-900">{model.performance.throughput}/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost/Request</p>
                <p className="text-lg font-semibold text-gray-900">${model.performance.costPerRequest}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Optimization Status</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {model.optimization.isOptimized ? 'Optimized' : 'Not Optimized'}
                </span>
                <span className="text-green-600 font-medium">
                  +{model.optimization.performanceGain}% improvement
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => optimizeModel(model.id)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Optimize
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderABTesting = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">A/B Testing</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {abTests.map(test => (
          <div key={test.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-500">{test.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                test.status === 'running' ? 'bg-green-100 text-green-800' :
                test.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {test.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Models</p>
              <div className="space-y-2">
                {test.models.map(model => (
                  <div key={model.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{model.name}</span>
                    <span className="font-medium">{model.trafficPercentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-lg font-semibold text-gray-900">{test.metrics.totalRequests.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">{(test.metrics.successRate * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startABTest(test.id)}
                disabled={test.status === 'running'}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {test.status === 'running' ? 'Running' : 'Start Test'}
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Results
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLearning = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Continuous Learning</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {continuousLearning.map(learning => (
          <div key={learning.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Model {learning.modelId}</h3>
                <p className="text-sm text-gray-500">Continuous Learning System</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                learning.status === 'active' ? 'bg-green-100 text-green-800' :
                learning.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {learning.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Data Collected</p>
                <p className="text-lg font-semibold text-gray-900">{learning.performance.dataPointsCollected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model Updates</p>
                <p className="text-lg font-semibold text-gray-900">{learning.performance.modelUpdates}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Improvement</p>
                <p className="text-lg font-semibold text-gray-900">+{learning.performance.performanceImprovement}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Learning Rate</p>
                <p className="text-lg font-semibold text-gray-900">{learning.learningRate}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Data Collection</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {learning.dataCollection.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="text-gray-500">
                  {learning.dataCollection.sources.length} sources
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Configure
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Performance Alerts</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></span>
                <div>
                  <h4 className="font-medium text-gray-900">{alert.message}</h4>
                  <p className="text-sm text-gray-500">Model {alert.modelId} • {alert.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{alert.currentValue} / {alert.threshold}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.status === 'active' ? 'bg-red-100 text-red-800' :
                  alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.status}
                </span>
              </div>
              <div className="flex space-x-2">
                {alert.status === 'active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Acknowledge
                  </button>
                )}
                <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Optimization Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map(model => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
              <p className="text-sm text-gray-500">Optimization Analysis</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Performance Gain</p>
                <p className="text-lg font-semibold text-green-600">+{model.optimization.performanceGain}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost Reduction</p>
                <p className="text-lg font-semibold text-blue-600">-{model.optimization.costReduction}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Latency Improvement</p>
                <p className="text-lg font-semibold text-purple-600">-{model.optimization.latencyImprovement}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Auto Optimization</p>
                <p className="text-lg font-semibold text-gray-900">
                  {model.optimization.autoOptimization ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Optimization Techniques</p>
              <div className="flex flex-wrap gap-1">
                {model.optimization.optimizationTechniques.map((technique, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {technique.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => optimizeModel(model.id)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Run Optimization
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Model Performance Optimization</h1>
          <p className="text-gray-600 mt-2">
            AI model optimization, performance monitoring, A/B testing, and continuous learning
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'models', label: 'Models' },
              { id: 'abtesting', label: 'A/B Testing' },
              { id: 'learning', label: 'Continuous Learning' },
              { id: 'alerts', label: 'Alerts' },
              { id: 'optimization', label: 'Optimization' }
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'models' && renderModels()}
            {activeTab === 'abtesting' && renderABTesting()}
            {activeTab === 'learning' && renderLearning()}
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'optimization' && renderOptimization()}
          </div>
        )}
      </div>
    </div>
  );
} 