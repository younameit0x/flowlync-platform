-- REMAINING Smart Matching Tables - Add these to complete the system

-- Table for storing user behavior and interaction data
CREATE TABLE IF NOT EXISTS user_behavior (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing affiliate performance metrics
CREATE TABLE IF NOT EXISTS affiliate_performance (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER REFERENCES affiliates(id),
  date DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  deposits INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  payout DECIMAL(10,2) DEFAULT 0,
  player_value DECIMAL(10,2) DEFAULT 0,
  retention_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, date)
);

-- Table for storing casino performance metrics
CREATE TABLE IF NOT EXISTS casino_performance (
  id SERIAL PRIMARY KEY,
  casino_id INTEGER REFERENCES casinos(id),
  date DATE NOT NULL,
  visitors INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  deposits INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  player_retention DECIMAL(5,2) DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(casino_id, date)
);

-- Table for storing AI-generated recommendations
CREATE TABLE IF NOT EXISTS smart_recommendations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  affiliate_id INTEGER REFERENCES affiliates(id),
  casino_id INTEGER REFERENCES casinos(id),
  recommendation_type TEXT NOT NULL,
  confidence_score DECIMAL(5,2),
  reasoning JSONB,
  user_feedback INTEGER,
  is_accepted BOOLEAN,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing recommendation interactions
CREATE TABLE IF NOT EXISTS recommendation_interactions (
  id SERIAL PRIMARY KEY,
  recommendation_id INTEGER REFERENCES smart_recommendations(id),
  user_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_casinos_category ON casinos(category);
CREATE INDEX IF NOT EXISTS idx_casinos_jurisdiction ON casinos(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_casinos_active ON casinos(is_active);

CREATE INDEX IF NOT EXISTS idx_affiliates_specialization ON affiliates(specialization);
CREATE INDEX IF NOT EXISTS idx_affiliates_active ON affiliates(is_active);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_timestamp ON user_behavior(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_behavior_action_type ON user_behavior(action_type);

CREATE INDEX IF NOT EXISTS idx_affiliate_performance_affiliate_date ON affiliate_performance(affiliate_id, date);
CREATE INDEX IF NOT EXISTS idx_casino_performance_casino_date ON casino_performance(casino_id, date);

CREATE INDEX IF NOT EXISTS idx_smart_recommendations_user_id ON smart_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_recommendations_created_at ON smart_recommendations(created_at);
CREATE INDEX IF NOT EXISTS idx_smart_recommendations_confidence ON smart_recommendations(confidence_score);

CREATE INDEX IF NOT EXISTS idx_recommendation_interactions_recommendation_id ON recommendation_interactions(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_interactions_timestamp ON recommendation_interactions(timestamp);

-- Add more test data
INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) 
VALUES 
('SportsBet Pro', 'https://sportsbetpro.com', 'Leading sportsbook', 'sportsbook', 'curacao', 5.00, 94.20, 92, 85, '["live-betting", "mobile-app"]', '{"age": "21-35", "experience": "beginner"}'),
('PokerElite Network', 'https://pokerelite.com', 'Professional poker platform', 'poker', 'uk', 20.00, 97.80, 78, 95, '["tournaments", "multi-table"]', '{"age": "30-50", "experience": "advanced"}')
ON CONFLICT DO NOTHING;

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) 
VALUES 
('SportsBet Partners', 'https://sportsbetpartners.com', 'Sportsbook affiliate specialists', 35.00, 'sportsbook', '["US", "EU", "ASIA"]', 82, 88, 90),
('PokerAffiliate Hub', 'https://pokeraffiliatehub.com', 'Premier poker affiliate network', 40.00, 'poker', '["US", "EU", "AU"]', 90, 95, 88)
ON CONFLICT DO NOTHING;