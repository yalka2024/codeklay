// Agentic AI API Routes for CodePal

import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { AgentFactory } from '@codepal/ai-agents';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();

// Rate limiting for agent endpoints
const agentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all agent routes
router.use(agentRateLimit);

// Input validation schemas
const AgentActionSchema = z.object({
  type: z.enum([
    'predict_performance',
    'optimize_for_platform',
    'aggregate_predictions',
    'coordinate_optimization',
    'get_decision_history',
    'get_agent_metrics',
    'register_agent',
    'detect_issues',
    'assign_task',
    'predict_vr_issues',
    'predict_demand',
    'predict_quantum_performance'
  ]),
  params: z.record(z.any()).optional(),
});

const PerformancePredictionSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  platform: z.enum(['web', 'mobile', 'iot', 'desktop', 'server']),
});

const PlatformOptimizationSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  platform: z.enum(['web', 'mobile', 'iot', 'desktop', 'server']),
});

const AgentRegistrationSchema = z.object({
  agentId: z.string().min(1, 'Agent ID cannot be empty'),
  agentType: z.enum([
    'codebase',
    'collaboration',
    'vr',
    'marketplace',
    'quantum',
    'cross-platform',
    'meta'
  ]),
  config: z.record(z.any()).optional(),
});

/**
 * @route POST /api/agents/action
 * @desc Execute an agent action
 * @access Private
 */
router.post('/action', 
  authenticateToken,
  authorizeRole(['user', 'admin']),
  validateRequest(AgentActionSchema),
  async (req, res) => {
    try {
      const { type, params = {} } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      logger.info(`Agent action requested`, {
        userId,
        actionType: type,
        params: JSON.stringify(params)
      });

      // Route to appropriate agent based on action type
      let agent;
      let result;

      switch (type) {
        case 'predict_performance':
        case 'optimize_for_platform':
          agent = AgentFactory.createCrossPlatformOptimizationAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'aggregate_predictions':
        case 'coordinate_optimization':
        case 'get_decision_history':
        case 'get_agent_metrics':
          agent = AgentFactory.createMetaAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'detect_issues':
          agent = AgentFactory.createCodebaseManagementAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'assign_task':
          agent = AgentFactory.createCollaborationCoordinatorAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'predict_vr_issues':
          agent = AgentFactory.createVRWorkflowAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'predict_demand':
          agent = AgentFactory.createMarketplaceOptimizationAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        case 'predict_quantum_performance':
          agent = AgentFactory.createQuantumWorkflowAgent({
            userId,
            sessionId: req.sessionID
          });
          break;

        default:
          return res.status(400).json({
            success: false,
            error: `Unsupported action type: ${type}`
          });
      }

      // Execute the action
      result = await agent.executeAction({ type, params });

      // Log the result
      logger.info(`Agent action completed`, {
        userId,
        actionType: type,
        success: result.success,
        timestamp: result.timestamp
      });

      return res.json(result);

    } catch (error) {
      logger.error('Agent action failed', {
        userId: req.user?.id,
        actionType: req.body?.type,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Internal server error during agent action execution',
        timestamp: new Date()
      });
    }
  }
);

/**
 * @route POST /api/agents/predict-performance
 * @desc Predict performance for a specific platform
 * @access Private
 */
router.post('/predict-performance',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  validateRequest(PerformancePredictionSchema),
  async (req, res) => {
    try {
      const { code, platform } = req.body;
      const userId = req.user?.id;

      logger.info(`Performance prediction requested`, {
        userId,
        platform,
        codeLength: code.length
      });

      const agent = AgentFactory.createCrossPlatformOptimizationAgent({
        userId,
        sessionId: req.sessionID
      });

      const result = await agent.predictPerformance(code, platform);

      logger.info(`Performance prediction completed`, {
        userId,
        platform,
        predictedScore: result.predictedScore,
        confidence: result.confidence
      });

      return res.json({
        success: true,
        data: result,
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Performance prediction failed', {
        userId: req.user?.id,
        platform: req.body?.platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to predict performance',
        timestamp: new Date()
      });
    }
  }
);

