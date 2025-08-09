import { Analytics } from './analytics';

// Predictive Analytics Engine
export interface PredictionModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'time_series';
  algorithm: 'linear' | 'random_forest' | 'neural_network' | 'svm' | 'lstm';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingDataSize: number;
  lastTrained: Date;
  metadata?: Record<string, any>;
}

export interface DevelopmentInsight {
  id: string;
  type: 'performance' | 'quality' | 'efficiency' | 'cost' | 'risk';
  category: 'code' | 'infrastructure' | 'process' | 'team' | 'technology';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: {
    performance: number; // 0-100%
    cost: number; // USD savings/potential
    time: number; // Hours saved/potential
    quality: number; // 0-100% improvement
  };
  confidence: number; // 0-100%
  recommendations: string[];
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // hours
    estimatedCost: number; // USD
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
  timestamp: Date;
}

export interface PerformancePrediction {
  id: string;
  component: string;
  metric: 'response_time' | 'throughput' | 'error_rate' | 'availability' | 'resource_usage';
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d';
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  factors: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface ResourceOptimization {
  id: string;
  resourceType: 'cpu' | 'memory' | 'storage' | 'network' | 'database';
  currentUsage: number;
  predictedUsage: number;
  optimalAllocation: number;
  savings: {
    cost: number;
    performance: number;
    efficiency: number;
  };
  recommendations: string[];
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
    estimatedCost: number;
    roi: number; // Return on investment
  };
  timestamp: Date;
}

export interface AnomalyDetection {
  id: string;
  component: string;
  metric: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'spike' | 'drop' | 'trend_change' | 'pattern_break';
  description: string;
  potentialCauses: string[];
  recommendedActions: string[];
  timestamp: Date;
}

export interface TrendAnalysis {
  id: string;
  metric: string;
  timeframe: '1d' | '7d' | '30d' | '90d' | '1y';
  trend: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
  slope: number;
  correlation: number;
  seasonality: boolean;
  forecast: {
    nextValue: number;
    confidence: number;
    range: {
      min: number;
      max: number;
    };
  };
  insights: string[];
  timestamp: Date;
}

export class PredictiveAnalyticsEngine {
  private analytics: Analytics;
  private models: Map<string, PredictionModel> = new Map();
  private insights: Map<string, DevelopmentInsight> = new Map();
  private predictions: Map<string, PerformancePrediction> = new Map();
  private optimizations: Map<string, ResourceOptimization> = new Map();
  private anomalies: Map<string, AnomalyDetection> = new Map();
  private trends: Map<string, TrendAnalysis> = new Map();

  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  async trainPredictionModel(
    name: string,
    type: 'regression' | 'classification' | 'clustering' | 'time_series',
    algorithm: 'linear' | 'random_forest' | 'neural_network' | 'svm' | 'lstm',
    trainingData: any[]
  ): Promise<PredictionModel> {
    // Simulate model training
    const accuracy = 0.75 + Math.random() * 0.25; // 75-100%
    const precision = 0.7 + Math.random() * 0.3; // 70-100%
    const recall = 0.65 + Math.random() * 0.35; // 65-100%
    const f1Score = (2 * precision * recall) / (precision + recall);

    const model: PredictionModel = {
      id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      algorithm,
      accuracy,
      precision,
      recall,
      f1Score,
      trainingDataSize: trainingData.length,
      lastTrained: new Date(),
      metadata: {
        features: this.extractFeatures(trainingData),
        hyperparameters: this.generateHyperparameters(algorithm),
        trainingTime: Math.random() * 3600 // 0-1 hour
      }
    };

    this.models.set(model.id, model);

    // Track analytics event
    await this.analytics.track('prediction_model_trained', {
      name,
      type,
      algorithm,
      accuracy,
      trainingDataSize: trainingData.length
    });

    return model;
  }

