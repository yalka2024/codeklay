const http = require('http');

console.log('🔍 CodePal Platform Status Check');
console.log('================================');

// Check main platform
function checkMainPlatform() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Main Platform (port 3001): RUNNING');
        resolve(true);
      } else {
        console.log(`❌ Main Platform (port 3001): ERROR - Status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Main Platform (port 3001): NOT RUNNING');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Main Platform (port 3001): TIMEOUT');
      req.destroy();
      resolve(false);
    });
  });
}

// Check WebSocket server
function checkWebSocketServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/health', (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            console.log(`✅ WebSocket Server (port 3002): RUNNING`);
            console.log(`   - Connections: ${health.connections}`);
            console.log(`   - Rooms: ${health.rooms}`);
            resolve(true);
          } catch (e) {
            console.log('❌ WebSocket Server (port 3002): INVALID RESPONSE');
            resolve(false);
          }
        });
      } else {
        console.log(`❌ WebSocket Server (port 3002): ERROR - Status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ WebSocket Server (port 3002): NOT RUNNING');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ WebSocket Server (port 3002): TIMEOUT');
      req.destroy();
      resolve(false);
    });
  });
}

// Check collaborative workspace
function checkCollaborativeWorkspace() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/collaborative-workspace', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Collaborative Workspace: ACCESSIBLE');
        resolve(true);
      } else {
        console.log(`❌ Collaborative Workspace: ERROR - Status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Collaborative Workspace: NOT ACCESSIBLE');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Collaborative Workspace: TIMEOUT');
      req.destroy();
      resolve(false);
    });
  });
}

// Check API endpoints
function checkAPIEndpoints() {
  const endpoints = [
    { name: 'AI Chat API', path: '/api/ai/chat' },
    { name: 'Analytics API', path: '/api/analytics/stats' },
    { name: 'Plugin API', path: '/api/plugins' },
  ];
  
  const checks = endpoints.map(endpoint => {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:3001${endpoint.path}`, (res) => {
        if (res.statusCode < 500) {
          console.log(`✅ ${endpoint.name}: RESPONDING`);
          resolve(true);
        } else {
          console.log(`❌ ${endpoint.name}: ERROR - Status ${res.statusCode}`);
          resolve(false);
        }
      });
      
      req.on('error', () => {
        console.log(`❌ ${endpoint.name}: NOT RESPONDING`);
        resolve(false);
      });
      
      req.setTimeout(3000, () => {
        console.log(`❌ ${endpoint.name}: TIMEOUT`);
        req.destroy();
        resolve(false);
      });
    });
  });
  
  return Promise.all(checks);
}

// Main status check
async function runStatusCheck() {
  console.log('\n📊 Checking services...\n');
  
  const results = await Promise.all([
    checkMainPlatform(),
    checkWebSocketServer(),
    checkCollaborativeWorkspace(),
    checkAPIEndpoints()
  ]);
  
  console.log('\n📈 Summary:');
  console.log('==========');
  
  const allRunning = results.every(result => Array.isArray(result) ? result.every(r => r) : result);
  
  if (allRunning) {
    console.log('🎉 All services are running successfully!');
    console.log('\n🌐 Access URLs:');
    console.log('   - Main Platform: http://localhost:3001');
    console.log('   - Collaborative Workspace: http://localhost:3001/collaborative-workspace');
    console.log('   - WebSocket Health: http://localhost:3002/health');
  } else {
    console.log('⚠️  Some services are not running properly.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure main platform is running: npm run dev');
    console.log('   2. Ensure WebSocket server is running: node scripts/websocket-server.js');
    console.log('   3. Check for any error messages in the console');
  }
  
  console.log('\n📚 For more information, see COLLABORATION_DEMO.md');
}

// Run the status check
runStatusCheck().catch(console.error); 