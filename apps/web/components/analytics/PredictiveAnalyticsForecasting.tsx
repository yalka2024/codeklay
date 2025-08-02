// Predictive Analytics & Forecasting for CodePal
// Features: Advanced forecasting models, trend analysis, predictive insights, model management

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface ForecastModel {
  id: string;
  name: string;
  type: 'time_series' | 'regression' | 'classification' | 'clustering' | 'neural_network';
  status: 'active' | 'training' | 'error' | 'inactive';
  accuracy: number;
  lastTrained: string;
  nextTraining: string;
  features: string[];
  target: string;
  config: ModelConfig;
  performance: ModelPerformance;
}

interface ModelConfig {
  algorithm: string;
  parameters: Record<string, any>;
  trainingDataSize: number;
  validationDataSize: number;
  testDataSize: number;
  hyperparameters: Record<string, any>;
}

interface ModelPerformance {
  mse: number;
  mae: number;
  r2: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

interface Forecast {
  id: string;
  modelId: string;
  metric: string;
  horizon: number;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  predictions: Prediction[];
  confidence: number;
  createdAt: string;
  expiresAt: string;
}

interface Prediction {
  timestamp: string;
  value: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  actual?: number;
  error?: number;
}

interface TrendAnalysis {
  id: string;
  metric: string;
  period: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'seasonal' | 'cyclical';
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'up' | 'down' | 'sideways';
  seasonality: SeasonalityInfo;
  cycles: CycleInfo[];
  anomalies: AnomalyInfo[];
}

interface SeasonalityInfo {
  detected: boolean;
  period: number;
  strength: number;
  components: string[];
}

interface CycleInfo {
  period: number;
  amplitude: number;
  phase: number;
  description: string;
}

interface AnomalyInfo {
  timestamp: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'spike' | 'drop' | 'trend_change' | 'seasonal_break';
}

interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  type: 'forecast' | 'trend' | 'anomaly' | 'pattern' | 'correlation';
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  relatedMetrics: string[];
  timeframe: string;
  createdAt: string;
}

interface DataPipeline {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'scheduled';
  source: string;
  destination: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  recordsProcessed: number;
  processingTime: number;
  errors: PipelineError[];
}

interface PipelineError {
  timestamp: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  resolved: boolean;
}

interface ModelTrainingJob {
  id: string;
  modelId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  metrics: TrainingMetrics;
  logs: TrainingLog[];
}

interface TrainingMetrics {
  epochs: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
}

