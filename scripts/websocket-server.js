const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections and rooms
const rooms = new Map();
const connections = new Map();

console.log('🚀 Starting WebSocket server for real-time collaboration...');

wss.on('connection', (ws, req) => {
  const connectionId = Date.now().toString();
  connections.set(connectionId, ws);
  
  console.log(`📡 New connection: ${connectionId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(connectionId, data);
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(connectionId);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    handleDisconnect(connectionId);
  });
});

function handleMessage(connectionId, data) {
  const { type, roomId, payload } = data;
  
  console.log(`📨 Message from ${connectionId}: ${type} in room ${roomId}`);

  switch (type) {
    case 'join_room':
      joinRoom(connectionId, roomId, payload);
      break;
    case 'leave_room':
      leaveRoom(connectionId, roomId);
      break;
    case 'code_change':
      broadcastToRoom(roomId, {
        type: 'code_change',
        connectionId,
        payload
      });
      break;
    case 'cursor_move':
      broadcastToRoom(roomId, {
        type: 'cursor_move',
        connectionId,
        payload
      });
      break;
    case 'chat_message':
      broadcastToRoom(roomId, {
        type: 'chat_message',
        connectionId,
        payload
      });
      break;
    case 'user_typing':
      broadcastToRoom(roomId, {
        type: 'user_typing',
        connectionId,
        payload
      });
      break;
    case 'file_save':
      broadcastToRoom(roomId, {
        type: 'file_save',
        connectionId,
        payload
      });
      break;
    default:
      console.log(`⚠️ Unknown message type: ${type}`);
  }
}

function joinRoom(connectionId, roomId, userData) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  const room = rooms.get(roomId);
  room.add(connectionId);
  
  // Store user data
  connections.get(connectionId).userData = userData;
  
  // Notify others in the room
  broadcastToRoom(roomId, {
    type: 'user_joined',
    connectionId,
    payload: userData
  });
  
  // Send current room state to new user
  const ws = connections.get(connectionId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'room_state',
      payload: {
        roomId,
        users: Array.from(room).map(id => ({
          id,
          userData: connections.get(id)?.userData
        }))
      }
    }));
  }
  
  console.log(`👥 User ${userData?.name || connectionId} joined room ${roomId}`);
}

function leaveRoom(connectionId, roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.delete(connectionId);
    
    // Notify others in the room
    broadcastToRoom(roomId, {
      type: 'user_left',
      connectionId
    });
    
    // Clean up empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    }
  }
}

function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  
  room.forEach(connectionId => {
    const ws = connections.get(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

function handleDisconnect(connectionId) {
  console.log(`🔌 Connection closed: ${connectionId}`);
  
  // Remove from all rooms
  rooms.forEach((room, roomId) => {
    if (room.has(connectionId)) {
      leaveRoom(connectionId, roomId);
    }
  });
  
  // Remove connection
  connections.delete(connectionId);
}

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      connections: connections.size,
      rooms: rooms.size,
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start server
const PORT = process.env.WS_PORT || 3002;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ WebSocket server stopped');
      process.exit(0);
    });
  });
}); 