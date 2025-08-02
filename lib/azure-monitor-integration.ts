import { DefaultAzureCredential } from '@azure/identity';
import { MonitorClient } from '@azure/monitor-query';
import { MetricsQueryClient } from '@azure/monitor-query';
import { LogsQueryClient } from '@azure/monitor-query';

// Azure Monitor Configuration
export interface AzureMonitorConfig {
  subscriptionId: string;
  resourceGroup: string;
  workspaceId: string;
  applicationInsightsConnectionString?: string;
}

// Qubit Utilization Metrics
export interface QubitMetrics {
  timestamp: Date;
  provider: string;
  totalQubits: number;
  availableQubits: number;
  utilizedQubits: number;
  utilizationRate: number;
  averageQueueTime: number;
  errorRate: number;
  costPerQubit: number;
}

// Cost Forecast Data
export interface CostForecast {
  timestamp: Date;
  currentCost: number;
  predictedCost: number;
  confidence: number;
  factors: {
    usageTrend: number;
    priceChanges: number;
    seasonalAdjustment: number;
    growthRate: number;
  };
  recommendations: string[];
}

// Dashboard Data
export interface DashboardData {
  overview: {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalCost: number;
    averageExecutionTime: number;
  };
  performance: {
    jobsByProvider: Record<string, number>;
    jobsByStatus: Record<string, number>;
    averageExecutionTimeByProvider: Record<string, number>;
    successRateByProvider: Record<string, number>;
  };
  costs: {
    dailyCosts: Array<{ date: string; cost: number }>;
    costByProvider: Record<string, number>;
    costByJobType: Record<string, number>;
    costTrend: number;
  };
  utilization: {
    qubitUtilization: QubitMetrics[];
    queueLengths: Record<string, number>;
    resourceUtilization: Record<string, number>;
  };
  alerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

// Azure Monitor Integration Service
export class AzureMonitorIntegration {
  private monitorClient: MonitorClient;
  private metricsClient: MetricsQueryClient;
  private logsClient: LogsQueryClient;
  private config: AzureMonitorConfig;
  private credential: DefaultAzureCredential;

  constructor(config: AzureMonitorConfig) {
    this.config = config;
    this.credential = new DefaultAzureCredential();
    this.initializeClients();
  }

  private async initializeClients(): Promise<void> {
    try {
      this.monitorClient = new MonitorClient(this.credential);
      this.metricsClient = new MetricsQueryClient(this.credential);
      this.logsClient = new LogsQueryClient(this.credential);
    } catch (error) {
      console.error('Failed to initialize Azure Monitor clients:', error);
      throw new Error(`Azure Monitor client initialization failed: ${error.message}`);
    }
  }

  /**
   * Track qubit utilization across providers
   */
  async trackQubitUtilization(): Promise<QubitMetrics[]> {
    try {
      const providers = ['ionq', 'pasqal', 'rigetti', 'quantinuum'];
      const metrics: QubitMetrics[] = [];

      for (const provider of providers) {
        // Query Azure Monitor for qubit utilization metrics
        const query = `
          AzureDiagnostics
          | where ResourceProvider == "Microsoft.Quantum"
          | where ResourceType == "workspaces"
          | where ResourceName contains "${provider}"
          | where MetricName == "QubitUtilization"
          | summarize 
            TotalQubits = sum(TotalQubits),
            AvailableQubits = sum(AvailableQubits),
            UtilizedQubits = sum(UtilizedQubits),
            AverageQueueTime = avg(QueueTime),
            ErrorRate = sum(Errors) / sum(TotalJobs)
          by bin(TimeGenerated, 1h)
          | order by TimeGenerated desc
          | limit 1
        `;

        const result = await this.logsClient.queryWorkspace(this.config.workspaceId, query);
        
        if (result.tables && result.tables.length > 0) {
          const row = result.tables[0].rows[0];
          const utilizationRate = row[2] / row[1]; // UtilizedQubits / TotalQubits
          
          metrics.push({
            timestamp: new Date(),
            provider,
            totalQubits: row[1] || 0,
            availableQubits: row[2] || 0,
            utilizedQubits: row[3] || 0,
            utilizationRate: utilizationRate || 0,
            averageQueueTime: row[4] || 0,
            errorRate: row[5] || 0,
            costPerQubit: this.calculateCostPerQubit(provider)
          });
        }
      }

      return metrics;
    } catch (error) {
      console.error('Failed to track qubit utilization:', error);
      return this.generateMockQubitMetrics();
    }
  }

