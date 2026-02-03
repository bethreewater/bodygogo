-- Core users table (profile data)
create table if not exists public.users (
  uid uuid primary key,
  height_cm integer,
  birth_date date,
  sex text check (sex in ('male', 'female')),
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  target_calories_intake integer,
  target_calories_out integer,
  target_weight_kg numeric,
  target_body_fat_percent numeric,
  avatar_config jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists users_uid_idx on public.users (uid);

-- Optional: keep updated_at in sync
create or replace function public.set_users_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
before update on public.users
for each row execute procedure public.set_users_updated_at();
