const { check } = require('k6');
const http = require('k6/http');
const { Rate } = require('k6/metrics');

// Custom metrics
const errorRate = new Rate('errors');
const successRate = new Rate('success');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'], // Error rate must be less than 10%
    errors: ['rate<0.1'],
    success: ['rate>0.9'],
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_USER = {
  email: 'loadtest@example.com',
  password: 'password123',
  firstName: 'Load',
  lastName: 'Test',
};

// Shared state
let authToken = null;
let refreshToken = null;

// Setup function - runs once before the test
export function setup() {
  console.log('Setting up load test...');
  
  // Register a test user
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(TEST_USER), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (registerResponse.status !== 201) {
    console.log('Failed to register test user:', registerResponse.body);
  }
  
  // Login to get tokens
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: TEST_USER.email,
    password: TEST_USER.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.accessToken;
    refreshToken = loginData.refreshToken;
    console.log('Successfully authenticated for load test');
  } else {
    console.log('Failed to login test user:', loginResponse.body);
  }
  
  return { authToken, refreshToken };
}

// Main test function
export default function(data) {
  const { authToken, refreshToken } = data;
  
  // Test 1: Health Check
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  // Test 2: User Registration (without auth)
  const newUser = {
    email: `loadtest${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Load',
    lastName: 'Test',
  };
  
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(newUser), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(registerResponse, {
    'register status is 201': (r) => r.status === 201,
    'register response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  // Test 3: User Login
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: newUser.email,
    password: newUser.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
    'login returns access token': (r) => {
      if (r.status === 200) {
        const data = JSON.parse(r.body);
        return data.accessToken && data.refreshToken;
      }
      return false;
    },
  });
  
  // Test 4: Get User Profile (with auth)
  if (authToken) {
    const profileResponse = http.get(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    check(profileResponse, {
      'profile status is 200': (r) => r.status === 200,
      'profile response time < 200ms': (r) => r.timings.duration < 200,
      'profile returns user data': (r) => {
        if (r.status === 200) {
          const data = JSON.parse(r.body);
          return data.email && data.firstName && data.lastName;
        }
        return false;
      },
    });
  }
  
  // Test 5: Refresh Token
  if (refreshToken) {
    const refreshResponse = http.post(`${BASE_URL}/api/auth/refresh`, JSON.stringify({
      refreshToken: refreshToken,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(refreshResponse, {
      'refresh status is 200': (r) => r.status === 200,
      'refresh response time < 300ms': (r) => r.timings.duration < 300,
      'refresh returns new access token': (r) => {
        if (r.status === 200) {
          const data = JSON.parse(r.body);
          return data.accessToken;
        }
        return false;
      },
    });
  }
  
  // Test 6: AI Chat Endpoint (if available)
  if (authToken) {
    const chatResponse = http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: 'Hello, this is a load test message',
      context: 'test',
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    check(chatResponse, {
      'chat status is 200': (r) => r.status === 200,
      'chat response time < 5000ms': (r) => r.timings.duration < 5000, // AI responses can be slower
    });
  }
  
  // Test 7: Analytics Endpoint (if available)
  if (authToken) {
    const analyticsResponse = http.get(`${BASE_URL}/api/analytics/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    check(analyticsResponse, {
      'analytics status is 200': (r) => r.status === 200,
      'analytics response time < 1000ms': (r) => r.timings.duration < 1000,
    });
  }
  
  // Test 8: Project Management (if available)
  if (authToken) {
    const projectsResponse = http.get(`${BASE_URL}/api/projects`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    
    check(projectsResponse, {
      'projects status is 200': (r) => r.status === 200,
      'projects response time < 500ms': (r) => r.timings.duration < 500,
    });
  }
  
  // Update custom metrics
  const success = registerResponse.status === 201 && loginResponse.status === 200;
  successRate.add(success);
  errorRate.add(!success);
  
  // Add think time between requests
  const thinkTime = Math.random() * 2 + 1; // 1-3 seconds
  sleep(thinkTime);
}

// Teardown function - runs once after the test
export function teardown(data) {
  console.log('Cleaning up load test...');
  
  // Clean up test user if needed
  if (data.authToken) {
    const logoutResponse = http.post(`${BASE_URL}/api/auth/logout`, JSON.stringify({
      refreshToken: data.refreshToken,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (logoutResponse.status === 200) {
      console.log('Successfully logged out test user');
    }
  }
}

// Helper function for sleep
function sleep(seconds) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + seconds * 1000) {
    // Busy wait
  }
}

// Additional test scenarios for different load patterns
export const stressTestOptions = {
  stages: [
    { duration: '2m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.15'],
  },
};

export const spikeTestOptions = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.2'],
  },
};

export const soakTestOptions = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '30m', target: 10 }, // Extended soak test
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'],
  },
}; 