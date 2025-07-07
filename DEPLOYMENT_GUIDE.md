# 🚀 Quick Deployment Guide

## Environment Variables Setup

### 1. Local Development
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here
```

### 2. Vercel Deployment
**Method A: Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Connect your repository
3. Go to Project Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-ref.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_public_anon_key_here`
5. Deploy!

**Method B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

### 3. Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Settings → API
4. Copy "Project URL" and "anon public" key

### 4. Database Setup
1. In Supabase dashboard: SQL Editor
2. Copy/paste contents of `supabase/schema.sql`
3. Click "Run"

## ✅ Verification
Test your deployment:
```bash
curl https://your-app.vercel.app/api/users
```

Should return:
```json
{"success": true, "data": []}
```

## 🚨 Common Issues
- **"Missing Supabase URL"**: Check environment variables in Vercel dashboard
- **Database errors**: Ensure schema.sql was run in Supabase
- **CORS errors**: Already configured in next.config.js