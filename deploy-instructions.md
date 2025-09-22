# FlowLync Platform Deployment Guide

## Quick Deployment to Vercel (Recommended)

### Step 1: Install Git (if not already installed)
1. Download Git from: https://git-scm.com/download/win
2. Install with default settings
3. Restart VS Code/Terminal

### Step 2: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial FlowLync platform setup"
```

### Step 3: Deploy to Vercel
1. Go to: https://vercel.com
2. Sign up with GitHub/Google
3. Click "Add New Project"
4. Choose "Import Git Repository"
5. Upload your project folder OR connect GitHub

### Step 4: Environment Variables
In Vercel dashboard, add these environment variables:
```
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=https://your-app.vercel.app
AUTH0_ISSUER_BASE_URL=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

### Alternative: GitHub + Vercel (Automated)
1. Create GitHub account
2. Create new repository
3. Push your code to GitHub
4. Connect Vercel to your GitHub repo
5. Auto-deploys on every push!

## Expected Results
- Public URL: `https://your-flowlync.vercel.app`
- Full landing page with manifesto
- Working Auth0 authentication
- User dashboard access
- Form submissions working

## Current Local Status ✅
- Running on: http://localhost:3002
- Auth0: Working
- Landing page: Integrated
- Dashboard: Functional