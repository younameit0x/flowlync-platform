-- 🚀 Real-Time Smart Matching Database Schema
-- Enhanced tables for live affiliate program intelligence

-- Real-time commission tracking table
CREATE TABLE IF NOT EXISTS real_time_commissions (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    network VARCHAR(100),
    current_commission INTEGER NOT NULL,
    base_commission INTEGER NOT NULL,
    tier2_commission INTEGER,
    tier3_commission INTEGER,
    trending_score INTEGER DEFAULT 0,
    competition_level VARCHAR(20) DEFAULT 'Medium',
    estimated_epc DECIMAL(10,2),
    conversion_rate VARCHAR(10),
    average_order_value INTEGER,
    program_health INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    geo_targeting TEXT[], -- Array of geo targets
    payment_terms VARCHAR(50),
    min_payout INTEGER,
    seasonal_bonus VARCHAR(50),
    available_creatives INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_name) -- Prevent duplicates, use upsert
);

-- Trending programs detection table
CREATE TABLE IF NOT EXISTS trending_programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    trending_score INTEGER NOT NULL,
    momentum VARCHAR(20), -- Rising, Hot, Explosive
    trending_reasons JSONB, -- Store trending indicators
    recommended_action TEXT,
    time_to_act VARCHAR(50),
    volume_change_24h DECIMAL(5,2),
    commission_change_24h DECIMAL(5,2),
    competition_change VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_name, DATE(updated_at)) -- One entry per program per day
);

-- Competitor intelligence table
CREATE TABLE IF NOT EXISTS competitor_intelligence (
    id SERIAL PRIMARY KEY,
    competitor_name VARCHAR(255) NOT NULL,
    promoted_programs TEXT[], -- Array of promoted programs
    average_commission INTEGER,
    traffic_estimate VARCHAR(50),
    top_keywords TEXT[], -- Array of top keywords
    market_share VARCHAR(10),
    opportunity_score INTEGER,
    recommended_strategy TEXT,
    competition_level VARCHAR(20),
    underserved_programs TEXT[], -- Array of underserved programs
    last_scraped TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(competitor_name, DATE(updated_at)) -- One entry per competitor per day
);

-- Market intelligence alerts table
CREATE TABLE IF NOT EXISTS market_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- commission_increase, new_program, competitor_left, etc.
    program_name VARCHAR(255),
    competitor_name VARCHAR(255),
    alert_title VARCHAR(255) NOT NULL,
    alert_message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    action_required BOOLEAN DEFAULT FALSE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historical performance tracking
