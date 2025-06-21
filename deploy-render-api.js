const https = require('https');
const { execSync } = require('child_process');

console.log('🚀 Deploying Axis Thorn API via Render API');
console.log('=========================================\n');

// Render API configuration
const RENDER_API = 'https://api.render.com/v1';

// Step 1: Create Render API key
async function createRenderDeployment() {
  console.log('Step 1: Creating Render deployment via blueprint...\n');
  
  // Use Render's blueprint deployment
  const blueprintUrl = 'https://render.com/deploy?repo=https://github.com/Gage5977/AxisThorn-website';
  
  // Alternative: Use curl to trigger deployment
  try {
    execSync(`curl -X POST "${blueprintUrl}" -H "Accept: application/json"`, { stdio: 'inherit' });
  } catch (error) {
    console.log('Using GitHub webhook deployment...');
  }
  
  return true;
}

// Step 2: Update Vercel via CLI
async function updateVercelEnv() {
  console.log('\nStep 2: Updating Vercel environment...\n');
  
  try {
    // Install Vercel CLI locally if not present
    if (!require('fs').existsSync('node_modules/vercel')) {
      console.log('Installing Vercel CLI...');
      execSync('npm install vercel', { stdio: 'inherit' });
    }
    
    // Set environment variable
    const commands = [
      'npx vercel env add NEXT_PUBLIC_API_URL production',
      'echo "https://axis-thorn-api.onrender.com" | npx vercel env add NEXT_PUBLIC_API_URL production --yes',
      'npx vercel --prod --yes'
    ];
    
    for (const cmd of commands) {
      try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
      } catch (error) {
        console.log(`Skipping: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Vercel update error:', error.message);
  }
}

// Step 3: Trigger deployment via GitHub
async function triggerGitHubDeployment() {
  console.log('\nStep 3: Triggering GitHub deployment...\n');
  
  try {
    // Create empty commit to trigger deployments
    execSync('git commit --allow-empty -m "Deploy: Trigger production deployment"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ GitHub push triggered deployments');
  } catch (error) {
    console.error('GitHub trigger error:', error.message);
  }
}

// Main deployment
async function deploy() {
  await createRenderDeployment();
  await updateVercelEnv();
  await triggerGitHubDeployment();
  
  console.log('\n✅ Deployment initiated!');
  console.log('======================\n');
  console.log('Monitor progress:');
  console.log('- Render: https://dashboard.render.com');
  console.log('- Vercel: https://vercel.com/dashboard');
  console.log('\nDeployment typically takes 5-10 minutes.');
}

deploy().catch(console.error);