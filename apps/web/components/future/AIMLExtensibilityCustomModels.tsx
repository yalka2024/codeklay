// AI/ML Extensibility & Custom Models for CodePal
// Features: Custom model management, fine-tuning, model marketplace, AI workflow orchestration

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface CustomModel {
  id: string;
  name: string;
  description: string;
  type: 'classification' | 'regression' | 'nlp' | 'vision' | 'recommendation' | 'custom';
  status: 'training' | 'ready' | 'deployed' | 'error' | 'archived';
  version: string;
  accuracy: number;
  trainingData: string;
  modelSize: number;
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  performance: ModelPerformance;
}

interface ModelPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
}

interface FineTuningJob {
  id: string;
  modelId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  hyperparameters: Record<string, any>;
  trainingMetrics: TrainingMetrics;
}

interface TrainingMetrics {
  loss: number[];
  accuracy: number[];
  validationLoss: number[];
  validationAccuracy: number[];
}

interface ModelMarketplace {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: string;
  price: number;
  rating: number;
  downloads: number;
  featured: boolean;
  tags: string[];
}

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  steps: WorkflowStep[];
  triggers: string[];
  createdAt: string;
  lastRun?: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'model' | 'preprocessing' | 'postprocessing' | 'condition' | 'action';
  modelId?: string;
  config: Record<string, any>;
  order: number;
}

