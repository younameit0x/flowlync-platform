# Step-by-Step Demo Setup Guide

## Prerequisites Check
1. ✅ Next.js server is running (on port 3001)  
2. ⚠️ Need to set up Supabase tables for demo data

## Step 1: Create Supabase Tables
Before testing, you need these tables in your Supabase database:

### Table 1: demo_clicks
```sql
CREATE TABLE demo_clicks (
  id SERIAL PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip TEXT
);
```

### Table 2: demo_conversions  
```sql
CREATE TABLE demo_conversions (
  id SERIAL PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## Step 2: Test the Demo Flow

### 2.1 Generate a Demo Link
1. Open: http://localhost:3001/demo-link
2. Enter a linkId (e.g., "demo1")
3. Click "Generate Link"
4. Copy the generated tracking link

### 2.2 Test Click Tracking
1. Click the generated tracking link
2. You should be redirected to `/demo-convert?linkId=demo1`
3. This logs a click in the `demo_clicks` table

### 2.3 Test Conversion Tracking
1. On the conversion page, click "Simulate Conversion"
2. This logs a conversion in the `demo_conversions` table
3. You should see "Conversion logged!" message

### 2.4 View Results
1. Open: http://localhost:3001/demo-dashboard  
2. Enter your linkId (e.g., "demo1")
3. Click "Fetch Data"
4. You should see your click and conversion data

## Step 3: Test Multiple Scenarios
- Try different linkIds (demo2, demo3, etc.)
- Test clicking the same link multiple times
- View data for different linkIds in the dashboard

## Troubleshooting
- If pages don't load: Check if server is running on http://localhost:3001
- If no data shows: Verify Supabase tables exist and environment variables are set
- If API errors: Check browser console for detailed error messages

## Environment Variables Needed
Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```