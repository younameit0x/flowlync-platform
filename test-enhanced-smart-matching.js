/**
 * Enhanced Smart Matching Demo
 * 
 * Demonstrates the enhanced matching capabilities with the expanded database
 */

const { enhancedSmartMatching } = require('./src/lib/enhanced-smart-matching.js');

async function runEnhancedMatchingDemo() {
  console.log('🚀 FlowLync Enhanced Smart Matching Demo');
  console.log('=' .repeat(50));

  try {
    // Test 1: Get enhanced statistics
    console.log('\n📊 ENHANCED DATABASE STATISTICS');
    console.log('-'.repeat(30));
    
    const stats = await enhancedSmartMatching.getEnhancedStatistics();
    console.log(`📈 Total Programs: ${stats.total_programs}`);
    console.log(`✅ Active Programs: ${stats.active_programs}`);
    console.log(`💰 Average Commission: ${stats.average_commission}%`);
    console.log(`⭐ Average Rating: ${stats.average_rating}`);
    
    console.log('\n🎯 Programs by Vertical:');
    Object.entries(stats.by_vertical).forEach(([vertical, count]) => {
      console.log(`   ${vertical}: ${count} programs`);
    });
    
    console.log('\n🌐 Programs by Network:');
    Object.entries(stats.by_network).forEach(([network, count]) => {
      console.log(`   ${network}: ${count} programs`);
    });

    // Test 2: High-value casino operator recommendations
    console.log('\n\n🎰 CASINO OPERATOR RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    const casinoPreferences = {
      gambling_types: ['Online Casino'],
      region: 'North America',
      target_audience: 'high-rollers'
    };

    const casinoRecommendations = await enhancedSmartMatching.getEnhancedRecommendations(
      casinoPreferences,
      {
        limit: 5,
        minRating: 4.5,
        minCommission: 30
      }
    );

    console.log(`🎯 Found ${casinoRecommendations.recommendations.length} premium casino recommendations:`);
    casinoRecommendations.recommendations.forEach((program, index) => {
      console.log(`\n${index + 1}. ${program.name}`);
      console.log(`   💯 Match: ${program.match_percentage}%`);
      console.log(`   💰 Commission: ${program.commission_structure?.revenue_share || 'N/A'}`);
      console.log(`   ⭐ Rating: ${program.rating || 'N/A'}`);
      console.log(`   🌐 Network: ${program.network_source || 'Direct'}`);
      console.log(`   💡 Why: ${program.recommendation_reason}`);
    });

    // Test 3: Sports betting focused recommendations
    console.log('\n\n🏈 SPORTSBOOK RECOMMENDATIONS');
    console.log('-'.repeat(35));
    
    const sportsbookPreferences = {
      gambling_types: ['Sportsbook'],
      region: 'North America',
      target_audience: 'sports-bettors'
    };

    const sportsbookRecommendations = await enhancedSmartMatching.getEnhancedRecommendations(
      sportsbookPreferences,
      {
        limit: 3,
        minRating: 4.0,
        preferredRegions: ['North America', 'Global']
      }
    );

    console.log(`🎯 Found ${sportsbookRecommendations.recommendations.length} sportsbook recommendations:`);
    sportsbookRecommendations.recommendations.forEach((program, index) => {
      console.log(`\n${index + 1}. ${program.name}`);
      console.log(`   💯 Match: ${program.match_percentage}%`);
      console.log(`   💰 Commission: ${program.commission_structure?.revenue_share || 'N/A'}`);
      console.log(`   ⭐ Rating: ${program.rating || 'N/A'}`);
      console.log(`   🌐 Network: ${program.network_source || 'Direct'}`);
      console.log(`   💡 Why: ${program.recommendation_reason}`);
    });

    // Test 4: Crypto gambling niche
    console.log('\n\n₿ CRYPTO GAMBLING RECOMMENDATIONS');
    console.log('-'.repeat(35));
    
    const cryptoPreferences = {
      gambling_types: ['Crypto Gambling'],
      region: 'Global',
      target_audience: 'crypto-enthusiasts'
    };

    const cryptoRecommendations = await enhancedSmartMatching.getEnhancedRecommendations(
      cryptoPreferences,
      {
        limit: 3,
        minRating: 4.0
      }
    );

    console.log(`🎯 Found ${cryptoRecommendations.recommendations.length} crypto gambling recommendations:`);
    cryptoRecommendations.recommendations.forEach((program, index) => {
      console.log(`\n${index + 1}. ${program.name}`);
      console.log(`   💯 Match: ${program.match_percentage}%`);
      console.log(`   💰 Commission: ${program.commission_structure?.revenue_share || 'N/A'}`);
      console.log(`   ⭐ Rating: ${program.rating || 'N/A'}`);
      console.log(`   🌐 Network: ${program.network_source || 'Direct'}`);
      console.log(`   💡 Why: ${program.recommendation_reason}`);
    });

    // Test 5: Network-specific filtering
    console.log('\n\n📡 NETWORK-SPECIFIC ANALYSIS');
    console.log('-'.repeat(30));
    
    const networks = ['ShareASale', 'Commission Junction', 'Impact Radius'];
    for (const network of networks) {
      const networkPrograms = await enhancedSmartMatching.getProgramsByNetwork(network);
      console.log(`${network}: ${networkPrograms.length} programs available`);
    }

    // Test 6: Performance comparison
    console.log('\n\n⚡ PERFORMANCE COMPARISON');
    console.log('-'.repeat(25));
    
    const startTime = Date.now();
    const largeRecommendations = await enhancedSmartMatching.getEnhancedRecommendations(
      { gambling_types: ['Online Casino', 'Sportsbook', 'Crypto Gambling'] },
      { limit: 20 }
    );
    const endTime = Date.now();
    
    console.log(`📊 Processed ${largeRecommendations.total_programs_analyzed} programs`);
    console.log(`⚡ Generated ${largeRecommendations.recommendations.length} recommendations`);
    console.log(`🕒 Processing time: ${endTime - startTime}ms`);
    console.log(`🧮 Algorithm: ${largeRecommendations.matching_algorithm}`);

    console.log('\n✅ Enhanced Smart Matching Demo Complete!');
    console.log('\n🚀 Ready for integration with live API data from:');
    console.log('   • ShareASale (200+ gambling programs)');
    console.log('   • Commission Junction (150+ programs)');
    console.log('   • Impact Radius (100+ programs)');
    console.log('\n📈 Total potential: 450+ affiliate programs vs original 18');

  } catch (error) {
    console.error('❌ Demo error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Ensure gambling-affiliate-data-enhanced.json exists');
    console.log('   2. Check file permissions');
    console.log('   3. Verify JSON structure');
  }
}

// Run the demo
if (require.main === module) {
  runEnhancedMatchingDemo();
}

module.exports = { runEnhancedMatchingDemo };