interface TrainingLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export default function PredictiveAnalyticsForecasting() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'forecasts' | 'trends' | 'insights' | 'pipelines' | 'training'>('overview');
  const [forecastModels, setForecastModels] = useState<ForecastModel[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [trendAnalyses, setTrendAnalyses] = useState<TrendAnalysis[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [dataPipelines, setDataPipelines] = useState<DataPipeline[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<ModelTrainingJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockForecastModels: ForecastModel[] = [
        {
          id: '1',
          name: 'Revenue Forecasting Model',
          type: 'time_series',
          status: 'active',
          accuracy: 0.92,
          lastTrained: '2024-03-20T10:00:00Z',
          nextTraining: '2024-03-27T10:00:00Z',
          features: ['historical_revenue', 'user_growth', 'seasonality', 'marketing_spend'],
          target: 'monthly_revenue',
          config: {
            algorithm: 'Prophet',
            parameters: { seasonality_mode: 'multiplicative', changepoint_prior_scale: 0.05 },
            trainingDataSize: 10000,
            validationDataSize: 2000,
            testDataSize: 1000,
            hyperparameters: { learning_rate: 0.1, batch_size: 32 }
          },
          performance: {
            mse: 0.08,
            mae: 0.12,
            r2: 0.92,
            precision: 0.89,
            recall: 0.91,
            f1Score: 0.90,
            confusionMatrix: [[850, 50], [45, 855]]
          }
        },
        {
          id: '2',
          name: 'User Churn Prediction',
          type: 'classification',
          status: 'active',
          accuracy: 0.88,
          lastTrained: '2024-03-19T15:00:00Z',
          nextTraining: '2024-03-26T15:00:00Z',
          features: ['usage_frequency', 'last_login', 'support_tickets', 'subscription_plan'],
          target: 'churn_probability',
          config: {
            algorithm: 'Random Forest',
            parameters: { n_estimators: 100, max_depth: 10 },
            trainingDataSize: 15000,
            validationDataSize: 3000,
            testDataSize: 1500,
            hyperparameters: { learning_rate: 0.05, batch_size: 64 }
          },
          performance: {
            mse: 0.12,
            mae: 0.15,
            r2: 0.88,
            precision: 0.85,
            recall: 0.87,
            f1Score: 0.86,
            confusionMatrix: [[1200, 100], [80, 1120]]
          }
        }
      ];

      const mockForecasts: Forecast[] = [
        {
          id: '1',
          modelId: '1',
          metric: 'Monthly Revenue',
          horizon: 12,
          frequency: 'monthly',
          predictions: [
            { timestamp: '2024-04-01T00:00:00Z', value: 1300000, lowerBound: 1250000, upperBound: 1350000, confidence: 0.85 },
            { timestamp: '2024-05-01T00:00:00Z', value: 1350000, lowerBound: 1300000, upperBound: 1400000, confidence: 0.82 },
            { timestamp: '2024-06-01T00:00:00Z', value: 1400000, lowerBound: 1350000, upperBound: 1450000, confidence: 0.80 }
          ],
          confidence: 0.85,
          createdAt: '2024-03-20T10:00:00Z',
          expiresAt: '2024-04-20T10:00:00Z'
        }
      ];

      const mockTrendAnalyses: TrendAnalysis[] = [
        {
          id: '1',
          metric: 'User Engagement',
          period: '6 months',
          trend: 'increasing',
          strength: 'strong',
          direction: 'up',
          seasonality: {
            detected: true,
            period: 7,
            strength: 0.75,
            components: ['weekly_pattern', 'monthly_variation']
          },
          cycles: [
            { period: 30, amplitude: 0.15, phase: 0, description: 'Monthly business cycle' }
          ],
          anomalies: [
            {
              timestamp: '2024-03-15T00:00:00Z',
              value: 0.85,
              expectedValue: 0.72,
              deviation: 0.13,
              severity: 'high',
              type: 'spike'
            }
          ]
        }
      ];

      const mockPredictiveInsights: PredictiveInsight[] = [
        {
          id: '1',
          title: 'Revenue Growth Forecast',
          description: 'Based on current trends, revenue is expected to grow 15% in Q2 2024',
          type: 'forecast',
          confidence: 0.92,
          impact: 'high',
          actionable: true,
          recommendations: [
            'Increase marketing spend in high-growth segments',
            'Optimize pricing strategy for enterprise customers',
            'Expand sales team to capitalize on growth opportunities'
          ],
          relatedMetrics: ['Monthly Revenue', 'Customer Acquisition', 'Conversion Rate'],
          timeframe: 'Q2 2024',
          createdAt: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          title: 'Churn Risk Alert',
          description: '15% of enterprise customers show high churn risk in next 30 days',
          type: 'anomaly',
          confidence: 0.88,
          impact: 'critical',
          actionable: true,
          recommendations: [
            'Implement proactive customer success outreach',
            'Offer retention incentives for at-risk customers',
            'Analyze usage patterns to identify pain points'
          ],
          relatedMetrics: ['Churn Rate', 'Customer Satisfaction', 'Usage Frequency'],
          timeframe: 'Next 30 days',
          createdAt: '2024-03-20T10:00:00Z'
        }
      ];

      const mockDataPipelines: DataPipeline[] = [
        {
          id: '1',
          name: 'Revenue Data Pipeline',
          status: 'running',
          source: 'production_database',
          destination: 'analytics_warehouse',
          schedule: 'hourly',
          lastRun: '2024-03-20T10:00:00Z',
          nextRun: '2024-03-20T11:00:00Z',
          recordsProcessed: 50000,
          processingTime: 120,
          errors: []
        }
      ];

      const mockTrainingJobs: ModelTrainingJob[] = [
        {
          id: '1',
          modelId: '1',
          status: 'completed',
          progress: 100,
          startTime: '2024-03-20T08:00:00Z',
          endTime: '2024-03-20T10:00:00Z',
          duration: 7200,
          metrics: {
            epochs: 100,
            loss: 0.08,
            accuracy: 0.92,
            validationLoss: 0.09,
            validationAccuracy: 0.91,
            learningRate: 0.001
          },
          logs: [
            { timestamp: '2024-03-20T08:00:00Z', level: 'info', message: 'Training started' },
            { timestamp: '2024-03-20T10:00:00Z', level: 'info', message: 'Training completed successfully' }
          ]
        }
      ];

      setForecastModels(mockForecastModels);
      setForecasts(mockForecasts);
      setTrendAnalyses(mockTrendAnalyses);
      setPredictiveInsights(mockPredictiveInsights);
      setDataPipelines(mockDataPipelines);
      setTrainingJobs(mockTrainingJobs);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
      case 'completed': return 'text-green-600 bg-green-100';
      case 'training':
      case 'queued': return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'failed': return 'text-red-600 bg-red-100';
      case 'inactive':
      case 'stopped': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Active Models</h3>
          <p className="text-3xl font-bold text-blue-600">
            {forecastModels.filter(m => m.status === 'active').length}
          </p>
          <p className="text-sm text-blue-700">Forecasting models</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Avg Accuracy</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatPercentage(forecastModels.reduce((acc, m) => acc + m.accuracy, 0) / forecastModels.length)}
          </p>
          <p className="text-sm text-green-700">Model performance</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Active Forecasts</h3>
          <p className="text-3xl font-bold text-purple-600">{forecasts.length}</p>
          <p className="text-sm text-purple-700">Predictive forecasts</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Training Jobs</h3>
          <p className="text-3xl font-bold text-orange-600">
            {trainingJobs.filter(j => j.status === 'running').length}
          </p>
          <p className="text-sm text-orange-700">Currently running</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Insights</h3>
          <div className="space-y-4">
            {predictiveInsights.slice(0, 3).map(insight => (
              <div key={insight.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{insight.timeframe}</span>
                  <span>{formatPercentage(insight.confidence)} confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="space-y-4">
            {forecastModels.slice(0, 3).map(model => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{model.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{model.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                    {model.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatPercentage(model.accuracy)} accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Models</h3>
      <div className="space-y-6">
        {forecastModels.map(model => (
          <div key={model.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{model.type.replace('_', ' ')} model</p>
                <p className="text-sm text-gray-500 mt-1">Target: {model.target}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(model.status)}`}>
                  {model.status}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(model.accuracy)} accuracy
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Algorithm</p>
                <p className="text-lg font-bold text-gray-900">{model.config.algorithm}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Features</p>
                <p className="text-lg font-bold text-gray-900">{model.features.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Trained</p>
                <p className="text-sm text-gray-900">{new Date(model.lastTrained).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Training</p>
                <p className="text-sm text-gray-900">{new Date(model.nextTraining).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Performance Metrics</h5>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-xs text-gray-600">MSE</p>
                  <p className="text-sm font-medium text-gray-900">{model.performance.mse.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">MAE</p>
                  <p className="text-sm font-medium text-gray-900">{model.performance.mae.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">R²</p>
                  <p className="text-sm font-medium text-gray-900">{model.performance.r2.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Precision</p>
                  <p className="text-sm font-medium text-gray-900">{formatPercentage(model.performance.precision)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Recall</p>
                  <p className="text-sm font-medium text-gray-900">{formatPercentage(model.performance.recall)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">F1 Score</p>
                  <p className="text-sm font-medium text-gray-900">{formatPercentage(model.performance.f1Score)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-2">Features</h5>
              <div className="flex flex-wrap gap-2">
                {model.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-white rounded text-sm text-gray-700">
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

  const renderForecasts = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecasts</h3>
      <div className="space-y-6">
        {forecasts.map(forecast => (
          <div key={forecast.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{forecast.metric}</h4>
                <p className="text-sm text-gray-600">{forecast.horizon} periods ahead</p>
                <p className="text-sm text-gray-500 mt-1">Frequency: {forecast.frequency}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(forecast.confidence)} confidence
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(forecast.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h5 className="font-medium text-gray-900 mb-3">Predictions</h5>
              <div className="space-y-3">
                {forecast.predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(prediction.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(prediction.value)} ± {formatNumber((prediction.upperBound - prediction.lowerBound) / 2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatNumber(prediction.value)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPercentage(prediction.confidence)} confidence
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h3>
      <div className="space-y-6">
        {trendAnalyses.map(trend => (
          <div key={trend.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{trend.metric}</h4>
                <p className="text-sm text-gray-600">Period: {trend.period}</p>
                <p className="text-sm text-gray-500 mt-1">Direction: {trend.direction}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trend.trend === 'increasing' ? 'text-green-600 bg-green-100' :
                  trend.trend === 'decreasing' ? 'text-red-600 bg-red-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {trend.trend}
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {trend.strength} strength
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Seasonality</p>
                <p className="text-lg font-bold text-gray-900">
                  {trend.seasonality.detected ? 'Detected' : 'None'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Cycles</p>
                <p className="text-lg font-bold text-gray-900">{trend.cycles.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Anomalies</p>
                <p className="text-lg font-bold text-gray-900">{trend.anomalies.length}</p>
              </div>
            </div>

            {trend.anomalies.length > 0 && (
              <div className="bg-red-50 p-4 rounded mb-4">
                <h5 className="font-medium text-red-900 mb-2">Recent Anomalies</h5>
                <div className="space-y-2">
                  {trend.anomalies.slice(0, 3).map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(anomaly.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{anomaly.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(anomaly.severity)}`}>
                          {anomaly.severity}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNumber(anomaly.deviation)} deviation
                        </p>
                      </div>
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

  const renderInsights = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h3>
      <div className="space-y-6">
        {predictiveInsights.map(insight => (
          <div key={insight.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                <p className="text-sm text-gray-500 mt-1">Timeframe: {insight.timeframe}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(insight.impact)}`}>
                  {insight.impact} impact
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  insight.type === 'forecast' ? 'text-blue-600 bg-blue-100' :
                  insight.type === 'anomaly' ? 'text-red-600 bg-red-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {insight.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Confidence</p>
                <p className="text-lg font-bold text-gray-900">{formatPercentage(insight.confidence)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Actionable</p>
                <p className="text-lg font-bold text-gray-900">{insight.actionable ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Related Metrics</p>
                <p className="text-lg font-bold text-gray-900">{insight.relatedMetrics.length}</p>
              </div>
            </div>

            {insight.recommendations.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                <ul className="space-y-1">
                  {insight.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created: {new Date(insight.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipelines = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pipelines</h3>
      <div className="space-y-6">
        {dataPipelines.map(pipeline => (
          <div key={pipeline.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{pipeline.name}</h4>
                <p className="text-sm text-gray-600">{pipeline.source} → {pipeline.destination}</p>
                <p className="text-sm text-gray-500 mt-1">Schedule: {pipeline.schedule}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pipeline.status)}`}>
                  {pipeline.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Records Processed</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(pipeline.recordsProcessed)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Processing Time</p>
                <p className="text-lg font-bold text-gray-900">{pipeline.processingTime}s</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Last Run</p>
                <p className="text-sm text-gray-900">{new Date(pipeline.lastRun).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Next Run</p>
                <p className="text-sm text-gray-900">{new Date(pipeline.nextRun).toLocaleString()}</p>
              </div>
            </div>

            {pipeline.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded">
                <h5 className="font-medium text-red-900 mb-2">Recent Errors</h5>
                <div className="space-y-2">
                  {pipeline.errors.slice(0, 3).map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-gray-900">{error.message}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(error.severity)}`}>
                        {error.severity}
                      </span>
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

  const renderTraining = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Training Jobs</h3>
      <div className="space-y-6">
        {trainingJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Training Job #{job.id}</h4>
                <p className="text-sm text-gray-600">Model: {job.modelId}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Started: {new Date(job.startTime).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                {job.status === 'running' && (
                  <span className="text-sm font-medium text-gray-900">
                    {job.progress}% complete
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Epochs</p>
                <p className="text-lg font-bold text-gray-900">{job.metrics.epochs}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Accuracy</p>
                <p className="text-lg font-bold text-gray-900">{formatPercentage(job.metrics.accuracy)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Loss</p>
                <p className="text-lg font-bold text-gray-900">{job.metrics.loss.toFixed(3)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-700">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {job.duration ? `${Math.round(job.duration / 60)}min` : 'N/A'}
                </p>
              </div>
            </div>

            {job.logs.length > 0 && (
              <div className="bg-gray-50 p-4 rounded">
                <h5 className="font-medium text-gray-900 mb-2">Training Logs</h5>
                <div className="space-y-2">
                  {job.logs.slice(-3).map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-gray-900">{log.message}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.level === 'error' ? 'text-red-600 bg-red-100' :
                        log.level === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                        'text-blue-600 bg-blue-100'
                      }`}>
                        {log.level}
                      </span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading predictive analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics & Forecasting</h1>
          <p className="text-gray-600 mt-2">
            Advanced forecasting models, trend analysis, and predictive insights
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'models', label: 'Models' },
              { id: 'forecasts', label: 'Forecasts' },
              { id: 'trends', label: 'Trends' },
              { id: 'insights', label: 'Insights' },
              { id: 'pipelines', label: 'Pipelines' },
              { id: 'training', label: 'Training' }
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
          {activeTab === 'models' && renderModels()}
          {activeTab === 'forecasts' && renderForecasts()}
          {activeTab === 'trends' && renderTrends()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'pipelines' && renderPipelines()}
          {activeTab === 'training' && renderTraining()}
        </div>
      </div>
    </div>
  );
} 