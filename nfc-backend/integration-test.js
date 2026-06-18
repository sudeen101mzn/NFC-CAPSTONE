/**
 * Integration Test Suite for NFC Bus App
 * Tests frontend services against backend API endpoints
 */

const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_TIMEOUT = 5000;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: [],
};

// Test helper function
async function test(name, fn) {
  testResults.total++;
  try {
    await fn();
    testResults.passed++;
    testResults.tests.push({
      name,
      status: 'PASS',
      error: null,
    });
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name,
      status: 'FAIL',
      error: error.message,
    });
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
  }
}

// Assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ============ TESTS ============

async function runIntegrationTests() {
  console.log(`\n${colors.blue}=== NFC BUS APP INTEGRATION TESTS ===${colors.reset}\n`);

  // 1. API Health Check
  console.log(`${colors.yellow}API Health & Structure:${colors.reset}`);
  
  await test('Backend server is running and responding', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/`);
      assert(response.status === 200, 'Server should return 200');
      assert(response.data.message, 'Server should return message');
    } catch (error) {
      throw new Error('Backend server not responding - Make sure MongoDB is running and backend is started');
    }
  });

  // 2. Auth Endpoints Structure
  console.log(`\n${colors.yellow}Auth Endpoints:${colors.reset}`);

  await test('Auth routes are mounted at /api/auth', async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123',
      }).catch(err => err.response);
      // We expect 401 (invalid credentials) or validation error, not 404
      assert(response.status !== 404, 'Auth routes should be mounted');
    } catch (error) {
      throw new Error('Auth routes validation failed');
    }
  });

  // 3. Card Endpoints
  console.log(`\n${colors.yellow}Card Service Endpoints:${colors.reset}`);

  const cardEndpoints = [
    { method: 'GET', path: '/cards', description: 'Get user cards' },
    { method: 'POST', path: '/cards', description: 'Add new card' },
  ];

  for (const endpoint of cardEndpoints) {
    await test(
      `Card endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            data: endpoint.method === 'POST' ? {} : undefined,
            ...config,
          }).catch(err => err.response);

          // Should not be 404 (endpoint exists)
          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 4. Transaction Endpoints
  console.log(`\n${colors.yellow}Transaction Service Endpoints:${colors.reset}`);

  const transactionEndpoints = [
    { method: 'GET', path: '/transactions', description: 'Get transaction history' },
    { method: 'GET', path: '/transactions/recent', description: 'Get recent transactions' },
  ];

  for (const endpoint of transactionEndpoints) {
    await test(
      `Transaction endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            ...config,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 5. Route Endpoints
  console.log(`\n${colors.yellow}Route Service Endpoints:${colors.reset}`);

  const routeEndpoints = [
    { method: 'GET', path: '/routes', description: 'Get all routes' },
    { method: 'GET', path: '/routes/search?source=A&destination=B', description: 'Search routes' },
  ];

  for (const endpoint of routeEndpoints) {
    await test(
      `Route endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 6. Notification Endpoints
  console.log(`\n${colors.yellow}Notification Service Endpoints:${colors.reset}`);

  const notificationEndpoints = [
    { method: 'GET', path: '/notifications', description: 'Get notifications' },
  ];

  for (const endpoint of notificationEndpoints) {
    await test(
      `Notification endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            ...config,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 7. User Endpoints
  console.log(`\n${colors.yellow}User Service Endpoints:${colors.reset}`);

  const userEndpoints = [
    { method: 'GET', path: '/users/profile', description: 'Get user profile' },
    { method: 'PATCH', path: '/users/profile', description: 'Update profile' },
  ];

  for (const endpoint of userEndpoints) {
    await test(
      `User endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            data: endpoint.method === 'PATCH' ? {} : undefined,
            ...config,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 8. Payment Endpoints
  console.log(`\n${colors.yellow}Payment Service Endpoints:${colors.reset}`);

  const paymentEndpoints = [
    { method: 'POST', path: '/payment/khalti/initiate' },
    { method: 'POST', path: '/payment/esewa/initiate' },
  ];

  for (const endpoint of paymentEndpoints) {
    await test(
      `Payment endpoint ${endpoint.method} ${endpoint.path}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            data: {},
            ...config,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // 9. Recharge Endpoints
  console.log(`\n${colors.yellow}Recharge Service Endpoints:${colors.reset}`);

  const rechargeEndpoints = [
    { method: 'POST', path: '/recharge', description: 'Process recharge' },
    { method: 'GET', path: '/recharge/history', description: 'Get recharge history' },
  ];

  for (const endpoint of rechargeEndpoints) {
    await test(
      `Recharge endpoint ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      async () => {
        try {
          const config = { headers: { Authorization: 'Bearer test-token' } };
          const response = await axios({
            method: endpoint.method.toLowerCase(),
            url: `${API_BASE_URL}${endpoint.path}`,
            data: endpoint.method === 'POST' ? {} : undefined,
            ...config,
          }).catch(err => err.response);

          assert(response.status !== 404, `Endpoint should exist`);
        } catch (error) {
          throw new Error(`${endpoint.path} validation failed`);
        }
      }
    );
  }

  // Print Summary
  console.log(`\n${colors.blue}=== TEST SUMMARY ===${colors.reset}`);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  if (testResults.failed > 0) {
    console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  }
  console.log(
    `Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%\n`
  );

  if (testResults.failed === 0) {
    console.log(`${colors.green}✓ All integration tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Check backend configuration.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runIntegrationTests();
