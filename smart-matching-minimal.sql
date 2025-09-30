-- MINIMAL Smart Matching Setup - Run this first to test
-- Just the essential tables needed for preferences

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  preferred_categories JSONB,
  preferred_jurisdictions JSONB,
  risk_tolerance TEXT,
  budget_range JSONB,
  preferred_features JSONB,
  preferred_payment_methods JSONB,
  target_regions JSONB,
  experience_level TEXT,
  marketing_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Casinos table
CREATE TABLE IF NOT EXISTS casinos (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  category TEXT,
  jurisdiction TEXT,
  min_deposit DECIMAL(10,2),
  payout_percentage DECIMAL(5,2),
  popularity_score INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  features JSONB,
  target_audience JSONB,
  commission_structure JSONB,
  payment_methods JSONB,
  languages JSONB,
  currencies JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliates table
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
  tracking_software TEXT,
  specialization TEXT,
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

-- Add some test data
INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) 
VALUES ('Royal Vegas Casino', 'https://royalvegascasino.com', 'Premium online casino', 'casino', 'malta', 10.00, 96.50, 85, 90, '["live-dealer", "mobile-app"]', '{"age": "25-45", "experience": "intermediate"}')
ON CONFLICT DO NOTHING;

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) 
VALUES ('CasinoAffiliates Pro', 'https://casinoaffiliatespro.com', 'Top casino affiliate network', 45.00, 'casino', '["US", "CA", "UK"]', 88, 92, 85)
ON CONFLICT DO NOTHING;