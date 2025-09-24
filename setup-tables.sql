-- Demo Tracking System Database Setup
-- Run these commands in your Supabase SQL Editor

-- Table for tracking demo link clicks
CREATE TABLE IF NOT EXISTS demo_clicks (
  id SERIAL PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip TEXT
);

-- Table for tracking demo conversions
CREATE TABLE IF NOT EXISTS demo_conversions (
  id SERIAL PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_clicks_link_id ON demo_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_demo_clicks_timestamp ON demo_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_demo_conversions_link_id ON demo_conversions(link_id);
CREATE INDEX IF NOT EXISTS idx_demo_conversions_timestamp ON demo_conversions(timestamp);

-- Insert some sample data for testing (optional)
INSERT INTO demo_clicks (link_id, user_agent, referrer, ip) VALUES 
('demo1', 'Test User Agent', 'https://example.com', '127.0.0.1');

INSERT INTO demo_conversions (link_id) VALUES 
('demo1');