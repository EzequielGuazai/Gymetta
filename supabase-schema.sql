-- =================================================
-- FORÇA APP — Supabase Schema
-- Cola este SQL no Supabase > SQL Editor > New Query
-- =================================================

-- Profiles
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default '',
  weight_kg float,
  height_cm float,
  goal text default 'hypertrophy',
  program text default 'ab',
  avatar_color text default '#22c55e',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workout logs
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  exercise_id text not null,
  day_key text not null,
  date date not null,
  sets jsonb not null default '[]',
  notes text,
  created_at timestamptz default now()
);

-- Body measurements
create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  weight_kg float,
  body_fat float,
  notes text,
  created_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  exercise_id text not null,
  target_weight float not null,
  target_date date,
  achieved_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists workout_logs_user_date on workout_logs(user_id, date);
create index if not exists measurements_user_date on measurements(user_id, date);

-- RLS
alter table profiles enable row level security;
alter table workout_logs enable row level security;
alter table measurements enable row level security;
alter table goals enable row level security;

create policy "Users manage own profile" on profiles for all using (auth.uid() = id);
create policy "Users manage own logs" on workout_logs for all using (auth.uid() = user_id);
create policy "Users manage own measurements" on measurements for all using (auth.uid() = user_id);
create policy "Users manage own goals" on goals for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
