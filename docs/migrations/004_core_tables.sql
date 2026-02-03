-- Core log tables and game state

create table if not exists public.logs_body (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references public.users (uid) on delete cascade,
  date date not null,
  timestamp timestamptz not null,
  weight_kg numeric,
  body_fat_percent numeric,
  source text check (source in ('user', 'device')) default 'user'
);

create unique index if not exists logs_body_uid_date_uq on public.logs_body (uid, date);
create index if not exists logs_body_uid_date_idx on public.logs_body (uid, date);

create table if not exists public.logs_food (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references public.users (uid) on delete cascade,
  date date not null,
  timestamp timestamptz not null,
  name text not null,
  calories integer not null,
  protein_g integer,
  fat_g integer,
  carbs_g integer
);

create index if not exists logs_food_uid_date_idx on public.logs_food (uid, date);

create table if not exists public.logs_workout (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references public.users (uid) on delete cascade,
  date date not null,
  timestamp timestamptz not null,
  type text not null,
  category text check (category in ('cardio', 'strength')),
  duration_minutes integer not null,
  calories integer not null,
  exercises jsonb
);

create index if not exists logs_workout_uid_date_idx on public.logs_workout (uid, date);

create table if not exists public.game_states (
  uid uuid not null references public.users (uid) on delete cascade,
  date date not null,
  streak_current integer not null default 0,
  streak_freeze_available integer not null default 0,
  level integer not null default 1,
  xp_current integer not null default 0,
  xp_next_level integer not null default 100,
  primary key (uid, date)
);

create index if not exists game_states_uid_date_idx on public.game_states (uid, date);

-- Quest history (minimal placeholder for deletes/analytics)
create table if not exists public.quest_history (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references public.users (uid) on delete cascade,
  date date not null,
  quest_id text not null,
  status text not null,
  xp_reward integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists quest_history_uid_date_idx on public.quest_history (uid, date);
