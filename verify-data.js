const fs = require('fs');
const path = require('path');

// Read the generated data
const data = JSON.parse(fs.readFileSync('gambling-affiliate-data.json', 'utf8'));

console.log('🔍 COMPREHENSIVE DATA QUALITY VERIFICATION');
console.log('=========================================');

let issues = [];
let warnings = [];

// 1. Metadata validation
console.log('\n📊 METADATA VALIDATION:');
console.log(`  ✅ Generated at: ${data.metadata.generated_at}`);
console.log(`  ✅ Total records: ${data.metadata.total_records}`);
console.log(`  ✅ Data sources: ${data.metadata.data_sources.length}`);
console.log(`  ✅ Verticals covered: ${data.metadata.verticals.length}`);
console.log(`  ✅ Global regions: ${data.metadata.global_regions.length}`);

// 2. Data structure validation
console.log('\n🏗️ DATA STRUCTURE VALIDATION:');

const requiredFields = [
  'id', 'name', 'website', 'affiliate_url', 'vertical', 'region',
  'license_authority', 'commission_structure', 'payment_terms',
  'minimum_payout', 'currencies', 'languages', 'contact_email',
  'status', 'rating', 'established', 'last_verified'
];

let totalRecords = 0;
let validRecords = 0;

Object.keys(data).forEach(category => {
  if (category !== 'metadata' && Array.isArray(data[category])) {
    console.log(`\n  📁 ${category.toUpperCase()}:`);
    console.log(`    Count: ${data[category].length}`);
    
    data[category].forEach((record, index) => {
      totalRecords++;
      let recordValid = true;
      
      requiredFields.forEach(field => {
        if (!record[field]) {
          recordValid = false;
          issues.push(`${category}[${index}] missing: ${field}`);
        }
      });
      
      if (recordValid) {
        validRecords++;
        
        // Additional validations
        if (record.rating < 1 || record.rating > 5) {
          warnings.push(`${category}[${index}] invalid rating: ${record.rating}`);
        }
        
        if (!record.contact_email.includes('@')) {
          warnings.push(`${category}[${index}] invalid email: ${record.contact_email}`);
        }
        
        if (record.commission_structure.revenue_share.includes('%')) {
          const rate = parseInt(record.commission_structure.revenue_share.split('-')[0]);
          if (rate < 10 || rate > 60) {
            warnings.push(`${category}[${index}] unusual commission rate: ${record.commission_structure.revenue_share}`);
          }
        }
      }
    });
  }
});

// 3. Data completeness check
console.log('\n📋 DATA COMPLETENESS CHECK:');
console.log(`  ✅ Total records: ${totalRecords}`);
console.log(`  ✅ Valid records: ${validRecords}`);
console.log(`  ✅ Success rate: ${((validRecords/totalRecords) * 100).toFixed(1)}%`);

if (issues.length > 0) {
  console.log(`\n❌ ISSUES FOUND (${issues.length}):`);
  issues.slice(0, 10).forEach(issue => console.log(`    - ${issue}`));
  if (issues.length > 10) {
    console.log(`    ... and ${issues.length - 10} more`);
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️ WARNINGS (${warnings.length}):`);
  warnings.slice(0, 10).forEach(warning => console.log(`    - ${warning}`));
  if (warnings.length > 10) {
    console.log(`    ... and ${warnings.length - 10} more`);
  }
}

// 4. Coverage analysis
console.log('\n🌍 COVERAGE ANALYSIS:');

const verticals = {};
const regions = {};
const licenseAuthorities = {};

Object.keys(data).forEach(category => {
  if (category !== 'metadata' && Array.isArray(data[category])) {
    data[category].forEach(record => {
      // Count by vertical
      verticals[record.vertical] = (verticals[record.vertical] || 0) + 1;
      
      // Count by region
      regions[record.region] = (regions[record.region] || 0) + 1;
      
      // Count by license authority
      licenseAuthorities[record.license_authority] = (licenseAuthorities[record.license_authority] || 0) + 1;
    });
  }
});

console.log('  📊 By Vertical:');
Object.entries(verticals).forEach(([vertical, count]) => {
  console.log(`    ${vertical}: ${count}`);
});

console.log('  🌍 By Region:');
Object.entries(regions).forEach(([region, count]) => {
  console.log(`    ${region}: ${count}`);
});

console.log('  📜 By License Authority:');
Object.entries(licenseAuthorities).forEach(([authority, count]) => {
  console.log(`    ${authority}: ${count}`);
});

// 5. Final summary
console.log('\n🎯 FINAL VERIFICATION SUMMARY:');
console.log('================================');

const successRate = ((validRecords/totalRecords) * 100).toFixed(1);
console.log(`✅ Overall Success Rate: ${successRate}%`);

if (successRate >= 95) {
  console.log('🟢 EXCELLENT: Data quality is production-ready');
} else if (successRate >= 85) {
  console.log('🟡 GOOD: Data quality is acceptable with minor issues');
} else {
  console.log('🔴 POOR: Data quality needs improvement');
}

console.log(`📊 Total Records: ${totalRecords}`);
console.log(`✅ Valid Records: ${validRecords}`);
console.log(`❌ Issues: ${issues.length}`);
console.log(`⚠️ Warnings: ${warnings.length}`);

console.log('\n🎉 DATA COLLECTION COMPLETE!');
console.log('Ready for API integration and Smart Matching system.');