const { createClient } = require('@supabase/supabase-js');

// Read environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLS() {
  try {
    console.log('🔓 Disabling Row Level Security...');
    
    // Try to query tables first to see what happens
    console.log('🔍 Testing direct table access...');
    
    const { data: casinos, error: casinosError } = await supabase
      .from('casinos')
      .select('*')
      .limit(1);
      
    console.log('Casinos query result:', casinosError ? `Error: ${casinosError.message}` : `Success: ${casinos?.length} records`);
    
    const { data: affiliates, error: affiliatesError } = await supabase
      .from('affiliates')
      .select('*')
      .limit(1);
      
    console.log('Affiliates query result:', affiliatesError ? `Error: ${affiliatesError.message}` : `Success: ${affiliates?.length} records`);
    
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .limit(1);
      
    console.log('Preferences query result:', preferencesError ? `Error: ${preferencesError.message}` : `Success: ${preferences?.length} records`);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

disableRLS().then(success => {
  process.exit(success ? 0 : 1);
});