// Test setup for CodePal Agentic AI System

import { jest } from '@jest/globals';

// Global test configuration
beforeAll(() => {
  // Set up global test environment
  process.env.NODE_ENV = 'test';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.DEEPSEEK_API_KEY = 'test-api-key';
  process.env.GITHUB_TOKEN = 'test-github-token';
});

afterAll(() => {
  // Clean up global test environment
  jest.clearAllMocks();
});

// Global test utilities
export const createMockAgent = (type: string, name: string) => {
  return {
    id: `agent-${Date.now()}`,
    name,
    type,
    enabled: true,
    isRunning: false,
    config: {},
    permissions: [],
    metrics: {
      actionsExecuted: 0,
      successRate: 0,
      averageResponseTime: 0,
      userSatisfaction: 0,
      lastActive: new Date(),
      uptime: 0,
    },
  };
};

export const createMockAction = (type: string, payload: any = {}) => {
  return {
    id: `action-${Date.now()}`,
    type,
    payload,
    status: 'pending' as const,
    createdAt: new Date(),
  };
};

export const createMockResponse = (success: boolean, data?: any, error?: string) => {
  return {
    success,
    data,
    error,
    metadata: {
      executionTime: 100,
      confidence: 0.8,
      agentId: 'test-agent',
      timestamp: new Date(),
    },
  };
};

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
}); 