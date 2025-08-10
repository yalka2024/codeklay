import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { Analytics } from '@/lib/analytics';
import { QuantumAnalytics } from '@/lib/quantum-analytics';
import { PredictiveAnalyticsEngine } from '@/lib/predictive-analytics';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';

// Initialize analytics services
const analytics = new Analytics();
const quantumAnalytics = new QuantumAnalytics(analytics);
const predictiveEngine = new PredictiveAnalyticsEngine(analytics);
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Log analytics operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'analytics_operation',
        resource: 'quantum-analytics-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      case 'track_quantum_metrics':
        const {
          quantumEfficiency,
          classicalEfficiency,
          qubitUtilization,
          coherenceTime,
          errorRate,
          gateFidelity,
          circuitDepth,
          costPerOperation,
          energyConsumption
        } = data;
        
        const metrics = await quantumAnalytics.trackQuantumMetrics(
          quantumEfficiency,
          classicalEfficiency,
          qubitUtilization,
          coherenceTime,
          errorRate,
          gateFidelity,
          circuitDepth,
          costPerOperation,
          energyConsumption
        );
        
        response = {
          success: true,
          metrics,
          message: 'Quantum metrics tracked successfully'
        };
        break;

      case 'run_performance_benchmark':
        const {
          name,
          description,
          algorithm,
          classicalRuntime,
          quantumRuntime,
          accuracy
        } = data;
        
        const benchmark = await quantumAnalytics.runPerformanceBenchmark(
          name,
          description,
          algorithm,
          classicalRuntime,
          quantumRuntime,
          accuracy
        );
        
        response = {
          success: true,
          benchmark,
          message: 'Performance benchmark completed successfully'
        };
        break;

      case 'analyze_quantum_optimization':
        const {
          problemType,
          classicalSolution,
          quantumSolution
        } = data;
        
        const optimization = await quantumAnalytics.analyzeQuantumOptimization(
          problemType,
          classicalSolution,
          quantumSolution
        );
        
        response = {
          success: true,
          optimization,
          message: 'Quantum optimization analysis completed'
        };
        break;

      case 'optimize_resources':
        const {
          resourceType,
          currentUsage,
          targetUsage,
          optimizationType
        } = data;
        
        const resourceOptimization = await quantumAnalytics.optimizeResources(
          resourceType,
          currentUsage,
          targetUsage
        );
        
        response = {
          success: true,
          resourceOptimization,
          message: 'Resource optimization completed'
        };
        break;

      case 'analyze_quantum_workload':
        const {
          name: workloadName,
          type: workloadType,
          complexity,
          requirements
        } = data;
        
        const workload = await quantumAnalytics.analyzeQuantumWorkload(
          workloadName,
          workloadType,
          complexity,
          requirements
        );
        
        response = {
          success: true,
          workload,
          message: 'Quantum workload analysis completed'
        };
        break;

      case 'train_prediction_model':
        const {
          name: modelName,
          type: modelType,
          algorithm: modelAlgorithm,
          trainingData
        } = data;
        
        const model = await predictiveEngine.trainPredictionModel(
          modelName,
          modelType,
          modelAlgorithm,
          trainingData
        );
        
        response = {
          success: true,
          model,
          message: 'Prediction model trained successfully'
        };
        break;

      case 'generate_development_insight':
        const {
          type: insightType,
          category,
          insightData
        } = data;
        
        const insight = await predictiveEngine.generateDevelopmentInsight(
          insightType,
          category,
          insightData
        );
        
        response = {
          success: true,
          insight,
          message: 'Development insight generated successfully'
        };
        break;

      case 'predict_performance':
        const {
          component,
          metric,
          currentValue,
          timeframe
        } = data;
        
        const prediction = await predictiveEngine.predictPerformance(
          component,
          metric,
          currentValue,
          timeframe
        );
        
        response = {
          success: true,
          prediction,
          message: 'Performance prediction generated'
        };
        break;

      case 'optimize_resources_predictive':
        const {
          resourceType: predResourceType,
          currentUsage: predCurrentUsage,
          historicalData
        } = data;
        
        const predOptimization = await predictiveEngine.optimizeResources(
          predResourceType,
          predCurrentUsage,
          historicalData
        );
        
        response = {
          success: true,
          predOptimization,
          message: 'Predictive resource optimization completed'
        };
        break;

      case 'detect_anomalies':
        const {
          component: anomalyComponent,
          metric: anomalyMetric,
          currentValue: anomalyCurrentValue,
          historicalData: anomalyHistoricalData
        } = data;
        
        const anomaly = await predictiveEngine.detectAnomalies(
          anomalyComponent,
          anomalyMetric,
          anomalyCurrentValue,
          anomalyHistoricalData
        );
        
        response = {
          success: true,
          anomaly,
          message: 'Anomaly detection completed'
        };
        break;

      case 'analyze_trends':
        const {
          metric: trendMetric,
          data: trendData,
          timeframe: trendTimeframe
        } = data;
        
        const trend = await predictiveEngine.analyzeTrends(
          trendMetric,
          trendData,
          trendTimeframe
        );
        
        response = {
          success: true,
          trend,
          message: 'Trend analysis completed'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful analytics operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'analytics_operation_success',
        resource: 'quantum-analytics-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quantum Analytics API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'analytics_operation_error',
        resource: 'quantum-analytics-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.body?.action
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    let response: any;

    switch (action) {
      case 'quantum_metrics_history':
        const { startDate, endDate } = searchParams;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        
        const metricsHistory = await quantumAnalytics.getQuantumMetricsHistory(start, end);
        response = {
          success: true,
          metrics: metricsHistory,
          count: metricsHistory.length
        };
        break;

      case 'performance_benchmarks':
        const benchmarks = await quantumAnalytics.getPerformanceBenchmarks();
        response = {
          success: true,
          benchmarks,
          count: benchmarks.length
        };
        break;

      case 'quantum_optimizations':
        const optimizations = await quantumAnalytics.getQuantumOptimizations();
        response = {
          success: true,
          optimizations,
          count: optimizations.length
        };
        break;

      case 'quantum_workloads':
        const workloads = await quantumAnalytics.getQuantumWorkloads();
        response = {
          success: true,
          workloads,
          count: workloads.length
        };
        break;

      case 'prediction_models':
        const models = await predictiveEngine.getPredictionModels();
        response = {
          success: true,
          models,
          count: models.length
        };
        break;

      case 'development_insights':
        const insights = await predictiveEngine.getDevelopmentInsights();
        response = {
          success: true,
          insights,
          count: insights.length
        };
        break;

      case 'performance_predictions':
        const predictions = await predictiveEngine.getPerformancePredictions();
        response = {
          success: true,
          predictions,
          count: predictions.length
        };
        break;

      case 'resource_optimizations':
        const resourceOpts = await predictiveEngine.getResourceOptimizations();
        response = {
          success: true,
          optimizations: resourceOpts,
          count: resourceOpts.length
        };
        break;

      case 'anomalies':
        const anomalies = await predictiveEngine.getAnomalies();
        response = {
          success: true,
          anomalies,
          count: anomalies.length
        };
        break;

      case 'trend_analyses':
        const trends = await predictiveEngine.getTrendAnalyses();
        response = {
          success: true,
          trends,
          count: trends.length
        };
        break;

      case 'quantum_analytics_report':
        const quantumReport = await quantumAnalytics.generateAnalyticsReport();
        response = {
          success: true,
          report: quantumReport
        };
        break;

      case 'predictive_analytics_report':
        const predictiveReport = await predictiveEngine.generateAnalyticsReport();
        response = {
          success: true,
          report: predictiveReport
        };
        break;

      case 'combined_analytics_report':
        const quantumReportData = await quantumAnalytics.generateAnalyticsReport();
        const predictiveReportData = await predictiveEngine.generateAnalyticsReport();
        
        const combinedReport = {
          quantum: quantumReportData,
          predictive: predictiveReportData,
          summary: {
            totalMetrics: quantumReportData.totalMetrics,
            totalInsights: predictiveReportData.totalInsights,
            totalPredictions: predictiveReportData.totalPredictions,
            totalOptimizations: quantumReportData.topOptimizations.length + predictiveReportData.totalOptimizations,
            averageAccuracy: predictiveReportData.averageAccuracy,
            totalAnomalies: predictiveReportData.totalAnomalies
          }
        };
        
        response = {
          success: true,
          report: combinedReport
        };
        break;

      case 'analytics_summary':
        const quantumSummary = await quantumAnalytics.generateAnalyticsReport();
        const predictiveSummary = await predictiveEngine.generateAnalyticsReport();
        
        const summary = {
          quantumMetrics: quantumSummary.totalMetrics,
          developmentInsights: predictiveSummary.totalInsights,
          performancePredictions: predictiveSummary.totalPredictions,
          resourceOptimizations: quantumSummary.topOptimizations.length + predictiveSummary.totalOptimizations,
          anomalies: predictiveSummary.totalAnomalies,
          averageAccuracy: predictiveSummary.averageAccuracy,
          topInsights: predictiveSummary.topInsights.slice(0, 3),
          recentAnomalies: predictiveSummary.recentAnomalies.slice(0, 5)
        };
        
        response = {
          success: true,
          summary
        };
        break;

      case 'quantum_efficiency_stats':
        const metrics = quantumAnalytics.getMetrics();
        const efficiencyStats = {
          averageQuantumEfficiency: metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + m.quantumEfficiency, 0) / metrics.length 
            : 0,
          averageClassicalEfficiency: metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + m.classicalEfficiency, 0) / metrics.length 
            : 0,
          averageQuantumAdvantage: metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + m.quantumAdvantage, 0) / metrics.length 
            : 0,
          totalMetrics: metrics.length,
          recentMetrics: metrics.slice(-10)
        };
        
        response = {
          success: true,
          efficiencyStats
        };
        break;

      case 'performance_benchmark_summary':
        const benchmarks = quantumAnalytics.getBenchmarks();
        const benchmarkSummary = {
          totalBenchmarks: benchmarks.length,
          averageSpeedup: benchmarks.length > 0 
            ? benchmarks.reduce((sum, b) => sum + b.speedup, 0) / benchmarks.length 
            : 0,
          averageAccuracy: benchmarks.length > 0 
            ? benchmarks.reduce((sum, b) => sum + b.accuracy, 0) / benchmarks.length 
            : 0,
          totalCostSavings: benchmarks.reduce((sum, b) => sum + b.costComparison.savings, 0),
          totalEnergySavings: benchmarks.reduce((sum, b) => sum + b.energyComparison.savings, 0),
          recentBenchmarks: benchmarks.slice(-5)
        };
        
        response = {
          success: true,
          benchmarkSummary
        };
        break;

      case 'prediction_accuracy_stats':
        const predictions = predictiveEngine.getPredictions();
        const accuracyStats = {
          totalPredictions: predictions.length,
          averageConfidence: predictions.length > 0 
            ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length 
            : 0,
          predictionsByTrend: {
            improving: predictions.filter(p => p.trend === 'improving').length,
            stable: predictions.filter(p => p.trend === 'stable').length,
            declining: predictions.filter(p => p.trend === 'declining').length,
            critical: predictions.filter(p => p.trend === 'critical').length
          },
          recentPredictions: predictions.slice(-10)
        };
        
        response = {
          success: true,
          accuracyStats
        };
        break;

      case 'anomaly_detection_summary':
        const anomalies = predictiveEngine.getAnomalies();
        const anomalySummary = {
          totalAnomalies: anomalies.length,
          anomaliesBySeverity: {
            low: anomalies.filter(a => a.severity === 'low').length,
            medium: anomalies.filter(a => a.severity === 'medium').length,
            high: anomalies.filter(a => a.severity === 'high').length,
            critical: anomalies.filter(a => a.severity === 'critical').length
          },
          anomaliesByType: {
            spike: anomalies.filter(a => a.type === 'spike').length,
            drop: anomalies.filter(a => a.type === 'drop').length,
            trend_change: anomalies.filter(a => a.type === 'trend_change').length,
            pattern_break: anomalies.filter(a => a.type === 'pattern_break').length
          },
          recentAnomalies: anomalies.slice(-10)
        };
        
        response = {
          success: true,
          anomalySummary
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful analytics operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'analytics_operation_success',
        resource: 'quantum-analytics-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quantum Analytics API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'analytics_operation_error',
        resource: 'quantum-analytics-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.url
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 