/**
 * @route POST /api/agents/optimize-platform
 * @desc Optimize code for a specific platform
 * @access Private
 */
router.post('/optimize-platform',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  validateRequest(PlatformOptimizationSchema),
  async (req, res) => {
    try {
      const { code, platform } = req.body;
      const userId = req.user?.id;

      logger.info(`Platform optimization requested`, {
        userId,
        platform,
        codeLength: code.length
      });

      const agent = AgentFactory.createCrossPlatformOptimizationAgent({
        userId,
        sessionId: req.sessionID
      });

      const result = await agent.optimizeForPlatform(code, platform);

      logger.info(`Platform optimization completed`, {
        userId,
        platform,
        performanceGain: result.performanceGain,
        compatibilityScore: result.compatibilityScore
      });

      return res.json({
        success: true,
        data: result,
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Platform optimization failed', {
        userId: req.user?.id,
        platform: req.body?.platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to optimize for platform',
        timestamp: new Date()
      });
    }
  }
);

/**
 * @route POST /api/agents/register
 * @desc Register a new agent
 * @access Private (Admin only)
 */
router.post('/register',
  authenticateToken,
  authorizeRole(['admin']),
  validateRequest(AgentRegistrationSchema),
  async (req, res) => {
    try {
      const { agentId, agentType, config = {} } = req.body;
      const userId = req.user?.id;

      logger.info(`Agent registration requested`, {
        userId,
        agentId,
        agentType
      });

      // Create agent based on type
      let agent;
      switch (agentType) {
        case 'codebase':
          agent = AgentFactory.createCodebaseManagementAgent(config);
          break;
        case 'collaboration':
          agent = AgentFactory.createCollaborationCoordinatorAgent(config);
          break;
        case 'vr':
          agent = AgentFactory.createVRWorkflowAgent(config);
          break;
        case 'marketplace':
          agent = AgentFactory.createMarketplaceOptimizationAgent(config);
          break;
        case 'quantum':
          agent = AgentFactory.createQuantumWorkflowAgent(config);
          break;
        case 'cross-platform':
          agent = AgentFactory.createCrossPlatformOptimizationAgent(config);
          break;
        case 'meta':
          agent = AgentFactory.createMetaAgent(config);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: `Unsupported agent type: ${agentType}`
          });
      }

      logger.info(`Agent registered successfully`, {
        userId,
        agentId,
        agentType
      });

      return res.json({
        success: true,
        data: {
          agentId,
          agentType,
          message: 'Agent registered successfully'
        },
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Agent registration failed', {
        userId: req.user?.id,
        agentId: req.body?.agentId,
        agentType: req.body?.agentType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to register agent',
        timestamp: new Date()
      });
    }
  }
);

/**
 * @route GET /api/agents/metrics
 * @desc Get agent performance metrics
 * @access Private
 */
