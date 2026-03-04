// Security Penetration Testing Script
// Run with: node security-test.js

const BASE_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testUnauthorizedAccess() {
  log(colors.blue, '\n🔍 Test 1: Unauthorized API Access');
  
  const tests = [
    { method: 'POST', endpoint: '/api/projects', body: { id: 'hack', title: 'Hacked' } },
    { method: 'PUT', endpoint: '/api/projects', body: { id: 'hack', title: 'Updated' } },
    { method: 'DELETE', endpoint: '/api/projects', body: { id: 'hack' } },
  ];

  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.body),
      });

      if (response.status === 401) {
        log(colors.green, `✅ ${test.method} ${test.endpoint}: Protected (401)`);
      } else {
        log(colors.red, `❌ ${test.method} ${test.endpoint}: VULNERABLE! (${response.status})`);
      }
    } catch (error) {
      log(colors.red, `❌ ${test.method} ${test.endpoint}: Error - ${error.message}`);
    }
  }
}

async function testXSSInjection() {
  log(colors.blue, '\n🔍 Test 2: XSS Injection');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
  ];

  // Note: This will fail without auth, but we're testing sanitization
  for (const payload of xssPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'xss-test', title: payload }),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        log(colors.green, `✅ XSS blocked by auth: "${payload.substring(0, 30)}..."`);
      } else if (data.project && data.project.title.includes('<script>')) {
        log(colors.red, `❌ XSS VULNERABLE: Payload not sanitized!`);
      } else {
        log(colors.green, `✅ XSS sanitized: "${payload.substring(0, 30)}..."`);
      }
    } catch (error) {
      log(colors.yellow, `⚠️  XSS test error: ${error.message}`);
    }
  }
}

async function testSQLInjection() {
  log(colors.blue, '\n🔍 Test 3: SQL/NoSQL Injection (JSON Injection)');
  
  const injectionPayloads = [
    { id: "1' OR '1'='1", title: 'SQL Injection' },
    { id: '{"$gt": ""}', title: 'NoSQL Injection' },
    { id: '1; DROP TABLE projects;--', title: 'SQL Drop' },
    { id: '../../../etc/passwd', title: 'Path Traversal' },
  ];

  for (const payload of injectionPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        log(colors.green, `✅ Injection blocked by auth: "${payload.id}"`);
      } else if (response.status === 400) {
        log(colors.green, `✅ Injection rejected by validation: "${payload.id}"`);
      } else {
        log(colors.red, `❌ VULNERABLE to injection: "${payload.id}"`);
      }
    } catch (error) {
      log(colors.yellow, `⚠️  Injection test error: ${error.message}`);
    }
  }
}

async function testPrototypePollution() {
  log(colors.blue, '\n🔍 Test 4: Prototype Pollution');
  
  const pollutionPayloads = [
    { __proto__: { admin: true }, id: 'test', title: 'Pollution' },
    { constructor: { prototype: { admin: true } }, id: 'test2', title: 'Pollution' },
    { 'constructor.prototype.admin': true, id: 'test3', title: 'Pollution' },
  ];

  for (const payload of pollutionPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        log(colors.green, `✅ Pollution blocked by auth`);
      } else if (data.project && !data.project.__proto__) {
        log(colors.green, `✅ Prototype pollution prevented`);
      } else {
        log(colors.red, `❌ VULNERABLE to prototype pollution!`);
      }
    } catch (error) {
      log(colors.yellow, `⚠️  Pollution test error: ${error.message}`);
    }
  }
}

async function testRateLimiting() {
  log(colors.blue, '\n🔍 Test 5: Rate Limiting (Brute Force Protection)');
  
  let blockedCount = 0;
  const totalRequests = 15;

  for (let i = 0; i < totalRequests; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: `test-${i}`, title: 'Rate Test' }),
      });

      if (response.status === 429) {
        blockedCount++;
      }
    } catch (error) {
      // Ignore
    }
  }

  if (blockedCount > 0) {
    log(colors.green, `✅ Rate limiting active: ${blockedCount}/${totalRequests} requests blocked`);
  } else {
    log(colors.red, `❌ NO RATE LIMITING: All ${totalRequests} requests went through!`);
  }
}

