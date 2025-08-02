import { BaseAgent, AgentConfig, AgentAction, AgentResponse, AgentMetrics } from '../core/BaseAgent';
import { PrismaClient } from '@prisma/client';
import { DeepSeekClient } from '@codepal/ai-agents';
import { CodeSnippet, MarketplaceMetrics, PricingOptimization } from '../types';

export class MarketplaceOptimizationAgent extends BaseAgent {
  private prisma: PrismaClient;
  private deepseek: DeepSeekClient;

  constructor(config: AgentConfig, prisma: PrismaClient, deepseekApiKey: string) {
    super(config);
    this.prisma = prisma;
    this.deepseek = new DeepSeekClient(deepseekApiKey);
  }

  async start(): Promise<void> {
    await super.start();
    this.logger.info('Marketplace Optimization Agent started');
    
    // Start monitoring marketplace metrics
    this.scheduleTask('monitor-marketplace', '*/5 * * * *', () => this.monitorMarketplaceMetrics());
    this.scheduleTask('optimize-pricing', '0 */6 * * *', () => this.optimizePricing());
    this.scheduleTask('flag-low-quality', '*/15 * * * *', () => this.flagLowQualitySnippets());
  }

  async stop(): Promise<void> {
    await super.stop();
    this.logger.info('Marketplace Optimization Agent stopped');
  }

  async predictSnippetDemand(snippetId: string): Promise<{ popularity: number; optimalPrice: number }> {
    try {
      const usage = await this.prisma.snippetUsage.findMany({
        where: { snippetId },
        include: {
          snippet: true,
          user: true
        }
      });

      const trends = await this.deepseek.analyzeTrends(usage);
      const optimalPrice = Math.max(0.01, trends.popularity * 0.1);

      await this.prisma.codeSnippet.update({
        where: { id: snippetId },
        data: { 
          price: optimalPrice,
          lastOptimized: new Date()
        }
      });

      this.recordMetrics('demand_prediction', { snippetId, popularity: trends.popularity, optimalPrice });
      
      return { popularity: trends.popularity, optimalPrice };
    } catch (error) {
      this.logger.error('Error predicting snippet demand:', error);
      throw error;
    }
  }

  async flagLowQuality(snippet: CodeSnippet): Promise<boolean> {
    try {
      const quality = await this.deepseek.analyzeQuality(snippet.code);
      
      if (quality.score < 50) {
        await this.prisma.codeSnippet.update({
          where: { id: snippet.id },
          data: { 
            status: 'flagged',
            flaggedAt: new Date(),
            flagReason: quality.reason
          }
        });

        this.recordMetrics('quality_flag', { snippetId: snippet.id, qualityScore: quality.score });
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error('Error flagging low quality snippet:', error);
      throw error;
    }
  }

  async recommendSnippets(userId: string, limit: number = 10): Promise<CodeSnippet[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          snippetUsage: {
            include: {
              snippet: true
            }
          }
        }
      });

      const recommendations = await this.deepseek.recommendSnippets(user.profile);
      
      const snippets = await this.prisma.codeSnippet.findMany({
        where: { 
          id: { in: recommendations.slice(0, limit) },
          status: 'active'
        },
        include: {
          author: true,
          tags: true
        }
      });

      this.recordMetrics('recommendations_generated', { userId, count: snippets.length });
      
      return snippets;
    } catch (error) {
      this.logger.error('Error recommending snippets:', error);
      throw error;
    }
  }

  async optimizePricing(): Promise<void> {
    try {
      const activeSnippets = await this.prisma.codeSnippet.findMany({
        where: { status: 'active' },
        include: {
          snippetUsage: true
        }
      });

      for (const snippet of activeSnippets) {
        await this.predictSnippetDemand(snippet.id);
      }

      this.logger.info(`Optimized pricing for ${activeSnippets.length} snippets`);
    } catch (error) {
      this.logger.error('Error optimizing pricing:', error);
    }
  }

  async flagLowQualitySnippets(): Promise<void> {
    try {
      const recentSnippets = await this.prisma.codeSnippet.findMany({
        where: { 
          status: 'active',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      let flaggedCount = 0;
      for (const snippet of recentSnippets) {
        const flagged = await this.flagLowQuality(snippet);
        if (flagged) flaggedCount++;
      }

      this.logger.info(`Flagged ${flaggedCount} low-quality snippets`);
    } catch (error) {
      this.logger.error('Error flagging low quality snippets:', error);
    }
  }

  async monitorMarketplaceMetrics(): Promise<void> {
    try {
      const metrics = await this.getMarketplaceMetrics();
      this.recordMetrics('marketplace_metrics', metrics);
      
      // Alert if metrics are concerning
      if (metrics.avgQualityScore < 60) {
        await this.sendNotification('marketplace_quality_alert', {
          message: 'Marketplace quality score is below threshold',
          metrics
        });
      }
    } catch (error) {
      this.logger.error('Error monitoring marketplace metrics:', error);
    }
  }

  async getMarketplaceMetrics(): Promise<MarketplaceMetrics> {
    const totalSnippets = await this.prisma.codeSnippet.count();
    const activeSnippets = await this.prisma.codeSnippet.count({ where: { status: 'active' } });
    const flaggedSnippets = await this.prisma.codeSnippet.count({ where: { status: 'flagged' } });
    
    const avgPrice = await this.prisma.codeSnippet.aggregate({
      _avg: { price: true }
    });

    const totalUsage = await this.prisma.snippetUsage.count();
    const recentUsage = await this.prisma.snippetUsage.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    return {
      totalSnippets,
      activeSnippets,
      flaggedSnippets,
      avgPrice: avgPrice._avg.price || 0,
      totalUsage,
      recentUsage,
      avgQualityScore: this.calculateQualityScore(activeSnippets, flaggedSnippets),
      timestamp: new Date()
    };
  }

  private calculateQualityScore(active: number, flagged: number): number {
    if (active === 0) return 0;
    return Math.max(0, 100 - (flagged / active) * 100);
  }

  async executeAction(action: AgentAction): Promise<AgentResponse> {
    switch (action.type) {
      case 'predict_demand':
        const { snippetId } = action.params;
        const result = await this.predictSnippetDemand(snippetId);
        return {
          success: true,
          data: result,
          timestamp: new Date()
        };

      case 'flag_quality':
        const { snippet } = action.params;
        const flagged = await this.flagLowQuality(snippet);
        return {
          success: true,
          data: { flagged },
          timestamp: new Date()
        };

      case 'recommend_snippets':
        const { userId, limit } = action.params;
        const recommendations = await this.recommendSnippets(userId, limit);
        return {
          success: true,
          data: recommendations,
          timestamp: new Date()
        };

      case 'get_metrics':
        const metrics = await this.getMarketplaceMetrics();
        return {
          success: true,
          data: metrics,
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
    const baseMetrics = await super.getMetrics();
    const marketplaceMetrics = await this.getMarketplaceMetrics();

    return {
      ...baseMetrics,
      custom: {
        marketplaceMetrics,
        demandPredictions: this.getMetricCount('demand_prediction'),
        qualityFlags: this.getMetricCount('quality_flag'),
        recommendationsGenerated: this.getMetricCount('recommendations_generated')
      }
    };
  }
} 