export default function AIMLExtensibilityCustomModels() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'fine-tuning' | 'marketplace' | 'workflows'>('overview');
  const [customModels, setCustomModels] = useState<CustomModel[]>([]);
  const [fineTuningJobs, setFineTuningJobs] = useState<FineTuningJob[]>([]);
  const [marketplaceModels, setMarketplaceModels] = useState<ModelMarketplace[]>([]);
  const [aiWorkflows, setAiWorkflows] = useState<AIWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIMLData();
  }, []);

  const loadAIMLData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCustomModels([
        {
          id: 'model-1',
          name: 'Code Quality Classifier',
          description: 'Custom model for classifying code quality and identifying potential issues.',
          type: 'classification',
          status: 'deployed',
          version: '1.2.0',
          accuracy: 0.94,
          trainingData: 'code_samples_v2.json',
          modelSize: 256,
          createdAt: '2024-01-10T10:00:00Z',
          lastUpdated: '2024-01-15T09:00:00Z',
          tags: ['code-quality', 'classification', 'python'],
          performance: {
            precision: 0.92,
            recall: 0.89,
            f1Score: 0.90,
            latency: 45,
            throughput: 1000
          }
        },
        {
          id: 'model-2',
          name: 'Bug Prediction Model',
          description: 'ML model to predict potential bugs in code based on historical data.',
          type: 'regression',
          status: 'training',
          version: '2.1.0',
          accuracy: 0.87,
          trainingData: 'bug_history_dataset.csv',
          modelSize: 512,
          createdAt: '2024-01-12T14:00:00Z',
          lastUpdated: '2024-01-20T08:00:00Z',
          tags: ['bug-prediction', 'regression', 'ml'],
          performance: {
            precision: 0.85,
            recall: 0.82,
            f1Score: 0.83,
            latency: 60,
            throughput: 800
          }
        }
      ]);

      setFineTuningJobs([
        {
          id: 'ft-1',
          modelId: 'model-1',
          status: 'completed',
          progress: 100,
          startTime: '2024-01-15T08:00:00Z',
          endTime: '2024-01-15T12:00:00Z',
          hyperparameters: {
            learningRate: 0.001,
            batchSize: 32,
            epochs: 100,
            optimizer: 'adam'
          },
          trainingMetrics: {
            loss: [0.5, 0.3, 0.2, 0.15, 0.1],
            accuracy: [0.7, 0.8, 0.85, 0.9, 0.94],
            validationLoss: [0.6, 0.4, 0.25, 0.2, 0.12],
            validationAccuracy: [0.65, 0.75, 0.82, 0.88, 0.92]
          }
        },
        {
          id: 'ft-2',
          modelId: 'model-2',
          status: 'running',
          progress: 65,
          startTime: '2024-01-20T10:00:00Z',
          hyperparameters: {
            learningRate: 0.0005,
            batchSize: 64,
            epochs: 150,
            optimizer: 'adam'
          },
          trainingMetrics: {
            loss: [0.8, 0.6, 0.4, 0.3],
            accuracy: [0.6, 0.7, 0.8, 0.85],
            validationLoss: [0.9, 0.7, 0.5, 0.35],
            validationAccuracy: [0.55, 0.65, 0.75, 0.8]
          }
        }
      ]);

      setMarketplaceModels([
        {
          id: 'market-1',
          name: 'GPT-4 Code Assistant',
          description: 'Advanced language model fine-tuned for code generation and assistance.',
          provider: 'OpenAI',
          type: 'nlp',
          price: 0.02,
          rating: 4.8,
          downloads: 15000,
          featured: true,
          tags: ['gpt-4', 'code-generation', 'nlp']
        },
        {
          id: 'market-2',
          name: 'CodeBERT Security Scanner',
          description: 'BERT-based model for detecting security vulnerabilities in code.',
          provider: 'Microsoft',
          type: 'nlp',
          price: 0.01,
          rating: 4.6,
          downloads: 8500,
          featured: false,
          tags: ['bert', 'security', 'vulnerability']
        }
      ]);

      setAiWorkflows([
        {
          id: 'workflow-1',
          name: 'Code Review Automation',
          description: 'Automated code review workflow using multiple AI models.',
          status: 'active',
          steps: [
            {
              id: 'step-1',
              name: 'Code Quality Check',
              type: 'model',
              modelId: 'model-1',
              config: { threshold: 0.8 },
              order: 1
            },
            {
              id: 'step-2',
              name: 'Security Scan',
              type: 'model',
              modelId: 'market-2',
              config: { scanLevel: 'comprehensive' },
              order: 2
            }
          ],
          triggers: ['pull_request', 'commit'],
          createdAt: '2024-01-10T00:00:00Z',
          lastRun: '2024-01-20T15:30:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error loading AI/ML data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'deployed': return 'text-blue-600 bg-blue-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatModelSize = (size: number) => {
    if (size < 1024) return `${size} MB`;
    return `${(size / 1024).toFixed(1)} GB`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custom Models</p>
              <p className="text-2xl font-bold text-gray-900">{customModels.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fine-tuning Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{fineTuningJobs.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Marketplace Models</p>
              <p className="text-2xl font-bold text-gray-900">{marketplaceModels.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{aiWorkflows.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Models</h3>
          <div className="space-y-3">
            {customModels.slice(0, 3).map((model) => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🤖</span>
                  <div>
                    <p className="font-medium text-gray-900">{model.name}</p>
                    <p className="text-sm text-gray-500">{model.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Workflows</h3>
          <div className="space-y-3">
            {aiWorkflows.filter(w => w.status === 'active').slice(0, 3).map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔄</span>
                  <div>
                    <p className="font-medium text-gray-900">{workflow.name}</p>
                    <p className="text-sm text-gray-500">{workflow.steps.length} steps</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Custom Models</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Model
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customModels.map((model) => (
          <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(model.status)}`}>
                {model.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{model.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{model.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium">{formatModelSize(model.modelSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">F1 Score:</span>
                <span className="font-medium">{(model.performance.f1Score * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Deploy
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Fine-tune
                </button>
                <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFineTuning = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Fine-tuning Jobs</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Start Fine-tuning
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fineTuningJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚙️</span>
                <h3 className="font-semibold text-gray-900">Fine-tuning Job {job.id}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Model:</span>
                <span className="font-medium">{job.modelId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress:</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Learning Rate:</span>
                <span className="font-medium">{job.hyperparameters.learningRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Epochs:</span>
                <span className="font-medium">{job.hyperparameters.epochs}</span>
              </div>
            </div>
            {job.status === 'running' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  View Logs
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Metrics
                </button>
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
        <h2 className="text-xl font-semibold text-gray-900">Model Marketplace</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Browse All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceModels.map((model) => (
          <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{model.featured ? '⭐' : '🛒'}</span>
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {model.type.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{model.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider:</span>
                <span className="font-medium">{model.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rating:</span>
                <span className="font-medium">{model.rating}/5.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Downloads:</span>
                <span className="font-medium">{model.downloads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">${model.price}/request</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Integrate
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">AI Workflows</h2>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          Create Workflow
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiWorkflows.map((workflow) => (
          <div key={workflow.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔄</span>
                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{workflow.description}</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Steps:</span>
                <span className="font-medium">{workflow.steps.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Triggers:</span>
                <span className="font-medium">{workflow.triggers.join(', ')}</span>
              </div>
              {workflow.lastRun && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Run:</span>
                  <span className="font-medium">{new Date(workflow.lastRun).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                  Run
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors">
                  Logs
                </button>
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
          <p className="mt-4 text-gray-600">Loading AI/ML data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI/ML Extensibility & Custom Models</h1>
          <p className="mt-2 text-gray-600">
            Create, fine-tune, and deploy custom AI/ML models. Integrate marketplace models and orchestrate AI workflows.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'models', name: 'Custom Models', icon: '🤖' },
                { id: 'fine-tuning', name: 'Fine-tuning', icon: '⚙️' },
                { id: 'marketplace', name: 'Marketplace', icon: '🛒' },
                { id: 'workflows', name: 'Workflows', icon: '🔄' }
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
            {activeTab === 'models' && renderModels()}
            {activeTab === 'fine-tuning' && renderFineTuning()}
            {activeTab === 'marketplace' && renderMarketplace()}
            {activeTab === 'workflows' && renderWorkflows()}
          </div>
        </div>
      </div>
    </div>
  );
} 