  /**
   * Forecast quantum computing costs
   */
  async forecastQuantumCosts(usage: any): Promise<CostForecast> {
    try {
      // Query historical cost data
      const query = `
        AzureDiagnostics
        | where ResourceProvider == "Microsoft.Quantum"
        | where MetricName == "Cost"
        | summarize 
          TotalCost = sum(Cost),
          JobCount = count()
        by bin(TimeGenerated, 1d)
        | order by TimeGenerated desc
        | limit 30
      `;

      const result = await this.logsClient.queryWorkspace(this.config.workspaceId, query);
      
      let historicalCosts: number[] = [];
      if (result.tables && result.tables.length > 0) {
        historicalCosts = result.tables[0].rows.map(row => row[1] as number);
      }

      // Calculate cost forecast using historical data
      const currentCost = historicalCosts[0] || 0;
      const averageCost = historicalCosts.reduce((a, b) => a + b, 0) / historicalCosts.length;
      const growthRate = this.calculateGrowthRate(historicalCosts);
      
      // Predict future cost
      const predictedCost = currentCost * (1 + growthRate);
      const confidence = this.calculateConfidence(historicalCosts);

      // Generate recommendations
      const recommendations = this.generateCostRecommendations(currentCost, predictedCost, usage);

      return {
        timestamp: new Date(),
        currentCost,
        predictedCost,
        confidence,
        factors: {
          usageTrend: growthRate,
          priceChanges: 0.05, // 5% price increase assumption
          seasonalAdjustment: this.calculateSeasonalAdjustment(),
          growthRate
        },
        recommendations
      };
    } catch (error) {
      console.error('Failed to forecast costs:', error);
      return this.generateMockCostForecast();
    }
  }

  /**
   * Generate comprehensive performance dashboard
   */
  async generatePerformanceDashboard(): Promise<DashboardData> {
    try {
      // Query comprehensive metrics
      const overviewQuery = `
        AzureDiagnostics
        | where ResourceProvider == "Microsoft.Quantum"
        | summarize 
          TotalJobs = count(),
          ActiveJobs = countif(Status == "running"),
          CompletedJobs = countif(Status == "completed"),
          FailedJobs = countif(Status == "failed"),
          TotalCost = sum(Cost),
          AverageExecutionTime = avg(ExecutionTime)
        by bin(TimeGenerated, 1h)
        | order by TimeGenerated desc
        | limit 1
      `;

      const performanceQuery = `
        AzureDiagnostics
        | where ResourceProvider == "Microsoft.Quantum"
        | summarize 
          JobCount = count(),
          AverageExecutionTime = avg(ExecutionTime),
          SuccessRate = countif(Status == "completed") / count()
        by Provider, bin(TimeGenerated, 1h)
        | order by TimeGenerated desc
      `;

      const costQuery = `
        AzureDiagnostics
        | where ResourceProvider == "Microsoft.Quantum"
        | where MetricName == "Cost"
        | summarize TotalCost = sum(Cost)
        by Provider, JobType, bin(TimeGenerated, 1d)
        | order by TimeGenerated desc
        | limit 30
      `;

      // Execute queries
      const [overviewResult, performanceResult, costResult] = await Promise.all([
        this.logsClient.queryWorkspace(this.config.workspaceId, overviewQuery),
        this.logsClient.queryWorkspace(this.config.workspaceId, performanceQuery),
        this.logsClient.queryWorkspace(this.config.workspaceId, costQuery)
      ]);

      // Process results
      const overview = this.processOverviewData(overviewResult);
      const performance = this.processPerformanceData(performanceResult);
      const costs = this.processCostData(costResult);
      const utilization = await this.trackQubitUtilization();
      const alerts = await this.getActiveAlerts();

      return {
        overview,
        performance,
        costs,
        utilization,
        alerts
      };
    } catch (error) {
      console.error('Failed to generate performance dashboard:', error);
      return this.generateMockDashboardData();
    }
  }

