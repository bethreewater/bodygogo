-- Enable RLS for user_settings and restrict to owner access
alter table public.user_settings enable row level security;

-- Users can select their own settings
drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
on public.user_settings
for select
using (auth.uid() = uid);

-- Users can insert their own settings
drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
on public.user_settings
for insert
with check (auth.uid() = uid);

-- Users can update their own settings
drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
on public.user_settings
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

-- Smoke-test queries (run in SQL editor as an authenticated user)
-- select * from public.user_settings where uid = auth.uid();
