import { io, Socket } from 'socket.io-client';
import { OperationalTransforms, TextOperation } from '../../lib/operational-transforms';

describe('Collaborative Editor Stress Tests', () => {
  const WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'http://localhost:3001';
  const CONCURRENT_USERS = 10;
  const OPERATIONS_PER_USER = 50;
  const TEST_TIMEOUT = 30000;

  let sockets: Socket[] = [];
  let roomId: string;

  beforeAll(() => {
    roomId = `stress-test-${Date.now()}`;
  });

  afterAll(async () => {
    await Promise.all(sockets.map(socket => {
      return new Promise<void>((resolve) => {
        if (socket.connected) {
          socket.disconnect();
        }
        resolve();
      });
    }));
  });

  test('should handle concurrent users editing simultaneously', async () => {
    const connections = await Promise.all(
      Array.from({ length: CONCURRENT_USERS }, (_, index) => 
        createUserConnection(`user-${index}`)
      )
    );

    sockets = connections;

    const operationPromises = connections.map((socket, userIndex) => 
      simulateUserOperations(socket, userIndex, OPERATIONS_PER_USER)
    );

    await Promise.all(operationPromises);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const finalStates = await Promise.all(
      connections.map(socket => getCurrentDocumentState(socket))
    );

    const firstState = finalStates[0];
    finalStates.forEach((state, index) => {
      expect(state).toBe(firstState);
    });
  }, TEST_TIMEOUT);

  test('should maintain document consistency under high load', async () => {
    const connections = await Promise.all(
      Array.from({ length: CONCURRENT_USERS }, (_, index) => 
        createUserConnection(`load-user-${index}`)
      )
    );

    sockets = connections;

    const startTime = Date.now();
    const operations: Array<{ userId: string; operation: TextOperation; timestamp: number }> = [];

    const operationPromises = connections.map(async (socket, userIndex) => {
      const userId = `load-user-${userIndex}`;
      
      for (let i = 0; i < OPERATIONS_PER_USER; i++) {
        const operation = createRandomOperation();
        operations.push({ userId, operation, timestamp: Date.now() });
        
        socket.emit('code_change', {
          roomId,
          fileId: 'main',
          operation: OperationalTransforms.toJSON(operation),
          userId,
          timestamp: Date.now()
        });

        await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
      }
    });

    await Promise.all(operationPromises);
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    const endTime = Date.now();
    const totalOperations = CONCURRENT_USERS * OPERATIONS_PER_USER;
    const operationsPerSecond = totalOperations / ((endTime - startTime) / 1000);

    console.log(`Processed ${totalOperations} operations in ${endTime - startTime}ms`);
    console.log(`Operations per second: ${operationsPerSecond.toFixed(2)}`);

    expect(operationsPerSecond).toBeGreaterThan(10);
  }, TEST_TIMEOUT);

  test('should handle connection drops and reconnections', async () => {
    const connections = await Promise.all(
      Array.from({ length: 5 }, (_, index) => 
        createUserConnection(`reconnect-user-${index}`)
      )
    );

    sockets = connections;

    const disconnectPromises = connections.slice(0, 2).map(async (socket, index) => {
      await new Promise(resolve => setTimeout(resolve, index * 1000));
      socket.disconnect();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      socket.connect();
      await waitForConnection(socket);
      
      socket.emit('join_room', { roomId, userId: `reconnect-user-${index}` });
    });

    const operationPromises = connections.slice(2).map((socket, index) => 
      simulateUserOperations(socket, index + 2, 20)
    );

    await Promise.all([...disconnectPromises, ...operationPromises]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const finalStates = await Promise.all(
      connections.map(socket => getCurrentDocumentState(socket))
    );

    const firstState = finalStates[0];
    finalStates.forEach(state => {
      expect(state).toBe(firstState);
    });
  }, TEST_TIMEOUT);

  test('should measure WebSocket latency under load', async () => {
    const socket = await createUserConnection('latency-user');
    sockets = [socket];

    const latencies: number[] = [];
    const PING_COUNT = 100;

    for (let i = 0; i < PING_COUNT; i++) {
      const startTime = Date.now();
      
      socket.emit('ping', startTime);
      
      const latency = await new Promise<number>((resolve) => {
        const timeout = setTimeout(() => resolve(-1), 5000);
        
        socket.once('pong', (timestamp) => {
          clearTimeout(timeout);
          resolve(Date.now() - timestamp);
        });
      });

      if (latency > 0) {
        latencies.push(latency);
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const avgLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const maxLatency = Math.max(...latencies);
    const minLatency = Math.min(...latencies);

    console.log(`Average latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`Min latency: ${minLatency}ms, Max latency: ${maxLatency}ms`);

    expect(avgLatency).toBeLessThan(1000);
    expect(latencies.length).toBeGreaterThan(PING_COUNT * 0.9);
  }, TEST_TIMEOUT);

  async function createUserConnection(userId: string): Promise<Socket> {
    const socket = io(WEBSOCKET_URL, {
      transports: ['websocket'],
      timeout: 5000
    });

    await waitForConnection(socket);
    
    socket.emit('join_room', { roomId, userId });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return socket;
  }

  async function waitForConnection(socket: Socket): Promise<void> {
    return new Promise((resolve, reject) => {
      if (socket.connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);

      socket.once('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async function simulateUserOperations(socket: Socket, userIndex: number, operationCount: number): Promise<void> {
    const userId = `user-${userIndex}`;
    
    for (let i = 0; i < operationCount; i++) {
      const operation = createRandomOperation();
      
      socket.emit('code_change', {
        roomId,
        fileId: 'main',
        operation: OperationalTransforms.toJSON(operation),
        userId,
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    }
  }

  function createRandomOperation(): TextOperation {
    const operations = [
      () => {
        const op = OperationalTransforms.createOperation(10);
        OperationalTransforms.retain(op, Math.floor(Math.random() * 5));
        OperationalTransforms.insert(op, `text-${Math.random().toString(36).substr(2, 5)}`);
        OperationalTransforms.retain(op, 10 - Math.floor(Math.random() * 5));
        return op;
      },
      () => {
        const op = OperationalTransforms.createOperation(10);
        OperationalTransforms.retain(op, Math.floor(Math.random() * 3));
        OperationalTransforms.delete(op, Math.floor(Math.random() * 3) + 1);
        OperationalTransforms.retain(op, 10 - Math.floor(Math.random() * 6) - 1);
        return op;
      },
      () => {
        const op = OperationalTransforms.createOperation(10);
        OperationalTransforms.retain(op, Math.floor(Math.random() * 2));
        OperationalTransforms.delete(op, Math.floor(Math.random() * 2) + 1);
        OperationalTransforms.insert(op, `replace-${Math.random().toString(36).substr(2, 3)}`);
        OperationalTransforms.retain(op, 10 - Math.floor(Math.random() * 4) - 1);
        return op;
      }
    ];

    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    return randomOperation();
  }

  async function getCurrentDocumentState(socket: Socket): Promise<string> {
    return new Promise((resolve) => {
      socket.emit('get_document_state', { roomId, fileId: 'main' });
      
      const timeout = setTimeout(() => {
        resolve('');
      }, 2000);

      socket.once('document_state', (data) => {
        clearTimeout(timeout);
        resolve(data.content || '');
      });
    });
  }
});
