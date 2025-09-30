-- DISABLE RLS for Smart Matching tables to allow API access

-- Disable Row Level Security for Smart Matching tables
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE casinos DISABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates DISABLE ROW LEVEL SECURITY;

-- Optional: If you created the additional tables, disable RLS for them too
-- ALTER TABLE user_behavior DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE affiliate_performance DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE casino_performance DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE smart_recommendations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE recommendation_interactions DISABLE ROW LEVEL SECURITY;

-- Test that tables exist
SELECT 'user_preferences' as table_name, COUNT(*) as row_count FROM user_preferences
UNION ALL
SELECT 'casinos' as table_name, COUNT(*) as row_count FROM casinos
UNION ALL
SELECT 'affiliates' as table_name, COUNT(*) as row_count FROM affiliates;