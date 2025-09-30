const { createClient } = require('@supabase/supabase-js');

// Read environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSampleData() {
  try {
    console.log('🎲 Adding sample data to Smart Matching tables...');
    
    // Add sample casinos
    const sampleCasinos = [
      {
        name: 'Casino Royale',
        website_url: 'https://casino-royale.example.com',
        logo_url: 'https://example.com/logo1.png',
        description: 'Premium online casino with luxury gaming experience',
        category: 'Premium',
        jurisdiction: 'Malta',
        min_deposit: 25.00,
        payout_percentage: 96.5,
        popularity_score: 85,
        trust_score: 90,
        features: JSON.stringify(['live_dealer', 'mobile_optimized', 'crypto_payments']),
        target_audience: JSON.stringify(['high_rollers', 'experienced_players']),
        commission_structure: JSON.stringify({ type: 'revenue_share', rate: 0.35 }),
        payment_methods: JSON.stringify(['visa', 'mastercard', 'bitcoin', 'ethereum']),
        languages: JSON.stringify(['en', 'es', 'de', 'fr']),
        currencies: JSON.stringify(['USD', 'EUR', 'BTC'])
      },
      {
        name: 'Lucky Stars Casino',
        website_url: 'https://lucky-stars.example.com', 
        logo_url: 'https://example.com/logo2.png',
        description: 'Fun and friendly casino for casual players',
        category: 'Casual',
        jurisdiction: 'Curacao',
        min_deposit: 10.00,
        payout_percentage: 94.8,
        popularity_score: 75,
        trust_score: 80,
        features: JSON.stringify(['quick_signup', 'mobile_app', 'social_features']),
        target_audience: JSON.stringify(['casual_players', 'beginners']),
        commission_structure: JSON.stringify({ type: 'cpa', rate: 150 }),
        payment_methods: JSON.stringify(['visa', 'mastercard', 'paypal', 'skrill']),
        languages: JSON.stringify(['en', 'es']),
        currencies: JSON.stringify(['USD', 'EUR'])
      }
    ];
    
    const { data: casinosData, error: casinosError } = await supabase
      .from('casinos')
      .insert(sampleCasinos)
      .select();
      
    if (casinosError) {
      console.error('❌ Error adding casinos:', casinosError);
    } else {
      console.log('✅ Added', casinosData.length, 'sample casinos');
    }
    
    // Add sample affiliates
    const sampleAffiliates = [
      {
        name: 'Digital Marketing Pro',
        email: 'contact@digitalmarketingpro.com',
        website_url: 'https://digitalmarketingpro.example.com',
        description: 'Professional affiliate with focus on digital marketing',
        category: 'Digital Marketing',
        preferred_commission_type: 'revenue_share',
        traffic_volume_monthly: 50000,
        primary_traffic_sources: JSON.stringify(['organic_search', 'social_media', 'email']),
        target_demographics: JSON.stringify(['millennials', 'gen_z']),
        experience_level: 'expert',
        preferred_markets: JSON.stringify(['US', 'EU', 'Canada']),
        marketing_channels: JSON.stringify(['content_marketing', 'social_media', 'ppc'])
      },
      {
        name: 'Casino Review Central',
        email: 'admin@casinoreviewcentral.com',
        website_url: 'https://casinoreviewcentral.example.com',
        description: 'Leading casino review and comparison site',
        category: 'Review Site',
        preferred_commission_type: 'cpa',
        traffic_volume_monthly: 100000,
        primary_traffic_sources: JSON.stringify(['organic_search', 'direct', 'referral']),
        target_demographics: JSON.stringify(['experienced_players', 'high_rollers']),
        experience_level: 'expert',
        preferred_markets: JSON.stringify(['Global']),
        marketing_channels: JSON.stringify(['seo', 'content_marketing', 'reviews'])
      }
    ];
    
    const { data: affiliatesData, error: affiliatesError } = await supabase
      .from('affiliates')
      .insert(sampleAffiliates)
      .select();
      
    if (affiliatesError) {
      console.error('❌ Error adding affiliates:', affiliatesError);
    } else {
      console.log('✅ Added', affiliatesData.length, 'sample affiliates');
    }
    
    // Check final counts
    const { count: casinoCount } = await supabase
      .from('casinos')
      .select('*', { count: 'exact', head: true });
      
    const { count: affiliateCount } = await supabase
      .from('affiliates')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Final counts:');
    console.log('  Casinos:', casinoCount);
    console.log('  Affiliates:', affiliateCount);
    
    return true;
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
    return false;
  }
}

addSampleData().then(success => {
  process.exit(success ? 0 : 1);
});