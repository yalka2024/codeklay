process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});
