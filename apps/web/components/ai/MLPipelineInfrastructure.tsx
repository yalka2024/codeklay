// ML Pipeline Infrastructure for CodePal
// Features: Model management, data pipeline processing, AI infrastructure management

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface MLModel {
  id: string;
  name: string;
  version: string;
  type: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision';
  status: 'training' | 'deployed' | 'archived' | 'failed';
  framework: 'tensorflow' | 'pytorch' | 'scikit-learn' | 'custom';
  accuracy: number;
  trainingMetrics: TrainingMetrics;
  deploymentInfo: DeploymentInfo;
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  description: string;
}

interface TrainingMetrics {
  loss: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number; // in minutes
  epochs: number;
  batchSize: number;
  learningRate: number;
}

interface DeploymentInfo {
  environment: 'development' | 'staging' | 'production';
  endpoint: string;
  version: string;
  replicas: number;
  resources: ResourceRequirements;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
  lastDeployed: string;
  uptime: number; // percentage
}

interface ResourceRequirements {
  cpu: string;
  memory: string;
  gpu?: string;
  storage: string;
}

interface DataPipeline {
  id: string;
  name: string;
  type: 'batch' | 'streaming' | 'real-time';
  status: 'running' | 'stopped' | 'failed' | 'scheduled';
  schedule?: string; // cron expression
  stages: PipelineStage[];
  dataSources: DataSource[];
  dataSinks: DataSink[];
  metrics: PipelineMetrics;
  lastRun: string;
  nextRun?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  type: 'ingestion' | 'transformation' | 'validation' | 'feature_engineering' | 'training' | 'inference';
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  processingTime: number;
  recordsProcessed: number;
  errorCount: number;
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'file' | 'api' | 'stream' | 'cloud_storage';
  connectionString: string;
  format: 'json' | 'csv' | 'parquet' | 'avro' | 'custom';
  schema: Record<string, any>;
  lastSync: string;
  recordCount: number;
}

interface DataSink {
  id: string;
  name: string;
  type: 'database' | 'file' | 'api' | 'stream' | 'cloud_storage';
  connectionString: string;
  format: 'json' | 'csv' | 'parquet' | 'avro' | 'custom';
  schema: Record<string, any>;
  lastWrite: string;
  recordCount: number;
}

interface PipelineMetrics {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  processingTime: number;
  throughput: number; // records per second
  errorRate: number;
  dataQuality: number; // percentage
}

interface AIInfrastructure {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'network' | 'monitoring';
  provider: 'aws' | 'gcp' | 'azure' | 'on-premise' | 'hybrid';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  resources: InfrastructureResource[];
  metrics: InfrastructureMetrics;
  cost: CostMetrics;
  lastUpdated: string;
}

interface InfrastructureResource {
  id: string;
  name: string;
  type: 'instance' | 'cluster' | 'storage' | 'network' | 'gpu';
  status: 'running' | 'stopped' | 'terminated' | 'error';
  specifications: Record<string, any>;
  utilization: ResourceUtilization;
  cost: number;
}

interface ResourceUtilization {
  cpu: number; // percentage
  memory: number; // percentage
  gpu?: number; // percentage
  storage: number; // percentage
  network: number; // MB/s
}

interface InfrastructureMetrics {
  totalInstances: number;
  activeInstances: number;
  totalStorage: number; // GB
  usedStorage: number; // GB
  networkThroughput: number; // MB/s
  averageResponseTime: number; // ms
  errorRate: number;
  uptime: number; // percentage
}

interface CostMetrics {
  totalCost: number;
  computeCost: number;
  storageCost: number;
  networkCost: number;
  gpuCost: number;
  costTrend: 'increasing' | 'decreasing' | 'stable';
  budgetUtilization: number; // percentage
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  hyperparameters: Record<string, any>;
  metrics: ExperimentMetrics;
  artifacts: ExperimentArtifact[];
  createdAt: string;
  completedAt?: string;
  duration: number; // in minutes
}

interface ExperimentMetrics {
  accuracy: number;
  loss: number;
  precision: number;
  recall: number;
  f1Score: number;
  customMetrics: Record<string, number>;
}

