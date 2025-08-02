process.env.NODE_ENV = 'test';
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb_e2e';

global.testConfig = {
  baseURL: process.env.BASE_URL,
  timeout: 30000,
  retries: 2,
};
