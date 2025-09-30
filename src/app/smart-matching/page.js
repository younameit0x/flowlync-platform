'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function SmartMatchingDashboard() {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Development mode - allows testing without authentication
  const isDev = process.env.NODE_ENV === 'development';
  const mockUser = { sub: 'dev-user-123' };
  const effectiveUser = user || (isDev ? mockUser : null);

  useEffect(() => {
    if (effectiveUser) {
      fetchRecommendations();
      fetchUserPreferences();
    } else if (!userLoading && !isDev) {
      setLoading(false);
    }
  }, [effectiveUser, userLoading]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/smart-matching/recommendations?user_id=${effectiveUser.sub}&limit=20`);
      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations');
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`/api/smart-matching/user-preferences?user_id=${effectiveUser.sub}`);
      const data = await response.json();

      if (response.ok) {
        setPreferences(data.preferences);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationFeedback = async (recommendationId, feedback, isAccepted = false) => {
    try {
      const response = await fetch('/api/smart-matching/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: effectiveUser.sub,
          recommendation_id: recommendationId,
          feedback,
          is_accepted: isAccepted
        }),
      });

      if (response.ok) {
        // Refresh recommendations
        fetchRecommendations();
      }
    } catch (err) {
      console.error('Error saving feedback:', err);
    }
  };

  if (userLoading || (loading && !isDev)) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          🤖 Loading Smart Matching AI...
        </div>
      </div>
    );
  }

  if (!effectiveUser && !isDev) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔐 Login Required</div>
          <div style={{ marginBottom: '24px' }}>Please log in to access Smart Matching AI</div>
          <a
            href="/api/auth/login"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            🔐 Login to Continue
          </a>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>❌ Authentication Error</div>
          <div>{userError.message}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔐 Access Required</div>
          <div>Please log in to access Smart Matching</div>
        </div>
      </div>
    );
  }

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '12px 24px',
        background: activeTab === tab ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: activeTab === tab ? 'bold' : 'normal',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  const RecommendationCard = ({ rec }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {rec.affiliate_logo && (
              <img
                src={rec.affiliate_logo}
                alt={rec.affiliate_name}
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
            <div>
              <h3 style={{ margin: '0', fontSize: '18px', color: '#1a202c' }}>
                {rec.affiliate_name}
              </h3>
              <p style={{ margin: '4px 0 0 0', color: '#4a5568', fontSize: '14px' }}>
                ↔ {rec.casino_name}
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: rec.confidence_score >= 80 ? '#48bb78' : rec.confidence_score >= 60 ? '#ed8936' : '#f56565',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {rec.confidence_score}% Match
          </div>
          <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
            {rec.commission_rate}% Commission
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '14px', color: '#2d3748', marginBottom: '8px' }}>🎯 Why This Match:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {rec.reasoning?.slice(0, 3).map((reason, index) => (
            <span key={index} style={{
              background: '#edf2f7',
              color: '#4a5568',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleRecommendationFeedback(rec.id, 1, true)}
          style={{
            background: '#48bb78',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          ✅ Accept
        </button>
        <button
          onClick={() => handleRecommendationFeedback(rec.id, -1, false)}
          style={{
            background: '#f56565',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          ❌ Reject
        </button>
        <button
          onClick={() => window.open(rec.affiliate_website, '_blank')}
          style={{
            background: '#4299e1',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          🔗 Visit
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🤖 Smart Matching AI
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
            AI-powered affiliate-casino pairing recommendations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <TabButton tab="recommendations" label="Recommendations" icon="🎯" />
          <TabButton tab="preferences" label="Preferences" icon="⚙️" />
          <TabButton tab="analytics" label="Analytics" icon="📊" />
        </div>

        {/* Content */}
        {activeTab === 'recommendations' && (
          <div>
            {!preferences ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>
                  Set Up Your Preferences
                </h2>
                <p style={{ color: '#4a5568', marginBottom: '24px' }}>
                  Tell us about your preferences so we can generate personalized recommendations
                </p>
                <button
                  onClick={() => setActiveTab('preferences')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Set Preferences →
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '8px' }}>
                    🎯 Your Recommendations ({recommendations.length})
                  </h2>
                  <p style={{ color: '#4a5568', margin: '0' }}>
                    AI-powered matches based on your preferences and market data
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fed7d7',
                    border: '1px solid #e53e3e',
                    color: '#c53030',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    {error}
                  </div>
                )}

                {recommendations.length === 0 ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤔</div>
                    <h3 style={{ color: '#2d3748', marginBottom: '8px' }}>
                      No Recommendations Yet
                    </h3>
                    <p style={{ color: '#4a5568' }}>
                      We're analyzing the market for the best matches. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {recommendations.map((rec, index) => (
                      <RecommendationCard key={index} rec={rec} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <UserPreferencesTab user={effectiveUser} preferences={preferences} onUpdate={fetchUserPreferences} />
        )}

        {activeTab === 'analytics' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>
              Analytics Dashboard
            </h2>
            <p style={{ color: '#4a5568' }}>
              Track your recommendation performance and insights (Coming Soon)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserPreferencesTab({ user, preferences, onUpdate }) {
  // Use effectiveUser (includes dev mode support)
  const effectiveUser = user || { sub: 'dev-user-123' };
  const [formData, setFormData] = useState({
    preferred_categories: preferences?.preferred_categories || [],
    preferred_jurisdictions: preferences?.preferred_jurisdictions || [],
    risk_tolerance: preferences?.risk_tolerance || 'medium',
    budget_range: preferences?.budget_range || { min: 10, max: 1000 },
    preferred_features: preferences?.preferred_features || [],
    experience_level: preferences?.experience_level || 'intermediate'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/smart-matching/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: effectiveUser.sub,
          ...formData
        }),
      });

      if (response.ok) {
        onUpdate();
        alert('Preferences saved successfully!');
      } else {
        alert('Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    }));
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ color: '#2d3748', marginBottom: '24px' }}>
        ⚙️ Your Preferences
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Preferred Categories (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferred_categories.join(', ')}
            onChange={(e) => handleArrayChange('preferred_categories', e.target.value)}
            placeholder="casino, sportsbook, poker"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Preferred Jurisdictions (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferred_jurisdictions.join(', ')}
            onChange={(e) => handleArrayChange('preferred_jurisdictions', e.target.value)}
            placeholder="malta, curacao, uk"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Risk Tolerance
          </label>
          <select
            value={formData.risk_tolerance}
            onChange={(e) => setFormData(prev => ({ ...prev, risk_tolerance: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
              Min Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget_range.min}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                budget_range: { ...prev.budget_range, min: parseInt(e.target.value) || 0 }
              }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
              Max Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget_range.max}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                budget_range: { ...prev.budget_range, max: parseInt(e.target.value) || 1000 }
              }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>
            Experience Level
          </label>
          <select
            value={formData.experience_level}
            onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? '💾 Saving...' : '💾 Save Preferences'}
        </button>
      </form>
    </div>
  );
}
