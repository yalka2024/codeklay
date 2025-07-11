module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}',
  ],
  
  // Test setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js',
    '<rootDir>/tests/setup/dom.setup.js',
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/backend/(.*)$': '<rootDir>/backend/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'backend/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!**/dist/**',
    '!**/build/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Global test setup
  globalSetup: '<rootDir>/tests/setup/global.setup.js',
  globalTeardown: '<rootDir>/tests/setup/global.teardown.js',
  
  // Projects for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/unit.setup.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js'],
      testEnvironment: 'node',
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/tests/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/e2e.setup.js'],
      testEnvironment: 'node',
    },
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
    }],
  ],
  
  // Snapshot serializers
  snapshotSerializers: [
    'jest-serializer-path',
    'jest-serializer-html',
  ],
  
  // Module path mapping for testing
  modulePaths: ['<rootDir>'],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/tests/',
    '/scripts/',
    '/docs/',
  ],
  
  // Maximum workers
  maxWorkers: '50%',
  
  // Force exit
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Run tests in band for integration tests
  runInBand: false,
  
  // Bail on first failure (useful for CI)
  bail: process.env.CI ? 1 : 0,
  
  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Cache key
  cacheKey: process.env.NODE_ENV + process.env.JEST_WORKER_ID,
  
  // Preprocessors
  preprocessors: {
    '**/*.{js,jsx,ts,tsx}': ['babel-jest'],
  },
  
  // Test results processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Sonar reporter configuration
  sonarQubeUnitReporter: {
    sonarQubeVersion: 'LATEST',
    outputFile: 'coverage/sonar-report.xml',
    usePathForSuiteName: true,
  },
}; 