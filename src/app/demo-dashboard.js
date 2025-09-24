import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// You may want to move these to env vars in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DemoDashboard() {
  const [linkId, setLinkId] = useState('demo1');
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: clickData } = await supabase
      .from('demo_clicks')
      .select('*')
      .eq('link_id', linkId)
      .order('timestamp', { ascending: false });
    const { data: conversionData } = await supabase
      .from('demo_conversions')
      .select('*')
      .eq('link_id', linkId)
      .order('timestamp', { ascending: false });
    setClicks(clickData || []);
    setConversions(conversionData || []);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Demo Dashboard</h2>
      <input
        type="text"
        value={linkId}
        onChange={e => setLinkId(e.target.value)}
        placeholder="Enter linkId (e.g. demo1)"
        style={{ marginRight: 8 }}
      />
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      <div style={{ marginTop: 24 }}>
        <h3>Clicks</h3>
        <ul>
          {clicks.map(click => (
            <li key={click.id}>
              {click.timestamp} | {click.user_agent} | {click.referrer} | {click.ip}
            </li>
          ))}
        </ul>
        <h3>Conversions</h3>
        <ul>
          {conversions.map(conv => (
            <li key={conv.id}>
              {conv.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
