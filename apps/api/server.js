const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple AI agents endpoints for elasticity testing
app.get('/api/agents/health', (req, res) => {
  res.json({
    status: 'healthy',
    agents: {
      'CrossPlatformOptimizationAgent': 'active',
      'MetaAgent': 'active'
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/api/agents/optimize', (req, res) => {
  // Mock optimization response
  res.json({
    success: true,
    agent: 'CrossPlatformOptimizationAgent',
    optimization: {
      performance: Math.random() * 100,
      efficiency: Math.random() * 100,
      recommendations: [
        'Optimize database queries',
        'Implement caching strategy',
        'Use connection pooling'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/api/agents/meta', (req, res) => {
  // Mock meta agent response
  res.json({
    success: true,
    agent: 'MetaAgent',
    analysis: {
      complexity: Math.random() * 10,
      maintainability: Math.random() * 100,
      insights: [
        'Code structure is well-organized',
        'Consider adding more unit tests',
        'Documentation could be improved'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint for monitoring
app.get('/api/metrics', (req, res) => {
  res.json({
    requests: {
      total: Math.floor(Math.random() * 1000),
      successful: Math.floor(Math.random() * 900),
      failed: Math.floor(Math.random() * 100)
    },
    performance: {
      responseTime: Math.random() * 100,
      throughput: Math.random() * 1000,
      errorRate: Math.random() * 0.1
    },
    agents: {
      active: 2,
      total: 2,
      utilization: Math.random() * 100
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 CodePal API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Agents health: http://localhost:${PORT}/api/agents/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
});

module.exports = app; 