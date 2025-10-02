// FlowLync Deployment Manager
// Quick commands to manage local vs web deployment

const { execSync } = require('child_process');
const fs = require('fs');

class DeploymentManager {
  constructor() {
    this.localUrl = 'http://localhost:3000';
    this.webUrl = 'https://flowlync-platform.vercel.app';
  }

  // Check current status
  async checkStatus() {
    console.log('🔍 FlowLync Deployment Status\n');
    
    // Local status
    try {
      const localCheck = await fetch(`${this.localUrl}/api/health`).catch(() => null);
      console.log(`🏠 Local: ${localCheck ? '✅ RUNNING' : '❌ STOPPED'} (${this.localUrl})`);
    } catch {
      console.log(`🏠 Local: ❌ STOPPED (run 'npm run dev')`);
    }

    // Web status
    try {
      const webCheck = await fetch(`${this.webUrl}/dashboard`).catch(() => null);
      console.log(`🌐 Web: ${webCheck?.ok ? '✅ LIVE' : '❌ DOWN'} (${this.webUrl})`);
    } catch {
      console.log(`🌐 Web: ❌ DOWN`);
    }

    console.log('\n📊 Available Features:');
    console.log('  • Agent Collaboration Hub');
    console.log('  • Smart Matching Educational Interface');
    console.log('  • AI Chat Enhancement');
    console.log('  • Multi-agent Task Coordination');
  }

  // Save current state
  saveState() {
    console.log('💾 Saving current state...\n');
    
    try {
      // Check git status
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (status.trim()) {
        console.log('📝 Found unsaved changes:');
        console.log(status);
        
        // Auto-commit
        execSync('git add .');
        const timestamp = new Date().toISOString().slice(0, 19);
        execSync(`git commit -m "Auto-save: ${timestamp}"`);
        console.log('✅ Changes committed');
        
        // Push to GitHub
        execSync('git push origin main');
        console.log('✅ Pushed to GitHub (web-ready)');
      } else {
        console.log('✅ All changes already saved');
      }
      
      console.log('\n🎯 Your work is now:');
      console.log('  • Saved locally');
      console.log('  • Backed up to GitHub');
      console.log('  • Ready for web deployment');
      
    } catch (error) {
      console.log('❌ Error saving:', error.message);
    }
  }

  // Deploy to web
  deployToWeb() {
    console.log('🚀 Deploying to web...\n');
    
    try {
      // First save everything
      this.saveState();
      
      // Vercel auto-deploys from GitHub, so just confirm
      console.log('⏳ Vercel will auto-deploy from GitHub...');
      console.log('🌐 Check deployment: https://vercel.com/dashboard');
      console.log(`✅ Web URL: ${this.webUrl}`);
      
      console.log('\n🎯 Web Deployment Features:');
      console.log(`  • Dashboard: ${this.webUrl}/dashboard`);
      console.log(`  • Agent Hub: ${this.webUrl}/agent-collaboration`);
      console.log(`  • Smart Matching: ${this.webUrl}/smart-matching`);
      
    } catch (error) {
      console.log('❌ Deployment error:', error.message);
    }
  }

  // Test both environments
  async testBoth() {
    console.log('🧪 Testing both environments...\n');
    
    const tests = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Agent Collaboration', path: '/agent-collaboration' },
      { name: 'Smart Matching', path: '/smart-matching' },
      { name: 'AI Chat API', path: '/api/ai-chat' }
    ];

    for (const test of tests) {
      console.log(`Testing ${test.name}:`);
      
      // Test local
      try {
        const localResponse = await fetch(`${this.localUrl}${test.path}`);
        console.log(`  🏠 Local: ${localResponse.ok ? '✅' : '❌'} (${localResponse.status})`);
      } catch {
        console.log(`  🏠 Local: ❌ (not running)`);
      }
      
      // Test web
      try {
        const webResponse = await fetch(`${this.webUrl}${test.path}`);
        console.log(`  🌐 Web: ${webResponse.ok ? '✅' : '❌'} (${webResponse.status})`);
      } catch {
        console.log(`  🌐 Web: ❌ (not accessible)`);
      }
      
      console.log('');
    }
  }

  // Show help
  showHelp() {
    console.log(`
🎯 FlowLync Deployment Manager

Commands:
  node deploy-manager.js status     # Check current status
  node deploy-manager.js save       # Save all changes to GitHub
  node deploy-manager.js deploy     # Deploy to web (Vercel)
  node deploy-manager.js test       # Test both local and web
  node deploy-manager.js help       # Show this help

Workflow:
  1. 🏠 Develop locally (npm run dev)
  2. 💾 Save progress (node deploy-manager.js save)
  3. 🚀 Deploy when ready (node deploy-manager.js deploy)
  4. 🧪 Test everything (node deploy-manager.js test)

URLs:
  Local:  ${this.localUrl}
  Web:    ${this.webUrl}
    `);
  }
}

// Command line interface
async function main() {
  const manager = new DeploymentManager();
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'status':
      await manager.checkStatus();
      break;
    case 'save':
      manager.saveState();
      break;
    case 'deploy':
      manager.deployToWeb();
      break;
    case 'test':
      await manager.testBoth();
      break;
    case 'help':
    default:
      manager.showHelp();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentManager };