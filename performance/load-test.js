import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '3m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 50 },    // Ramp down to 50 users
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'], // 95% of requests under 200ms
    http_req_failed: ['rate<0.01'],                 // Error rate under 1%
    errors: ['rate<0.01'],                          // Custom error rate under 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://axisthorn.com';
const API_TOKEN = __ENV.API_TOKEN || '';

// Helper function to make authenticated requests
function authRequest(url, params = {}) {
  return http.get(url, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...params.headers,
    },
    ...params,
  });
}

export default function () {
  // Test 1: Health check endpoint
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 50ms': (r) => r.timings.duration < 50,
  });
  errorRate.add(healthRes.status !== 200);

  sleep(1);

  // Test 2: API version endpoint
  const versionRes = http.get(`${BASE_URL}/api/v1`);
  check(versionRes, {
    'API version status is 200': (r) => r.status === 200,
    'API version has correct structure': (r) => {
      const body = JSON.parse(r.body);
      return body.version && body.endpoints;
    },
  });
  errorRate.add(versionRes.status !== 200);

  sleep(1);

  // Test 3: List invoices (authenticated)
  if (API_TOKEN) {
    const invoicesRes = authRequest(`${BASE_URL}/api/v1/invoices?limit=10`);
    check(invoicesRes, {
      'invoices status is 200': (r) => r.status === 200,
      'invoices response time < 200ms': (r) => r.timings.duration < 200,
      'invoices returns array': (r) => Array.isArray(JSON.parse(r.body)),
    });
    errorRate.add(invoicesRes.status !== 200);

    sleep(1);

    // Test 4: Get specific invoice
    const invoiceId = 'test-invoice-id';
    const invoiceRes = authRequest(`${BASE_URL}/api/v1/invoices/${invoiceId}`);
    check(invoiceRes, {
      'invoice status is 200 or 404': (r) => r.status === 200 || r.status === 404,
      'invoice response time < 100ms': (r) => r.timings.duration < 100,
    });
    errorRate.add(![200, 404].includes(invoiceRes.status));
  }

  sleep(1);

  // Test 5: Static asset loading
  const staticRes = http.get(`${BASE_URL}/css/axis-2025.css`);
  check(staticRes, {
    'static CSS loads': (r) => r.status === 200,
    'static CSS cached': (r) => r.headers['Cache-Control'] !== undefined,
  });

  sleep(1);

  // Test 6: Portal page load
  const portalRes = http.get(`${BASE_URL}/portal-login.html`);
  check(portalRes, {
    'portal login page loads': (r) => r.status === 200,
    'portal page size reasonable': (r) => r.body.length < 100000, // Under 100KB
  });

  // Random sleep between 1-3 seconds to simulate real user behavior
  sleep(Math.random() * 2 + 1);
}

// Lifecycle hooks
export function setup() {
  // Verify the target is reachable
  const res = http.get(`${BASE_URL}/api/health`);
  if (res.status !== 200) {
    throw new Error(`Target ${BASE_URL} is not healthy`);
  }
  
  return { startTime: Date.now() };
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Test completed in ${duration} seconds`);
}

// Custom summary report
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
    'summary.html': htmlReport(data),
  };
}

// Helper to generate HTML report
function htmlReport(data) {
  const metrics = data.metrics;
  const checks = data.root_group.checks;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Load Test Results - Axis Thorn</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metric { margin: 10px 0; padding: 10px; background: #f0f0f0; }
    .pass { color: green; }
    .fail { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #333; color: white; }
  </style>
</head>
<body>
  <h1>Load Test Results</h1>
  <p>Test completed at: ${new Date().toISOString()}</p>
  
  <h2>Key Metrics</h2>
  <div class="metric">
    <strong>Request Duration (p95):</strong> 
    ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
    <span class="${metrics.http_req_duration.values['p(95)'] < 200 ? 'pass' : 'fail'}">
      (Target: <200ms)
    </span>
  </div>
  
  <div class="metric">
    <strong>Error Rate:</strong> 
    ${(metrics.http_req_failed.values.rate * 100).toFixed(2)}%
    <span class="${metrics.http_req_failed.values.rate < 0.01 ? 'pass' : 'fail'}">
      (Target: <1%)
    </span>
  </div>
  
  <div class="metric">
    <strong>Total Requests:</strong> ${metrics.http_reqs.values.count}
  </div>
  
  <div class="metric">
    <strong>Request Rate:</strong> ${metrics.http_reqs.values.rate.toFixed(2)} req/s
  </div>
  
  <h2>Checks Summary</h2>
  <table>
    <tr>
      <th>Check</th>
      <th>Passes</th>
      <th>Failures</th>
      <th>Pass Rate</th>
    </tr>
    ${Object.entries(checks).map(([name, check]) => `
      <tr>
        <td>${name}</td>
        <td>${check.passes}</td>
        <td>${check.fails}</td>
        <td class="${check.fails === 0 ? 'pass' : 'fail'}">
          ${((check.passes / (check.passes + check.fails)) * 100).toFixed(2)}%
        </td>
      </tr>
    `).join('')}
  </table>
</body>
</html>
  `;
}