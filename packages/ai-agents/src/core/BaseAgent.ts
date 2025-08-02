// Base Agent Class for CodePal Agentic AI System

import { v4 as uuidv4 } from 'uuid';
import { AgentConfig, AgentType, AgentAction, AgentResponse, AgentMetrics, AgentEvent } from '../types';
import { Redis } from 'redis';
import { EventEmitter } from 'events';

export abstract class BaseAgent extends EventEmitter {
  protected config: AgentConfig;
  protected redis: Redis;
  protected metrics: AgentMetrics;
  protected isRunning: boolean = false;

  constructor(
    type: AgentType,
    name: string,
    config: Record<string, any> = {},
    redisClient?: Redis
  ) {
    super();
    
    this.config = {
      id: uuidv4(),
      name,
      type,
      enabled: true,
      config,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.redis = redisClient || new Redis({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.metrics = {
      agentId: this.config.id,
      actionsExecuted: 0,
      successRate: 0,
      averageResponseTime: 0,
      userSatisfaction: 0,
      lastActive: new Date(),
      uptime: 0,
    };

    this.setupEventHandlers();
  }

  /**
   * Initialize the agent
   */
  public async initialize(): Promise<AgentResponse<void>> {
    try {
      const startTime = Date.now();
      
      await this.validateConfig();
      await this.setupConnections();
      await this.loadState();
      
      this.isRunning = true;
      this.metrics.lastActive = new Date();
      
      const executionTime = Date.now() - startTime;
      
      this.emit('agent:initialized', {
        agentId: this.config.id,
        executionTime,
        timestamp: new Date(),
      });

      return {
        success: true,
        metadata: {
          executionTime,
          confidence: 1.0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.emit('agent:error', {
        agentId: this.config.id,
        error: errorMessage,
        timestamp: new Date(),
      });

      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Shutdown the agent
   */
  public async shutdown(): Promise<AgentResponse<void>> {
    try {
      const startTime = Date.now();
      
      await this.saveState();
      await this.cleanupConnections();
      
      this.isRunning = false;
      
      const executionTime = Date.now() - startTime;
      
      this.emit('agent:shutdown', {
        agentId: this.config.id,
        executionTime,
        timestamp: new Date(),
      });

      return {
        success: true,
        metadata: {
          executionTime,
          confidence: 1.0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Execute an action with the agent
   */
  public async executeAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<AgentResponse<any>> {
    if (!this.isRunning) {
      return {
        success: false,
        error: 'Agent is not running',
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }

    const startTime = Date.now();
    
    try {
      // Check permissions
      if (!this.hasPermission(action.type)) {
        throw new Error(`Agent does not have permission to execute action: ${action.type}`);
      }

      // Execute the action
      const result = await this.performAction(action);
      
      // Update metrics
      const executionTime = Date.now() - startTime;
      this.updateMetrics(executionTime, true);
      
      // Emit event
      this.emit('agent:action:executed', {
        agentId: this.config.id,
        actionId: action.id,
        executionTime,
        success: true,
        timestamp: new Date(),
      });

      return {
        success: true,
        data: result,
        metadata: {
          executionTime,
          confidence: this.calculateConfidence(result),
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.updateMetrics(executionTime, false);
      
      this.emit('agent:action:failed', {
        agentId: this.config.id,
        actionId: action.id,
        executionTime,
        error: errorMessage,
        timestamp: new Date(),
      });

      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionTime,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Get agent configuration
   */
  public getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Update agent configuration
   */
  public async updateConfig(updates: Partial<AgentConfig>): Promise<AgentResponse<void>> {
    try {
      this.config = { ...this.config, ...updates, updatedAt: new Date() };
      await this.saveConfig();
      
      this.emit('agent:config:updated', {
        agentId: this.config.id,
        updates,
        timestamp: new Date(),
      });

      return {
        success: true,
        metadata: {
          executionTime: 0,
          confidence: 1.0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Get agent metrics
   */
  public getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  /**
   * Check if agent is running
   */
  public isAgentRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Add permission to agent
   */
  public addPermission(permission: string): void {
    if (!this.config.permissions.includes(permission)) {
      this.config.permissions.push(permission);
    }
  }

  /**
   * Remove permission from agent
   */
  public removePermission(permission: string): void {
    this.config.permissions = this.config.permissions.filter(p => p !== permission);
  }

  /**
   * Check if agent has permission
   */
  public hasPermission(action: string): boolean {
    return this.config.permissions.includes(action) || this.config.permissions.includes('*');
  }

  // Abstract methods that must be implemented by subclasses
  protected abstract validateConfig(): Promise<void>;
  protected abstract setupConnections(): Promise<void>;
  protected abstract loadState(): Promise<void>;
  protected abstract saveState(): Promise<void>;
  protected abstract cleanupConnections(): Promise<void>;
  protected abstract performAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<any>;
  protected abstract calculateConfidence(result: any): number;

  // Protected helper methods
  protected async saveConfig(): Promise<void> {
    const key = `agent:config:${this.config.id}`;
    await this.redis.set(key, JSON.stringify(this.config));
  }

  protected async loadConfig(): Promise<void> {
    const key = `agent:config:${this.config.id}`;
    const configData = await this.redis.get(key);
    if (configData) {
      this.config = { ...this.config, ...JSON.parse(configData) };
    }
  }

  protected async saveMetrics(): Promise<void> {
    const key = `agent:metrics:${this.config.id}`;
    await this.redis.set(key, JSON.stringify(this.metrics));
  }

  protected async loadMetrics(): Promise<void> {
    const key = `agent:metrics:${this.config.id}`;
    const metricsData = await this.redis.get(key);
    if (metricsData) {
      this.metrics = { ...this.metrics, ...JSON.parse(metricsData) };
    }
  }

  protected updateMetrics(executionTime: number, success: boolean): void {
    this.metrics.actionsExecuted++;
    this.metrics.lastActive = new Date();
    
    // Update success rate
    const totalActions = this.metrics.actionsExecuted;
    const successfulActions = Math.floor(this.metrics.successRate * (totalActions - 1)) + (success ? 1 : 0);
    this.metrics.successRate = successfulActions / totalActions;
    
    // Update average response time
    const totalTime = this.metrics.averageResponseTime * (totalActions - 1) + executionTime;
    this.metrics.averageResponseTime = totalTime / totalActions;
    
    // Update uptime
    const now = new Date();
    const uptimeMs = now.getTime() - this.config.createdAt.getTime();
    this.metrics.uptime = uptimeMs / 1000; // Convert to seconds
    
    this.saveMetrics();
  }

  protected setupEventHandlers(): void {
    this.on('agent:error', (event: AgentEvent) => {
      console.error(`Agent ${this.config.name} error:`, event);
    });

    this.on('agent:action:executed', (event: AgentEvent) => {
      console.log(`Agent ${this.config.name} executed action:`, event);
    });

    this.on('agent:action:failed', (event: AgentEvent) => {
      console.error(`Agent ${this.config.name} failed action:`, event);
    });
  }

  protected async publishEvent(event: Omit<AgentEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: AgentEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
    };

    const key = `agent:events:${this.config.id}`;
    await this.redis.lpush(key, JSON.stringify(fullEvent));
    await this.redis.ltrim(key, 0, 999); // Keep only last 1000 events

    this.emit('agent:event:published', fullEvent);
  }
} 