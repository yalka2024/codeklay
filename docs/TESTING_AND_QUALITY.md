# Testing & Quality Assurance Framework

## Overview

This document outlines the comprehensive testing and quality assurance framework implemented for the CodePal project. The framework includes unit tests, integration tests, end-to-end tests, performance tests, and security tests to ensure high code quality and reliability.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── backend/            # Backend service unit tests
│   └── frontend/           # Frontend component unit tests
├── integration/            # Integration tests for API endpoints
│   └── api/               # API integration tests
├── e2e/                   # End-to-end tests
│   └── playwright/        # Playwright E2E tests
├── performance/           # Performance and load tests
│   └── load-test.js       # K6 load testing
├── security/              # Security tests
│   └── security-test.js   # K6 security testing
└── setup/                 # Test setup and configuration
    ├── jest.setup.js      # Jest configuration
    ├── dom.setup.js       # DOM testing setup
    └── global.setup.js    # Global test setup
```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual functions, components, and services in isolation.

**Location**: `tests/unit/`

**Coverage**:
- Backend services (AuthService, UserService, etc.)
- Frontend components (AuthForm, Dashboard, etc.)
- Utility functions
- Custom hooks

**Example**:
```typescript
// tests/unit/backend/auth.service.test.ts
describe('AuthService', () => {
  it('should register a new user successfully', async () => {
    // Test implementation
  });
});
```

**Running Unit Tests**:
```bash
npm run test:unit
```

### 2. Integration Tests

Integration tests verify that different parts of the application work together correctly.

**Location**: `tests/integration/`

**Coverage**:
- API endpoint functionality
- Database interactions
- Authentication flows
- Service integrations

**Example**:
```typescript
// tests/integration/api/auth.test.ts
describe('Auth API Integration Tests', () => {
  it('should register a new user via API', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserData);
    
    expect(response.status).toBe(201);
  });
});
```

**Running Integration Tests**:
```bash
npm run test:integration
```

### 3. End-to-End Tests

E2E tests simulate real user interactions and test complete user journeys.

**Location**: `tests/e2e/`

**Coverage**:
- User registration and login flows
- Dashboard interactions
- Project management
- Error handling
- Accessibility

**Example**:
```typescript
// tests/e2e/playwright/auth.spec.ts
test('should register a new user successfully', async ({ page }) => {
  await page.click('text=Sign Up');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  // ... more test steps
});
```

**Running E2E Tests**:
```bash
npm run test:e2e
npm run test:e2e:ui      # With Playwright UI
npm run test:e2e:headed  # With browser visible
```

### 4. Performance Tests

Performance tests ensure the application can handle expected load and maintain good response times.

**Location**: `tests/performance/`

**Coverage**:
- Load testing (ramp-up, steady state, ramp-down)
- Stress testing (beyond normal capacity)
- Spike testing (sudden traffic increases)
- Soak testing (extended periods)

**Example**:
```javascript
// tests/performance/load-test.js
export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 10 },  // Steady state
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};
```

**Running Performance Tests**:
```bash
npm run test:performance
```

### 5. Security Tests

Security tests verify that the application is protected against common vulnerabilities.

**Location**: `tests/security/`

**Coverage**:
- Authentication security
- Authorization checks
- Input validation
- SQL injection protection
- XSS protection
- CSRF protection
- Rate limiting
- Security headers

**Example**:
```javascript
// tests/security/security-test.js
function testSQLInjectionProtection() {
  SQL_INJECTION_PAYLOADS.forEach(payload => {
    const response = http.post('/api/auth/login', {
      email: payload,
      password: 'password123',
    });
    
    expect(response.status).toBe(400);
  });
}
```

**Running Security Tests**:
```bash
npm run test:security
```

## Test Configuration

### Jest Configuration

**File**: `jest.config.js`

**Key Features**:
- Multiple test environments (jsdom, node)
- Coverage reporting
- Custom matchers
- Mock configurations
- Project-based organization

### Playwright Configuration

**File**: `playwright.config.ts`

**Key Features**:
- Multiple browser support
- Parallel test execution
- Screenshot and video capture
- Retry mechanisms
- Custom fixtures

### K6 Configuration

**File**: `k6.config.js`

**Key Features**:
- Multiple test scenarios
- Custom metrics
- Threshold definitions
- Environment-specific configurations

## Test Utilities

### Global Test Utilities

**File**: `tests/setup/jest.setup.js`

**Available Utilities**:
- `testUtils.waitForElement()` - Wait for element to appear
- `testUtils.mockApiResponse()` - Mock API responses
- `testUtils.createTestUser()` - Create test user data
- `testUtils.mockAuthContext()` - Mock authentication context

### Custom Matchers

```typescript
// Custom Jest matchers
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('expected text');
expect(element).toBeVisible();
```

## Coverage Requirements

### Code Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **HTML**: Interactive web report
- **LCOV**: CI/CD integration
- **JSON**: Programmatic access

**Viewing Coverage**:
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## Continuous Integration

### GitHub Actions Integration

Tests are automatically run in CI/CD pipeline:

```yaml
# .github/workflows/ci-cd-pipeline.yml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:e2e
    npm run test:performance
    npm run test:security
