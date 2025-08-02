const http = require('http');

// Simple test server for elasticity testing
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${url}`);

  if (url === '/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'development'
    }));
  } else if (url === '/api/agents/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      agents: {
        'CrossPlatformOptimizationAgent': 'active',
        'MetaAgent': 'active'
      },
      timestamp: new Date().toISOString()
    }));
  } else if (url === '/api/agents/optimize' && method === 'POST') {
    // Mock CrossPlatformOptimizationAgent response
    res.writeHead(200);
    res.end(JSON.stringify({
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
    }));
  } else if (url === '/api/agents/meta' && method === 'POST') {
    // Mock MetaAgent response
    res.writeHead(200);
    res.end(JSON.stringify({
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
    }));
  } else if (url === '/api/metrics' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
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
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Endpoint not found',
      path: url
    }));
  }
});

const PORT = 3002;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CodePal API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Agents health: http://localhost:${PORT}/api/agents/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`);
  console.log(`🧪 Ready for elasticity testing!`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server; 