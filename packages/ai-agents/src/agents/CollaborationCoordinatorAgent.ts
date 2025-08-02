// Collaboration Coordinator Agent for CodePal
// Assigns tasks in decentralized coding pods based on user skills and manages CPAL token rewards

import { BaseAgent } from '../core/BaseAgent';
import { 
  Task, 
  UserSkill, 
  CollaborationSession,
  AgentAction,
  AgentResponse 
} from '../types';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface BlockchainConfig {
  providerUrl: string;
  contractAddress: string;
  privateKey: string;
  chainId: number;
}

interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
}

interface CollaborationAgentConfig {
  blockchain: BlockchainConfig;
  deepseek: DeepSeekConfig;
  autoAssignment: boolean;
  skillMatchingThreshold: number;
  rewardMultiplier: number;
  maxTasksPerUser: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  skills: UserSkill[];
  reputation: number;
  totalRewards: number;
  activeTasks: number;
  availability: 'available' | 'busy' | 'unavailable';
}

interface TaskAssignment {
  taskId: string;
  userId: string;
  assignedAt: Date;
  estimatedCompletion: Date;
  confidence: number;
  reason: string;
}

export class CollaborationCoordinatorAgent extends BaseAgent {
  private prisma: PrismaClient;
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private deepseekApiKey: string;
  private deepseekBaseUrl: string;
  private autoAssignment: boolean;
  private skillMatchingThreshold: number;
  private rewardMultiplier: number;
  private maxTasksPerUser: number;

  constructor(config: CollaborationAgentConfig, redisClient?: any) {
    super('collaboration-coordinator', 'Collaboration Coordinator Agent', config, redisClient);
    
    this.prisma = new PrismaClient();
    this.provider = new ethers.JsonRpcProvider(config.blockchain.providerUrl);
    this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
    this.contract = new ethers.Contract(
      config.blockchain.contractAddress,
      this.getContractABI(),
      this.wallet
    );
    
    this.deepseekApiKey = config.deepseek.apiKey;
    this.deepseekBaseUrl = config.deepseek.baseUrl;
    this.autoAssignment = config.autoAssignment || true;
    this.skillMatchingThreshold = config.skillMatchingThreshold || 0.7;
    this.rewardMultiplier = config.rewardMultiplier || 1.0;
    this.maxTasksPerUser = config.maxTasksPerUser || 3;

    // Add default permissions
    this.addPermission('assign-task');
    this.addPermission('manage-rewards');
    this.addPermission('coordinate-session');
    this.addPermission('analyze-skills');
    this.addPermission('optimize-workflow');
  }

  protected async validateConfig(): Promise<void> {
    if (!this.config.config.blockchain?.providerUrl) {
      throw new Error('Blockchain provider URL is required');
    }
    if (!this.config.config.blockchain?.contractAddress) {
      throw new Error('Contract address is required');
    }
    if (!this.config.config.blockchain?.privateKey) {
      throw new Error('Private key is required');
    }
    if (!this.config.config.deepseek?.apiKey) {
      throw new Error('DeepSeek API key is required');
    }
  }

