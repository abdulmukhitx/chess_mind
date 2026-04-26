-- ChessMind Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  rating integer default 800,
  games_played integer default 0,
  games_won integer default 0,
  city text,
  is_pro boolean default false,
  created_at timestamptz default now()
);

-- Games table
create table if not exists games (
  id uuid default uuid_generate_v4() primary key,
  white_player_id uuid references profiles(id) on delete set null,
  black_player_id uuid references profiles(id) on delete set null,
  pgn text default '',
  result text check (result in ('white', 'black', 'draw', 'ongoing')) default 'ongoing',
  mode text check (mode in ('ai', 'multiplayer', 'local')) not null,
  ai_level integer,
  moves_count integer default 0,
  created_at timestamptz default now(),
  ended_at timestamptz
);

-- Game analyses table
create table if not exists game_analyses (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references games(id) on delete cascade,
  analysis text not null,
  key_moments text default '[]',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table games enable row level security;
alter table game_analyses enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Games: anyone can read, authenticated users can insert
create policy "Games are viewable by everyone" on games
  for select using (true);

create policy "Authenticated users can create games" on games
  for insert with check (auth.role() = 'authenticated');

create policy "Players can update own games" on games
  for update using (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- Analyses: anyone can read
create policy "Analyses are viewable by everyone" on game_analyses
  for select using (true);

create policy "Authenticated users can create analyses" on game_analyses
  for insert with check (auth.role() = 'authenticated');

-- Enable Realtime for multiplayer
alter publication supabase_realtime add table games;

-- Sample data for leaderboard demonstration
insert into profiles (id, username, rating, games_played, games_won, city, is_pro) values
  ('00000000-0000-0000-0000-000000000001', 'GrandMaster_KZ', 1850, 234, 178, 'Almaty', true),
  ('00000000-0000-0000-0000-000000000002', 'SteppeKnight', 1720, 156, 112, 'Astana', false),
  ('00000000-0000-0000-0000-000000000003', 'AlmatyCastle', 1680, 89, 61, 'Almaty', true),
  ('00000000-0000-0000-0000-000000000004', 'TuranBishop', 1590, 201, 134, 'Shymkent', false),
  ('00000000-0000-0000-0000-000000000005', 'SilkRoadQueen', 1540, 67, 42, 'Astana', false)
on conflict (id) do nothing;