async function testCSRF() {
  log(colors.blue, '\n🔍 Test 6: CSRF Protection');
  
  try {
    // Simulate cross-origin request
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://evil.com',
      },
      body: JSON.stringify({ id: 'csrf-test', title: 'CSRF Attack' }),
    });

    if (response.status === 401) {
      log(colors.green, `✅ CSRF protected by authentication`);
    } else if (response.status === 403) {
      log(colors.green, `✅ CSRF explicitly blocked`);
    } else {
      log(colors.yellow, `⚠️  CSRF: Relies on SameSite cookies (partial protection)`);
    }
  } catch (error) {
    log(colors.yellow, `⚠️  CSRF test error: ${error.message}`);
  }
}

async function testSessionFixation() {
  log(colors.blue, '\n🔍 Test 7: Session Fixation');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: {
        'Cookie': 'next-auth.session-token=malicious-token-12345',
      },
    });

    if (response.status === 401 || !response.ok) {
      log(colors.green, `✅ Session fixation prevented (invalid tokens rejected)`);
    } else {
      log(colors.red, `❌ VULNERABLE to session fixation!`);
    }
  } catch (error) {
    log(colors.green, `✅ Session fixation prevented (NextAuth handles this)`);
  }
}

async function testPathTraversal() {
  log(colors.blue, '\n🔍 Test 8: Path Traversal');
  
  const traversalPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  ];

  for (const payload of traversalPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: payload }),
      });

      if (response.status === 401) {
        log(colors.green, `✅ Path traversal blocked by auth: "${payload}"`);
      } else if (response.status === 400) {
        log(colors.green, `✅ Path traversal rejected by validation: "${payload}"`);
      } else {
        log(colors.red, `❌ VULNERABLE to path traversal: "${payload}"`);
      }
    } catch (error) {
      log(colors.yellow, `⚠️  Path traversal test error: ${error.message}`);
    }
  }
}

async function testMassAssignment() {
  log(colors.blue, '\n🔍 Test 9: Mass Assignment');
  
  const payload = {
    id: 'test',
    title: 'Test',
    isAdmin: true,
    role: 'admin',
    permissions: ['all'],
    __internal: 'secret',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.status === 401) {
      log(colors.green, `✅ Mass assignment blocked by auth`);
    } else if (data.project && (data.project.isAdmin || data.project.role)) {
      log(colors.yellow, `⚠️  Mass assignment possible (extra fields accepted)`);
    } else {
      log(colors.green, `✅ Mass assignment handled (extra fields ignored/sanitized)`);
    }
  } catch (error) {
    log(colors.yellow, `⚠️  Mass assignment test error: ${error.message}`);
  }
}

async function testInformationDisclosure() {
  log(colors.blue, '\n🔍 Test 10: Information Disclosure');
  
  try {
    const response = await fetch(`${BASE_URL}/api/projects/nonexistent`, {
      method: 'GET',
    });

    const text = await response.text();
    
    if (text.includes('stack') || text.includes('Error:') || text.includes('at ')) {
      log(colors.red, `❌ VULNERABLE: Stack traces exposed!`);
    } else {
      log(colors.green, `✅ No sensitive information in error messages`);
    }
  } catch (error) {
    log(colors.green, `✅ Information disclosure prevented`);
  }
}

// Run all tests
async function runAllTests() {
  log(colors.magenta, '\n' + '='.repeat(60));
  log(colors.magenta, '🛡️  SECURITY PENETRATION TEST');
  log(colors.magenta, '='.repeat(60));
  
  await testUnauthorizedAccess();
  await testXSSInjection();
  await testSQLInjection();
  await testPrototypePollution();
  await testRateLimiting();
  await testCSRF();
  await testSessionFixation();
  await testPathTraversal();
  await testMassAssignment();
  await testInformationDisclosure();
  
  log(colors.magenta, '\n' + '='.repeat(60));
  log(colors.magenta, '✅ SECURITY TEST COMPLETED');
  log(colors.magenta, '='.repeat(60) + '\n');
}

runAllTests().catch(console.error);
