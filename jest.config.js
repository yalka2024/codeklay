module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Changed from jsdom to node for backend tests
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.json',
      useESM: false
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@prisma/client|@noble/hashes|@paralleldrive/cuid2)/)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/e2e/'],
  moduleNameMapper: {
    '^@backend/(.*)$': '<rootDir>/backend/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@codepal/(.*)$': '<rootDir>/packages/$1',
    '^@apps/(.*)$': '<rootDir>/apps/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  globals: {
    'ts-jest': {
      useESM: false,
      tsconfig: 'tsconfig.json'
    }
  },
  testTimeout: 30000, // Increased timeout for integration tests
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    'backend/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
