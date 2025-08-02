import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { MarketplaceOptimizationAgent } from '@codepal/ai-agents';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize marketplace agent
const marketplaceAgent = new MarketplaceOptimizationAgent(
  {
    id: 'marketplace-optimization-agent',
    name: 'Marketplace Optimization Agent',
    type: 'marketplace',
    version: '1.0.0',
    permissions: ['read', 'write', 'analyze']
  },
  prisma,
  process.env.DEEPSEEK_API_KEY || ''
);

// Start the agent
marketplaceAgent.start().catch(console.error);

// Predict snippet demand
router.post('/predict-demand/:snippetId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { snippetId } = req.params;
    const result = await marketplaceAgent.predictSnippetDemand(snippetId);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error predicting snippet demand:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to predict snippet demand',
      timestamp: new Date()
    });
  }
});

// Flag low quality snippet
router.post('/flag-quality', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { snippet } = req.body;
    const flagged = await marketplaceAgent.flagLowQuality(snippet);
    
    res.json({
      success: true,
      data: { flagged },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error flagging low quality snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to flag low quality snippet',
      timestamp: new Date()
    });
  }
});

// Get snippet recommendations
router.get('/recommendations/:userId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    const recommendations = await marketplaceAgent.recommendSnippets(userId, Number(limit));
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
      timestamp: new Date()
    });
  }
});

// Get marketplace metrics
router.get('/metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await marketplaceAgent.getMarketplaceMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting marketplace metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get marketplace metrics',
      timestamp: new Date()
    });
  }
});

// Optimize pricing for all active snippets
router.post('/optimize-pricing', authenticateToken, rateLimit, async (req, res) => {
  try {
    await marketplaceAgent.optimizePricing();
    
    res.json({
      success: true,
      message: 'Pricing optimization completed',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error optimizing pricing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize pricing',
      timestamp: new Date()
    });
  }
});

// Flag low quality snippets (batch)
router.post('/flag-low-quality', authenticateToken, rateLimit, async (req, res) => {
  try {
    await marketplaceAgent.flagLowQualitySnippets();
    
    res.json({
      success: true,
      message: 'Low quality snippet flagging completed',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error flagging low quality snippets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to flag low quality snippets',
      timestamp: new Date()
    });
  }
});

// Get agent metrics
router.get('/agent-metrics', authenticateToken, rateLimit, async (req, res) => {
  try {
    const metrics = await marketplaceAgent.getMetrics();
    
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