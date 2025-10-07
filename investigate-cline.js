console.log('🔍 INVESTIGATING CLINE DATA COLLECTION ISSUES');
console.log('==============================================');

// Check if the comprehensive data collector exists and what might have gone wrong
const fs = require('fs');
const path = require('path');

console.log('\n📁 CHECKING FILES AND STRUCTURE:');

// 1. Check if Cline's collector exists
const collectorPath = 'src/lib/comprehensive-data-collector.js';
if (fs.existsSync(collectorPath)) {
  const stats = fs.statSync(collectorPath);
  console.log(`✅ Comprehensive Data Collector: EXISTS (${Math.round(stats.size/1024)}KB)`);
  console.log(`   Last Modified: ${stats.mtime.toISOString()}`);
} else {
  console.log('❌ Comprehensive Data Collector: MISSING');
}

// 2. Check current affiliate data
if (fs.existsSync('gambling-affiliate-data.json')) {
  const data = JSON.parse(fs.readFileSync('gambling-affiliate-data.json', 'utf8'));
  console.log(`✅ Current Data File: EXISTS`);
  console.log(`   Generated: ${data.metadata.generated_at}`);
  console.log(`   Claims ${data.metadata.total_records} records, but actually has:`);
  
  let actualRecords = 0;
  Object.keys(data).forEach(key => {
    if (key !== 'metadata' && Array.isArray(data[key])) {
      actualRecords += data[key].length;
      console.log(`     ${key}: ${data[key].length} records`);
    }
  });
  console.log(`   Actual Total: ${actualRecords} records (NOT ${data.metadata.total_records})`);
} else {
  console.log('❌ Current Data File: MISSING');
}

console.log('\n🔍 ANALYZING POTENTIAL ISSUES:');

// 3. Check for dependency issues
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['puppeteer', 'cheerio', 'axios', '@supabase/supabase-js'];
  
  console.log('📦 DEPENDENCIES CHECK:');
  requiredDeps.forEach(dep => {
    if (pkg.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${pkg.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: MISSING`);
    }
  });
}

console.log('\n🚨 LIKELY ISSUES IDENTIFIED:');
console.log('1. METADATA MISMATCH: Claims 2847 records but only has 6');
console.log('2. INCOMPLETE EXECUTION: Collector ran but did not complete full scraping');
console.log('3. POSSIBLE CAUSES:');
console.log('   - Token/Resource limitations hit during execution');
console.log('   - Network timeouts or rate limiting from target sites');
console.log('   - Process interruption mid-collection');
console.log('   - Puppeteer browser automation blocked');

// 4. Check environment variables
console.log('\n🔧 ENVIRONMENT CHECK:');
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  console.log('✅ Environment file exists');
  // Don't read actual values for security
} else {
  console.log('⚠️  Environment file missing - may cause Supabase connection issues');
}

// 5. Check for error logs or crash indicators
console.log('\n📝 CHECKING FOR ERROR INDICATORS:');

// Look for any error logs
const possibleLogFiles = ['error.log', 'debug.log', 'scraping.log'];
let foundLogs = false;
possibleLogFiles.forEach(logFile => {
  if (fs.existsSync(logFile)) {
    console.log(`⚠️  Found log file: ${logFile}`);
    foundLogs = true;
  }
});

if (!foundLogs) {
  console.log('ℹ️  No error log files found');
}

console.log('\n🎯 INVESTIGATION SUMMARY:');
console.log('========================');
console.log('ISSUE: Data collection appears to have started but not completed');
console.log('EVIDENCE: 6 actual records vs 2847 claimed in metadata');
console.log('');
console.log('MOST LIKELY CAUSES:');
console.log('1. 🔴 TOKEN EXHAUSTION - Cline hit usage limits mid-process');
console.log('2. 🔴 SCOPE TOO LARGE - 10+ sources overwhelming for single session');
console.log('3. 🔴 NETWORK BLOCKING - Anti-bot measures from gambling sites');
console.log('4. 🔴 PROCESS INTERRUPTION - User or system stopped the collection');
console.log('');
console.log('RECOMMENDATION: Resume with smaller scope (2-3 sources max)');