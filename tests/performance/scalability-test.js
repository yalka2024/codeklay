const { check } = require('k6');
const http = require('k6/http');
const { Rate, Trend, Counter } = require('k6/metrics');

// Custom metrics for scalability testing
const errorRate = new Rate('errors');
const successRate = new Rate('success');
const responseTime = new Trend('response_time');
const throughput = new Counter('throughput');
const memoryUsage = new Trend('memory_usage');
const cpuUsage = new Trend('cpu_usage');

// Scalability test configuration
export const options = {
  scenarios: {
    // Baseline performance test
    baseline: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 0 },
      ],
      exec: 'baselineTest',
    },
    
    // Expected load test (target: 1000 concurrent users)
    expected_load: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 500 },
        { duration: '10m', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '5m', target: 0 },
      ],
      exec: 'expectedLoadTest',
    },
    
    // Peak load test (target: 5000 concurrent users)
    peak_load: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '5m', target: 1000 },
        { duration: '10m', target: 2500 },
        { duration: '10m', target: 5000 },
        { duration: '5m', target: 5000 },
        { duration: '5m', target: 0 },
      ],
      exec: 'peakLoadTest',
    },
    
    // Stress test (beyond capacity)
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 500,
      stages: [
        { duration: '5m', target: 2000 },
        { duration: '10m', target: 5000 },
        { duration: '10m', target: 10000 },
        { duration: '5m', target: 10000 },
        { duration: '5m', target: 0 },
      ],
      exec: 'stressTest',
    },
    
    // Spike test (sudden traffic increase)
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '30s', target: 2000 },
        { duration: '2m', target: 2000 },
        { duration: '30s', target: 10 },
        { duration: '2m', target: 10 },
      ],
      exec: 'spikeTest',
    },
    
    // Soak test (extended period)
    soak_test: {
      executor: 'constant-vus',
      vus: 500,
      duration: '2h',
      exec: 'soakTest',
    },
  },
  
  thresholds: {
    // Performance thresholds
    http_req_duration: [
      'p(50)<200',   // 50% of requests under 200ms
      'p(90)<500',   // 90% of requests under 500ms
      'p(95)<1000',  // 95% of requests under 1s
      'p(99)<2000',  // 99% of requests under 2s
    ],
    
    // Error rate thresholds
    http_req_failed: [
      'rate<0.01',   // Less than 1% error rate
    ],
    
    // Custom metric thresholds
    errors: ['rate<0.01'],
    success: ['rate>0.99'],
    response_time: [
      'p(95)<1000',  // 95% response time under 1s
    ],
    
    // Throughput thresholds
    throughput: [
      'count>10000', // Minimum 10k requests
    ],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_USERS = [];
const AUTH_TOKENS = [];

// Test data generation
function generateTestData() {
  const testUser = {
    email: `scalability${Date.now()}${Math.random()}@example.com`,
    password: 'SecurePassword123!',
    firstName: 'Scalability',
    lastName: 'Test',
  };
  
  TEST_USERS.push(testUser);
  return testUser;
}

// Setup function - runs once before all tests
export function setup() {
  console.log('Setting up scalability test...');
  
  // Generate test users for different load scenarios
  for (let i = 0; i < 100; i++) {
    generateTestData();
  }
  
  // Pre-authenticate some users
  const authPromises = TEST_USERS.slice(0, 50).map(async (user) => {
    try {
      // Register user
      const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(user), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (registerResponse.status === 201) {
        // Login to get token
        const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
          email: user.email,
          password: user.password,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (loginResponse.status === 200) {
          const loginData = JSON.parse(loginResponse.body);
          AUTH_TOKENS.push(loginData.accessToken);
        }
      }
    } catch (error) {
      console.log(`Failed to setup user ${user.email}:`, error);
    }
  });
  
  // Wait for authentication setup
  Promise.all(authPromises);
  
  console.log(`Setup complete. Generated ${TEST_USERS.length} test users, ${AUTH_TOKENS.length} authenticated.`);
  
  return { testUsers: TEST_USERS, authTokens: AUTH_TOKENS };
}

// Baseline performance test
export function baselineTest(data) {
  const { authTokens } = data;
  
  // Test basic functionality with minimal load
  const responses = {
    health: http.get(`${BASE_URL}/api/health`),
    auth: http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: 'baseline@example.com',
      password: 'password123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    }),
    profile: authTokens.length > 0 ? http.get(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authTokens[0]}` },
    }) : null,
  };
  
  // Validate responses
  check(responses.health, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  check(responses.auth, {
    'auth response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  if (responses.profile) {
    check(responses.profile, {
      'profile response time < 200ms': (r) => r.timings.duration < 200,
    });
  }
  
  // Record metrics
  responseTime.add(responses.health.timings.duration);
  throughput.add(1);
  
  const success = responses.health.status === 200;
  successRate.add(success);
  errorRate.add(!success);
}

// Expected load test (1000 concurrent users)
export function expectedLoadTest(data) {
  const { authTokens } = data;
  
  // Simulate realistic user behavior
  const userActions = [
    () => http.get(`${BASE_URL}/api/health`),
    () => http.get(`${BASE_URL}/api/analytics/stats`),
    () => http.get(`${BASE_URL}/api/projects`),
    () => http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: 'Hello, this is a scalability test message',
      context: 'test',
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authTokens.length > 0 ? `Bearer ${authTokens[Math.floor(Math.random() * authTokens.length)]}` : '',
      },
    }),
  ];
  
  // Randomly select user action
  const action = userActions[Math.floor(Math.random() * userActions.length)];
  const response = action();
  
  // Validate response
  check(response, {
    'expected load response time < 500ms': (r) => r.timings.duration < 500,
    'expected load status is successful': (r) => r.status >= 200 && r.status < 500,
  });
  
  // Record metrics
  responseTime.add(response.timings.duration);
  throughput.add(1);
  
  const success = response.status >= 200 && response.status < 500;
  successRate.add(success);
  errorRate.add(!success);
  
  // Add think time to simulate real user behavior
  const thinkTime = Math.random() * 3 + 1; // 1-4 seconds
  sleep(thinkTime);
}

// Peak load test (5000 concurrent users)
export function peakLoadTest(data) {
  const { authTokens } = data;
  
  // More intensive operations
  const intensiveActions = [
    () => http.get(`${BASE_URL}/api/analytics/stats`),
    () => http.get(`${BASE_URL}/api/projects`),
    () => http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: 'This is a peak load test with a longer message to test AI processing capabilities under high load conditions',
      context: 'peak-load-test',
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authTokens.length > 0 ? `Bearer ${authTokens[Math.floor(Math.random() * authTokens.length)]}` : '',
      },
    }),
    () => http.get(`${BASE_URL}/api/user/api-keys`),
  ];
  
  const action = intensiveActions[Math.floor(Math.random() * intensiveActions.length)];
  const response = action();
  
  check(response, {
    'peak load response time < 1000ms': (r) => r.timings.duration < 1000,
    'peak load status is successful': (r) => r.status >= 200 && r.status < 500,
  });
  
  responseTime.add(response.timings.duration);
  throughput.add(1);
  
  const success = response.status >= 200 && response.status < 500;
  successRate.add(success);
  errorRate.add(!success);
  
  // Shorter think time for higher load
  const thinkTime = Math.random() * 2 + 0.5; // 0.5-2.5 seconds
  sleep(thinkTime);
}

// Stress test (beyond capacity - 10000 concurrent users)
export function stressTest(data) {
  const { authTokens } = data;
  
  // Stress the system with complex operations
  const stressActions = [
    () => http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: 'Stress test message with complex AI processing requirements and multiple context switches',
      context: 'stress-test',
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authTokens.length > 0 ? `Bearer ${authTokens[Math.floor(Math.random() * authTokens.length)]}` : '',
      },
    }),
    () => http.get(`${BASE_URL}/api/analytics/stats`),
    () => http.get(`${BASE_URL}/api/projects`),
  ];
  
  const action = stressActions[Math.floor(Math.random() * stressActions.length)];
  const response = action();
  
  check(response, {
    'stress test response time < 2000ms': (r) => r.timings.duration < 2000,
    'stress test handles errors gracefully': (r) => r.status !== 500,
  });
  
  responseTime.add(response.timings.duration);
  throughput.add(1);
  
  const success = response.status >= 200 && response.status < 500;
  successRate.add(success);
  errorRate.add(!success);
  
  // Minimal think time for maximum stress
  const thinkTime = Math.random() * 1 + 0.1; // 0.1-1.1 seconds
  sleep(thinkTime);
}

// Spike test (sudden traffic increase)
export function spikeTest(data) {
  const { authTokens } = data;
  
  // Test system's ability to handle sudden spikes
  const spikeActions = [
    () => http.get(`${BASE_URL}/api/health`),
    () => http.get(`${BASE_URL}/api/analytics/stats`),
    () => http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: `spike${Date.now()}@example.com`,
      password: 'password123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    }),
  ];
  
  const action = spikeActions[Math.floor(Math.random() * spikeActions.length)];
  const response = action();
  
  check(response, {
    'spike test response time < 1000ms': (r) => r.timings.duration < 1000,
    'spike test maintains service': (r) => r.status !== 503,
  });
  
  responseTime.add(response.timings.duration);
  throughput.add(1);
  
  const success = response.status >= 200 && response.status < 500;
  successRate.add(success);
  errorRate.add(!success);
}

// Soak test (extended period)
export function soakTest(data) {
  const { authTokens } = data;
  
  // Long-running test to detect memory leaks and performance degradation
  const soakActions = [
    () => http.get(`${BASE_URL}/api/health`),
    () => http.get(`${BASE_URL}/api/analytics/stats`),
    () => http.get(`${BASE_URL}/api/projects`),
    () => http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: 'Soak test message',
      context: 'soak-test',
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authTokens.length > 0 ? `Bearer ${authTokens[Math.floor(Math.random() * authTokens.length)]}` : '',
      },
    }),
  ];
  
  const action = soakActions[Math.floor(Math.random() * soakActions.length)];
  const response = action();
  
  check(response, {
    'soak test response time consistent': (r) => r.timings.duration < 1000,
    'soak test no degradation': (r) => r.status >= 200 && r.status < 500,
  });
  
  responseTime.add(response.timings.duration);
  throughput.add(1);
  
  const success = response.status >= 200 && response.status < 500;
  successRate.add(success);
  errorRate.add(!success);
  
  // Regular intervals for soak test
  const thinkTime = Math.random() * 5 + 2; // 2-7 seconds
  sleep(thinkTime);
}

// Helper function for sleep
function sleep(seconds) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + seconds * 1000) {
    // Busy wait
  }
}

// Teardown function
export function teardown(data) {
  console.log('Cleaning up scalability test...');
  
  // Clean up test users if needed
  // Note: In production, you might want to clean up test data
  console.log('Scalability test completed');
}

// Additional test scenarios for specific scale targets
export const scaleTargets = {
  // Small scale (100 users)
  small: {
    executor: 'ramping-vus',
    startVUs: 1,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 0 },
    ],
    exec: 'expectedLoadTest',
  },
  
  // Medium scale (1000 users)
  medium: {
    executor: 'ramping-vus',
    startVUs: 10,
    stages: [
      { duration: '5m', target: 500 },
      { duration: '10m', target: 1000 },
      { duration: '5m', target: 0 },
    ],
    exec: 'expectedLoadTest',
  },
  
  // Large scale (5000 users)
  large: {
    executor: 'ramping-vus',
    startVUs: 100,
    stages: [
      { duration: '10m', target: 2500 },
      { duration: '10m', target: 5000 },
      { duration: '5m', target: 0 },
    ],
    exec: 'peakLoadTest',
  },
  
  // Extreme scale (10000+ users)
  extreme: {
    executor: 'ramping-vus',
    startVUs: 500,
    stages: [
      { duration: '10m', target: 5000 },
      { duration: '10m', target: 10000 },
      { duration: '5m', target: 0 },
    ],
    exec: 'stressTest',
  },
}; 