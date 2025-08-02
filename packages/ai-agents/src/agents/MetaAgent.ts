import { BaseAgent, AgentConfig, AgentAction, AgentResponse, AgentMetrics } from '../core/BaseAgent';
import { QuantumWorkflowAgent } from './QuantumWorkflowAgent';
import { CodebaseManagementAgent } from './CodebaseManagementAgent';
import { CollaborationCoordinatorAgent } from './CollaborationCoordinatorAgent';
import { VRWorkflowAgent } from './VRWorkflowAgent';
import { MarketplaceOptimizationAgent } from './MarketplaceOptimizationAgent';
import { CrossPlatformOptimizationAgent } from './CrossPlatformOptimizationAgent';

interface AgentPrediction {
  agentId: string;
  agentType: string;
  prediction: any;
  confidence: number;
  timestamp: Date;
}

interface AggregatedDecision {
  decision: string;
  rationale: string;
  confidence: number;
  agentContributions: AgentPrediction[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
}

/**
 * MetaAgent
 * Integrates predictions from all agents (code, collaboration, marketplace, VR, quantum, etc.)
 * for holistic, system-wide decision-making and optimization.
 */
export class MetaAgent extends BaseAgent {
  private quantumAgent?: QuantumWorkflowAgent;
  private codebaseAgent?: CodebaseManagementAgent;
  private collaborationAgent?: CollaborationCoordinatorAgent;
  private vrAgent?: VRWorkflowAgent;
  private marketplaceAgent?: MarketplaceOptimizationAgent;
  private crossPlatformAgent?: CrossPlatformOptimizationAgent;
  
  private decisionHistory: AggregatedDecision[] = [];
  private agentRegistry: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    super(config);
  }

  /**
   * Register other agents for coordination
   */
  public registerAgent(agentId: string, agent: any): void {
    this.agentRegistry.set(agentId, agent);
    this.logger.info(`Registered agent: ${agentId}`);
  }

  /**
   * Set specific agent references for direct integration
   */
  public setQuantumAgent(agent: QuantumWorkflowAgent): void {
    this.quantumAgent = agent;
    this.registerAgent('quantum', agent);
  }

  public setCodebaseAgent(agent: CodebaseManagementAgent): void {
    this.codebaseAgent = agent;
    this.registerAgent('codebase', agent);
  }

  public setCollaborationAgent(agent: CollaborationCoordinatorAgent): void {
    this.collaborationAgent = agent;
    this.registerAgent('collaboration', agent);
  }

  public setVRAgent(agent: VRWorkflowAgent): void {
    this.vrAgent = agent;
    this.registerAgent('vr', agent);
  }

  public setMarketplaceAgent(agent: MarketplaceOptimizationAgent): void {
    this.marketplaceAgent = agent;
    this.registerAgent('marketplace', agent);
  }

  public setCrossPlatformAgent(agent: CrossPlatformOptimizationAgent): void {
    this.crossPlatformAgent = agent;
    this.registerAgent('cross-platform', agent);
  }

