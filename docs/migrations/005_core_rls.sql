-- Enable RLS for core tables
alter table public.users enable row level security;
alter table public.logs_body enable row level security;
alter table public.logs_food enable row level security;
alter table public.logs_workout enable row level security;
alter table public.game_states enable row level security;
alter table public.quest_history enable row level security;

-- Users table policies (owner only)
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users
for select
using (auth.uid() = uid);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
on public.users
for insert
with check (auth.uid() = uid);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

-- logs_body policies
drop policy if exists "logs_body_select_own" on public.logs_body;
create policy "logs_body_select_own"
on public.logs_body
for select
using (auth.uid() = uid);

drop policy if exists "logs_body_insert_own" on public.logs_body;
create policy "logs_body_insert_own"
on public.logs_body
for insert
with check (auth.uid() = uid);

drop policy if exists "logs_body_update_own" on public.logs_body;
create policy "logs_body_update_own"
on public.logs_body
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

drop policy if exists "logs_body_delete_own" on public.logs_body;
create policy "logs_body_delete_own"
on public.logs_body
for delete
using (auth.uid() = uid);

-- logs_food policies
drop policy if exists "logs_food_select_own" on public.logs_food;
create policy "logs_food_select_own"
on public.logs_food
for select
using (auth.uid() = uid);

drop policy if exists "logs_food_insert_own" on public.logs_food;
create policy "logs_food_insert_own"
on public.logs_food
for insert
with check (auth.uid() = uid);

drop policy if exists "logs_food_update_own" on public.logs_food;
create policy "logs_food_update_own"
on public.logs_food
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

drop policy if exists "logs_food_delete_own" on public.logs_food;
create policy "logs_food_delete_own"
on public.logs_food
for delete
using (auth.uid() = uid);

-- logs_workout policies
drop policy if exists "logs_workout_select_own" on public.logs_workout;
create policy "logs_workout_select_own"
on public.logs_workout
for select
using (auth.uid() = uid);

drop policy if exists "logs_workout_insert_own" on public.logs_workout;
create policy "logs_workout_insert_own"
on public.logs_workout
for insert
with check (auth.uid() = uid);

drop policy if exists "logs_workout_update_own" on public.logs_workout;
create policy "logs_workout_update_own"
on public.logs_workout
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

drop policy if exists "logs_workout_delete_own" on public.logs_workout;
create policy "logs_workout_delete_own"
on public.logs_workout
for delete
using (auth.uid() = uid);

-- game_states policies
drop policy if exists "game_states_select_own" on public.game_states;
create policy "game_states_select_own"
on public.game_states
for select
using (auth.uid() = uid);

drop policy if exists "game_states_insert_own" on public.game_states;
create policy "game_states_insert_own"
on public.game_states
for insert
with check (auth.uid() = uid);

drop policy if exists "game_states_update_own" on public.game_states;
create policy "game_states_update_own"
on public.game_states
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

drop policy if exists "game_states_delete_own" on public.game_states;
create policy "game_states_delete_own"
on public.game_states
for delete
using (auth.uid() = uid);

-- quest_history policies
drop policy if exists "quest_history_select_own" on public.quest_history;
create policy "quest_history_select_own"
on public.quest_history
for select
using (auth.uid() = uid);

drop policy if exists "quest_history_insert_own" on public.quest_history;
create policy "quest_history_insert_own"
on public.quest_history
for insert
with check (auth.uid() = uid);

drop policy if exists "quest_history_update_own" on public.quest_history;
create policy "quest_history_update_own"
on public.quest_history
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

drop policy if exists "quest_history_delete_own" on public.quest_history;
create policy "quest_history_delete_own"
on public.quest_history
for delete
using (auth.uid() = uid);