CREATE TABLE IF NOT EXISTS program_performance_history (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    commission_rate INTEGER,
    trending_score INTEGER,
    competition_level VARCHAR(20),
    market_share DECIMAL(5,2),
    estimated_earnings DECIMAL(10,2),
    conversion_rate DECIMAL(5,2),
    traffic_volume INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market trends analysis table
CREATE TABLE IF NOT EXISTS market_trends (
    id SERIAL PRIMARY KEY,
    trend_type VARCHAR(50) NOT NULL, -- seasonal, regulatory, competitive, etc.
    trend_name VARCHAR(255) NOT NULL,
    trend_description TEXT,
    affected_programs TEXT[], -- Array of affected programs
    impact_score INTEGER, -- 1-100 impact rating
    trend_direction VARCHAR(20), -- up, down, stable
    start_date DATE,
    predicted_end_date DATE,
    confidence_level INTEGER, -- AI prediction confidence 1-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time scraper health monitoring
CREATE TABLE IF NOT EXISTS scraper_health (
    id SERIAL PRIMARY KEY,
    scraper_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, stopped, error
    last_successful_run TIMESTAMP WITH TIME ZONE,
    total_runs INTEGER DEFAULT 0,
    successful_runs INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error_message TEXT,
    avg_response_time DECIMAL(10,3), -- in seconds
    data_quality_score INTEGER DEFAULT 100, -- 1-100 quality rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scraper_name) -- One entry per scraper
);

-- User notification preferences for real-time alerts
CREATE TABLE IF NOT EXISTS user_alert_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    commission_alerts BOOLEAN DEFAULT TRUE,
    trending_alerts BOOLEAN DEFAULT TRUE,
    competitor_alerts BOOLEAN DEFAULT FALSE,
    market_alerts BOOLEAN DEFAULT TRUE,
    alert_frequency VARCHAR(20) DEFAULT 'real_time', -- real_time, hourly, daily
    min_opportunity_score INTEGER DEFAULT 70, -- Minimum score to trigger alerts
    preferred_geos TEXT[], -- Geographic preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_real_time_commissions_trending ON real_time_commissions(trending_score DESC, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_real_time_commissions_commission ON real_time_commissions(current_commission DESC);
CREATE INDEX IF NOT EXISTS idx_real_time_commissions_program ON real_time_commissions(program_name);
CREATE INDEX IF NOT EXISTS idx_trending_programs_score ON trending_programs(trending_score DESC, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_intelligence_opportunity ON competitor_intelligence(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_market_alerts_user_unread ON market_alerts(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_performance_history_program_time ON program_performance_history(program_name, recorded_at DESC);

-- Functions for real-time data updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
CREATE TRIGGER update_real_time_commissions_updated_at BEFORE UPDATE ON real_time_commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trending_programs_updated_at BEFORE UPDATE ON trending_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitor_intelligence_updated_at BEFORE UPDATE ON competitor_intelligence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_trends_updated_at BEFORE UPDATE ON market_trends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scraper_health_updated_at BEFORE UPDATE ON scraper_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_alert_preferences_updated_at BEFORE UPDATE ON user_alert_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion for testing
INSERT INTO real_time_commissions (
    program_name, network, current_commission, base_commission, tier2_commission, tier3_commission,
    trending_score, competition_level, estimated_epc, conversion_rate, average_order_value,
    program_health, geo_targeting, payment_terms, min_payout
) VALUES 
    ('BetMGM Casino', 'Internal', 28, 25, 35, 45, 85, 'Medium', 3.25, '2.1%', 125, 95, '{"US","CA"}', 'Net 30', 100),
    ('Caesars Casino', 'CJ Affiliate', 32, 30, 40, 50, 92, 'High', 4.10, '2.8%', 145, 98, '{"US"}', 'Net 15', 50),
    ('DraftKings Casino', 'Impact', 22, 20, 30, 40, 78, 'Low', 2.85, '1.9%', 110, 88, '{"US","CA","UK"}', 'Net 30', 100),
    ('PokerStars Casino', 'Direct', 38, 35, 45, 55, 96, 'Medium', 4.75, '3.2%', 180, 99, '{"Global"}', 'Net 45', 200),
    ('Borgata Casino', 'ShareASale', 27, 25, 35, 45, 82, 'Low', 3.15, '2.3%', 135, 91, '{"US"}', 'Net 30', 100)
ON CONFLICT (program_name) DO UPDATE SET
    current_commission = EXCLUDED.current_commission,
    trending_score = EXCLUDED.trending_score,
    updated_at = NOW();

-- Insert sample trending programs
INSERT INTO trending_programs (
    program_name, trending_score, momentum, trending_reasons, recommended_action, time_to_act
) VALUES 
    ('Caesars Casino', 92, 'Hot', '{"commissionIncrease": true, "volumeSpike": true}', 'Consider joining - trending upward', '24-48 hours optimal window'),
    ('PokerStars Casino', 96, 'Explosive', '{"newCreatives": true, "seasonalBoost": true}', 'High priority - explosive growth', '12-24 hours critical window')
ON CONFLICT (program_name, DATE(updated_at)) DO UPDATE SET
    trending_score = EXCLUDED.trending_score,
    momentum = EXCLUDED.momentum,
    updated_at = NOW();

-- Enable Row Level Security (RLS) for user-specific data
ALTER TABLE market_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user data protection
CREATE POLICY "Users can view their own alerts" ON market_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON market_alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences" ON user_alert_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Grant permissions for service role to manage real-time data
GRANT ALL ON real_time_commissions TO service_role;
GRANT ALL ON trending_programs TO service_role;
GRANT ALL ON competitor_intelligence TO service_role;
GRANT ALL ON market_alerts TO service_role;
GRANT ALL ON program_performance_history TO service_role;
GRANT ALL ON market_trends TO service_role;
GRANT ALL ON scraper_health TO service_role;
GRANT ALL ON user_alert_preferences TO service_role;

-- Grant read access to authenticated users for public data
GRANT SELECT ON real_time_commissions TO authenticated;
GRANT SELECT ON trending_programs TO authenticated;
GRANT SELECT ON competitor_intelligence TO authenticated;
GRANT SELECT ON program_performance_history TO authenticated;
GRANT SELECT ON market_trends TO authenticated;

COMMENT ON TABLE real_time_commissions IS 'Live affiliate program commission data updated every 15 minutes';
COMMENT ON TABLE trending_programs IS 'AI-detected trending affiliate programs with momentum analysis';
COMMENT ON TABLE competitor_intelligence IS 'Competitive analysis data from market intelligence scraping';
COMMENT ON TABLE market_alerts IS 'Real-time notifications for market opportunities and changes';
COMMENT ON TABLE program_performance_history IS 'Historical tracking for trend analysis and predictions';
COMMENT ON TABLE market_trends IS 'Macro market trend analysis for strategic planning';
COMMENT ON TABLE scraper_health IS 'Monitoring and health metrics for web scraping systems';
COMMENT ON TABLE user_alert_preferences IS 'User preferences for real-time alert delivery';