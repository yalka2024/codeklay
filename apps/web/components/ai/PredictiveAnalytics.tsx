// Predictive Analytics Platform for CodePal
// Features: Project success prediction, developer productivity analytics, market intelligence

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'project_success' | 'productivity' | 'market_intelligence' | 'risk_assessment';
  status: 'training' | 'active' | 'inactive' | 'error';
  accuracy: number;
  lastUpdated: string;
  version: string;
  features: string[];
  performance: ModelPerformance;
}

interface ModelPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  featureImportance: FeatureImportance[];
}

interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

interface ProjectPrediction {
  id: string;
  projectId: string;
  projectName: string;
  predictionType: 'completion_time' | 'success_probability' | 'risk_level' | 'resource_needs';
  predictedValue: number;
  confidence: number;
  factors: PredictionFactor[];
  recommendations: string[];
  createdAt: string;
  actualValue?: number;
  accuracy?: number;
}

interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

interface ProductivityInsight {
  id: string;
  userId: string;
  userName: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  factors: string[];
  recommendations: string[];
  period: string;
}

interface MarketIntelligence {
  id: string;
  category: 'technology_trends' | 'skill_demand' | 'salary_benchmarks' | 'career_paths';
  title: string;
  description: string;
  data: MarketData[];
  insights: string[];
  predictions: MarketPrediction[];
  confidence: number;
  lastUpdated: string;
}

interface MarketData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

interface MarketPrediction {
  timeframe: string;
  predictedValue: number;
  confidence: number;
  factors: string[];
}

interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: WidgetLayout[];
  filters: DashboardFilter[];
  lastUpdated: string;
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'prediction';
  title: string;
  data: any;
  config: WidgetConfig;
  position: WidgetPosition;
}

interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  timeRange?: string;
  aggregation?: string;
  thresholds?: Record<string, number>;
  colors?: string[];
}

interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetLayout {
  widgetId: string;
  position: WidgetPosition;
}

interface DashboardFilter {
  id: string;
  name: string;
  type: 'date_range' | 'user' | 'project' | 'technology' | 'custom';
  value: any;
  options?: any[];
}

