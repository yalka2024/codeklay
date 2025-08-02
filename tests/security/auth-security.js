import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('auth_errors');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  testPasswordComplexity();
  testBruteForceProtection();
  testSessionSecurity();
  sleep(1);
}

function testPasswordComplexity() {
  const weakPasswords = [
    '123456',
    'password',
    'qwerty',
    '12345678',
    'abc123',
  ];

  weakPasswords.forEach((password, index) => {
    let response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
      email: `test${index}@example.com`,
      password: password,
      name: 'Test User'
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(response, {
      [`Weak password ${index + 1} rejected`]: (r) => r.status === 400 || r.status === 422,
    });
  });
}

function testBruteForceProtection() {
  const attempts = [];
  for (let i = 0; i < 5; i++) {
    attempts.push(['POST', `${BASE_URL}/api/auth/login`, JSON.stringify({
      email: 'test@example.com',
      password: 'wrongpassword'
    }), { headers: { 'Content-Type': 'application/json' } }]);
  }
  
  let responses = http.batch(attempts);
  
  let rateLimited = responses.some(r => r.status === 429);
  check(rateLimited, {
    'Brute force protection active': () => rateLimited,
  });
}

function testSessionSecurity() {
  let loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'valid@example.com',
    password: 'ValidPassword123!'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginResponse.status === 200) {
    let token = loginResponse.json('token');
    
    let profileResponse = http.get(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    check(profileResponse, {
      'Valid token accepted': (r) => r.status === 200,
    });
    
    let invalidTokenResponse = http.get(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid-token' },
    });
    
    check(invalidTokenResponse, {
      'Invalid token rejected': (r) => r.status === 401,
    });
  }
}
