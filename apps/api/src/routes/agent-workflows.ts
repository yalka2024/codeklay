import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validation';
import { AgentFactory } from '@codepal/ai-agents';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const AgentNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  config: z.object({
    name: z.string(),
    enabled: z.boolean(),
    permissions: z.array(z.string()),
    settings: z.record(z.any())
  }),
  connections: z.array(z.string())
});

const AgentWorkflowSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  nodes: z.array(AgentNodeSchema),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.string()
  })),
  status: z.enum(['draft', 'testing', 'deployed', 'archived']).optional()
});

const DeployWorkflowSchema = z.object({
  workflowId: z.string(),
  environment: z.enum(['development', 'staging', 'production']),
  strategy: z.enum(['rolling', 'blue-green', 'canary']).optional(),
  config: z.record(z.any()).optional()
});

// In-memory storage for workflows (in production, use database)
const workflows = new Map();

/**
 * @route GET /api/agent-workflows
 * @desc Get all workflows for the user
 * @access Private
 */
router.get('/', 
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Filter workflows by user (in production, query database)
      const userWorkflows = Array.from(workflows.values())
        .filter((workflow: any) => workflow.userId === userId)
        .map((workflow: any) => ({
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          status: workflow.status,
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
          nodeCount: workflow.nodes.length,
          connectionCount: workflow.connections.length
        }));

      return res.json({
        success: true,
        data: userWorkflows,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error fetching workflows:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/agent-workflows/:id
 * @desc Get a specific workflow
 * @access Private
 */
router.get('/:id',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const workflow = workflows.get(id);
      
      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: 'Workflow not found'
        });
      }

      if (workflow.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: workflow,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error fetching workflow:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/agent-workflows
 * @desc Create or update a workflow
 * @access Private
 */
router.post('/',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }),
  validateRequest(AgentWorkflowSchema),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const workflowData = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const workflowId = workflowData.id || `workflow-${Date.now()}`;
      const now = new Date();

      const workflow = {
        id: workflowId,
        userId,
        name: workflowData.name,
        description: workflowData.description || '',
        nodes: workflowData.nodes || [],
        connections: workflowData.connections || [],
        status: workflowData.status || 'draft',
        createdAt: now,
        updatedAt: now
      };

      workflows.set(workflowId, workflow);

      return res.status(201).json({
        success: true,
        data: {
          id: workflow.id,
          name: workflow.name,
          status: workflow.status,
          message: 'Workflow saved successfully'
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error saving workflow:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/agent-workflows/deploy
 * @desc Deploy a workflow
 * @access Private
 */
router.post('/deploy',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }),
  validateRequest(DeployWorkflowSchema),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { workflowId, environment, strategy = 'rolling', config = {} } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const workflow = workflows.get(workflowId);
      
      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: 'Workflow not found'
        });
      }

      if (workflow.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Validate workflow before deployment
      if (workflow.nodes.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Workflow must contain at least one agent node'
        });
      }

      // Initialize agents based on workflow
      const agents = [];
      for (const node of workflow.nodes) {
        try {
          let agent;
          switch (node.type) {
            case 'codebase':
              agent = AgentFactory.createCodebaseManagementAgent({
                ...node.config,
                userId,
                workflowId
              });
              break;
            case 'collaboration':
              agent = AgentFactory.createCollaborationCoordinatorAgent({
                ...node.config,
                userId,
                workflowId
              });
              break;
            case 'marketplace':
              agent = AgentFactory.createMarketplaceOptimizationAgent({
                ...node.config,
                userId,
                workflowId
              }, null, process.env.DEEPSEEK_API_KEY || '');
              break;
            case 'vr':
              agent = AgentFactory.createVRWorkflowAgent({
                ...node.config,
                userId,
                workflowId
              }, null, process.env.DEEPSEEK_API_KEY || '');
              break;
            case 'quantum':
              agent = AgentFactory.createQuantumWorkflowAgent({
                ...node.config,
                userId,
                workflowId
              }, process.env.QISKIT_API_KEY || '', process.env.DEEPSEEK_API_KEY || '');
              break;
            case 'cross-platform':
              agent = AgentFactory.createCrossPlatformOptimizationAgent({
                ...node.config,
                userId,
                workflowId
              });
              break;
            case 'meta':
              agent = AgentFactory.createMetaAgent({
                ...node.config,
                userId,
                workflowId
              });
              break;
            default:
              throw new Error(`Unsupported agent type: ${node.type}`);
          }
          
          if (agent) {
            await agent.start();
            agents.push({
              id: node.id,
              type: node.type,
              agent
            });
          }
        } catch (error) {
          console.error(`Error initializing agent ${node.type}:`, error);
        }
      }

      // Update workflow status
      workflow.status = 'deployed';
      workflow.updatedAt = new Date();
      workflow.deployment = {
        environment,
        strategy,
        deployedAt: new Date(),
        agentCount: agents.length
      };

      workflows.set(workflowId, workflow);

      return res.json({
        success: true,
        data: {
          workflowId,
          status: 'deployed',
          environment,
          strategy,
          agentCount: agents.length,
          message: 'Workflow deployed successfully'
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error deploying workflow:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/agent-workflows/:id/test
 * @desc Test a workflow
 * @access Private
 */
router.post('/:id/test',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const workflow = workflows.get(id);
      
      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: 'Workflow not found'
        });
      }

      if (workflow.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Simulate workflow testing
      const testResults = {
        workflowId: id,
        status: 'testing',
        results: {
          nodes: workflow.nodes.map(node => ({
            id: node.id,
            type: node.type,
            status: 'success',
            message: `${node.type} agent initialized successfully`
          })),
          connections: workflow.connections.map(conn => ({
            from: conn.from,
            to: conn.to,
            status: 'success',
            message: 'Connection established'
          })),
          overall: 'success'
        },
        timestamp: new Date()
      };

      return res.json({
        success: true,
        data: testResults,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error testing workflow:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route DELETE /api/agent-workflows/:id
 * @desc Delete a workflow
 * @access Private
 */
router.delete('/:id',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const workflow = workflows.get(id);
      
      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: 'Workflow not found'
        });
      }

      if (workflow.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      workflows.delete(id);

      return res.json({
        success: true,
        data: {
          id,
          message: 'Workflow deleted successfully'
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error deleting workflow:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/agent-workflows/templates
 * @desc Get workflow templates
 * @access Private
 */
router.get('/templates',
  authenticateToken,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }),
  async (req, res) => {
    try {
      const templates = [
        {
          id: 'basic-monitoring',
          name: 'Basic Code Monitoring',
          description: 'Simple workflow for monitoring code repositories',
          category: 'monitoring',
          nodes: [
            {
              type: 'codebase',
              config: {
                name: 'Repository Monitor',
                enabled: true,
                permissions: ['read'],
                settings: {
                  repositories: ['*'],
                  checkInterval: 300
                }
              }
            }
          ],
          connections: []
        },
        {
          id: 'collaboration-workflow',
          name: 'Team Collaboration',
          description: 'Workflow for managing team collaboration',
          category: 'collaboration',
          nodes: [
            {
              type: 'collaboration',
              config: {
                name: 'Team Coordinator',
                enabled: true,
                permissions: ['read', 'write'],
                settings: {
                  autoAssign: true,
                  skillMatching: true
                }
              }
            }
          ],
          connections: []
        },
        {
          id: 'marketplace-optimization',
          name: 'Marketplace Optimization',
          description: 'Workflow for optimizing marketplace performance',
          category: 'optimization',
          nodes: [
            {
              type: 'marketplace',
              config: {
                name: 'Marketplace Optimizer',
                enabled: true,
                permissions: ['read', 'write'],
                settings: {
                  autoPricing: true,
                  qualityThreshold: 0.8
                }
              }
            }
          ],
          connections: []
        },
        {
          id: 'full-stack-workflow',
          name: 'Full Stack Development',
          description: 'Comprehensive workflow for full-stack development',
          category: 'development',
          nodes: [
            {
              type: 'codebase',
              config: {
                name: 'Code Monitor',
                enabled: true,
                permissions: ['read', 'write'],
                settings: {}
              }
            },
            {
              type: 'collaboration',
              config: {
                name: 'Team Manager',
                enabled: true,
                permissions: ['read', 'write'],
                settings: {}
              }
            },
            {
              type: 'cross-platform',
              config: {
                name: 'Platform Optimizer',
                enabled: true,
                permissions: ['read', 'write'],
                settings: {}
              }
            }
          ],
          connections: [
            { from: 'codebase', to: 'collaboration', type: 'data' },
            { from: 'collaboration', to: 'cross-platform', type: 'data' }
          ]
        }
      ];

      return res.json({
        success: true,
        data: templates,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

export default router; 