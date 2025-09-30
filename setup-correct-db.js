const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.log('SERVICE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Testing Smart Matching database connection...');
    console.log('📍 Target project:', supabaseUrl);
    
    // Test connection by checking if tables exist
    console.log('🔍 Checking existing tables...');
    
    // Test the tables
    const { data: casinos, error: casinosError } = await supabase
      .from('casinos')
      .select('count', { count: 'exact' });
      
    const { data: affiliates, error: affiliatesError } = await supabase
      .from('affiliates')
      .select('count', { count: 'exact' });
      
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('count', { count: 'exact' });
    
    console.log('📊 Table counts:');
    console.log('  Casinos:', casinosError ? 'ERROR' : casinos?.count || 0);
    console.log('  Affiliates:', affiliatesError ? 'ERROR' : affiliates?.count || 0);
    console.log('  Preferences:', preferencesError ? 'ERROR' : preferences?.count || 0);
    
    return true;
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return false;
  }
}

setupDatabase().then(success => {
  process.exit(success ? 0 : 1);
});