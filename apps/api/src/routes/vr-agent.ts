import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { VRWorkflowAgent } from '@codepal/ai-agents';
import * as THREE from 'three';

const router = express.Router();

// Create a Three.js scene for VR visualization
const scene = new THREE.Scene();

// Initialize VR agent
const vrAgent = new VRWorkflowAgent(
  {
    id: 'vr-workflow-agent',
    name: 'VR Workflow Agent',
    type: 'vr',
    version: '1.0.0',
    permissions: ['read', 'write', 'analyze', 'visualize']
  },
  scene,
  process.env.DEEPSEEK_API_KEY || ''
);

// Start the agent
vrAgent.start().catch(console.error);

// Predict VR issues
router.post('/predict-issues', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { code } = req.body;
    const issues = await vrAgent.predictVRIssues(code);
    
    res.json({
      success: true,
      data: issues,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error predicting VR issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to predict VR issues',
      timestamp: new Date()
    });
  }
});

// Apply VR fix
router.post('/apply-fix', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { nodeId, fix } = req.body;
    const result = await vrAgent.applyFix(nodeId, fix);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error applying VR fix:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply VR fix',
      timestamp: new Date()
    });
  }
});

// Create VR node
router.post('/nodes', authenticateToken, rateLimit, async (req, res) => {
  try {
    const nodeData = req.body;
    const node = await vrAgent.createVRNode(nodeData);
    
    res.json({
      success: true,
      data: node,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating VR node:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create VR node',
      timestamp: new Date()
    });
  }
});

// Update VR node
router.put('/nodes/:nodeId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { nodeId } = req.params;
    const updates = req.body;
    const node = await vrAgent.updateVRNode(nodeId, updates);
    
    res.json({
      success: true,
      data: node,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error updating VR node:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update VR node',
      timestamp: new Date()
    });
  }
});

// Create VR workflow
router.post('/workflows', authenticateToken, rateLimit, async (req, res) => {
  try {
    const workflowData = req.body;
    const workflow = await vrAgent.createVRWorkflow(workflowData);
    
    res.json({
      success: true,
      data: workflow,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating VR workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create VR workflow',
      timestamp: new Date()
    });
  }
});

// Optimize VR performance
router.post('/optimize-performance', authenticateToken, rateLimit, async (req, res) => {
  try {
    await vrAgent.optimizeVRPerformance();
    
    res.json({
      success: true,
      message: 'VR performance optimization completed',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error optimizing VR performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize VR performance',
      timestamp: new Date()
    });
  }
});

// Get VR metrics
router.get('/metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await vrAgent.getVRMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting VR metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get VR metrics',
      timestamp: new Date()
    });
  }
});

// Get agent metrics
router.get('/agent-metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await vrAgent.getMetrics();
    
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

// Get scene data for 3D visualization
router.get('/scene', authenticateToken, rateLimit, async (req, res) => {
  try {
    // Convert Three.js scene to JSON for frontend consumption
    const sceneData = {
      children: scene.children.map(child => ({
        name: child.name,
        type: child.type,
        position: child.position.toArray(),
        rotation: child.rotation.toArray(),
        scale: child.scale.toArray(),
        visible: child.visible
      }))
    };
    
    res.json({
      success: true,
      data: sceneData,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting scene data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scene data',
      timestamp: new Date()
    });
  }
});

export default router; 