  /**
   * Aggregates predictions from all agents and produces a holistic recommendation.
   */
  async aggregatePredictions(predictions: Record<string, any>): Promise<AggregatedDecision> {
    try {
      const agentPredictions: AgentPrediction[] = [];
      let totalConfidence = 0;
      let predictionCount = 0;

      // Collect predictions from all registered agents
      for (const [agentId, agent] of this.agentRegistry) {
        try {
          let prediction: any = null;
          let confidence = 0;

          // Get prediction based on agent type
          switch (agentId) {
            case 'quantum':
              if (this.quantumAgent && predictions.quantumCode) {
                const quantumResult = await this.quantumAgent.predictQuantumPerformance(predictions.quantumCode);
                prediction = quantumResult;
                confidence = quantumResult.predictedPerformance || 0;
              }
              break;

            case 'codebase':
              if (this.codebaseAgent && predictions.codebaseIssues) {
                const codebaseResult = await this.codebaseAgent.detectIssues(predictions.codebaseIssues);
                prediction = codebaseResult;
                confidence = codebaseResult.confidence || 0;
              }
              break;

            case 'collaboration':
              if (this.collaborationAgent && predictions.collaborationTask) {
                const collaborationResult = await this.collaborationAgent.assignTask(predictions.collaborationTask);
                prediction = collaborationResult;
                confidence = collaborationResult.confidence || 0;
              }
              break;

            case 'vr':
              if (this.vrAgent && predictions.vrCode) {
                const vrResult = await this.vrAgent.predictVRIssues(predictions.vrCode);
                prediction = vrResult;
                confidence = vrResult.confidence || 0;
              }
              break;

            case 'marketplace':
              if (this.marketplaceAgent && predictions.marketplaceSnippet) {
                const marketplaceResult = await this.marketplaceAgent.predictDemand(predictions.marketplaceSnippet);
                prediction = marketplaceResult;
                confidence = marketplaceResult.confidence || 0;
              }
              break;

            case 'cross-platform':
              if (this.crossPlatformAgent && predictions.platformCode) {
                const platformResult = await this.crossPlatformAgent.predictPerformance(
                  predictions.platformCode, 
                  predictions.platform
                );
                prediction = platformResult;
                confidence = platformResult.predictedScore || 0;
              }
              break;

            default:
              // Handle generic agent predictions
              if (predictions[agentId]) {
                prediction = predictions[agentId];
                confidence = prediction.confidence || 0;
              }
          }

          if (prediction) {
            agentPredictions.push({
              agentId,
              agentType: agentId,
              prediction,
              confidence,
              timestamp: new Date()
            });
            totalConfidence += confidence;
            predictionCount++;
          }
        } catch (error) {
          this.logger.error(`Error getting prediction from agent ${agentId}:`, error);
        }
      }

      // Calculate aggregated decision
      const averageConfidence = predictionCount > 0 ? totalConfidence / predictionCount : 0;
      const decision = this.generateHolisticDecision(agentPredictions, averageConfidence);
      const rationale = this.generateRationale(agentPredictions);
      const priority = this.calculatePriority(agentPredictions);
      const recommendedActions = this.generateRecommendedActions(agentPredictions);

      const aggregatedDecision: AggregatedDecision = {
        decision,
        rationale,
        confidence: averageConfidence,
        agentContributions: agentPredictions,
        priority,
        recommendedActions
      };

      // Store decision in history
      this.decisionHistory.push(aggregatedDecision);
      this.recordMetrics('meta_decision_made', { 
        decisionId: aggregatedDecision.decision,
        confidence: averageConfidence,
        agentCount: predictionCount 
      });

      return aggregatedDecision;
    } catch (error) {
      this.logger.error('Error aggregating predictions:', error);
      throw error;
    }
  }

  /**
   * Generate holistic decision based on all agent predictions
   */
  private generateHolisticDecision(predictions: AgentPrediction[], confidence: number): string {
    // Analyze predictions to determine the best course of action
    const criticalIssues = predictions.filter(p => p.prediction?.severity === 'critical');
    const highPriorityIssues = predictions.filter(p => p.prediction?.severity === 'high');
    const performanceIssues = predictions.filter(p => p.prediction?.type === 'performance');
    const securityIssues = predictions.filter(p => p.prediction?.type === 'security');

    if (criticalIssues.length > 0) {
      return 'immediate-action-required';
    } else if (highPriorityIssues.length > 0) {
      return 'high-priority-optimization';
    } else if (performanceIssues.length > 0) {
      return 'performance-optimization';
    } else if (securityIssues.length > 0) {
      return 'security-enhancement';
    } else if (confidence > 80) {
      return 'proceed-with-current-approach';
    } else {
      return 'monitor-and-optimize';
    }
  }

  /**
   * Generate rationale for the decision
   */
  private generateRationale(predictions: AgentPrediction[]): string {
    const issues = predictions.filter(p => p.prediction?.issues?.length > 0);
    const optimizations = predictions.filter(p => p.prediction?.optimizations?.length > 0);
    
    let rationale = `Based on analysis from ${predictions.length} agents: `;
    
    if (issues.length > 0) {
      rationale += `${issues.length} agents identified issues requiring attention. `;
    }
    
    if (optimizations.length > 0) {
      rationale += `${optimizations.length} agents suggested optimizations. `;
    }
    
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    rationale += `Overall confidence: ${avgConfidence.toFixed(1)}%.`;
    
    return rationale;
  }