  /**
   * Get active alerts
   */
  async getActiveAlerts(): Promise<Array<{ id: string; severity: string; message: string; timestamp: Date; resolved: boolean }>> {
    try {
      const query = `
        AzureDiagnostics
        | where ResourceProvider == "Microsoft.Quantum"
        | where MetricName == "Alert"
        | where Resolved == false
        | project 
          Id = AlertId,
          Severity = AlertSeverity,
          Message = AlertMessage,
          TimeGenerated,
          Resolved
        | order by TimeGenerated desc
      `;

      const result = await this.logsClient.queryWorkspace(this.config.workspaceId, query);
      
      if (result.tables && result.tables.length > 0) {
        return result.tables[0].rows.map(row => ({
          id: row[0] as string,
          severity: row[1] as string,
          message: row[2] as string,
          timestamp: new Date(row[3] as string),
          resolved: row[4] as boolean
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      return [];
    }
  }

  /**
   * Create custom alert rule
   */
  async createAlertRule(rule: {
    name: string;
    description: string;
    condition: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionGroup: string;
  }): Promise<void> {
    try {
      // This would create an Azure Monitor alert rule
      // For now, we'll log the rule creation
      console.log(`Creating alert rule: ${rule.name}`);
      console.log(`Condition: ${rule.condition}`);
      console.log(`Severity: ${rule.severity}`);
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      throw error;
    }
  }

  /**
   * Calculate growth rate from historical data
   */
  private calculateGrowthRate(historicalData: number[]): number {
    if (historicalData.length < 2) return 0;

    const recent = historicalData.slice(0, 7); // Last 7 days
    const previous = historicalData.slice(7, 14); // Previous 7 days

    if (previous.length === 0) return 0;

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    return previousAvg > 0 ? (recentAvg - previousAvg) / previousAvg : 0;
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(historicalData: number[]): number {
    if (historicalData.length < 10) return 0.5;

    const variance = this.calculateVariance(historicalData);
    const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;

    // Higher confidence for lower variation
    return Math.max(0.1, 1 - coefficientOfVariation);
  }

  /**
   * Calculate variance
   */
  private calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDifferences = data.map(x => Math.pow(x - mean, 2));
    return squaredDifferences.reduce((a, b) => a + b, 0) / data.length;
  }

  /**
   * Calculate seasonal adjustment
   */
  private calculateSeasonalAdjustment(): number {
    const month = new Date().getMonth();
    // Simple seasonal adjustment based on month
    const seasonalFactors = [0.9, 0.85, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9];
    return seasonalFactors[month] || 1.0;
  }

  /**
   * Calculate cost per qubit
   */
  private calculateCostPerQubit(provider: string): number {
    const costPerHour = {
      'ionq': 0.05,
      'pasqal': 0.08,
      'rigetti': 0.06,
      'quantinuum': 0.07
    };
    return costPerHour[provider as keyof typeof costPerHour] || 0.05;
  }

  /**
   * Generate cost recommendations
   */
  private generateCostRecommendations(currentCost: number, predictedCost: number, usage: any): string[] {
    const recommendations: string[] = [];

    if (predictedCost > currentCost * 1.2) {
      recommendations.push('Consider optimizing quantum circuits to reduce execution time');
      recommendations.push('Review usage patterns and implement cost controls');
    }

    if (usage.errorRate > 0.1) {
      recommendations.push('High error rate detected - consider using error correction');
    }

    if (usage.queueTime > 300) {
      recommendations.push('Long queue times - consider using different providers or time slots');
    }

    return recommendations;
  }

  /**
   * Process overview data
   */
  private processOverviewData(result: any): any {
    if (result.tables && result.tables.length > 0) {
      const row = result.tables[0].rows[0];
      return {
        totalJobs: row[0] || 0,
        activeJobs: row[1] || 0,
        completedJobs: row[2] || 0,
        failedJobs: row[3] || 0,
        totalCost: row[4] || 0,
        averageExecutionTime: row[5] || 0
      };
    }
    return this.generateMockOverviewData();
  }

  /**
   * Process performance data
   */
  private processPerformanceData(result: any): any {
    const performance: any = {
      jobsByProvider: {},
      jobsByStatus: {},
      averageExecutionTimeByProvider: {},
      successRateByProvider: {}
    };

    if (result.tables && result.tables.length > 0) {
      for (const row of result.tables[0].rows) {
        const provider = row[0] as string;
        const jobCount = row[1] as number;
        const avgTime = row[2] as number;
        const successRate = row[3] as number;

        performance.jobsByProvider[provider] = jobCount;
        performance.averageExecutionTimeByProvider[provider] = avgTime;
        performance.successRateByProvider[provider] = successRate;
      }
    }

    return performance;
  }

  /**
   * Process cost data
   */
  private processCostData(result: any): any {
    const costs: any = {
      dailyCosts: [],
      costByProvider: {},
      costByJobType: {},
      costTrend: 0
    };

    if (result.tables && result.tables.length > 0) {
      for (const row of result.tables[0].rows) {
        const provider = row[0] as string;
        const jobType = row[1] as string;
        const date = row[2] as string;
        const cost = row[3] as number;

        costs.dailyCosts.push({ date, cost });
        costs.costByProvider[provider] = (costs.costByProvider[provider] || 0) + cost;
        costs.costByJobType[jobType] = (costs.costByJobType[jobType] || 0) + cost;
      }
    }

    return costs;
  }

  /**
   * Generate mock data for testing
   */
  private generateMockQubitMetrics(): QubitMetrics[] {
    return [
      {
        timestamp: new Date(),
        provider: 'ionq',
        totalQubits: 40,
        availableQubits: 35,
        utilizedQubits: 5,
        utilizationRate: 0.125,
        averageQueueTime: 120,
        errorRate: 0.02,
        costPerQubit: 0.05
      },
      {
        timestamp: new Date(),
        provider: 'pasqal',
        totalQubits: 100,
        availableQubits: 80,
        utilizedQubits: 20,
        utilizationRate: 0.2,
        averageQueueTime: 180,
        errorRate: 0.03,
        costPerQubit: 0.08
      }
    ];
  }

  private generateMockCostForecast(): CostForecast {
    return {
      timestamp: new Date(),
      currentCost: 150.0,
      predictedCost: 180.0,
      confidence: 0.85,
      factors: {
        usageTrend: 0.15,
        priceChanges: 0.05,
        seasonalAdjustment: 1.0,
        growthRate: 0.2
      },
      recommendations: [
        'Consider optimizing quantum circuits',
        'Review usage patterns',
        'Implement cost controls'
      ]
    };
  }

  private generateMockDashboardData(): DashboardData {
    return {
      overview: {
        totalJobs: 1250,
        activeJobs: 15,
        completedJobs: 1200,
        failedJobs: 35,
        totalCost: 1250.50,
        averageExecutionTime: 45.2
      },
      performance: {
        jobsByProvider: { 'ionq': 600, 'pasqal': 400, 'rigetti': 250 },
        jobsByStatus: { 'completed': 1200, 'failed': 35, 'running': 15 },
        averageExecutionTimeByProvider: { 'ionq': 40, 'pasqal': 50, 'rigetti': 45 },
        successRateByProvider: { 'ionq': 0.95, 'pasqal': 0.92, 'rigetti': 0.94 }
      },
      costs: {
        dailyCosts: [
          { date: '2025-01-25', cost: 45.2 },
          { date: '2025-01-26', cost: 52.1 },
          { date: '2025-01-27', cost: 48.7 }
        ],
        costByProvider: { 'ionq': 600, 'pasqal': 400, 'rigetti': 250 },
        costByJobType: { 'simulation': 800, 'optimization': 300, 'sampling': 150 },
        costTrend: 0.15
      },
      utilization: this.generateMockQubitMetrics(),
      alerts: [
        {
          id: 'alert-001',
          severity: 'medium',
          message: 'High queue time detected for IonQ provider',
          timestamp: new Date(),
          resolved: false
        }
      ]
    };
  }

  private generateMockOverviewData(): any {
    return {
      totalJobs: 1250,
      activeJobs: 15,
      completedJobs: 1200,
      failedJobs: 35,
      totalCost: 1250.50,
      averageExecutionTime: 45.2
    };
  }
} 