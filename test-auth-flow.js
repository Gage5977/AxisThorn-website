// Test auth flow: register -> login -> use token
const http = require('http');

async function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body ? JSON.parse(body) : null
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAuthFlow() {
  console.log('🔐 Testing Auth Flow\n');
  
  const testUser = {
    email: `test${Date.now()}@axisthorn.com`,
    password: 'testpass123',
    name: 'Test User'
  };
  
  try {
    // 1. Register
    console.log('1️⃣ Testing Registration...');
    const registerRes = await makeRequest('/api/v1/auth/register', 'POST', testUser);
    console.log(`   Status: ${registerRes.status}`);
    if (registerRes.status === 201) {
      console.log(`   ✅ User created: ${registerRes.body.user.email}`);
      console.log(`   Token: ${registerRes.body.token.substring(0, 20)}...`);
    } else {
      console.log(`   ❌ Failed:`, registerRes.body);
      return;
    }
    
    // 2. Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await makeRequest('/api/v1/auth/login', 'POST', {
      email: testUser.email,
      password: testUser.password
    });
    console.log(`   Status: ${loginRes.status}`);
    if (loginRes.status === 200) {
      console.log(`   ✅ Login successful`);
      const token = loginRes.body.token;
      
      // 3. Verify token
      console.log('\n3️⃣ Testing Token Verification...');
      const verifyRes = await makeRequest('/api/v1/auth/verify', 'GET', null, token);
      console.log(`   Status: ${verifyRes.status}`);
      if (verifyRes.status === 200) {
        console.log(`   ✅ Token valid for user: ${verifyRes.body.user.email}`);
      } else {
        console.log(`   ❌ Failed:`, verifyRes.body);
      }
      
      // 4. Test protected endpoint
      console.log('\n4️⃣ Testing Protected Endpoint (invoices)...');
      const protectedRes = await makeRequest('/api/v1/invoices', 'GET', null, token);
      console.log(`   Status: ${protectedRes.status}`);
      if (protectedRes.status === 200) {
        console.log(`   ✅ Access granted - found ${protectedRes.body.data.length} invoices`);
      } else {
        console.log(`   ❌ Access denied:`, protectedRes.body);
      }
      
      // 5. Test without token
      console.log('\n5️⃣ Testing Without Token...');
      const noTokenRes = await makeRequest('/api/v1/invoices', 'GET');
      console.log(`   Status: ${noTokenRes.status}`);
      if (noTokenRes.status === 401) {
        console.log(`   ✅ Correctly rejected - auth required`);
      } else {
        console.log(`   ❌ Unexpected response:`, noTokenRes.body);
      }
      
    } else {
      console.log(`   ❌ Failed:`, loginRes.body);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAuthFlow();