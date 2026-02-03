# Deployment Guide

This document describes how to deploy BodyGoGo to production (Vercel + Supabase).

## 1. Prerequisites
- Supabase project created
- Migrations applied:
  - `docs/migrations/000_users.sql`
  - `docs/migrations/001_user_settings.sql`
  - `docs/migrations/002_user_settings_rls.sql`
  - `docs/migrations/004_core_tables.sql`
  - `docs/migrations/005_core_rls.sql`
- Local build passes:
  - `npm test`
  - `npm run lint`
  - `npm run build`

## 2. Environment Variables
Set these in your hosting provider:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Supabase Auth Settings
In Supabase Auth settings:
- Add your production domain to **Site URL**
- Add your production domain to **Redirect URLs**
  - Example: `https://your-domain.com`

## 4. Build & Deploy (Vercel)
1. Import the repo into Vercel
2. Configure Environment Variables (see section 2)
3. Deploy using default Next.js settings

## 5. Post-Deploy Smoke Test
Follow `docs/E2E_CHECKLIST.md`:
- Sign up / log in
- Complete onboarding
- Log body / food / workout
- Confirm dashboard updates
- Toggle privacy and verify community feed behavior

## 6. Notes
- Font loading uses local Inter files under `public/fonts/Inter/woff-hinted`.
- The app uses RLS; users will only see their own data unless privacy is `public` for community.
