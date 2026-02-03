-- Rollback for user_settings table
drop trigger if exists user_settings_updated_at on public.user_settings;
drop function if exists public.set_user_settings_updated_at();
drop index if exists public.user_settings_uid_idx;
drop table if exists public.user_settings;