```

### Test Reports

Test results are published as artifacts:
- JUnit XML reports
- Coverage reports
- Performance metrics
- Security scan results

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert Pattern**:
   ```typescript
   // Arrange
   const user = createTestUser();
   mockApiResponse('/api/users', user);
   
   // Act
   const result = await userService.getUser(user.id);
   
   // Assert
   expect(result).toEqual(user);
   ```

2. **Descriptive Test Names**:
   ```typescript
   it('should return 400 when email is invalid', async () => {
     // Test implementation
   });
   ```

3. **Test Isolation**:
   - Each test should be independent
   - Clean up after each test
   - Use beforeEach/afterEach hooks

4. **Mock External Dependencies**:
   ```typescript
   jest.mock('@/lib/api', () => ({
     fetchUser: jest.fn(),
   }));
   ```

### Test Data Management

1. **Factory Functions**:
   ```typescript
   const createTestUser = (overrides = {}) => ({
     id: 'test-id',
     email: 'test@example.com',
     ...overrides,
   });
   ```

2. **Test Database**:
   - Use separate test database
   - Reset data between tests
   - Use transactions for rollback

### Performance Testing

1. **Realistic Scenarios**:
   - Model real user behavior
   - Include think time
   - Test gradual load increases

2. **Monitoring**:
   - Track response times
   - Monitor error rates
   - Set appropriate thresholds

### Security Testing

1. **Comprehensive Coverage**:
   - Test all input validation
   - Verify authentication flows
   - Check authorization rules

2. **Regular Updates**:
   - Update test payloads
   - Add new vulnerability tests
   - Review security headers

## Troubleshooting

### Common Issues

1. **Test Timeouts**:
   - Increase timeout in Jest config
   - Check for async operations
   - Verify mock implementations

2. **Flaky Tests**:
   - Add proper waits
   - Use stable selectors
   - Avoid time-based assertions

3. **Coverage Issues**:
   - Check file patterns in config
   - Verify test file locations
   - Review coverage exclusions

### Debugging

1. **Jest Debug Mode**:
   ```bash
   npm run test:unit -- --verbose --detectOpenHandles
   ```

2. **Playwright Debug Mode**:
   ```bash
   npm run test:e2e -- --debug
   ```

3. **K6 Debug Mode**:
   ```bash
   k6 run --verbose tests/performance/load-test.js
   ```

## Maintenance

### Regular Tasks

1. **Update Dependencies**:
   - Keep testing libraries updated
   - Review breaking changes
   - Update test configurations

2. **Review Test Coverage**:
   - Monitor coverage trends
   - Add tests for new features
   - Remove obsolete tests

3. **Performance Monitoring**:
   - Track test execution time
   - Optimize slow tests
   - Update performance thresholds

### Quality Metrics

- **Test Coverage**: Maintain >80%
- **Test Execution Time**: <10 minutes for full suite
- **Flaky Test Rate**: <1%
- **Security Test Pass Rate**: 100%

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [K6 Documentation](https://k6.io/docs/)

### Tools
- [Testing Library](https://testing-library.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Jest Coverage](https://jestjs.io/docs/configuration#collectcoveragefrom-array)

### Best Practices
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [E2E Testing Guide](https://playwright.dev/docs/best-practices)
- [Performance Testing Guide](https://k6.io/docs/testing-guides/) 