import '@testing-library/jest-dom';

// Node.js environment setup for tests
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder (needed for supertest and other libraries)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/codepal_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.OPENAI_SECRET_KEY = 'test-openai-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Setup test database cleanup
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Global test timeout
jest.setTimeout(30000);
