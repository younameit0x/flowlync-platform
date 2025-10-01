// 🚀 Real-Time Database Setup Script
// Creates tables for enhanced Smart Matching system

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupRealTimeDatabase() {
  console.log('🚀 Setting up Real-Time Smart Matching Database...');

  try {
    // Create real_time_commissions table
    const { error: commissionError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS real_time_commissions (
          id SERIAL PRIMARY KEY,
          program_name VARCHAR(255) NOT NULL UNIQUE,
          network VARCHAR(100),
          current_commission INTEGER NOT NULL,
          base_commission INTEGER NOT NULL,
          tier2_commission INTEGER,
          tier3_commission INTEGER,
          trending_score INTEGER DEFAULT 0,
          competition_level VARCHAR(20) DEFAULT 'Medium',
          estimated_epc DECIMAL(10,2),
          conversion_rate VARCHAR(10),
          average_order_value INTEGER,
          program_health INTEGER DEFAULT 100,
          status VARCHAR(20) DEFAULT 'active',
          geo_targeting TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (commissionError) {
      console.error('❌ Commission table error:', commissionError.message);
    } else {
      console.log('✅ real_time_commissions table created');
    }

    // Create trending_programs table
    const { error: trendingError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS trending_programs (
          id SERIAL PRIMARY KEY,
          program_name VARCHAR(255) NOT NULL,
          trending_score INTEGER NOT NULL,
          momentum VARCHAR(20),
          trending_reasons JSONB,
          recommended_action TEXT,
          time_to_act VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (trendingError) {
      console.error('❌ Trending table error:', trendingError.message);
    } else {
      console.log('✅ trending_programs table created');
    }

    // Create competitor_intelligence table
    const { error: competitorError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS competitor_intelligence (
          id SERIAL PRIMARY KEY,
          competitor_name VARCHAR(255) NOT NULL,
          promoted_programs TEXT[],
          average_commission INTEGER,
          traffic_estimate VARCHAR(50),
          top_keywords TEXT[],
          market_share VARCHAR(10),
          opportunity_score INTEGER,
          recommended_strategy TEXT,
          competition_level VARCHAR(20),
          underserved_programs TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (competitorError) {
      console.error('❌ Competitor table error:', competitorError.message);
    } else {
      console.log('✅ competitor_intelligence table created');
    }

    // Insert sample data
    console.log('📊 Inserting sample real-time data...');

    const sampleCommissions = [
      {
        program_name: 'BetMGM Casino',
        network: 'Internal',
        current_commission: 28,
        base_commission: 25,
        tier2_commission: 35,
        tier3_commission: 45,
        trending_score: 85,
        competition_level: 'Medium',
        estimated_epc: 3.25,
        conversion_rate: '2.1%',
        average_order_value: 125,
        program_health: 95,
        geo_targeting: ['US', 'CA']
      },
      {
        program_name: 'Caesars Casino',
        network: 'CJ Affiliate',
        current_commission: 32,
        base_commission: 30,
        tier2_commission: 40,
        tier3_commission: 50,
        trending_score: 92,
        competition_level: 'High',
        estimated_epc: 4.10,
        conversion_rate: '2.8%',
        average_order_value: 145,
        program_health: 98,
        geo_targeting: ['US']
      },
      {
        program_name: 'DraftKings Casino',
        network: 'Impact',
        current_commission: 22,
        base_commission: 20,
        tier2_commission: 30,
        tier3_commission: 40,
        trending_score: 78,
        competition_level: 'Low',
        estimated_epc: 2.85,
        conversion_rate: '1.9%',
        average_order_value: 110,
        program_health: 88,
        geo_targeting: ['US', 'CA', 'UK']
      }
    ];

    const { error: insertError } = await supabase
      .from('real_time_commissions')
      .upsert(sampleCommissions);

    if (insertError) {
      console.error('❌ Sample data error:', insertError.message);
    } else {
      console.log('✅ Sample commission data inserted');
    }

    // Insert trending programs
    const sampleTrending = [
      {
        program_name: 'Caesars Casino',
        trending_score: 92,
        momentum: 'Hot',
        trending_reasons: { commissionIncrease: true, volumeSpike: true },
        recommended_action: 'Consider joining - trending upward',
        time_to_act: '24-48 hours optimal window'
      },
      {
        program_name: 'PokerStars Casino',
        trending_score: 96,
        momentum: 'Explosive',
        trending_reasons: { newCreatives: true, seasonalBoost: true },
        recommended_action: 'High priority - explosive growth',
        time_to_act: '12-24 hours critical window'
      }
    ];

    const { error: trendingInsertError } = await supabase
      .from('trending_programs')
      .insert(sampleTrending);

    if (trendingInsertError) {
      console.error('❌ Trending data error:', trendingInsertError.message);
    } else {
      console.log('✅ Sample trending data inserted');
    }

    console.log('🎯 Real-Time Smart Matching Database setup complete!');
    console.log('📈 Tables ready for live commission tracking and trending detection');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

// Run setup
setupRealTimeDatabase();