  /**
   * Calculate priority based on agent predictions
   */
  private calculatePriority(predictions: AgentPrediction[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalCount = predictions.filter(p => p.prediction?.severity === 'critical').length;
    const highCount = predictions.filter(p => p.prediction?.severity === 'high').length;
    
    if (criticalCount > 0) return 'critical';
    if (highCount > 0) return 'high';
    if (predictions.length > 3) return 'medium';
    return 'low';
  }

  /**
   * Generate recommended actions based on agent predictions
   */
  private generateRecommendedActions(predictions: AgentPrediction[]): string[] {
    const actions: string[] = [];
    
    for (const prediction of predictions) {
      if (prediction.prediction?.recommendations) {
        actions.push(...prediction.prediction.recommendations);
      }
      
      if (prediction.prediction?.suggestedActions) {
        actions.push(...prediction.prediction.suggestedActions);
      }
    }
    
    // Remove duplicates and limit to top 5
    return [...new Set(actions)].slice(0, 5);
  }

  /**
   * Coordinate system-wide optimization
   */
  async coordinateSystemOptimization(): Promise<AggregatedDecision> {
    const predictions: Record<string, any> = {};
    
    // Collect current system state from all agents
    if (this.codebaseAgent) {
      predictions.codebaseIssues = await this.codebaseAgent.getCurrentIssues();
    }
    
    if (this.quantumAgent) {
      predictions.quantumCode = await this.quantumAgent.getActiveAlgorithms();
    }
    
    if (this.vrAgent) {
      predictions.vrCode = await this.vrAgent.getCurrentWorkflow();
    }
    
    if (this.marketplaceAgent) {
      predictions.marketplaceSnippet = await this.marketplaceAgent.getTrendingSnippets();
    }
    
    if (this.crossPlatformAgent) {
      predictions.platformCode = await this.crossPlatformAgent.getCurrentOptimizations();
    }
    
    return await this.aggregatePredictions(predictions);
  }

  /**
   * Get decision history
   */
  getDecisionHistory(): AggregatedDecision[] {
    return this.decisionHistory;
  }

  /**
   * Get agent performance metrics
   */
  async getAgentPerformanceMetrics(): Promise<any> {
    const metrics: any = {};
    
    for (const [agentId, agent] of this.agentRegistry) {
      try {
        const agentMetrics = await agent.getMetrics();
        metrics[agentId] = agentMetrics;
      } catch (error) {
        this.logger.error(`Error getting metrics for agent ${agentId}:`, error);
      }
    }
    
    return metrics;
  }

  /**
   * Executes an agent action (for API integration).
   */
  async executeAction(action: AgentAction): Promise<AgentResponse> {
    switch (action.type) {
      case 'aggregate_predictions':
        const decision = await this.aggregatePredictions(action.params.predictions);
        return {
          success: true,
          data: decision,
          timestamp: new Date()
        };

      case 'coordinate_optimization':
        const optimization = await this.coordinateSystemOptimization();
        return {
          success: true,
          data: optimization,
          timestamp: new Date()
        };

      case 'get_decision_history':
        return {
          success: true,
          data: this.getDecisionHistory(),
          timestamp: new Date()
        };

      case 'get_agent_metrics':
        const metrics = await this.getAgentPerformanceMetrics();
        return {
          success: true,
          data: metrics,
          timestamp: new Date()
        };

      case 'register_agent':
        this.registerAgent(action.params.agentId, action.params.agent);
        return {
          success: true,
          data: { message: 'Agent registered successfully' },
          timestamp: new Date()
        };

      default:
        return { 
          success: false, 
          error: `Unknown action type: ${action.type}`, 
          timestamp: new Date() 
        };
    }
  }

  async getMetrics(): Promise<AgentMetrics> {
    const base = await super.getMetrics();
    return { 
      ...base, 
      custom: { 
        metaDecisions: this.decisionHistory.length,
        registeredAgents: this.agentRegistry.size,
        averageConfidence: this.decisionHistory.length > 0 
          ? this.decisionHistory.reduce((sum, d) => sum + d.confidence, 0) / this.decisionHistory.length 
          : 0
      } 
    };
  }
} 