-- Smart Matching: AI-powered affiliate-casino pairing recommendations
-- Database schema for the recommendation system (SAFE VERSION)

-- Table for storing casino information
CREATE TABLE IF NOT EXISTS casinos (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  category TEXT, -- 'sportsbook', 'casino', 'poker', 'bingo', etc.
  jurisdiction TEXT, -- 'malta', 'curacao', 'uk', 'us', etc.
  min_deposit DECIMAL(10,2),
  payout_percentage DECIMAL(5,2),
  popularity_score INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  features JSONB, -- Array of features like ['live-dealer', 'mobile-app', 'crypto']
  target_audience JSONB, -- Demographics and preferences
  commission_structure JSONB,
  payment_methods JSONB,
  languages JSONB,
  currencies JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing affiliate information
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  contact_email TEXT,
  affiliate_manager TEXT,
  commission_rate DECIMAL(5,2),
  payment_terms TEXT,
  tracking_software TEXT, -- 'cake', 'income-access', 'custom', etc.
  specialization TEXT, -- 'casino', 'sportsbook', 'poker', etc.
  target_regions JSONB,
  marketing_materials JSONB,
  api_integration BOOLEAN DEFAULT false,
  reputation_score INTEGER DEFAULT 0,
  payout_reliability INTEGER DEFAULT 0,
  support_quality INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing user preferences and behavior
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- Auth0 user ID
  preferred_categories JSONB, -- ['sportsbook', 'casino', 'poker']
  preferred_jurisdictions JSONB,
  risk_tolerance TEXT, -- 'low', 'medium', 'high'
  budget_range JSONB, -- {min: 10, max: 1000}
  preferred_features JSONB,
  preferred_payment_methods JSONB,
  target_regions JSONB,
  experience_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  marketing_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table for storing user behavior and interaction data
CREATE TABLE IF NOT EXISTS user_behavior (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT,
  action_type TEXT NOT NULL, -- 'view', 'click', 'signup', 'deposit', 'conversion'
  target_type TEXT, -- 'casino', 'affiliate', 'recommendation'
  target_id INTEGER,
  metadata JSONB, -- Additional context data
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
  recommendation_type TEXT NOT NULL, -- 'affiliate_match', 'casino_match', 'partnership'
  confidence_score DECIMAL(5,2), -- 0-100
  reasoning JSONB, -- AI explanation for the recommendation
  user_feedback INTEGER, -- -1 (negative), 0 (neutral), 1 (positive)
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
  interaction_type TEXT NOT NULL, -- 'view', 'click', 'accept', 'reject', 'ignore'
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

-- Insert sample data for testing (only if tables are empty)
INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) 
SELECT 'Royal Vegas Casino', 'https://royalvegascasino.com', 'Premium online casino with extensive game library', 'casino', 'malta', 10.00, 96.50, 85, 90, '["live-dealer", "mobile-app", "vip-program"]', '{"age": "25-45", "income": "middle-high", "experience": "intermediate"}'
WHERE NOT EXISTS (SELECT 1 FROM casinos WHERE name = 'Royal Vegas Casino');

INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) 
SELECT 'SportsBet Pro', 'https://sportsbetpro.com', 'Leading sportsbook with competitive odds', 'sportsbook', 'curacao', 5.00, 94.20, 92, 85, '["live-betting", "mobile-app", "cash-out"]', '{"age": "21-35", "income": "middle", "experience": "beginner"}'
WHERE NOT EXISTS (SELECT 1 FROM casinos WHERE name = 'SportsBet Pro');

INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) 
SELECT 'PokerElite Network', 'https://pokerelite.com', 'Professional poker platform with tournaments', 'poker', 'uk', 20.00, 97.80, 78, 95, '["tournaments", "multi-table", "coaching"]', '{"age": "30-50", "income": "high", "experience": "advanced"}'
WHERE NOT EXISTS (SELECT 1 FROM casinos WHERE name = 'PokerElite Network');

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) 
SELECT 'CasinoAffiliates Pro', 'https://casinoaffiliatespro.com', 'Top-performing casino affiliate network', 45.00, 'casino', '["US", "CA", "UK", "AU"]', 88, 92, 85
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE name = 'CasinoAffiliates Pro');

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) 
SELECT 'SportsBet Partners', 'https://sportsbetpartners.com', 'Sportsbook affiliate specialists', 35.00, 'sportsbook', '["US", "EU", "ASIA"]', 82, 88, 90
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE name = 'SportsBet Partners');

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) 
SELECT 'PokerAffiliate Hub', 'https://pokeraffiliatehub.com', 'Premier poker affiliate network', 40.00, 'poker', '["US", "EU", "AU"]', 90, 95, 88
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE name = 'PokerAffiliate Hub');

-- Function to update timestamps (CREATE OR REPLACE handles existing functions)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Safe trigger creation (drop and recreate)
DROP TRIGGER IF EXISTS update_casinos_updated_at ON casinos;
CREATE TRIGGER update_casinos_updated_at BEFORE UPDATE ON casinos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_smart_recommendations_updated_at ON smart_recommendations;
CREATE TRIGGER update_smart_recommendations_updated_at BEFORE UPDATE ON smart_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();