router.get('/metrics',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const agentType = req.query.type as string;

      logger.info(`Agent metrics requested`, {
        userId,
        agentType
      });

      let metrics = {};

      if (agentType) {
        // Get metrics for specific agent type
        let agent;
        switch (agentType) {
          case 'codebase':
            agent = AgentFactory.createCodebaseManagementAgent({ userId });
            break;
          case 'collaboration':
            agent = AgentFactory.createCollaborationCoordinatorAgent({ userId });
            break;
          case 'vr':
            agent = AgentFactory.createVRWorkflowAgent({ userId });
            break;
          case 'marketplace':
            agent = AgentFactory.createMarketplaceOptimizationAgent({ userId });
            break;
          case 'quantum':
            agent = AgentFactory.createQuantumWorkflowAgent({ userId });
            break;
          case 'cross-platform':
            agent = AgentFactory.createCrossPlatformOptimizationAgent({ userId });
            break;
          case 'meta':
            agent = AgentFactory.createMetaAgent({ userId });
            break;
          default:
            return res.status(400).json({
              success: false,
              error: `Unsupported agent type: ${agentType}`
            });
        }

        metrics = await agent.getMetrics();
      } else {
        // Get metrics for all agents
        const agentTypes = ['codebase', 'collaboration', 'vr', 'marketplace', 'quantum', 'cross-platform', 'meta'];
        
        for (const type of agentTypes) {
          try {
            let agent;
            switch (type) {
              case 'codebase':
                agent = AgentFactory.createCodebaseManagementAgent({ userId });
                break;
              case 'collaboration':
                agent = AgentFactory.createCollaborationCoordinatorAgent({ userId });
                break;
              case 'vr':
                agent = AgentFactory.createVRWorkflowAgent({ userId });
                break;
              case 'marketplace':
                agent = AgentFactory.createMarketplaceOptimizationAgent({ userId });
                break;
              case 'quantum':
                agent = AgentFactory.createQuantumWorkflowAgent({ userId });
                break;
              case 'cross-platform':
                agent = AgentFactory.createCrossPlatformOptimizationAgent({ userId });
                break;
              case 'meta':
                agent = AgentFactory.createMetaAgent({ userId });
                break;
            }
            
            if (agent) {
              metrics[type] = await agent.getMetrics();
            }
          } catch (error) {
            logger.warn(`Failed to get metrics for agent type: ${type}`, { error });
          }
        }
      }

      logger.info(`Agent metrics retrieved successfully`, {
        userId,
        agentType,
        metricsCount: Object.keys(metrics).length
      });

      return res.json({
        success: true,
        data: metrics,
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Failed to get agent metrics', {
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve agent metrics',
        timestamp: new Date()
      });
    }
  }
);

/**
 * @route GET /api/agents/health
 * @desc Check agent system health
 * @access Private
 */
router.get('/health',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  async (req, res) => {
    try {
      const userId = req.user?.id;

      logger.info(`Agent health check requested`, { userId });

      // Check health of all agent types
      const healthStatus = {};
      const agentTypes = ['codebase', 'collaboration', 'vr', 'marketplace', 'quantum', 'cross-platform', 'meta'];
      
      for (const type of agentTypes) {
        try {
          let agent;
          switch (type) {
            case 'codebase':
              agent = AgentFactory.createCodebaseManagementAgent({ userId });
              break;
            case 'collaboration':
              agent = AgentFactory.createCollaborationCoordinatorAgent({ userId });
              break;
            case 'vr':
              agent = AgentFactory.createVRWorkflowAgent({ userId });
              break;
            case 'marketplace':
              agent = AgentFactory.createMarketplaceOptimizationAgent({ userId });
              break;
            case 'quantum':
              agent = AgentFactory.createQuantumWorkflowAgent({ userId });
              break;
            case 'cross-platform':
              agent = AgentFactory.createCrossPlatformOptimizationAgent({ userId });
              break;
            case 'meta':
              agent = AgentFactory.createMetaAgent({ userId });
              break;
          }
          
          if (agent) {
            const metrics = await agent.getMetrics();
            healthStatus[type] = {
              status: 'healthy',
              metrics: metrics
            };
          }
        } catch (error) {
          logger.warn(`Agent health check failed for type: ${type}`, { error });
          healthStatus[type] = {
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }

      const overallStatus = Object.values(healthStatus).every(
        (status: any) => status.status === 'healthy'
      ) ? 'healthy' : 'degraded';

      logger.info(`Agent health check completed`, {
        userId,
        overallStatus,
        healthyAgents: Object.values(healthStatus).filter((s: any) => s.status === 'healthy').length
      });

      return res.json({
        success: true,
        data: {
          status: overallStatus,
          agents: healthStatus,
          timestamp: new Date()
        },
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Agent health check failed', {
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to check agent health',
        timestamp: new Date()
      });
    }
  }
);

export default router; 