  protected async setupConnections(): Promise<void> {
    // Test blockchain connection
    try {
      const network = await this.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (${network.chainId})`);
    } catch (error) {
      throw new Error(`Failed to connect to blockchain: ${error}`);
    }

    // Test contract connection
    try {
      await this.contract.name();
    } catch (error) {
      throw new Error(`Failed to connect to contract: ${error}`);
    }

    // Test DeepSeek connection
    try {
      await this.testDeepSeekConnection();
    } catch (error) {
      throw new Error(`Failed to connect to DeepSeek: ${error}`);
    }
  }

  protected async loadState(): Promise<void> {
    await this.loadConfig();
    await this.loadMetrics();
  }

  protected async saveState(): Promise<void> {
    await this.saveConfig();
    await this.saveMetrics();
  }

  protected async cleanupConnections(): Promise<void> {
    await this.prisma.$disconnect();
  }

  protected async performAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<any> {
    switch (action.type) {
      case 'assign-task':
        return await this.assignTask(action.payload.taskId);
      
      case 'manage-rewards':
        return await this.manageRewards(action.payload.taskId, action.payload.userId);
      
      case 'coordinate-session':
        return await this.coordinateSession(action.payload.sessionId);
      
      case 'analyze-skills':
        return await this.analyzeUserSkills(action.payload.userId);
      
      case 'optimize-workflow':
        return await this.optimizeWorkflow(action.payload.sessionId);
      
      case 'auto-assign-tasks':
        return await this.autoAssignTasks();
      
      case 'calculate-rewards':
        return await this.calculateRewards(action.payload.taskId);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  protected calculateConfidence(result: any): number {
    if (!result) return 0;
    
    if (result.assignment && result.assignment.confidence) {
      return result.assignment.confidence;
    }
    
    if (result.rewards && result.rewards.amount > 0) {
      return 0.9;
    }
    
    if (result.session && result.session.status === 'active') {
      return 0.85;
    }
    
    return 0.7;
  }

  /**
   * Assign a task to the best available user
   */
  public async assignTask(taskId: string): Promise<AgentResponse<TaskAssignment>> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      const availableUsers = await this.getAvailableUsers();
      const bestMatch = await this.findBestUserMatch(task, availableUsers);
      
      if (!bestMatch) {
        throw new Error('No suitable user found for this task');
      }

      const assignment: TaskAssignment = {
        taskId,
        userId: bestMatch.user.id,
        assignedAt: new Date(),
        estimatedCompletion: this.calculateEstimatedCompletion(task, bestMatch),
        confidence: bestMatch.confidence,
        reason: bestMatch.reason,
      };

      // Update task in database
      await this.prisma.task.update({
        where: { id: taskId },
        data: {
          assignee: bestMatch.user.id,
          status: 'assigned',
        },
      });

      // Update user's active tasks count
      await this.prisma.user.update({
        where: { id: bestMatch.user.id },
        data: {
          activeTasks: {
            increment: 1,
          },
        },
      });

      // Emit blockchain event
      await this.emitTaskAssignment(assignment);

      await this.publishEvent({
        type: 'task:assigned',
        agentId: this.config.id,
        payload: assignment,
        priority: 'high',
      });

      return {
        success: true,
        data: assignment,
        metadata: {
          executionTime: 0,
          confidence: bestMatch.confidence,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to assign task: ${error}`);
    }
  }

  /**
   * Manage rewards for completed tasks
   */
  public async manageRewards(taskId: string, userId: string): Promise<AgentResponse<{ amount: number; transactionHash: string }>> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      if (task.status !== 'completed') {
        throw new Error('Task must be completed before rewards can be distributed');
      }

      const rewardAmount = await this.calculateRewardAmount(task, userId);
      
      // Distribute rewards via blockchain
      const transaction = await this.contract.distributeReward(
        userId,
        ethers.parseEther(rewardAmount.toString()),
        taskId
      );

      const receipt = await transaction.wait();

      // Update task status
      await this.prisma.task.update({
        where: { id: taskId },
        data: {
          status: 'rewarded',
          actualHours: task.actualHours,
        },
      });

      // Update user rewards
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalRewards: {
            increment: rewardAmount,
          },
          activeTasks: {
            decrement: 1,
          },
        },
      });

      await this.publishEvent({
        type: 'rewards:distributed',
        agentId: this.config.id,
        payload: { taskId, userId, amount: rewardAmount, transactionHash: receipt.hash },
        priority: 'high',
      });

      return {
        success: true,
        data: {
          amount: rewardAmount,
          transactionHash: receipt.hash,
        },
        metadata: {
          executionTime: 0,
          confidence: 0.95,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to manage rewards: ${error}`);
    }
  }

  /**
   * Coordinate a collaboration session
   */
  public async coordinateSession(sessionId: string): Promise<AgentResponse<CollaborationSession>> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      // Optimize task distribution
      const optimizedTasks = await this.optimizeTaskDistribution(session.tasks);
      
      // Update session
      const updatedSession = await this.prisma.collaborationSession.update({
        where: { id: sessionId },
        data: {
          tasks: optimizedTasks,
          status: 'active',
        },
      });

      await this.publishEvent({
        type: 'session:coordinated',
        agentId: this.config.id,
        payload: { sessionId, optimizedTasks },
        priority: 'medium',
      });

      return {
        success: true,
        data: updatedSession,
        metadata: {
          executionTime: 0,
          confidence: 0.85,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to coordinate session: ${error}`);
    }
  }

  /**
   * Analyze user skills using AI
   */
  public async analyzeUserSkills(userId: string): Promise<AgentResponse<UserSkill[]>> {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      // Get user's recent contributions
      const contributions = await this.getUserContributions(userId);
      
      // Analyze skills with DeepSeek
      const analyzedSkills = await this.analyzeSkillsWithDeepSeek(contributions);
      
      // Update user skills in database
      await this.prisma.userSkill.deleteMany({
        where: { userId },
      });

      for (const skill of analyzedSkills) {
        await this.prisma.userSkill.create({
          data: {
            userId,
            skill: skill.skill,
            level: skill.level,
            confidence: skill.confidence,
            lastUsed: skill.lastUsed,
            projectsCompleted: skill.projectsCompleted,
          },
        });
      }

      await this.publishEvent({
        type: 'skills:analyzed',
        agentId: this.config.id,
        payload: { userId, skills: analyzedSkills },
        priority: 'medium',
      });

      return {
        success: true,
        data: analyzedSkills,
        metadata: {
          executionTime: 0,
          confidence: 0.8,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to analyze user skills: ${error}`);
    }
  }

  /**
   * Optimize workflow for a session
   */
  public async optimizeWorkflow(sessionId: string): Promise<AgentResponse<any>> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      // Analyze current workflow
      const workflowAnalysis = await this.analyzeWorkflowWithDeepSeek(session);
      
      // Generate optimization suggestions
      const optimizations = await this.generateWorkflowOptimizations(workflowAnalysis);
      
      // Apply optimizations
      const optimizedSession = await this.applyWorkflowOptimizations(sessionId, optimizations);

      await this.publishEvent({
        type: 'workflow:optimized',
        agentId: this.config.id,
        payload: { sessionId, optimizations },
        priority: 'high',
      });

      return {
        success: true,
        data: optimizedSession,
        metadata: {
          executionTime: 0,
          confidence: 0.85,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to optimize workflow: ${error}`);
    }
  }

  /**
   * Automatically assign available tasks
   */
  public async autoAssignTasks(): Promise<AgentResponse<TaskAssignment[]>> {
    if (!this.autoAssignment) {
      return {
        success: false,
        error: 'Auto assignment is disabled',
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }

    try {
      const openTasks = await this.getOpenTasks();
      const assignments: TaskAssignment[] = [];

      for (const task of openTasks) {
        try {
          const assignment = await this.assignTask(task.id);
          if (assignment.success) {
            assignments.push(assignment.data);
          }
        } catch (error) {
          console.error(`Failed to auto-assign task ${task.id}:`, error);
        }
      }

      return {
        success: true,
        data: assignments,
        metadata: {
          executionTime: 0,
          confidence: 0.8,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to auto-assign tasks: ${error}`);
    }
  }

  /**
   * Calculate rewards for a task
   */
  public async calculateRewards(taskId: string): Promise<AgentResponse<number>> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      const baseReward = task.reward;
      const complexityMultiplier = this.calculateComplexityMultiplier(task);
      const qualityMultiplier = await this.calculateQualityMultiplier(task);
      
      const totalReward = baseReward * complexityMultiplier * qualityMultiplier * this.rewardMultiplier;

      return {
        success: true,
        data: totalReward,
        metadata: {
          executionTime: 0,
          confidence: 0.9,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to calculate rewards: ${error}`);
    }
  }

  // Private helper methods

  private async testDeepSeekConnection(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status !== 200) {
        throw new Error('DeepSeek API test failed');
      }
    } catch (error) {
      throw new Error(`DeepSeek connection test failed: ${error}`);
    }
  }

  private getContractABI(): any[] {
    // Simplified ABI for the coding pod contract
    return [
      'function name() view returns (string)',
      'function distributeReward(address user, uint256 amount, string taskId) external',
      'function getRewardBalance(address user) view returns (uint256)',
      'event RewardDistributed(address indexed user, uint256 amount, string taskId)',
    ];
  }

  private async getTask(taskId: string): Promise<Task | null> {
    return await this.prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  private async getOpenTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { status: 'open' },
      orderBy: { priority: 'desc' },
    });
  }

  private async getAvailableUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        availability: 'available',
        activeTasks: {
          lt: this.maxTasksPerUser,
        },
      },
      include: {
        skills: true,
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      reputation: user.reputation || 0,
      totalRewards: user.totalRewards || 0,
      activeTasks: user.activeTasks || 0,
      availability: user.availability as any,
    }));
  }

  private async findBestUserMatch(task: Task, users: User[]): Promise<{ user: User; confidence: number; reason: string } | null> {
    let bestMatch = null;
    let highestScore = 0;

    for (const user of users) {
      const score = await this.calculateUserTaskScore(user, task);
      
      if (score > highestScore && score >= this.skillMatchingThreshold) {
        highestScore = score;
        bestMatch = {
          user,
          confidence: score,
          reason: this.generateAssignmentReason(user, task, score),
        };
      }
    }

    return bestMatch;
  }

  private async calculateUserTaskScore(user: User, task: Task): Promise<number> {
    // Skill matching (40%)
    const skillScore = this.calculateSkillMatch(user.skills, task.requiredSkills);
    
    // Reputation (20%)
    const reputationScore = Math.min(user.reputation / 100, 1);
    
    // Availability (20%)
    const availabilityScore = user.activeTasks < this.maxTasksPerUser ? 1 : 0.5;
    
    // Historical performance (20%)
    const performanceScore = await this.calculatePerformanceScore(user.id);

    const totalScore = (skillScore * 0.4) + (reputationScore * 0.2) + (availabilityScore * 0.2) + (performanceScore * 0.2);
    
    return Math.min(totalScore, 1);
  }

  private calculateSkillMatch(userSkills: UserSkill[], requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 1;

    let totalScore = 0;
    let matchedSkills = 0;

    for (const requiredSkill of requiredSkills) {
      const userSkill = userSkills.find(skill => skill.skill.toLowerCase() === requiredSkill.toLowerCase());
      
      if (userSkill) {
        matchedSkills++;
        const levelScore = this.getSkillLevelScore(userSkill.level);
        totalScore += levelScore * userSkill.confidence;
      }
    }

    return matchedSkills > 0 ? totalScore / requiredSkills.length : 0;
  }

  private getSkillLevelScore(level: string): number {
    switch (level) {
      case 'expert': return 1.0;
      case 'advanced': return 0.8;
      case 'intermediate': return 0.6;
      case 'beginner': return 0.4;
      default: return 0.3;
    }
  }

  private async calculatePerformanceScore(userId: string): Promise<number> {
    const completedTasks = await this.prisma.task.count({
      where: {
        assignee: userId,
        status: 'completed',
      },
    });

    const totalTasks = await this.prisma.task.count({
      where: {
        assignee: userId,
      },
    });

    return totalTasks > 0 ? completedTasks / totalTasks : 0.5;
  }

  private generateAssignmentReason(user: User, task: Task, score: number): string {
    const reasons = [];
    
    if (score > 0.8) {
      reasons.push('Excellent skill match');
    } else if (score > 0.6) {
      reasons.push('Good skill match');
    }
    
    if (user.reputation > 80) {
      reasons.push('High reputation');
    }
    
    if (user.activeTasks < 2) {
      reasons.push('Available capacity');
    }
    
    return reasons.join(', ');
  }

  private calculateEstimatedCompletion(task: Task, match: { user: User; confidence: number }): Date {
    const baseHours = task.estimatedHours;
    const skillMultiplier = 1 / match.confidence;
    const estimatedHours = baseHours * skillMultiplier;
    
    const completionDate = new Date();
    completionDate.setHours(completionDate.getHours() + estimatedHours);
    
    return completionDate;
  }

  private async calculateRewardAmount(task: Task, userId: string): Promise<number> {
    const baseReward = task.reward;
    const complexityMultiplier = this.calculateComplexityMultiplier(task);
    const qualityMultiplier = await this.calculateQualityMultiplier(task);
    
    return baseReward * complexityMultiplier * qualityMultiplier * this.rewardMultiplier;
  }

  private calculateComplexityMultiplier(task: Task): number {
    switch (task.priority) {
      case 'critical': return 1.5;
      case 'high': return 1.3;
      case 'medium': return 1.0;
      case 'low': return 0.8;
      default: return 1.0;
    }
  }

  private async calculateQualityMultiplier(task: Task): Promise<number> {
    // This would analyze the quality of the completed work
    // For now, return a default multiplier
    return 1.0;
  }

  private async emitTaskAssignment(assignment: TaskAssignment): Promise<void> {
    // Emit blockchain event for task assignment
    await this.contract.emit('TaskAssigned', [
      assignment.userId,
      assignment.taskId,
      assignment.assignedAt.getTime(),
    ]);
  }

  private async getUser(userId: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true },
    });
  }

  private async getSession(sessionId: string): Promise<any> {
    return await this.prisma.collaborationSession.findUnique({
      where: { id: sessionId },
    });
  }

  private async getUserContributions(userId: string): Promise<any[]> {
    return await this.prisma.task.findMany({
      where: {
        assignee: userId,
        status: 'completed',
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
  }

  private async analyzeSkillsWithDeepSeek(contributions: any[]): Promise<UserSkill[]> {
    try {
      const contributionText = contributions.map(c => `${c.title}: ${c.description}`).join('\n');
      
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: 'Analyze the user contributions and extract their skills. Return a JSON array of skills with skill name, level (beginner/intermediate/advanced/expert), confidence (0-1), and projectsCompleted count.',
            },
            {
              role: 'user',
              content: `Analyze these contributions:\n\n${contributionText}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const analysis = response.data.choices[0].message.content;
      const skills = JSON.parse(analysis);
      
      return skills.map((skill: any) => ({
        userId: '',
        skill: skill.skill,
        level: skill.level,
        confidence: skill.confidence,
        lastUsed: new Date(),
        projectsCompleted: skill.projectsCompleted,
      }));
    } catch (error) {
      console.error('DeepSeek skill analysis failed:', error);
      return [];
    }
  }

  private async optimizeTaskDistribution(tasks: string[]): Promise<string[]> {
    // Simple optimization - sort by priority and complexity
    const taskDetails = await Promise.all(
      tasks.map(async (taskId) => {
        const task = await this.getTask(taskId);
        return { taskId, task };
      })
    );

    return taskDetails
      .filter(item => item.task)
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.task!.priority as keyof typeof priorityOrder] || 1;
        const bPriority = priorityOrder[b.task!.priority as keyof typeof priorityOrder] || 1;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return b.task!.estimatedHours - a.task!.estimatedHours;
      })
      .map(item => item.taskId);
  }

  private async analyzeWorkflowWithDeepSeek(session: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: 'Analyze the collaboration workflow and identify optimization opportunities.',
            },
            {
              role: 'user',
              content: `Analyze this session: ${JSON.stringify(session)}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek workflow analysis failed:', error);
      return {};
    }
  }

  private async generateWorkflowOptimizations(analysis: any): Promise<any[]> {
    // Generate optimization suggestions based on analysis
    return [
      { type: 'task-reordering', description: 'Reorder tasks for better efficiency' },
      { type: 'skill-matching', description: 'Improve skill-task matching' },
      { type: 'communication', description: 'Enhance team communication' },
    ];
  }

  private async applyWorkflowOptimizations(sessionId: string, optimizations: any[]): Promise<any> {
    // Apply the optimizations to the session
    return await this.prisma.collaborationSession.update({
      where: { id: sessionId },
      data: {
        // Apply optimizations here
      },
    });
  }
} 