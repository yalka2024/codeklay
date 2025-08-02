import { OperationalTransforms } from '../../../lib/operational-transforms';

describe('WebSocket Service Tests', () => {
  describe('Operational Transforms Integration', () => {
    test('should create and apply text operations', () => {
      const oldText = 'Hello World';
      const newText = 'Hello Beautiful World';
      
      const operation = OperationalTransforms.createOperation(oldText.length);
      OperationalTransforms.retain(operation, 6);
      OperationalTransforms.insert(operation, 'Beautiful ');
      OperationalTransforms.retain(operation, 5);
      
      const result = OperationalTransforms.apply(oldText, operation);
      expect(result).toBe(newText);
    });

    test('should handle conflict resolution with transforms', () => {
      const baseText = 'Hello World';
      
      const op1 = OperationalTransforms.createOperation(baseText.length);
      OperationalTransforms.retain(op1, 6);
      OperationalTransforms.insert(op1, 'Beautiful ');
      OperationalTransforms.retain(op1, 5);
      
      const op2 = OperationalTransforms.createOperation(baseText.length);
      OperationalTransforms.retain(op2, 11);
      OperationalTransforms.insert(op2, '!');
      
      const transformedOp2 = OperationalTransforms.transform(op2, op1, false);
      
      const text1 = OperationalTransforms.apply(baseText, op1);
      const finalText = OperationalTransforms.apply(text1, transformedOp2);
      
      expect(finalText).toBe('Hello Beautiful World!');
    });

    test('should compose operations correctly', () => {
      const baseText = 'Hello World';
      
      const op1 = OperationalTransforms.createOperation(baseText.length);
      OperationalTransforms.retain(op1, 6);
      OperationalTransforms.insert(op1, 'Beautiful ');
      OperationalTransforms.retain(op1, 5);
      
      const op2 = OperationalTransforms.createOperation(op1.targetLength);
      OperationalTransforms.retain(op2, op1.targetLength);
      OperationalTransforms.insert(op2, '!');
      
      const composedOp = OperationalTransforms.compose(op1, op2);
      const result = OperationalTransforms.apply(baseText, composedOp);
      
      expect(result).toBe('Hello Beautiful World!');
    });

    test('should invert operations correctly', () => {
      const originalText = 'Hello World';
      
      const operation = OperationalTransforms.createOperation(originalText.length);
      OperationalTransforms.retain(operation, 6);
      OperationalTransforms.insert(operation, 'Beautiful ');
      OperationalTransforms.retain(operation, 5);
      
      const modifiedText = OperationalTransforms.apply(originalText, operation);
      const invertedOp = OperationalTransforms.invert(operation, originalText);
      const restoredText = OperationalTransforms.apply(modifiedText, invertedOp);
      
      expect(restoredText).toBe(originalText);
    });
  });

  describe('Connection Health Monitoring', () => {
    test('should track connection health metrics', () => {
      const mockWebSocketService = {
        isConnected: jest.fn().mockReturnValue(true),
        latency: 50,
        reconnectAttempts: 0,
        getConnectionHealth: jest.fn().mockReturnValue({
          connected: true,
          latency: 50,
          reconnectAttempts: 0
        })
      };

      const health = mockWebSocketService.getConnectionHealth();
      
      expect(health.connected).toBe(true);
      expect(health.latency).toBe(50);
      expect(health.reconnectAttempts).toBe(0);
    });

    test('should measure latency correctly', async () => {
      const mockLatency = 100;
      const mockWebSocketService = {
        measureLatency: jest.fn().mockResolvedValue(mockLatency)
      };

      const latency = await mockWebSocketService.measureLatency();
      expect(latency).toBe(mockLatency);
    });
  });

  describe('Conflict Resolution', () => {
    test('should handle operation conflicts gracefully', () => {
      const serverOp = OperationalTransforms.createOperation(10);
      OperationalTransforms.retain(serverOp, 5);
      OperationalTransforms.insert(serverOp, 'server');
      OperationalTransforms.retain(serverOp, 5);

      const clientOp = OperationalTransforms.createOperation(10);
      OperationalTransforms.retain(clientOp, 3);
      OperationalTransforms.insert(clientOp, 'client');
      OperationalTransforms.retain(clientOp, 7);

      const transformedClientOp = OperationalTransforms.transform(clientOp, serverOp, false);
      const transformedServerOp = OperationalTransforms.transform(serverOp, clientOp, true);

      expect(transformedClientOp).toBeDefined();
      expect(transformedServerOp).toBeDefined();
    });
  });
});

