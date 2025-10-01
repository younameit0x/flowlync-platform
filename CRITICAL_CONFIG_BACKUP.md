# 🔐 CRITICAL CONFIGURATION FILES BACKUP

## 📦 package.json
```json
{
  "name": "flowlync-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.45.4",
    "dotenv": "^16.4.5",
    "puppeteer": "^23.5.0"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "14.2.15",
    "postcss": "^8",
    "tailwindcss": "^3.4.1"
  }
}
```

## ⚙️ Environment Variables Template (.env.local)
```bash
# 🚨 CRITICAL: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anonymous-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 📝 Notes:
# - Get these from your Supabase project dashboard
# - Service role key has full database access
# - Anonymous key for client-side operations
# - Never commit these keys to version control
```

## 🏗️ next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  }
};

export default nextConfig;
```

## 🎨 tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
```

## 📋 eslint.config.mjs
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
```

## 🎯 postcss.config.mjs
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

## 📊 jsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🗄️ Database Schema (setup-smart-matching-db.js)
```sql
-- Core Tables
CREATE TABLE IF NOT EXISTS casinos (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  category TEXT,
  jurisdiction TEXT,
  min_deposit DECIMAL(10,2),
  payout_percentage DECIMAL(5,2),
  popularity_score INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  commission_rate DECIMAL(5,2),
  specialization TEXT,
  reputation_score INTEGER DEFAULT 0,
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
  experience_level TEXT,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔄 Git Configuration
```bash
# .gitignore (Important Files to Exclude)
.env.local
.env
.next/
node_modules/
.vercel/
*.log
.DS_Store
```

## 🚀 Vercel Configuration (vercel.json)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**": {
      "maxDuration": 60
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key", 
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
  }
}
```

## 📱 VS Code Workspace (flowlync-platform.code-workspace)
```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "extensions": {
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "ms-vscode.vscode-typescript-next",
      "esbenp.prettier-vscode"
    ]
  }
}
```

## 🗂️ Critical File Paths for Backup
```
📁 Root Configuration
├── package.json ⭐
├── next.config.mjs ⭐  
├── .env.local ⭐⭐⭐ (MOST CRITICAL)
├── jsconfig.json
├── tailwind.config.js
├── postcss.config.mjs
└── eslint.config.mjs

📁 Database & Setup
├── setup-smart-matching-db.js ⭐⭐
├── add-sample-data.js ⭐
└── *.sql files

📁 Source Code
├── src/app/ (All pages & APIs) ⭐⭐
├── src/components/ (React components) ⭐
└── src/lib/ (Core libraries) ⭐⭐

📁 Documentation
├── COMPLETE_WORKSPACE_BACKUP.md ⭐⭐
├── COMPLETE_TECHNICAL_DOCUMENTATION.md ⭐⭐
└── All *.md files ⭐
```

## 🚨 RECOVERY PRIORITY ORDER
```
1. 🔐 .env.local (Supabase credentials)
2. 📦 package.json (Dependencies)
3. 🗄️ Database schema files
4. 💻 src/ directory (All source code)
5. ⚙️ Configuration files
6. 📚 Documentation files
```

---
**⚠️ CRITICAL REMINDER**: The `.env.local` file contains your Supabase credentials and is the MOST IMPORTANT file for recovery. Without these keys, the entire system cannot function. Keep this secure and backed up separately.

**📅 Generated**: October 2, 2025
**🔒 Status**: Complete Configuration Backup