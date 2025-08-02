declare module '@codepal/ai-agents' {
  export class AgentFactory {
    static createAgent(type: string, config?: any): any;
    static createCrossPlatformOptimizationAgent(config?: any): CrossPlatformOptimizationAgent;
    static createMetaAgent(config?: any): MetaAgent;
    static createMarketplaceOptimizationAgent(config?: any): MarketplaceOptimizationAgent;
    static createQuantumWorkflowAgent(config?: any): QuantumWorkflowAgent;
    static createVRWorkflowAgent(config?: any): VRWorkflowAgent;
  }

  export class CrossPlatformOptimizationAgent {
    constructor(config?: any);
    optimize(code: string, platform: string): Promise<any>;
    getMetrics(): Promise<any>;
  }

  export class MetaAgent {
    constructor(config?: any);
    analyze(code: string): Promise<any>;
    getMetrics(): Promise<any>;
  }

  export class MarketplaceOptimizationAgent {
    constructor(config?: any);
    start(): Promise<void>;
    optimize(code: string): Promise<any>;
    getMetrics(): Promise<any>;
    predictSnippetDemand(snippetId: string): Promise<any>;
    flagLowQuality(snippet: any): Promise<any>;
    recommendSnippets(userId: string, limit: number): Promise<any>;
    getMarketplaceMetrics(): Promise<any>;
    optimizePricing(): Promise<void>;
    flagLowQualitySnippets(): Promise<void>;
  }

  export class QuantumWorkflowAgent {
    constructor(config?: any);
    start(): Promise<void>;
    process(code: string): Promise<any>;
    getMetrics(): Promise<any>;
    predictQuantumPerformance(code: string): Promise<any>;
    optimizeQuantumCode(code: string): Promise<any>;
    createQuantumAlgorithm(algorithmData: any): Promise<any>;
    getAlgorithm(algorithmId: string): Promise<any>;
    listAlgorithms(filter?: any): Promise<any>;
    runQuantumSimulation(algorithmId: string, parameters: any): Promise<any>;
    getSimulation(simulationId: string): Promise<any>;
    listSimulations(filter?: any): Promise<any>;
    getOptimization(optimizationId: string): Promise<any>;
    optimizeQuantumCircuits(): Promise<void>;
    getQuantumMetrics(): Promise<any>;
  }

  export class VRWorkflowAgent {
    constructor(config?: any);
    start(): Promise<void>;
    process(code: string): Promise<any>;
    getMetrics(): Promise<any>;
    predictVRIssues(code: string): Promise<any>;
    applyFix(nodeId: string, fix: any): Promise<any>;
    createVRNode(nodeData: any): Promise<any>;
    updateVRNode(nodeId: string, updates: any): Promise<any>;
    createVRWorkflow(workflowData: any): Promise<any>;
    optimizeVRPerformance(): Promise<void>;
    getVRMetrics(): Promise<any>;
  }
} 