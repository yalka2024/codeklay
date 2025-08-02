// Comprehensive tests for CodePal Agentic AI System

import { BaseAgent, CodebaseManagementAgent, CollaborationCoordinatorAgent, AgentManager, AgentFactory } from '../index';
import { AgentConfig, AgentType, AgentAction, AgentResponse } from '../types';

// Mock dependencies
jest.mock('redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    lpush: jest.fn().mockResolvedValue(1),
    ltrim: jest.fn().mockResolvedValue('OK'),
  })),
}));

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    repos: {
      get: jest.fn().mockResolvedValue({ data: { default_branch: 'main' } }),
      listCommits: jest.fn().mockResolvedValue({ data: [] }),
    },
    git: {
      getTree: jest.fn().mockResolvedValue({ data: { tree: [] } }),
      getBlob: jest.fn().mockResolvedValue({ data: { content: Buffer.from('test code').toString('base64') } }),
      getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'test-sha' } } }),
      createRef: jest.fn().mockResolvedValue({ data: {} }),
    },
    pulls: {
      create: jest.fn().mockResolvedValue({ data: { id: 1, title: 'Test PR', state: 'open' } }),
    },
  })),
}));

jest.mock('ethers', () => ({
  JsonRpcProvider: jest.fn().mockImplementation(() => ({
    getNetwork: jest.fn().mockResolvedValue({ name: 'testnet', chainId: 1 }),
  })),
  Wallet: jest.fn().mockImplementation(() => ({
    provider: {},
  })),
  Contract: jest.fn().mockImplementation(() => ({
    name: jest.fn().mockResolvedValue('TestContract'),
    distributeReward: jest.fn().mockResolvedValue({
      wait: jest.fn().mockResolvedValue({ hash: 'test-hash' }),
    }),
    emit: jest.fn().mockResolvedValue({}),
  })),
  parseEther: jest.fn().mockReturnValue('1000000000000000000'),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: 'user-1', name: 'Test User' }),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    },
    task: {
      findUnique: jest.fn().mockResolvedValue({ id: 'task-1', title: 'Test Task' }),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    userSkill: {
      deleteMany: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
    },
    collaborationSession: {
      findUnique: jest.fn().mockResolvedValue({ id: 'session-1' }),
      update: jest.fn().mockResolvedValue({}),
    },
    $disconnect: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({
    status: 200,
    data: {
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                type: 'bug',
                severity: 'medium',
                description: 'Test issue',
                lineNumber: 1,
                code: 'test code',
                suggestedFix: 'fix code',
                confidence: 0.8,
              },
            ]),
          },
        },
      ],
    },
  }),
}));

