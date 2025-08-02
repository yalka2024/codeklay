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
  } else if (url === '/auth/login' && method === 'POST') {
    // Mock authentication endpoint for POST requests
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        tokens: {
          accessToken: 'mock-access-token-' + Math.random().toString(36).substr(2, 9),
          refreshToken: 'mock-refresh-token-' + Math.random().toString(36).substr(2, 9)
        },
        message: 'Authentication successful',
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/auth/login' && method === 'GET') {
    // Mock authentication endpoint for GET requests
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'Authentication endpoint accessible',
      timestamp: new Date().toISOString()
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
  } else if (url === '/ai/complete' && method === 'POST') {
    // Mock AI completion endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        completion: 'return a + b; }',
        confidence: Math.random() * 100,
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/ai/analyze' && method === 'POST') {
    // Mock AI analysis endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        analysis: {
          performance: Math.random() * 100,
          security: Math.random() * 100,
          maintainability: Math.random() * 100
        },
        recommendations: [
          'Consider using const instead of let',
          'Add error handling',
          'Optimize loop performance'
        ],
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/agents/action' && method === 'POST') {
    // Mock agents action endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        agent_id: 'agent-' + Math.random().toString(36).substr(2, 9),
        action: 'completed',
        result: {
          status: 'success',
          data: 'Action completed successfully'
        },
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/agents/metrics' && method === 'GET') {
    // Mock agents metrics endpoint
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      metrics: {
        active_agents: 2,
        total_requests: Math.floor(Math.random() * 1000),
        success_rate: Math.random() * 100,
        average_response_time: Math.random() * 100
      },
      timestamp: new Date().toISOString()
    }));
  } else if (url === '/projects/create' && method === 'POST') {
    // Mock project creation endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        project: {
          id: 'proj-' + Math.random().toString(36).substr(2, 9),
          name: 'Test Project',
          description: 'Load test project',
          visibility: 'private'
        },
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url.startsWith('/projects/') && url.includes('/files') && method === 'POST') {
    // Mock project files endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        file: {
          path: 'src/main.js',
          content: 'console.log("Hello World");',
          message: 'Initial commit'
        },
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url.startsWith('/projects/') && url.includes('/commit') && method === 'POST') {
    // Mock project commit endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        commit: {
          id: 'commit-' + Math.random().toString(36).substr(2, 9),
          message: 'Update from load test',
          files: ['src/main.js']
        },
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/collaboration/join' && method === 'POST') {
    // Mock collaboration join endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        room_id: 'room-' + Math.random().toString(36).substr(2, 9),
        user_id: 'user-' + Math.random().toString(36).substr(2, 9),
        status: 'joined',
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/collaboration/broadcast' && method === 'POST') {
    // Mock collaboration broadcast endpoint
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: {
          type: 'code_change',
          data: {
            file: 'src/main.js',
            changes: 'console.log("Collaborative edit");'
          }
        },
        timestamp: new Date().toISOString()
      }));
    });
    return;
  } else if (url === '/collaboration/status' && method === 'GET') {
    // Mock collaboration status endpoint
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      status: {
        room_id: 'room-' + Math.random().toString(36).substr(2, 9),
        active_users: Math.floor(Math.random() * 10) + 1,
        last_activity: new Date().toISOString()
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