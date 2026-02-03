-- User settings table for theme, privacy, and preferences
create table if not exists public.user_settings (
  uid uuid primary key references public.users (uid) on delete cascade,
  theme text default 'cozy_light',
  notifications boolean default true,
  units text default 'metric',
  privacy text default 'private',
  updated_at timestamptz default now()
);

create index if not exists user_settings_uid_idx on public.user_settings (uid);

-- Optional: keep updated_at in sync
create or replace function public.set_user_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
before update on public.user_settings
for each row execute procedure public.set_user_settings_updated_at();
