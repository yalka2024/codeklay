// CodePal Agentic AI System - Main Export File

// Core exports
export { BaseAgent } from './core/BaseAgent';

// Agent implementations
export { CodebaseManagementAgent } from './agents/CodebaseManagementAgent';
export { CollaborationCoordinatorAgent } from './agents/CollaborationCoordinatorAgent';
export { MarketplaceOptimizationAgent } from './agents/MarketplaceOptimizationAgent';
export { VRWorkflowAgent } from './agents/VRWorkflowAgent';
export { QuantumWorkflowAgent } from './agents/QuantumWorkflowAgent';
export { CrossPlatformOptimizationAgent } from './agents/CrossPlatformOptimizationAgent';
export { MetaAgent } from './agents/MetaAgent';

// Types
export * from './types';

// Agent factory for easy instantiation
export class AgentFactory {
  static createCodebaseManagementAgent(config: any, redisClient?: any) {
    return new CodebaseManagementAgent(config, redisClient);
  }

  static createCollaborationCoordinatorAgent(config: any, redisClient?: any) {
    return new CollaborationCoordinatorAgent(config, redisClient);
  }

  static createMarketplaceOptimizationAgent(config: any, prismaClient: any, deepseekApiKey: string) {
    return new MarketplaceOptimizationAgent(config, prismaClient, deepseekApiKey);
  }

  static createVRWorkflowAgent(config: any, scene: any, deepseekApiKey: string) {
    return new VRWorkflowAgent(config, scene, deepseekApiKey);
  }

  static createQuantumWorkflowAgent(config: any, qiskitApiKey: string, deepseekApiKey: string) {
    return new QuantumWorkflowAgent(config, qiskitApiKey, deepseekApiKey);
  }

  static createCrossPlatformOptimizationAgent(config: any) {
    return new CrossPlatformOptimizationAgent(config);
  }
  static createMetaAgent(config: any) {
    return new MetaAgent(config);
  }
}

// Agent manager for orchestrating multiple agents
export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map();

  async registerAgent(agent: BaseAgent): Promise<void> {
    this.agents.set(agent.getConfig().id, agent);
    await agent.initialize();
  }

  async unregisterAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      await agent.shutdown();
      this.agents.delete(agentId);
    }
  }

  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  async shutdownAll(): Promise<void> {
    const shutdownPromises = Array.from(this.agents.values()).map(agent => agent.shutdown());
    await Promise.all(shutdownPromises);
    this.agents.clear();
  }
} 