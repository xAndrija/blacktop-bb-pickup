-- Run this in your Supabase SQL editor

-- ===== TABLES =====

create table if not exists courts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_name text not null,
  lat float not null,
  lng float not null,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references courts(id) on delete cascade,
  creator_id uuid not null references auth.users(id) on delete cascade,
  date_time timestamptz not null,
  max_players int not null check (max_players >= 2),
  created_at timestamptz default now()
);

create table if not exists session_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (session_id, user_id)
);

-- ===== ROW LEVEL SECURITY =====

alter table courts enable row level security;
alter table sessions enable row level security;
alter table session_players enable row level security;

create policy "courts_select" on courts for select using (true);

create policy "sessions_select" on sessions for select using (true);
create policy "sessions_insert" on sessions for insert with check (auth.uid() = creator_id);
create policy "sessions_delete" on sessions for delete using (auth.uid() = creator_id);

create policy "session_players_select" on session_players for select using (true);
create policy "session_players_insert" on session_players for insert with check (auth.uid() = user_id);
create policy "session_players_delete" on session_players for delete using (auth.uid() = user_id);

-- ===== TERENI U SRBIJI =====

insert into courts (name, location_name, lat, lng) values
  ('Tašmajdan', 'Tašmajdan park, Beograd', 44.8120, 20.4650),
  ('Ada Ciganlija', 'Ada Ciganlija, Beograd', 44.7880, 20.4010),
  ('Pionirski park', 'Pionirski park, Beograd', 44.8075, 20.4621),
  ('Košutnjak', 'Košutnjak park, Beograd', 44.7700, 20.4200),
  ('Ušće', 'Ušće park, Novi Beograd', 44.8220, 20.4180),
  ('Petrovaradin', 'Petrovaradin, Novi Sad', 45.2510, 19.8630),
  ('Klisa', 'Klisa, Novi Sad', 45.2670, 19.8300),
  ('Čair', 'Čair park, Niš', 43.3250, 21.9080),
  ('Kragujevac centar', 'Centar, Kragujevac', 44.0128, 20.9111),
  ('Subotica park', 'Gradski park, Subotica', 46.1002, 19.6656);
