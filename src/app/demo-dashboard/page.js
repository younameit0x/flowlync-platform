'use client';

import { useState, useEffect } from 'react';

// Mock data for demo purposes when Supabase isn't available
const mockClicks = [
  { id: 1, link_id: 'demo-link-1', timestamp: new Date().toISOString(), user_agent: 'Demo Browser', ip_address: '192.168.1.1' },
  { id: 2, link_id: 'demo-link-2', timestamp: new Date(Date.now() - 3600000).toISOString(), user_agent: 'Mobile Demo', ip_address: '192.168.1.2' },
  { id: 3, link_id: 'demo-link-1', timestamp: new Date(Date.now() - 7200000).toISOString(), user_agent: 'Demo Browser Pro', ip_address: '192.168.1.3' }
];

const mockConversions = [
  { id: 1, link_id: 'demo-link-1', timestamp: new Date(Date.now() - 1800000).toISOString(), value: 25.00 },
  { id: 2, link_id: 'demo-link-2', timestamp: new Date(Date.now() - 5400000).toISOString(), value: 50.00 }
];

// Try to create Supabase client, but gracefully handle missing env vars
let supabase = null;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
} catch (error) {
  console.log('Supabase not available, using mock data');
}

export default function DemoDashboard() {
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    revenue: 0
  });
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      if (supabase) {
        // Try to fetch from Supabase if available
        const { data: clicksData, error: clicksError } = await supabase
          .from('demo_clicks')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        const { data: conversionsData, error: conversionsError } = await supabase
          .from('demo_conversions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (clicksError || conversionsError) {
          throw new Error(clicksError?.message || conversionsError?.message);
        }

        setClicks(clicksData || []);
        setConversions(conversionsData || []);
      } else {
        // Use mock data when Supabase is not available
        setClicks(mockClicks);
        setConversions(mockConversions);
      }
      
      // Calculate stats
      const totalClicks = clicksData?.length || 0;
      const totalConversions = conversionsData?.length || 0;
      const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100) : 0;
      const revenue = totalConversions * 50; // $50 per conversion

      setStats({
        totalClicks,
        totalConversions,
        conversionRate: conversionRate.toFixed(2),
        revenue
      });

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, prefix = '', suffix = '' }) => (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      cursor: 'default'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>
            {title}
          </p>
          <p style={{ 
            color: color || '#1e293b', 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {prefix}{value}{suffix}
          </p>
        </div>
        <div style={{ 
          fontSize: '28px',
          color: color || '#3b82f6',
          opacity: 0.8
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ type, timestamp, details }) => (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateX(4px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)';
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: type === 'click' 
          ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: 'white'
      }}>
        {type === 'click' ? '👆' : '💰'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
          {type === 'click' ? 'Link Click' : 'Conversion'}
        </div>
        <div style={{ color: '#6b7280', fontSize: '12px' }}>
          {new Date(timestamp).toLocaleString()}
        </div>
        {details && (
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {details}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '32px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            FlowLync Demo Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>
            Real-time affiliate tracking analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          <StatCard 
            title="Total Clicks" 
            value={loading ? '...' : stats.totalClicks} 
            icon="👆" 
            color="#3b82f6"
          />
          <StatCard 
            title="Conversions" 
            value={loading ? '...' : stats.totalConversions} 
            icon="💰" 
            color="#10b981"
          />
          <StatCard 
            title="Conversion Rate" 
            value={loading ? '...' : stats.conversionRate} 
            icon="📈" 
            color="#f59e0b"
            suffix="%"
          />
          <StatCard 
            title="Revenue" 
            value={loading ? '...' : `$${stats.revenue}`} 
            icon="💎" 
            color="#8b5cf6"
          />
        </div>

        {error && (
          <div style={{ 
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#dc2626',
            fontWeight: '500'
          }}>
            Error: {error}
          </div>
        )}

        {/* Activity Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px'
        }}>
          
          {/* Recent Clicks */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👆</span> Recent Clicks
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Loading clicks...
                </div>
              ) : clicks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  No clicks yet. Try the demo link!
                </div>
              ) : (
                clicks.map((click, index) => (
                  <ActivityItem
                    key={index}
                    type="click"
                    timestamp={click.timestamp}
                    details={`From: ${click.referrer || 'Direct'}`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Recent Conversions */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>💰</span> Recent Conversions
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Loading conversions...
                </div>
              ) : conversions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  No conversions yet. Try the demo!
                </div>
              ) : (
                conversions.map((conversion, index) => (
                  <ActivityItem
                    key={index}
                    type="conversion"
                    timestamp={conversion.timestamp}
                    details={`Value: $${conversion.value || 50}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          marginTop: '32px',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/demo-link" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔗 Generate Demo Link
          </a>
          <a 
            href="/demo-convert" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            💰 Test Conversion
          </a>
          <a 
            href="/setup-db" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ⚙️ Setup Database
          </a>
        </div>
      </div>
    </div>
  );
}