  private extractFeatures(data: any[]): string[] {
    // Simulate feature extraction
    return ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];
  }

  private generateHyperparameters(algorithm: string): Record<string, any> {
    const hyperparams: Record<string, any> = {};
    
    switch (algorithm) {
      case 'neural_network':
        hyperparams.layers = [64, 32, 16];
        hyperparams.learningRate = 0.001;
        hyperparams.epochs = 100;
        break;
      case 'random_forest':
        hyperparams.nEstimators = 100;
        hyperparams.maxDepth = 10;
        break;
      case 'lstm':
        hyperparams.units = 50;
        hyperparams.dropout = 0.2;
        break;
      default:
        hyperparams.regularization = 0.01;
    }
    
    return hyperparams;
  }

  async generateDevelopmentInsight(
    type: 'performance' | 'quality' | 'efficiency' | 'cost' | 'risk',
    category: 'code' | 'infrastructure' | 'process' | 'team' | 'technology',
    data: Record<string, any>
  ): Promise<DevelopmentInsight> {
    const insight = this.analyzeDataForInsight(type, category, data);
    
    const developmentInsight: DevelopmentInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      severity: this.assessSeverity(insight.impact),
      title: insight.title,
      description: insight.description,
      impact: insight.impact,
      confidence: insight.confidence,
      recommendations: insight.recommendations,
      implementation: {
        difficulty: this.assessDifficulty(insight.impact),
        estimatedTime: this.estimateTime(insight.impact),
        estimatedCost: this.estimateCost(insight.impact),
        priority: this.assessPriority(insight.impact)
      },
      timestamp: new Date()
    };

    this.insights.set(developmentInsight.id, developmentInsight);

    // Track analytics event
    await this.analytics.track('development_insight_generated', {
      type,
      category,
      severity: developmentInsight.severity,
      confidence: insight.confidence
    });

    return developmentInsight;
  }

  private analyzeDataForInsight(
    type: string,
    category: string,
    data: Record<string, any>
  ): any {
    // Simulate AI analysis
    const insights = {
      performance: {
        title: 'Performance Bottleneck Detected',
        description: 'Database queries are causing 40% performance degradation',
        impact: {
          performance: 40,
          cost: 5000,
          time: 20,
          quality: 15
        },
        confidence: 0.85,
        recommendations: [
          'Implement database query optimization',
          'Add database indexing',
          'Consider caching strategies',
          'Monitor query performance'
        ]
      },
      quality: {
        title: 'Code Quality Improvement Opportunity',
        description: 'Test coverage is below industry standards',
        impact: {
          performance: 10,
          cost: 2000,
          time: 15,
          quality: 35
        },
        confidence: 0.9,
        recommendations: [
          'Increase unit test coverage to 80%',
          'Implement integration tests',
          'Add code quality gates',
          'Regular code reviews'
        ]
      },
      efficiency: {
        title: 'Resource Utilization Optimization',
        description: 'CPU usage is inefficient during peak hours',
        impact: {
          performance: 25,
          cost: 3000,
          time: 10,
          quality: 5
        },
        confidence: 0.8,
        recommendations: [
          'Implement auto-scaling',
          'Optimize resource allocation',
          'Monitor peak usage patterns',
          'Consider load balancing'
        ]
      }
    };

    return insights[type as keyof typeof insights] || insights.performance;
  }

  private assessSeverity(impact: any): 'low' | 'medium' | 'high' | 'critical' {
    const totalImpact = impact.performance + impact.cost / 1000 + impact.time / 10;
    
    if (totalImpact > 100) return 'critical';
    if (totalImpact > 50) return 'high';
    if (totalImpact > 20) return 'medium';
    return 'low';
  }

  private assessDifficulty(impact: any): 'easy' | 'medium' | 'hard' {
    const complexity = impact.performance + impact.time;
    
    if (complexity > 50) return 'hard';
    if (complexity > 20) return 'medium';
    return 'easy';
  }

  private estimateTime(impact: any): number {
    return Math.max(1, Math.min(40, impact.time));
  }

  private estimateCost(impact: any): number {
    return Math.max(100, Math.min(10000, impact.cost));
  }

  private assessPriority(impact: any): 'low' | 'medium' | 'high' | 'critical' {
    const priority = impact.performance + impact.cost / 1000;
    
    if (priority > 80) return 'critical';
    if (priority > 40) return 'high';
    if (priority > 15) return 'medium';
    return 'low';
  }

  async predictPerformance(
    component: string,
    metric: 'response_time' | 'throughput' | 'error_rate' | 'availability' | 'resource_usage',
    currentValue: number,
    timeframe: '1h' | '24h' | '7d' | '30d' | '90d'
  ): Promise<PerformancePrediction> {
    // Simulate performance prediction
    const trend = this.analyzeTrend(currentValue);
    const predictedValue = this.calculatePredictedValue(currentValue, trend);
    const confidence = 0.7 + Math.random() * 0.3; // 70-100%
    
    const factors = this.identifyPerformanceFactors(component, metric);
    const recommendations = this.generatePerformanceRecommendations(component, metric, trend);

    const prediction: PerformancePrediction = {
      id: `prediction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      component,
      metric,
      currentValue,
      predictedValue,
      confidence,
      timeframe,
      trend,
      factors,
      recommendations,
      timestamp: new Date()
    };

    this.predictions.set(prediction.id, prediction);

    // Track analytics event
    await this.analytics.track('performance_prediction_generated', {
      component,
      metric,
      trend,
      confidence
    });

    return prediction;
  }

  private analyzeTrend(currentValue: number): 'improving' | 'stable' | 'declining' | 'critical' {
    const random = Math.random();
    
    if (random < 0.2) return 'improving';
    if (random < 0.6) return 'stable';
    if (random < 0.9) return 'declining';
    return 'critical';
  }

  private calculatePredictedValue(currentValue: number, trend: string): number {
    const multipliers = {
      improving: 0.8,
      stable: 1.0,
      declining: 1.3,
      critical: 1.8
    };
    
    return currentValue * multipliers[trend as keyof typeof multipliers];
  }

  private identifyPerformanceFactors(component: string, metric: string): string[] {
    const factors: Record<string, string[]> = {
      response_time: ['Database load', 'Network latency', 'Server capacity', 'Caching efficiency'],
      throughput: ['Concurrent users', 'System resources', 'Database performance', 'Network bandwidth'],
      error_rate: ['Code quality', 'Infrastructure stability', 'External dependencies', 'Monitoring coverage'],
      availability: ['Infrastructure redundancy', 'Monitoring systems', 'Deployment processes', 'Backup strategies'],
      resource_usage: ['Application efficiency', 'Infrastructure scaling', 'Memory management', 'CPU optimization']
    };
    
    return factors[metric] || ['Unknown factors'];
  }

  private generatePerformanceRecommendations(
    component: string,
    metric: string,
    trend: string
  ): string[] {
    const recommendations: Record<string, string[]> = {
      improving: [
        'Continue current optimization strategies',
        'Monitor for potential bottlenecks',
        'Document successful practices'
      ],
      stable: [
        'Implement proactive monitoring',
        'Consider performance optimization',
        'Plan for future scaling'
      ],
      declining: [
        'Immediate performance investigation required',
        'Implement performance monitoring',
        'Consider infrastructure scaling',
        'Optimize application code'
      ],
      critical: [
        'URGENT: Performance intervention required',
        'Implement emergency scaling',
        'Review and optimize critical paths',
        'Consider architectural changes'
      ]
    };
    
    return recommendations[trend] || ['Monitor and analyze'];
  }

  async optimizeResources(
    resourceType: 'cpu' | 'memory' | 'storage' | 'network' | 'database',
    currentUsage: number,
    historicalData: number[]
  ): Promise<ResourceOptimization> {
    const predictedUsage = this.predictResourceUsage(historicalData);
    const optimalAllocation = this.calculateOptimalAllocation(currentUsage, predictedUsage);
    
    const savings = {
      cost: this.calculateCostSavings(currentUsage, optimalAllocation),
      performance: this.calculatePerformanceImprovement(currentUsage, optimalAllocation),
      efficiency: this.calculateEfficiencyImprovement(currentUsage, optimalAllocation)
    };

    const recommendations = this.generateResourceRecommendations(resourceType, currentUsage, optimalAllocation);
    const implementation = this.assessResourceImplementation(savings);

    const optimization: ResourceOptimization = {
      id: `optimization_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resourceType,
      currentUsage,
      predictedUsage,
      optimalAllocation,
      savings,
      recommendations,
      implementation,
      timestamp: new Date()
    };

    this.optimizations.set(optimization.id, optimization);

    // Track analytics event
    await this.analytics.track('resource_optimization_generated', {
      resourceType,
      costSavings: savings.cost,
      performanceImprovement: savings.performance
    });

    return optimization;
  }

  private predictResourceUsage(historicalData: number[]): number {
    // Simple moving average prediction
    const recentData = historicalData.slice(-10);
    return recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
  }

  private calculateOptimalAllocation(current: number, predicted: number): number {
    // Add 20% buffer for safety
    return Math.max(current, predicted * 1.2);
  }

  private calculateCostSavings(current: number, optimal: number): number {
    const costPerUnit = 10; // $10 per unit
    return Math.max(0, (current - optimal) * costPerUnit);
  }

  private calculatePerformanceImprovement(current: number, optimal: number): number {
    return Math.max(0, ((optimal - current) / current) * 100);
  }

  private calculateEfficiencyImprovement(current: number, optimal: number): number {
    return Math.max(0, ((current - optimal) / current) * 100);
  }

  private generateResourceRecommendations(
    resourceType: string,
    current: number,
    optimal: number
  ): string[] {
    const recommendations: Record<string, string[]> = {
      cpu: [
        'Implement auto-scaling policies',
        'Optimize application algorithms',
        'Consider load balancing',
        'Monitor CPU-intensive processes'
      ],
      memory: [
        'Implement memory pooling',
        'Optimize data structures',
        'Consider caching strategies',
        'Monitor memory leaks'
      ],
      storage: [
        'Implement data compression',
        'Optimize storage allocation',
        'Consider tiered storage',
        'Monitor storage growth'
      ],
      network: [
        'Optimize network protocols',
        'Implement CDN strategies',
        'Consider bandwidth optimization',
        'Monitor network latency'
      ],
      database: [
        'Optimize database queries',
        'Implement connection pooling',
        'Consider read replicas',
        'Monitor database performance'
      ]
    };
    
    return recommendations[resourceType] || ['General optimization recommended'];
  }

  private assessResourceImplementation(savings: any): {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
    estimatedCost: number;
    roi: number;
  } {
    const totalSavings = savings.cost + savings.performance * 100;
    const difficulty = totalSavings > 1000 ? 'hard' : totalSavings > 500 ? 'medium' : 'easy';
    const estimatedTime = difficulty === 'hard' ? 40 : difficulty === 'medium' ? 20 : 8;
    const estimatedCost = estimatedTime * 150; // $150/hour
    const roi = totalSavings / estimatedCost;
    
    return {
      difficulty,
      estimatedTime,
      estimatedCost,
      roi
    };
  }

  async detectAnomalies(
    component: string,
    metric: string,
    currentValue: number,
    historicalData: number[]
  ): Promise<AnomalyDetection> {
    const expectedValue = this.calculateExpectedValue(historicalData);
    const deviation = Math.abs(currentValue - expectedValue) / expectedValue;
    const severity = this.assessAnomalySeverity(deviation);
    const type = this.determineAnomalyType(currentValue, expectedValue);
    
    const description = this.generateAnomalyDescription(component, metric, deviation);
    const potentialCauses = this.identifyAnomalyCauses(component, metric, type);
    const recommendedActions = this.generateAnomalyActions(severity, type);

    const anomaly: AnomalyDetection = {
      id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      component,
      metric,
      currentValue,
      expectedValue,
      deviation,
      severity,
      type,
      description,
      potentialCauses,
      recommendedActions,
      timestamp: new Date()
    };

    this.anomalies.set(anomaly.id, anomaly);

    // Track analytics event
    await this.analytics.track('anomaly_detected', {
      component,
      metric,
      severity,
      deviation
    });

    return anomaly;
  }

  private calculateExpectedValue(historicalData: number[]): number {
    const recentData = historicalData.slice(-20);
    return recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
  }

  private assessAnomalySeverity(deviation: number): 'low' | 'medium' | 'high' | 'critical' {
    if (deviation > 0.5) return 'critical';
    if (deviation > 0.3) return 'high';
    if (deviation > 0.1) return 'medium';
    return 'low';
  }

  private determineAnomalyType(current: number, expected: number): 'spike' | 'drop' | 'trend_change' | 'pattern_break' {
    const ratio = current / expected;
    
    if (ratio > 2) return 'spike';
    if (ratio < 0.5) return 'drop';
    if (Math.abs(ratio - 1) > 0.3) return 'trend_change';
    return 'pattern_break';
  }

  private generateAnomalyDescription(component: string, metric: string, deviation: number): string {
    return `${component} ${metric} shows ${(deviation * 100).toFixed(1)}% deviation from expected values`;
  }

  private identifyAnomalyCauses(component: string, metric: string, type: string): string[] {
    const causes: Record<string, string[]> = {
      spike: ['Increased load', 'System malfunction', 'External dependency issue', 'Configuration change'],
      drop: ['Service degradation', 'Resource exhaustion', 'Network issue', 'Code deployment problem'],
      trend_change: ['System optimization', 'Infrastructure change', 'User behavior change', 'External factors'],
      pattern_break: ['System update', 'Configuration change', 'External service change', 'Unusual activity']
    };
    
    return causes[type] || ['Unknown cause'];
  }

  private generateAnomalyActions(severity: string, type: string): string[] {
    const actions: Record<string, string[]> = {
      low: ['Monitor closely', 'Document occurrence', 'Check related metrics'],
      medium: ['Investigate root cause', 'Implement monitoring', 'Prepare mitigation plan'],
      high: ['Immediate investigation required', 'Implement temporary fixes', 'Alert stakeholders'],
      critical: ['URGENT: Immediate intervention', 'Implement emergency procedures', 'Escalate to management']
    };
    
    return actions[severity] || ['Monitor and investigate'];
  }

  async analyzeTrends(
    metric: string,
    data: number[],
    timeframe: '1d' | '7d' | '30d' | '90d' | '1y'
  ): Promise<TrendAnalysis> {
    const trend = this.determineTrend(data);
    const slope = this.calculateSlope(data);
    const correlation = this.calculateCorrelation(data);
    const seasonality = this.detectSeasonality(data);
    
    const forecast = this.generateForecast(data, trend);
    const insights = this.generateTrendInsights(metric, trend, slope, seasonality);

    const analysis: TrendAnalysis = {
      id: `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metric,
      timeframe,
      trend,
      slope,
      correlation,
      seasonality,
      forecast,
      insights,
      timestamp: new Date()
    };

    this.trends.set(analysis.id, analysis);

    // Track analytics event
    await this.analytics.track('trend_analysis_completed', {
      metric,
      trend,
      timeframe,
      seasonality
    });

    return analysis;
  }

  private determineTrend(data: number[]): 'increasing' | 'decreasing' | 'stable' | 'cyclical' {
    if (data.length < 2) return 'stable';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    if (this.detectCycles(data)) return 'cyclical';
    return 'stable';
  }

  private calculateSlope(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = data.reduce((sum, val, index) => sum + index * index, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateCorrelation(data: number[]): number {
    if (data.length < 2) return 0;
    
    const indices = Array.from({ length: data.length }, (_, i) => i);
    const meanX = indices.reduce((sum, val) => sum + val, 0) / indices.length;
    const meanY = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    const numerator = indices.reduce((sum, x, i) => sum + (x - meanX) * (data[i] - meanY), 0);
    const denominatorX = Math.sqrt(indices.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0));
    const denominatorY = Math.sqrt(data.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0));
    
    return numerator / (denominatorX * denominatorY);
  }

  private detectSeasonality(data: number[]): boolean {
    if (data.length < 7) return false;
    
    // Simple seasonality detection
    const weeklyPatterns = data.length >= 7;
    const monthlyPatterns = data.length >= 30;
    
    return weeklyPatterns || monthlyPatterns;
  }

  private detectCycles(data: number[]): boolean {
    if (data.length < 4) return false;
    
    // Simple cycle detection
    const variance = this.calculateVariance(data);
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    
    return coefficientOfVariation > 0.3;
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }

  private generateForecast(data: number[], trend: string): {
    nextValue: number;
    confidence: number;
    range: { min: number; max: number };
  } {
    const lastValue = data[data.length - 1];
    const slope = this.calculateSlope(data);
    
    let nextValue = lastValue;
    if (trend === 'increasing') nextValue += slope;
    else if (trend === 'decreasing') nextValue -= slope;
    
    const confidence = 0.6 + Math.random() * 0.4; // 60-100%
    const range = {
      min: nextValue * (1 - confidence),
      max: nextValue * (1 + confidence)
    };
    
    return { nextValue, confidence, range };
  }

  private generateTrendInsights(
    metric: string,
    trend: string,
    slope: number,
    seasonality: boolean
  ): string[] {
    const insights: string[] = [];
    
    if (trend === 'increasing') {
      insights.push(`${metric} shows an upward trend`);
      insights.push('Consider scaling resources proactively');
    } else if (trend === 'decreasing') {
      insights.push(`${metric} shows a downward trend`);
      insights.push('Monitor for potential issues');
    } else if (trend === 'cyclical') {
      insights.push(`${metric} shows cyclical patterns`);
      insights.push('Consider seasonal optimization strategies');
    } else {
      insights.push(`${metric} shows stable behavior`);
      insights.push('Continue current monitoring practices');
    }
    
    if (seasonality) {
      insights.push('Seasonal patterns detected');
      insights.push('Implement seasonal resource planning');
    }
    
    return insights;
  }

  // Analytics and reporting methods
  async getPredictionModels(): Promise<PredictionModel[]> {
    return Array.from(this.models.values());
  }

  async getDevelopmentInsights(): Promise<DevelopmentInsight[]> {
    return Array.from(this.insights.values());
  }

  async getPerformancePredictions(): Promise<PerformancePrediction[]> {
    return Array.from(this.predictions.values());
  }

  async getResourceOptimizations(): Promise<ResourceOptimization[]> {
    return Array.from(this.optimizations.values());
  }

  async getAnomalies(): Promise<AnomalyDetection[]> {
    return Array.from(this.anomalies.values());
  }

  async getTrendAnalyses(): Promise<TrendAnalysis[]> {
    return Array.from(this.trends.values());
  }

  async generateAnalyticsReport(): Promise<{
    totalModels: number;
    totalInsights: number;
    totalPredictions: number;
    totalOptimizations: number;
    totalAnomalies: number;
    averageAccuracy: number;
    topInsights: DevelopmentInsight[];
    recentAnomalies: AnomalyDetection[];
  }> {
    const models = Array.from(this.models.values());
    const insights = Array.from(this.insights.values());
    const predictions = Array.from(this.predictions.values());
    const optimizations = Array.from(this.optimizations.values());
    const anomalies = Array.from(this.anomalies.values());

    const averageAccuracy = models.length > 0 
      ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length 
      : 0;

    const topInsights = insights
      .sort((a, b) => b.impact.performance - a.impact.performance)
      .slice(0, 5);

    const recentAnomalies = anomalies
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalModels: models.length,
      totalInsights: insights.length,
      totalPredictions: predictions.length,
      totalOptimizations: optimizations.length,
      totalAnomalies: anomalies.length,
      averageAccuracy,
      topInsights,
      recentAnomalies
    };
  }

  // Public methods for external access
  getModels(): PredictionModel[] {
    return Array.from(this.models.values());
  }

  getInsights(): DevelopmentInsight[] {
    return Array.from(this.insights.values());
  }

  getPredictions(): PerformancePrediction[] {
    return Array.from(this.predictions.values());
  }

  getOptimizations(): ResourceOptimization[] {
    return Array.from(this.optimizations.values());
  }

  getAnomalies(): AnomalyDetection[] {
    return Array.from(this.anomalies.values());
  }

  getTrends(): TrendAnalysis[] {
    return Array.from(this.trends.values());
  }
} 