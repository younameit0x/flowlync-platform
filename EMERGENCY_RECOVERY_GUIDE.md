# 🛠️ EMERGENCY DEPLOYMENT RECOVERY GUIDE
# Step-by-Step Instructions to Rebuild Everything

## 🚨 WHEN TO USE THIS GUIDE
- Computer crashes or data loss
- Need to setup on new machine
- Deployment corruption
- Starting from complete scratch
- Transferring to another developer

## 📋 PREREQUISITES CHECKLIST
```
✅ Internet connection
✅ Node.js 18+ installed
✅ Git installed
✅ VS Code (recommended)
✅ Supabase account access
✅ GitHub account access
✅ Vercel account access
```

## 🚀 STEP-BY-STEP RECOVERY PROCESS

### Step 1: Repository Recovery
```bash
# 1.1 Clone the repository
git clone https://github.com/younameit0x/flowlync-platform.git
cd flowlync-platform

# 1.2 Verify all files are present
ls -la
# Should see: package.json, src/, public/, *.md files, etc.

# 1.3 Check branch status
git status
git branch -a
```

### Step 2: Environment Setup
```bash
# 2.1 Install Node.js dependencies
npm install

# 2.2 Create environment file
cp .env.example .env.local
# OR create manually:
touch .env.local

# 2.3 Add Supabase credentials to .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local  
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-key" >> .env.local
```

### Step 3: Database Recovery
```bash
# 3.1 Setup Smart Matching database
node setup-smart-matching-db.js

# 3.2 Verify database connection
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
supabase.from('casinos').select('count').then(r => 
  console.log('Database connected:', r.data ? 'SUCCESS' : 'FAILED')
);
"

# 3.3 Add sample data if needed
node add-sample-data.js
```

### Step 4: Local Testing
```bash
# 4.1 Start development server
npm run dev

# 4.2 Test in browser
# Open: http://localhost:3000
# Verify: Homepage loads properly

# 4.3 Test key endpoints
curl http://localhost:3000/api/smart-matching/casinos
curl http://localhost:3000/api/ai-chat
```

### Step 5: Production Deployment
```bash
# 5.1 Commit any changes
git add .
git commit -m "Recovery deployment setup"

# 5.2 Push to GitHub
git push origin main

# 5.3 Setup Vercel (if needed)
# Visit: https://vercel.com
# Import from GitHub: younameit0x/flowlync-platform
# Add environment variables in Vercel dashboard

# 5.4 Verify deployment
curl https://flowlync-platform.vercel.app
```

## 🔧 SUPABASE RECOVERY INSTRUCTIONS

### If Supabase Project is Lost:
```sql
-- 1. Create new Supabase project
-- 2. Go to SQL Editor
-- 3. Run this complete schema:

-- Smart Matching Tables
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

-- Insert sample data
INSERT INTO casinos (name, website_url, description, category, jurisdiction, min_deposit, payout_percentage, popularity_score, trust_score, features, target_audience) VALUES
('Royal Vegas Casino', 'https://royalvegascasino.com', 'Premium online casino', 'casino', 'malta', 10.00, 96.50, 85, 90, '["live-dealer", "mobile-app", "vip-program"]', '{"age": "25-45", "income": "middle-high"}'),
('SportsBet Pro', 'https://sportsbetpro.com', 'Leading sportsbook', 'sportsbook', 'curacao', 5.00, 94.20, 92, 85, '["live-betting", "mobile-app", "cash-out"]', '{"age": "21-35", "income": "middle"}'),
('PokerElite Network', 'https://pokerelite.com', 'Professional poker platform', 'poker', 'uk', 20.00, 97.80, 78, 95, '["tournaments", "multi-table", "coaching"]', '{"age": "30-50", "income": "high"}');

INSERT INTO affiliates (name, website_url, description, commission_rate, specialization, target_regions, reputation_score, payout_reliability, support_quality) VALUES
('CasinoAffiliates Pro', 'https://casinoaffiliatespro.com', 'Top casino affiliate network', 45.00, 'casino', '["US", "CA", "UK", "AU"]', 88, 92, 85),
('SportsBet Partners', 'https://sportsbetpartners.com', 'Sportsbook specialists', 35.00, 'sportsbook', '["US", "EU", "ASIA"]', 82, 88, 90),
('PokerAffiliate Hub', 'https://pokeraffiliatehub.com', 'Premier poker network', 40.00, 'poker', '["US", "EU", "AU"]', 90, 95, 88);
```

## ⚡ QUICK RECOVERY COMMANDS (Copy-Paste Ready)

### Full Recovery in 5 Minutes:
```bash
# 1. Clone and setup
git clone https://github.com/younameit0x/flowlync-platform.git
cd flowlync-platform
npm install

# 2. Environment (REPLACE WITH YOUR KEYS)
echo "NEXT_PUBLIC_SUPABASE_URL=YOUR_URL_HERE" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY_HERE" >> .env.local

# 3. Database
node setup-smart-matching-db.js

# 4. Test locally
npm run dev

# 5. Deploy
git add .
git commit -m "Recovery deployment"
git push origin main
```

## 🚨 TROUBLESHOOTING RECOVERY ISSUES

### Issue: "Module not found" errors
```bash
# Solution: Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Supabase connection failed"
```bash
# Solution: Verify environment variables
cat .env.local
# Ensure keys are correct and complete
```

### Issue: "Database tables not found"
```bash
# Solution: Re-run database setup
node setup-smart-matching-db.js
# Check Supabase SQL Editor for tables
```

### Issue: "Vercel deployment fails"
```bash
# Solution: Check build locally first
npm run build
# Fix any build errors before pushing
```

## 📞 RECOVERY VERIFICATION CHECKLIST

After recovery, verify these work:
```
✅ Homepage loads: https://flowlync-platform.vercel.app
✅ Dashboard accessible: /dashboard
✅ Smart Matching works: /smart-matching  
✅ AI Chat responds: Chat widget on any page
✅ Recommendations API: /api/smart-matching/recommendations?user_id=test-user
✅ Database contains data: Check Supabase tables
✅ All APIs respond: Test each endpoint
```

## 🔒 FINAL SECURITY STEPS

1. **Verify .env.local is in .gitignore**
2. **Never commit Supabase keys to Git**
3. **Set Vercel environment variables securely**
4. **Test all functionality thoroughly**
5. **Create new backup documentation**

---

**🎯 RECOVERY SUCCESS**: If you can access the live platform and all APIs work, recovery is complete!

**📅 Last Updated**: October 2, 2025
**⚡ Recovery Time**: ~15-30 minutes with this guide