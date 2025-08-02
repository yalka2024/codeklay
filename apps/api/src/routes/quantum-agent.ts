import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { QuantumWorkflowAgent } from '@codepal/ai-agents';

const router = express.Router();

// Initialize quantum agent
const quantumAgent = new QuantumWorkflowAgent(
  {
    id: 'quantum-workflow-agent',
    name: 'Quantum Workflow Agent',
    type: 'quantum',
    version: '1.0.0',
    permissions: ['read', 'write', 'analyze', 'simulate']
  },
  process.env.QISKIT_API_KEY || '',
  process.env.DEEPSEEK_API_KEY || ''
);

// Start the agent
quantumAgent.start().catch(console.error);

// Predict quantum performance
router.post('/predict-performance', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { code } = req.body;
    const simulation = await quantumAgent.predictQuantumPerformance(code);
    
    res.json({
      success: true,
      data: simulation,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error predicting quantum performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to predict quantum performance',
      timestamp: new Date()
    });
  }
});

// Optimize quantum code
router.post('/optimize-code', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { code } = req.body;
    const optimizedCode = await quantumAgent.optimizeQuantumCode(code);
    
    res.json({
      success: true,
      data: { optimizedCode },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error optimizing quantum code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize quantum code',
      timestamp: new Date()
    });
  }
});

// Create quantum algorithm
router.post('/algorithms', authenticateToken, rateLimit, async (req, res) => {
  try {
    const algorithmData = req.body;
    const algorithm = await quantumAgent.createQuantumAlgorithm(algorithmData);
    
    res.json({
      success: true,
      data: algorithm,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating quantum algorithm:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quantum algorithm',
      timestamp: new Date()
    });
  }
});

// Get quantum algorithm
router.get('/algorithms/:algorithmId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { algorithmId } = req.params;
    const algorithm = await quantumAgent.getAlgorithm(algorithmId);
    
    if (!algorithm) {
      return res.status(404).json({
        success: false,
        error: 'Quantum algorithm not found',
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      data: algorithm,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting quantum algorithm:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quantum algorithm',
      timestamp: new Date()
    });
  }
});

// List quantum algorithms
router.get('/algorithms', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = { type: type as string, status: status as string };
    const algorithms = await quantumAgent.listAlgorithms(filter);
    
    res.json({
      success: true,
      data: algorithms,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error listing quantum algorithms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list quantum algorithms',
      timestamp: new Date()
    });
  }
});

// Run quantum simulation
router.post('/simulations', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { algorithmId, parameters } = req.body;
    const simulation = await quantumAgent.runQuantumSimulation(algorithmId, parameters);
    
    res.json({
      success: true,
      data: simulation,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error running quantum simulation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run quantum simulation',
      timestamp: new Date()
    });
  }
});

// Get quantum simulation
router.get('/simulations/:simulationId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { simulationId } = req.params;
    const simulation = await quantumAgent.getSimulation(simulationId);
    
    if (!simulation) {
      return res.status(404).json({
        success: false,
        error: 'Quantum simulation not found',
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      data: simulation,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting quantum simulation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quantum simulation',
      timestamp: new Date()
    });
  }
});

// List quantum simulations
router.get('/simulations', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { algorithmId, status } = req.query;
    const filter = { algorithmId: algorithmId as string, status: status as string };
    const simulations = await quantumAgent.listSimulations(filter);
    
    res.json({
      success: true,
      data: simulations,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error listing quantum simulations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list quantum simulations',
      timestamp: new Date()
    });
  }
});

// Get quantum optimization
router.get('/optimizations/:optimizationId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { optimizationId } = req.params;
    const optimization = await quantumAgent.getOptimization(optimizationId);
    
    if (!optimization) {
      return res.status(404).json({
        success: false,
        error: 'Quantum optimization not found',
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      data: optimization,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting quantum optimization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quantum optimization',
      timestamp: new Date()
    });
  }
});

// Optimize quantum circuits
router.post('/optimize-circuits', authenticateToken, rateLimit, async (req, res) => {
  try {
    await quantumAgent.optimizeQuantumCircuits();
    
    res.json({
      success: true,
      message: 'Quantum circuit optimization completed',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error optimizing quantum circuits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize quantum circuits',
      timestamp: new Date()
    });
  }
});

// Get quantum metrics
router.get('/metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await quantumAgent.getQuantumMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting quantum metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quantum metrics',
      timestamp: new Date()
    });
  }
});

// Get agent metrics
router.get('/agent-metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await quantumAgent.getMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting agent metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get agent metrics',
      timestamp: new Date()
    });
  }
});

export default router; 