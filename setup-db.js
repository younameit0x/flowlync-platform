// Database setup script for demo tables
import { supabase } from './src/lib/supabase.js';

async function setupTables() {
  console.log('Setting up demo tables...');

  // Create demo_clicks table
  const { error: clicksError } = await supabase.rpc('create_demo_clicks_table');
  
  // If RPC doesn't work, try direct table creation
  try {
    // Check if tables exist by trying to select from them
    const { data: clicks, error: clicksSelectError } = await supabase
      .from('demo_clicks')
      .select('*')
      .limit(1);
    
    if (clicksSelectError && clicksSelectError.code === 'PGRST116') {
      console.log('demo_clicks table does not exist - you need to create it in Supabase dashboard');
      console.log('Run the SQL commands in setup-tables.sql in your Supabase SQL Editor');
    } else {
      console.log('✅ demo_clicks table exists');
    }

    const { data: conversions, error: conversionsSelectError } = await supabase
      .from('demo_conversions')
      .select('*')
      .limit(1);
    
    if (conversionsSelectError && conversionsSelectError.code === 'PGRST116') {
      console.log('demo_conversions table does not exist - you need to create it in Supabase dashboard');
    } else {
      console.log('✅ demo_conversions table exists');
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

setupTables();