export default function PredictiveAnalytics() {
  const { user } = useAuthContext();
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [projectPredictions, setProjectPredictions] = useState<ProjectPrediction[]>([]);
  const [productivityInsights, setProductivityInsights] = useState<ProductivityInsight[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence[]>([]);
  const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
  const [selectedModel, setSelectedModel] = useState<PredictiveModel | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<ProjectPrediction | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'predictions' | 'insights' | 'market' | 'dashboards'>('overview');

  // Load predictive analytics data
  const loadPredictiveData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockModels: PredictiveModel[] = [
        {
          id: '1',
          name: 'Project Success Predictor',
          type: 'project_success',
          status: 'active',
          accuracy: 0.87,
          lastUpdated: '2024-01-15T10:30:00Z',
          version: '2.1.0',
          features: ['team_size', 'experience_level', 'project_complexity', 'deadline_pressure'],
          performance: {
            precision: 0.85,
            recall: 0.89,
            f1Score: 0.87,
            auc: 0.91,
            confusionMatrix: [[45, 5], [8, 42]],
            featureImportance: [
              { feature: 'team_experience', importance: 0.35, description: 'Average team experience level' },
              { feature: 'project_complexity', importance: 0.28, description: 'Project complexity score' },
              { feature: 'deadline_pressure', importance: 0.22, description: 'Time pressure assessment' },
              { feature: 'resource_availability', importance: 0.15, description: 'Available resources score' }
            ]
          }
        },
        {
          id: '2',
          name: 'Developer Productivity Analyzer',
          type: 'productivity',
          status: 'active',
          accuracy: 0.82,
          lastUpdated: '2024-01-14T15:45:00Z',
          version: '1.8.2',
          features: ['code_quality', 'commit_frequency', 'review_participation', 'learning_curve'],
          performance: {
            precision: 0.80,
            recall: 0.84,
            f1Score: 0.82,
            auc: 0.88,
            confusionMatrix: [[38, 7], [9, 46]],
            featureImportance: [
              { feature: 'code_quality_score', importance: 0.40, description: 'Code quality metrics' },
              { feature: 'commit_frequency', importance: 0.25, description: 'Regular commit patterns' },
              { feature: 'review_participation', importance: 0.20, description: 'Code review engagement' },
              { feature: 'learning_curve', importance: 0.15, description: 'Skill improvement rate' }
            ]
          }
        }
      ];

      const mockPredictions: ProjectPrediction[] = [
        {
          id: '1',
          projectId: 'proj-001',
          projectName: 'E-commerce Platform Redesign',
          predictionType: 'completion_time',
          predictedValue: 45, // days
          confidence: 0.87,
          factors: [
            { factor: 'Team Experience', impact: 'positive', weight: 0.35, description: 'High team experience level' },
            { factor: 'Project Complexity', impact: 'negative', weight: 0.28, description: 'Complex UI/UX requirements' },
            { factor: 'Resource Availability', impact: 'positive', weight: 0.22, description: 'Adequate development resources' },
            { factor: 'Deadline Pressure', impact: 'negative', weight: 0.15, description: 'Tight timeline constraints' }
          ],
          recommendations: [
            'Consider adding 1-2 senior developers to reduce complexity impact',
            'Implement parallel development tracks for UI and backend',
            'Set up daily standups to monitor progress closely'
          ],
          createdAt: '2024-01-15T09:00:00Z'
        }
      ];

      const mockInsights: ProductivityInsight[] = [
        {
          id: '1',
          userId: 'user-001',
          userName: 'Sarah Johnson',
          metric: 'Code Quality Score',
          currentValue: 8.5,
          predictedValue: 8.8,
          trend: 'improving',
          confidence: 0.82,
          factors: ['Increased code review participation', 'Better testing practices', 'Improved documentation'],
          recommendations: [
            'Continue current code review practices',
            'Consider mentoring junior developers',
            'Document best practices for team sharing'
          ],
          period: 'Last 30 days'
        }
      ];

      const mockMarketData: MarketIntelligence[] = [
        {
          id: '1',
          category: 'technology_trends',
          title: 'AI/ML Development Trends',
          description: 'Analysis of AI and machine learning technology adoption in software development',
          data: [
            { date: '2024-01-01', value: 65 },
            { date: '2024-01-08', value: 68 },
            { date: '2024-01-15', value: 72 }
          ],
          insights: [
            'AI/ML adoption increased by 10.8% in the last quarter',
            'Python remains the dominant language for AI development',
            'Demand for AI engineers continues to grow rapidly'
          ],
          predictions: [
            {
              timeframe: 'Q2 2024',
              predictedValue: 78,
              confidence: 0.85,
              factors: ['Increased investment in AI', 'Growing developer interest', 'Industry adoption']
            }
          ],
          confidence: 0.85,
          lastUpdated: '2024-01-15T12:00:00Z'
        }
      ];

      setModels(mockModels);
      setProjectPredictions(mockPredictions);
      setProductivityInsights(mockInsights);
      setMarketIntelligence(mockMarketData);
    } catch (error) {
      console.error('Error loading predictive data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Train or retrain a model
  const trainModel = async (modelId: string) => {
    try {
      setIsLoading(true);
      // Simulate model training
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update model status
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'active', accuracy: model.accuracy + 0.02 }
          : model
      ));
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new prediction
  const generatePrediction = async (projectId: string, predictionType: string) => {
    try {
      setIsLoading(true);
      // Simulate prediction generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPrediction: ProjectPrediction = {
        id: `pred-${Date.now()}`,
        projectId,
        projectName: 'New Project Analysis',
        predictionType: predictionType as any,
        predictedValue: Math.random() * 100,
        confidence: 0.8 + Math.random() * 0.15,
        factors: [
          { factor: 'Team Size', impact: 'positive', weight: 0.3, description: 'Optimal team size' },
          { factor: 'Technology Stack', impact: 'positive', weight: 0.25, description: 'Modern tech stack' },
          { factor: 'Requirements Clarity', impact: 'neutral', weight: 0.2, description: 'Moderate clarity' },
          { factor: 'Timeline', impact: 'negative', weight: 0.25, description: 'Aggressive timeline' }
        ],
        recommendations: [
          'Consider extending timeline by 2 weeks',
          'Add more detailed requirements documentation',
          'Implement agile methodology for better flexibility'
        ],
        createdAt: new Date().toISOString()
      };
      
      setProjectPredictions(prev => [newPrediction, ...prev]);
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new dashboard
  const createDashboard = async (name: string, description: string) => {
    try {
      const newDashboard: AnalyticsDashboard = {
        id: `dashboard-${Date.now()}`,
        name,
        description,
        widgets: [],
        layout: [],
        filters: [],
        lastUpdated: new Date().toISOString()
      };
      
      setDashboards(prev => [newDashboard, ...prev]);
      setSelectedDashboard(newDashboard);
    } catch (error) {
      console.error('Error creating dashboard:', error);
    }
  };

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Models</h3>
          <p className="text-2xl font-bold text-blue-600">{models.filter(m => m.status === 'active').length}</p>
          <p className="text-xs text-gray-400">Predictive models</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Accuracy</h3>
          <p className="text-2xl font-bold text-green-600">
            {(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400">Model performance</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Predictions</h3>
          <p className="text-2xl font-bold text-purple-600">{projectPredictions.length}</p>
          <p className="text-xs text-gray-400">Generated today</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Insights</h3>
          <p className="text-2xl font-bold text-orange-600">{productivityInsights.length}</p>
          <p className="text-xs text-gray-400">Productivity insights</p>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Predictions</h3>
        </div>
        <div className="p-6">
          {projectPredictions.slice(0, 3).map(prediction => (
            <div key={prediction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-medium text-gray-900">{prediction.projectName}</h4>
                <p className="text-sm text-gray-500">{prediction.predictionType.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{prediction.predictedValue}</p>
                <p className="text-sm text-gray-500">{(prediction.confidence * 100).toFixed(1)}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Model Performance</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {models.map(model => (
              <div key={model.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <p className="text-sm text-gray-500">Accuracy: {(model.accuracy * 100).toFixed(1)}%</p>
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
                    onClick={() => trainModel(model.id)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Retrain
                  </button>
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
        <h2 className="text-xl font-semibold text-gray-900">Predictive Models</h2>
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
                <p className="text-sm text-gray-500">Type: {model.type.replace('_', ' ')}</p>
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
                <p className="text-lg font-semibold text-gray-900">{(model.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">F1 Score</p>
                <p className="text-lg font-semibold text-gray-900">{model.performance.f1Score.toFixed(3)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Feature Importance</p>
              <div className="space-y-2">
                {model.performance.featureImportance.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{feature.feature}</span>
                    <span className="text-sm font-medium text-gray-900">{(feature.importance * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => trainModel(model.id)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Retrain Model
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

  const renderPredictions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Project Predictions</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Generate New Prediction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {projectPredictions.map(prediction => (
            <div key={prediction.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{prediction.projectName}</h3>
                  <p className="text-sm text-gray-500">Prediction Type: {prediction.predictionType.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{prediction.predictedValue}</p>
                  <p className="text-sm text-gray-500">{(prediction.confidence * 100).toFixed(1)}% confidence</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Factors</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        factor.impact === 'positive' ? 'bg-green-500' :
                        factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></span>
                      <span className="text-sm text-gray-600">{factor.factor}</span>
                      <span className="text-xs text-gray-400">({(factor.weight * 100).toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
                <ul className="list-disc list-inside space-y-1">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Productivity Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {productivityInsights.map(insight => (
          <div key={insight.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{insight.userName}</h3>
                <p className="text-sm text-gray-500">{insight.metric}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{insight.currentValue}</p>
                <p className="text-sm text-gray-500">Current Score</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Predicted: {insight.predictedValue}</span>
                <span className={`text-sm font-medium ${
                  insight.trend === 'improving' ? 'text-green-600' :
                  insight.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {insight.trend}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(insight.currentValue / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Factors</p>
              <ul className="list-disc list-inside space-y-1">
                {insight.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600">{factor}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
              <ul className="list-disc list-inside space-y-1">
                {insight.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Market Intelligence</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {marketIntelligence.map(intelligence => (
          <div key={intelligence.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{intelligence.title}</h3>
              <p className="text-sm text-gray-500">{intelligence.category.replace('_', ' ')}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">{intelligence.description}</p>
              
              <div className="space-y-2">
                {intelligence.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Predictions</p>
              {intelligence.predictions.map((prediction, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{prediction.timeframe}</span>
                    <span className="text-sm text-gray-500">{(prediction.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{prediction.predictedValue}</p>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-400">
              Last updated: {new Date(intelligence.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboards</h2>
        <button 
          onClick={() => createDashboard('New Dashboard', 'Custom analytics dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map(dashboard => (
          <div key={dashboard.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{dashboard.name}</h3>
              <p className="text-sm text-gray-500">{dashboard.description}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{dashboard.widgets.length} widgets</span>
                <span>{dashboard.filters.length} filters</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Open
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Edit
              </button>
            </div>
          </div>
        ))}

        {dashboards.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No dashboards created yet. Create your first dashboard to get started.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-gray-600 mt-2">
            AI-powered insights and predictions for project success, developer productivity, and market intelligence
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'models', label: 'Models' },
              { id: 'predictions', label: 'Predictions' },
              { id: 'insights', label: 'Insights' },
              { id: 'market', label: 'Market Intelligence' },
              { id: 'dashboards', label: 'Dashboards' }
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
            {activeTab === 'predictions' && renderPredictions()}
            {activeTab === 'insights' && renderInsights()}
            {activeTab === 'market' && renderMarket()}
            {activeTab === 'dashboards' && renderDashboards()}
          </div>
        )}
      </div>
    </div>
  );
} 