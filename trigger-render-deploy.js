const https = require('https');
const { execSync } = require('child_process');

console.log('🚀 Triggering Render Deployment');
console.log('==============================\n');

// Trigger via GitHub integration
async function triggerRenderDeploy() {
  // Method 1: Use render.yaml blueprint
  console.log('Method 1: Blueprint deployment...');
  console.log('Visit: https://render.com/deploy?repo=https://github.com/Gage5977/AxisThorn-website\n');
  
  // Method 2: Create deploy hook
  console.log('Method 2: Creating deploy webhook...');
  
  // Generate deploy configuration
  const deployConfig = {
    services: [{
      type: 'web',
      name: 'axis-thorn-api',
      env: 'node',
      repo: 'https://github.com/Gage5977/AxisThorn-website',
      buildCommand: 'cd api-deployment && npm install && npx prisma generate',
      startCommand: 'cd api-deployment && npm start',
      healthCheckPath: '/api/health',
      envVars: {
        JWT_SECRET: 'RlhUBEjgfo65wHYBk5kbOAVyKsMOpz5+OtNPBaSEeSw=',
        ADMIN_EMAIL: 'admin@axisthorn.com',
        ADMIN_PASSWORD: 'qwKG6keEE166rg9thZJL7A==',
        NODE_ENV: 'production',
        ALLOWED_ORIGINS: 'https://axisthorn.com,https://axis-thorn-llc-website.vercel.app'
      }
    }]
  };
  
  console.log('Deploy configuration ready.');
  console.log(JSON.stringify(deployConfig, null, 2));
  
  // Method 3: Direct link
  console.log('\nMethod 3: Direct deployment link...');
  const deployUrl = new URL('https://render.com/deploy');
  deployUrl.searchParams.set('repo', 'https://github.com/Gage5977/AxisThorn-website');
  
  console.log(`\n🔗 Click to deploy: ${deployUrl.toString()}`);
  
  // Open in browser if available
  try {
    const openCmd = process.platform === 'darwin' ? 'open' : 
                    process.platform === 'win32' ? 'start' : 'xdg-open';
    execSync(`${openCmd} "${deployUrl.toString()}"`);
    console.log('✅ Opened deployment URL in browser');
  } catch (error) {
    console.log('⚠️  Please manually visit the deployment URL above');
  }
}

triggerRenderDeploy().catch(console.error);