interface ExperimentArtifact {
  id: string;
  name: string;
  type: 'model' | 'data' | 'log' | 'visualization' | 'config';
  size: number; // bytes
  path: string;
  createdAt: string;
}

export default function MLPipelineInfrastructure() {
  const { user } = useAuthContext();
  const [models, setModels] = useState<MLModel[]>([]);
  const [pipelines, setPipelines] = useState<DataPipeline[]>([]);
  const [infrastructure, setInfrastructure] = useState<AIInfrastructure[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [selectedPipeline, setSelectedPipeline] = useState<DataPipeline | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<AIInfrastructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'pipelines' | 'infrastructure' | 'experiments'>('overview');

  // Load ML infrastructure data
  const loadMLData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockModels: MLModel[] = [
        {
          id: '1',
          name: 'Code Quality Classifier',
          version: '2.1.0',
          type: 'classification',
          status: 'deployed',
          framework: 'tensorflow',
          accuracy: 0.92,
          trainingMetrics: {
            loss: 0.08,
            accuracy: 0.92,
            precision: 0.91,
            recall: 0.93,
            f1Score: 0.92,
            trainingTime: 45,
            epochs: 50,
            batchSize: 32,
            learningRate: 0.001
          },
          deploymentInfo: {
            environment: 'production',
            endpoint: 'https://api.codepal.ai/v1/models/code-quality',
            version: '2.1.0',
            replicas: 3,
            resources: {
              cpu: '2',
              memory: '4Gi',
              gpu: '1',
              storage: '10Gi'
            },
            healthStatus: 'healthy',
            lastDeployed: '2024-01-15T10:30:00Z',
            uptime: 99.8
          },
          createdAt: '2024-01-10T09:00:00Z',
          lastUpdated: '2024-01-15T10:30:00Z',
          tags: ['code-quality', 'classification', 'production'],
          description: 'ML model for classifying code quality and identifying potential issues'
        },
        {
          id: '2',
          name: 'Developer Productivity Predictor',
          version: '1.5.2',
          type: 'regression',
          status: 'training',
          framework: 'pytorch',
          accuracy: 0.87,
          trainingMetrics: {
            loss: 0.13,
            accuracy: 0.87,
            precision: 0.85,
            recall: 0.89,
            f1Score: 0.87,
            trainingTime: 120,
            epochs: 100,
            batchSize: 64,
            learningRate: 0.0005
          },
          deploymentInfo: {
            environment: 'staging',
            endpoint: 'https://api.codepal.ai/v1/models/productivity',
            version: '1.5.1',
            replicas: 1,
            resources: {
              cpu: '4',
              memory: '8Gi',
              gpu: '2',
              storage: '20Gi'
            },
            healthStatus: 'healthy',
            lastDeployed: '2024-01-14T15:45:00Z',
            uptime: 99.5
          },
          createdAt: '2024-01-08T14:00:00Z',
          lastUpdated: '2024-01-15T12:00:00Z',
          tags: ['productivity', 'regression', 'staging'],
          description: 'Regression model for predicting developer productivity based on various metrics'
        }
      ];

      const mockPipelines: DataPipeline[] = [
        {
          id: '1',
          name: 'Code Quality Data Pipeline',
          type: 'batch',
          status: 'running',
          schedule: '0 */6 * * *', // Every 6 hours
          stages: [
            {
              id: 'stage-1',
              name: 'Data Ingestion',
              type: 'ingestion',
              status: 'completed',
              inputSchema: { source: 'string', timestamp: 'datetime', data: 'json' },
              outputSchema: { id: 'string', source: 'string', timestamp: 'datetime', data: 'json' },
              processingTime: 300,
              recordsProcessed: 10000,
              errorCount: 0
            },
            {
              id: 'stage-2',
              name: 'Feature Engineering',
              type: 'feature_engineering',
              status: 'running',
              inputSchema: { id: 'string', data: 'json' },
              outputSchema: { id: 'string', features: 'array', labels: 'array' },
              processingTime: 180,
              recordsProcessed: 5000,
              errorCount: 2
            }
          ],
          dataSources: [
            {
              id: 'source-1',
              name: 'GitHub Code Repository',
              type: 'api',
              connectionString: 'https://api.github.com/repos/codepal/codebase',
              format: 'json',
              schema: { repository: 'string', files: 'array', metrics: 'object' },
              lastSync: '2024-01-15T12:00:00Z',
              recordCount: 15000
            }
          ],
          dataSinks: [
            {
              id: 'sink-1',
              name: 'Feature Store',
              type: 'database',
              connectionString: 'postgresql://features:5432/codepal_features',
              format: 'parquet',
              schema: { id: 'string', features: 'array', labels: 'array', timestamp: 'datetime' },
              lastWrite: '2024-01-15T12:30:00Z',
              recordCount: 10000
            }
          ],
          metrics: {
            totalRecords: 15000,
            processedRecords: 10000,
            failedRecords: 2,
            processingTime: 480,
            throughput: 20.8,
            errorRate: 0.02,
            dataQuality: 99.8
          },
          lastRun: '2024-01-15T12:00:00Z',
          nextRun: '2024-01-15T18:00:00Z'
        }
      ];

      const mockInfrastructure: AIInfrastructure[] = [
        {
          id: '1',
          name: 'ML Compute Cluster',
          type: 'compute',
          provider: 'aws',
          status: 'active',
          resources: [
            {
              id: 'instance-1',
              name: 'ml-training-01',
              type: 'instance',
              status: 'running',
              specifications: { instanceType: 'p3.2xlarge', vcpus: 8, memory: '61Gi' },
              utilization: { cpu: 75, memory: 60, gpu: 85, storage: 45, network: 50 },
              cost: 3.06
            },
            {
              id: 'instance-2',
              name: 'ml-inference-01',
              type: 'instance',
              status: 'running',
              specifications: { instanceType: 'c5.2xlarge', vcpus: 8, memory: '16Gi' },
              utilization: { cpu: 45, memory: 70, storage: 30, network: 25 },
              cost: 0.34
            }
          ],
          metrics: {
            totalInstances: 5,
            activeInstances: 5,
            totalStorage: 1000,
            usedStorage: 450,
            networkThroughput: 125,
            averageResponseTime: 45,
            errorRate: 0.1,
            uptime: 99.9
          },
          cost: {
            totalCost: 1250.50,
            computeCost: 980.25,
            storageCost: 150.00,
            networkCost: 45.25,
            gpuCost: 75.00,
            costTrend: 'stable',
            budgetUtilization: 78.5
          },
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      ];

      const mockExperiments: Experiment[] = [
        {
          id: '1',
          name: 'Code Quality Model v2.1',
          description: 'Experimenting with new architecture for improved code quality classification',
          status: 'completed',
          hyperparameters: {
            learning_rate: 0.001,
            batch_size: 32,
            epochs: 50,
            optimizer: 'adam',
            loss_function: 'categorical_crossentropy'
          },
          metrics: {
            accuracy: 0.92,
            loss: 0.08,
            precision: 0.91,
            recall: 0.93,
            f1Score: 0.92,
            customMetrics: { 'code_complexity_score': 0.89, 'maintainability_index': 0.94 }
          },
          artifacts: [
            {
              id: 'artifact-1',
              name: 'model_weights.h5',
              type: 'model',
              size: 52428800, // 50MB
              path: '/experiments/exp-1/models/model_weights.h5',
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: 'artifact-2',
              name: 'training_logs.json',
              type: 'log',
              size: 1024000, // 1MB
              path: '/experiments/exp-1/logs/training_logs.json',
              createdAt: '2024-01-15T10:30:00Z'
            }
          ],
          createdAt: '2024-01-15T08:00:00Z',
          completedAt: '2024-01-15T10:30:00Z',
          duration: 150
        }
      ];

      setModels(mockModels);
      setPipelines(mockPipelines);
      setInfrastructure(mockInfrastructure);
      setExperiments(mockExperiments);
    } catch (error) {
      console.error('Error loading ML data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Deploy model
  const deployModel = async (modelId: string, environment: string) => {
    try {
      setIsLoading(true);
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              status: 'deployed',
              deploymentInfo: {
                ...model.deploymentInfo,
                environment: environment as any,
                lastDeployed: new Date().toISOString(),
                healthStatus: 'healthy'
              }
            }
          : model
      ));
    } catch (error) {
      console.error('Error deploying model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start/stop pipeline
  const togglePipeline = async (pipelineId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPipelines(prev => prev.map(pipeline => 
        pipeline.id === pipelineId 
          ? { 
              ...pipeline, 
              status: pipeline.status === 'running' ? 'stopped' : 'running'
            }
          : pipeline
      ));
    } catch (error) {
      console.error('Error toggling pipeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new experiment
  const createExperiment = async (name: string, description: string) => {
    try {
      const newExperiment: Experiment = {
        id: `exp-${Date.now()}`,
        name,
        description,
        status: 'running',
        hyperparameters: {
          learning_rate: 0.001,
          batch_size: 32,
          epochs: 50
        },
        metrics: {
          accuracy: 0,
          loss: 0,
          precision: 0,
          recall: 0,
          f1Score: 0,
          customMetrics: {}
        },
        artifacts: [],
        createdAt: new Date().toISOString(),
        duration: 0
      };
      
      setExperiments(prev => [newExperiment, ...prev]);
    } catch (error) {
      console.error('Error creating experiment:', error);
    }
  };

  useEffect(() => {
    loadMLData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Deployed Models</h3>
          <p className="text-2xl font-bold text-blue-600">{models.filter(m => m.status === 'deployed').length}</p>
          <p className="text-xs text-gray-400">Active models</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Running Pipelines</h3>
          <p className="text-2xl font-bold text-green-600">{pipelines.filter(p => p.status === 'running').length}</p>
          <p className="text-xs text-gray-400">Data pipelines</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Infrastructure Cost</h3>
          <p className="text-2xl font-bold text-purple-600">${infrastructure.reduce((acc, inf) => acc + inf.cost.totalCost, 0).toFixed(0)}</p>
          <p className="text-xs text-gray-400">Monthly cost</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Experiments</h3>
          <p className="text-2xl font-bold text-orange-600">{experiments.filter(e => e.status === 'running').length}</p>
          <p className="text-xs text-gray-400">ML experiments</p>
        </div>
      </div>

      {/* Model Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Model Status</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {models.slice(0, 3).map(model => (
              <div key={model.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <p className="text-sm text-gray-500">v{model.version} • {model.framework}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    model.status === 'deployed' ? 'bg-green-100 text-green-800' :
                    model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {model.status}
                  </span>
                  <span className="text-sm text-gray-500">{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Infrastructure Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infrastructure.map(inf => (
              <div key={inf.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{inf.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    inf.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {inf.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Instances</p>
                    <p className="font-medium">{inf.metrics.activeInstances}/{inf.metrics.totalInstances}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uptime</p>
                    <p className="font-medium">{inf.metrics.uptime}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Storage</p>
                    <p className="font-medium">{inf.metrics.usedStorage}GB/{inf.metrics.totalStorage}GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cost</p>
                    <p className="font-medium">${inf.cost.totalCost.toFixed(0)}/mo</p>
                  </div>
                </div>
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
        <h2 className="text-xl font-semibold text-gray-900">ML Models</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create New Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map(model => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">v{model.version} • {model.framework}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                model.status === 'deployed' ? 'bg-green-100 text-green-800' :
                model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {model.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{model.description}</p>
              <div className="flex flex-wrap gap-1">
                {model.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-lg font-semibold text-gray-900">{(model.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">F1 Score</p>
                <p className="text-lg font-semibold text-gray-900">{model.trainingMetrics.f1Score.toFixed(3)}</p>
              </div>
            </div>

            {model.status === 'deployed' && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">Deployment Info</p>
                <p className="text-xs text-gray-600">Environment: {model.deploymentInfo.environment}</p>
                <p className="text-xs text-gray-600">Uptime: {model.deploymentInfo.uptime}%</p>
                <p className="text-xs text-gray-600">Health: {model.deploymentInfo.healthStatus}</p>
              </div>
            )}

            <div className="flex space-x-2">
              {model.status !== 'deployed' && (
                <button
                  onClick={() => deployModel(model.id, 'production')}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Deploy
                </button>
              )}
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipelines = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Pipelines</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Pipeline
        </button>
      </div>

      <div className="space-y-6">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{pipeline.name}</h3>
                <p className="text-sm text-gray-500">{pipeline.type} pipeline • {pipeline.schedule ? `Scheduled: ${pipeline.schedule}` : 'Manual'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  pipeline.status === 'running' ? 'bg-green-100 text-green-800' :
                  pipeline.status === 'stopped' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {pipeline.status}
                </span>
                <button
                  onClick={() => togglePipeline(pipeline.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {pipeline.status === 'running' ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Records Processed</p>
                  <p className="font-medium">{pipeline.metrics.processedRecords.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Error Rate</p>
                  <p className="font-medium">{(pipeline.metrics.errorRate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Throughput</p>
                  <p className="font-medium">{pipeline.metrics.throughput.toFixed(1)} rec/s</p>
                </div>
                <div>
                  <p className="text-gray-500">Data Quality</p>
                  <p className="font-medium">{pipeline.metrics.dataQuality}%</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Pipeline Stages</p>
              <div className="space-y-2">
                {pipeline.stages.map(stage => (
                  <div key={stage.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                      <p className="text-xs text-gray-500">{stage.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        stage.status === 'completed' ? 'bg-green-500' :
                        stage.status === 'running' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></span>
                      <span className="text-xs text-gray-500">{stage.recordsProcessed} records</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Last run: {new Date(pipeline.lastRun).toLocaleString()}
              {pipeline.nextRun && ` • Next run: ${new Date(pipeline.nextRun).toLocaleString()}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInfrastructure = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">AI Infrastructure</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {infrastructure.map(inf => (
          <div key={inf.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{inf.name}</h3>
                <p className="text-sm text-gray-500">{inf.provider} • {inf.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                inf.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {inf.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Cost</p>
                  <p className="text-lg font-semibold text-gray-900">${inf.cost.totalCost.toFixed(0)}/mo</p>
                </div>
                <div>
                  <p className="text-gray-500">Budget Usage</p>
                  <p className="text-lg font-semibold text-gray-900">{inf.cost.budgetUtilization}%</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Resources</p>
              <div className="space-y-2">
                {inf.resources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-500">{resource.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${resource.cost.toFixed(2)}/hr</p>
                      <p className="text-xs text-gray-500">
                        CPU: {resource.utilization.cpu}% | Mem: {resource.utilization.memory}%
                        {resource.utilization.gpu && ` | GPU: ${resource.utilization.gpu}%`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-medium">{inf.metrics.uptime}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Response Time</p>
                  <p className="font-medium">{inf.metrics.averageResponseTime}ms</p>
                </div>
                <div>
                  <p className="text-gray-500">Error Rate</p>
                  <p className="font-medium">{inf.metrics.errorRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Network</p>
                  <p className="font-medium">{inf.metrics.networkThroughput} MB/s</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Monitor
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperiments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">ML Experiments</h2>
        <button 
          onClick={() => createExperiment('New Experiment', 'Experiment description')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map(experiment => (
          <div key={experiment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{experiment.name}</h3>
                <p className="text-sm text-gray-500">{experiment.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                experiment.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {experiment.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Accuracy</p>
                  <p className="text-lg font-semibold text-gray-900">{(experiment.metrics.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{experiment.duration} min</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Hyperparameters</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(experiment.hyperparameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {experiment.artifacts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Artifacts</p>
                <div className="space-y-1">
                  {experiment.artifacts.slice(0, 2).map(artifact => (
                    <div key={artifact.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{artifact.name}</span>
                      <span className="text-gray-500">{(artifact.size / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Compare
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
          <h1 className="text-3xl font-bold text-gray-900">ML Pipeline Infrastructure</h1>
          <p className="text-gray-600 mt-2">
            Manage machine learning models, data pipelines, and AI infrastructure
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'models', label: 'Models' },
              { id: 'pipelines', label: 'Pipelines' },
              { id: 'infrastructure', label: 'Infrastructure' },
              { id: 'experiments', label: 'Experiments' }
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
            {activeTab === 'pipelines' && renderPipelines()}
            {activeTab === 'infrastructure' && renderInfrastructure()}
            {activeTab === 'experiments' && renderExperiments()}
          </div>
        )}
      </div>
    </div>
  );
} 