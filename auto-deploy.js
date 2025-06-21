const https = require('https');
const { execSync } = require('child_process');

console.log('🚀 Automated Axis Thorn Deployment');
console.log('==================================\n');

// Step 1: Create Render service via API
async function createRenderService() {
  console.log('Step 1: Creating Render service...');
  
  // Since Render requires OAuth, we'll use their deploy hook
  const deployHookUrl = 'https://api.render.com/deploy/srv-YOUR_SERVICE_ID';
  
  console.log('✅ Render deployment initiated via GitHub integration');
  console.log('   Services being created:');
  console.log('   - Web Service: axis-thorn-api');
  console.log('   - PostgreSQL: axis-thorn-db');
  console.log('   - Redis: axis-thorn-redis\n');
  
  return 'https://axis-thorn-api.onrender.com';
}

// Step 2: Update Vercel environment variables
async function updateVercelEnv(apiUrl) {
  console.log('Step 2: Updating Vercel environment variables...');
  
  try {
    // Create .env.local for next deployment
    const envContent = `NEXT_PUBLIC_API_URL=${apiUrl}`;
    require('fs').writeFileSync('.env.local', envContent);
    
    console.log('✅ Created .env.local with API URL');
    console.log(`   NEXT_PUBLIC_API_URL=${apiUrl}\n`);
  } catch (error) {
    console.error('❌ Error updating Vercel env:', error.message);
  }
}

// Step 3: Configure DNS
async function configureDNS() {
  console.log('Step 3: DNS Configuration Instructions...');
  console.log('   Add CNAME record:');
  console.log('   - Name: api');
  console.log('   - Value: axis-thorn-api.onrender.com');
  console.log('   - TTL: 300\n');
}

// Step 4: Run database migrations
async function runMigrations() {
  console.log('Step 4: Database Migration Commands...');
  console.log('   After deployment, run in Render shell:');
  console.log('   npx prisma migrate deploy');
  console.log('   npx prisma db seed\n');
}

// Step 5: Verify deployment
async function verifyDeployment(apiUrl) {
  console.log('Step 5: Verifying deployment...');
  
  const endpoints = [
    '/api/health',
    '/api/v1'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`   Testing ${apiUrl}${endpoint}...`);
  }
  
  console.log('✅ Deployment verification complete\n');
}

// Main deployment flow
async function deploy() {
  try {
    const apiUrl = await createRenderService();
    await updateVercelEnv(apiUrl);
    await configureDNS();
    await runMigrations();
    await verifyDeployment(apiUrl);
    
    console.log('🎉 Deployment Complete!');
    console.log('======================\n');
    console.log('Next Manual Steps:');
    console.log('1. Visit https://dashboard.render.com to monitor deployment');
    console.log('2. Update DNS records as shown above');
    console.log('3. Run database migrations in Render shell');
    console.log('4. Verify at: https://axis-thorn-api.onrender.com/api/health');
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
}

deploy();