describe('BaseAgent', () => {
  let mockAgent: BaseAgent;

  beforeEach(() => {
    // Create a concrete implementation of BaseAgent for testing
    class TestAgent extends BaseAgent {
      protected async validateConfig(): Promise<void> {}
      protected async setupConnections(): Promise<void> {}
      protected async loadState(): Promise<void> {}
      protected async saveState(): Promise<void> {}
      protected async cleanupConnections(): Promise<void> {}
      protected async performAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<any> {
        return { success: true, data: 'test result' };
      }
      protected calculateConfidence(result: any): number {
        return 0.8;
      }
    }

    mockAgent = new TestAgent('test-agent' as AgentType, 'Test Agent', { test: 'config' });
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const result = await mockAgent.initialize();
      expect(result.success).toBe(true);
      expect(mockAgent.isAgentRunning()).toBe(true);
    });

    it('should handle initialization errors', async () => {
      jest.spyOn(mockAgent as any, 'validateConfig').mockRejectedValue(new Error('Config error'));
      const result = await mockAgent.initialize();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Config error');
    });
  });

  describe('shutdown', () => {
    it('should shutdown successfully', async () => {
      await mockAgent.initialize();
      const result = await mockAgent.shutdown();
      expect(result.success).toBe(true);
      expect(mockAgent.isAgentRunning()).toBe(false);
    });
  });

  describe('action execution', () => {
    beforeEach(async () => {
      await mockAgent.initialize();
    });

    it('should execute actions successfully', async () => {
      const result = await mockAgent.executeAction({
        type: 'test-action',
        payload: { test: 'data' },
        status: 'pending',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe('test result');
      expect(result.metadata.confidence).toBe(0.8);
    });

    it('should reject actions when not running', async () => {
      await mockAgent.shutdown();
      const result = await mockAgent.executeAction({
        type: 'test-action',
        payload: { test: 'data' },
        status: 'pending',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Agent is not running');
    });

    it('should handle action execution errors', async () => {
      jest.spyOn(mockAgent as any, 'performAction').mockRejectedValue(new Error('Action error'));
      const result = await mockAgent.executeAction({
        type: 'test-action',
        payload: { test: 'data' },
        status: 'pending',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Action error');
    });
  });

  describe('permissions', () => {
    it('should manage permissions correctly', () => {
      expect(mockAgent.hasPermission('test-permission')).toBe(false);
      
      mockAgent.addPermission('test-permission');
      expect(mockAgent.hasPermission('test-permission')).toBe(true);
      
      mockAgent.removePermission('test-permission');
      expect(mockAgent.hasPermission('test-permission')).toBe(false);
    });

    it('should allow all actions with wildcard permission', () => {
      mockAgent.addPermission('*');
      expect(mockAgent.hasPermission('any-action')).toBe(true);
    });
  });

  describe('configuration', () => {
    it('should get configuration', () => {
      const config = mockAgent.getConfig();
      expect(config.name).toBe('Test Agent');
      expect(config.type).toBe('test-agent');
    });

    it('should update configuration', async () => {
      const result = await mockAgent.updateConfig({ name: 'Updated Agent' });
      expect(result.success).toBe(true);
      expect(mockAgent.getConfig().name).toBe('Updated Agent');
    });
  });

  describe('metrics', () => {
    it('should get metrics', () => {
      const metrics = mockAgent.getMetrics();
      expect(metrics.agentId).toBe(mockAgent.getConfig().id);
      expect(metrics.actionsExecuted).toBe(0);
    });

    it('should update metrics after action execution', async () => {
      await mockAgent.initialize();
      await mockAgent.executeAction({
        type: 'test-action',
        payload: {},
        status: 'pending',
      });

      const metrics = mockAgent.getMetrics();
      expect(metrics.actionsExecuted).toBe(1);
      expect(metrics.successRate).toBe(1);
    });
  });
});

describe('CodebaseManagementAgent', () => {
  let agent: CodebaseManagementAgent;
  const config = {
    github: {
      token: 'test-token',
      owner: 'test-owner',
      repo: 'test-repo',
      baseBranch: 'main',
    },
    deepseek: {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.deepseek.com',
    },
    monitoringInterval: 30,
    autoCreatePRs: false,
    requireApproval: true,
    testBeforePR: true,
  };

  beforeEach(() => {
    agent = new CodebaseManagementAgent(config);
  });

  describe('initialization', () => {
    it('should validate configuration', async () => {
      const invalidAgent = new CodebaseManagementAgent({} as any);
      await expect(invalidAgent.initialize()).rejects.toThrow('GitHub token is required');
    });

    it('should setup connections', async () => {
      const result = await agent.initialize();
      expect(result.success).toBe(true);
    });
  });

  describe('repository monitoring', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should monitor repository', async () => {
      const result = await agent.monitorRepository();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should detect issues', async () => {
      const result = await agent.detectIssues();
      expect(result.success).toBe(true);
    });
  });

  describe('fix generation', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should generate fixes', async () => {
      const result = await agent.generateFix('test-issue-id');
      expect(result.success).toBe(true);
    });
  });

  describe('pull request creation', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should create pull requests', async () => {
      const result = await agent.createPullRequest('test-issue-id');
      expect(result.success).toBe(true);
    });
  });

  describe('testing', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should run tests', async () => {
      const result = await agent.runTests([{ file: 'test.ts', content: 'test', type: 'update' }]);
      expect(result.success).toBe(true);
      expect(result.data.success).toBe(true);
    });
  });

  describe('monitoring control', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should start monitoring', async () => {
      const result = await agent.startMonitoring();
      expect(result.success).toBe(true);
    });

    it('should stop monitoring', async () => {
      await agent.startMonitoring();
      const result = await agent.stopMonitoring();
      expect(result.success).toBe(true);
    });
  });
});

describe('CollaborationCoordinatorAgent', () => {
  let agent: CollaborationCoordinatorAgent;
  const config = {
    blockchain: {
      providerUrl: 'https://testnet.infura.io/v3/test',
      contractAddress: '0x1234567890123456789012345678901234567890',
      privateKey: 'test-private-key',
      chainId: 1,
    },
    deepseek: {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.deepseek.com',
    },
    autoAssignment: true,
    skillMatchingThreshold: 0.7,
    rewardMultiplier: 1.0,
    maxTasksPerUser: 3,
  };

  beforeEach(() => {
    agent = new CollaborationCoordinatorAgent(config);
  });

  describe('initialization', () => {
    it('should validate configuration', async () => {
      const invalidAgent = new CollaborationCoordinatorAgent({} as any);
      await expect(invalidAgent.initialize()).rejects.toThrow('Blockchain provider URL is required');
    });

    it('should setup connections', async () => {
      const result = await agent.initialize();
      expect(result.success).toBe(true);
    });
  });

  describe('task assignment', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should assign tasks', async () => {
      const result = await agent.assignTask('test-task-id');
      expect(result.success).toBe(true);
    });

    it('should handle task assignment errors', async () => {
      jest.spyOn(agent as any, 'getTask').mockResolvedValue(null);
      const result = await agent.assignTask('non-existent-task');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Task not found: non-existent-task');
    });
  });

  describe('reward management', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should manage rewards', async () => {
      const result = await agent.manageRewards('test-task-id', 'test-user-id');
      expect(result.success).toBe(true);
    });

    it('should calculate rewards', async () => {
      const result = await agent.calculateRewards('test-task-id');
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('number');
    });
  });

  describe('session coordination', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should coordinate sessions', async () => {
      const result = await agent.coordinateSession('test-session-id');
      expect(result.success).toBe(true);
    });
  });

  describe('skill analysis', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should analyze user skills', async () => {
      const result = await agent.analyzeUserSkills('test-user-id');
      expect(result.success).toBe(true);
    });
  });

  describe('workflow optimization', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should optimize workflows', async () => {
      const result = await agent.optimizeWorkflow('test-session-id');
      expect(result.success).toBe(true);
    });
  });

  describe('auto assignment', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should auto assign tasks', async () => {
      const result = await agent.autoAssignTasks();
      expect(result.success).toBe(true);
    });
  });
});

describe('AgentManager', () => {
  let manager: AgentManager;
  let mockAgent: BaseAgent;

  beforeEach(() => {
    manager = new AgentManager();
    
    // Create a mock agent
    class TestAgent extends BaseAgent {
      protected async validateConfig(): Promise<void> {}
      protected async setupConnections(): Promise<void> {}
      protected async loadState(): Promise<void> {}
      protected async saveState(): Promise<void> {}
      protected async cleanupConnections(): Promise<void> {}
      protected async performAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<any> {
        return { success: true };
      }
      protected calculateConfidence(result: any): number {
        return 0.8;
      }
    }

    mockAgent = new TestAgent('test-agent' as AgentType, 'Test Agent');
  });

  describe('agent registration', () => {
    it('should register agents', async () => {
      await manager.registerAgent(mockAgent);
      expect(manager.getAllAgents()).toHaveLength(1);
      expect(manager.getAgent(mockAgent.getConfig().id)).toBe(mockAgent);
    });

    it('should unregister agents', async () => {
      await manager.registerAgent(mockAgent);
      await manager.unregisterAgent(mockAgent.getConfig().id);
      expect(manager.getAllAgents()).toHaveLength(0);
      expect(manager.getAgent(mockAgent.getConfig().id)).toBeUndefined();
    });
  });

  describe('agent management', () => {
    beforeEach(async () => {
      await manager.registerAgent(mockAgent);
    });

    it('should get all agents', () => {
      const agents = manager.getAllAgents();
      expect(agents).toHaveLength(1);
      expect(agents[0]).toBe(mockAgent);
    });

    it('should get specific agent', () => {
      const agent = manager.getAgent(mockAgent.getConfig().id);
      expect(agent).toBe(mockAgent);
    });

    it('should shutdown all agents', async () => {
      await manager.shutdownAll();
      expect(manager.getAllAgents()).toHaveLength(0);
    });
  });
});

describe('AgentFactory', () => {
  it('should create codebase management agent', () => {
    const config = {
      github: { token: 'test', owner: 'test', repo: 'test' },
      deepseek: { apiKey: 'test', baseUrl: 'test' },
    };
    const agent = AgentFactory.createCodebaseManagementAgent(config);
    expect(agent).toBeInstanceOf(CodebaseManagementAgent);
  });

  it('should create collaboration coordinator agent', () => {
    const config = {
      blockchain: { providerUrl: 'test', contractAddress: 'test', privateKey: 'test' },
      deepseek: { apiKey: 'test', baseUrl: 'test' },
    };
    const agent = AgentFactory.createCollaborationCoordinatorAgent(config);
    expect(agent).toBeInstanceOf(CollaborationCoordinatorAgent);
  });
});

describe('Integration Tests', () => {
  let manager: AgentManager;
  let codebaseAgent: CodebaseManagementAgent;
  let collaborationAgent: CollaborationCoordinatorAgent;

  beforeEach(async () => {
    manager = new AgentManager();
    
    const codebaseConfig = {
      github: { token: 'test', owner: 'test', repo: 'test' },
      deepseek: { apiKey: 'test', baseUrl: 'test' },
    };
    
    const collaborationConfig = {
      blockchain: { providerUrl: 'test', contractAddress: 'test', privateKey: 'test' },
      deepseek: { apiKey: 'test', baseUrl: 'test' },
    };

    codebaseAgent = new CodebaseManagementAgent(codebaseConfig);
    collaborationAgent = new CollaborationCoordinatorAgent(collaborationConfig);
  });

  it('should manage multiple agents', async () => {
    await manager.registerAgent(codebaseAgent);
    await manager.registerAgent(collaborationAgent);

    expect(manager.getAllAgents()).toHaveLength(2);
    expect(manager.getAllAgents().map(a => a.getConfig().type)).toContain('codebase-management');
    expect(manager.getAllAgents().map(a => a.getConfig().type)).toContain('collaboration-coordinator');
  });

  it('should handle agent lifecycle', async () => {
    await manager.registerAgent(codebaseAgent);
    expect(codebaseAgent.isAgentRunning()).toBe(true);

    await manager.unregisterAgent(codebaseAgent.getConfig().id);
    expect(manager.getAllAgents()).toHaveLength(0);
  });
}); 