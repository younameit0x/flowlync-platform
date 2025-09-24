'use client';

import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export default function SetupDatabase() {
  const [status, setStatus] = useState('ready');
  const [results, setResults] = useState([]);

  const setupTables = async () => {
    setStatus('setting up...');
    const newResults = [];

    try {
      // Test connection first
      const { data, error } = await supabase.from('early_access_signups').select('count').limit(1);
      if (!error) {
        newResults.push('✅ Supabase connection working');
      }

      // Try to create demo_clicks table
      try {
        const { error: clicksError } = await supabase.from('demo_clicks').select('*').limit(1);
        if (clicksError && clicksError.code === 'PGRST116') {
          newResults.push('❌ demo_clicks table does not exist');
          newResults.push('📝 You need to run the SQL in setup-tables.sql in your Supabase dashboard');
        } else {
          newResults.push('✅ demo_clicks table exists');
        }
      } catch (err) {
        newResults.push(`❌ Error checking demo_clicks: ${err.message}`);
      }

      // Try to create demo_conversions table
      try {
        const { error: conversionsError } = await supabase.from('demo_conversions').select('*').limit(1);
        if (conversionsError && conversionsError.code === 'PGRST116') {
          newResults.push('❌ demo_conversions table does not exist');
          newResults.push('📝 You need to run the SQL in setup-tables.sql in your Supabase dashboard');
        } else {
          newResults.push('✅ demo_conversions table exists');
        }
      } catch (err) {
        newResults.push(`❌ Error checking demo_conversions: ${err.message}`);
      }

      setResults(newResults);
      setStatus('complete');
    } catch (error) {
      setResults([`❌ Setup failed: ${error.message}`]);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h2>Database Setup</h2>
      <p>Click the button below to check if your Supabase tables are set up correctly.</p>
      
      <button 
        onClick={setupTables} 
        disabled={status === 'setting up...'}
        style={{ 
          padding: 12, 
          background: status === 'setting up...' ? '#ccc' : '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: 4, 
          cursor: status === 'setting up...' ? 'not-allowed' : 'pointer',
          marginBottom: 16
        }}
      >
        {status === 'setting up...' ? 'Checking...' : 'Check Database Setup'}
      </button>

      {results.length > 0 && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 4, border: '1px solid #dee2e6' }}>
          {results.map((result, index) => (
            <div key={index} style={{ marginBottom: 8, fontFamily: 'monospace' }}>
              {result}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, background: '#fff3cd', borderRadius: 4, border: '1px solid #ffeaa7' }}>
        <h4>If tables don&apos;t exist, follow these steps:</h4>
        <ol>
          <li>Go to your Supabase dashboard</li>
          <li>Navigate to the SQL Editor</li>
          <li>Copy and paste the SQL from <code>setup-tables.sql</code></li>
          <li>Run the SQL queries</li>
          <li>Come back and click &quot;Check Database Setup&quot; again</li>
        </ol>
      </div>
    </div>
  );
}