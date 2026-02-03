# End-to-End Smoke Checklist

This checklist validates the full flow: init → onboarding → logging → dashboard → community.

## 1. Environment
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] Supabase migrations applied:
  - `docs/migrations/000_users.sql`
  - `docs/migrations/001_user_settings.sql`
  - `docs/migrations/002_user_settings_rls.sql`
  - `docs/migrations/004_core_tables.sql`
  - `docs/migrations/005_core_rls.sql`

## 2. Auth
- [ ] Sign up with email/password
- [ ] Confirm you can log in

## 3. Onboarding
- [ ] Open `/` and complete the onboarding wizard
- [ ] Confirm profile fields are saved (height, sex, birth date, activity, targets)
- [ ] Confirm a body log is created on completion

## 4. Daily Logging
- [ ] Add a weight or body fat entry
- [ ] Add a food log with calories/macros
- [ ] Add a workout log with calories/duration
- [ ] Confirm dashboard values update after submit (revalidation)

## 5. Time Travel
- [ ] Navigate to `/` with `?date=YYYY-MM-DD`
- [ ] Confirm metrics reflect that date (not today)

## 6. Community / Privacy
- [ ] Set privacy to `public` in Settings
- [ ] Visit `/community` and verify your card appears
- [ ] Set privacy back to `private` and confirm you disappear

## 7. Build & Tests
- [ ] `npm test`
- [ ] `npm run lint`
- [ ] `npm run build`
