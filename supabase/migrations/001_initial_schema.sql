-- ============================================================
-- TRUEMMO MVP Timer — Initial Schema
-- Apply via Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── Groups ──────────────────────────────────────────────────
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique default substring(gen_random_uuid()::text, 1, 8),
  created_at  timestamptz not null default now()
);

-- ─── Profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  group_id     uuid references public.groups(id) on delete set null,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- ─── Kill Log ────────────────────────────────────────────────
create table if not exists public.kill_log (
  id               uuid primary key default gen_random_uuid(),
  mvp_id           text not null,         -- matches MvpDefinition.id
  killed_at        timestamptz not null,
  killed_by_user_id uuid not null references auth.users(id),
  killed_by_name   text not null,
  group_id         uuid not null references public.groups(id) on delete cascade,
  window_start     timestamptz not null,
  window_end       timestamptz not null,
  notes            text,
  created_at       timestamptz not null default now()
);

-- Indexes
create index if not exists kill_log_group_id_idx on public.kill_log(group_id);
create index if not exists kill_log_mvp_id_idx   on public.kill_log(mvp_id);
create index if not exists kill_log_killed_at_idx on public.kill_log(killed_at desc);

-- ─── Row Level Security ──────────────────────────────────────
alter table public.groups   enable row level security;
alter table public.profiles enable row level security;
alter table public.kill_log enable row level security;

-- profiles: users can read/update only their own profile
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

-- groups: any authenticated user can read; only members can see their group
create policy "groups_select" on public.groups for select using (
  id in (select group_id from public.profiles where id = auth.uid())
);
create policy "groups_insert" on public.groups for insert with check (auth.role() = 'authenticated');

-- kill_log: only members of the same group can read/write
create policy "kill_log_select" on public.kill_log for select using (
  group_id in (select group_id from public.profiles where id = auth.uid())
);
create policy "kill_log_insert" on public.kill_log for insert with check (
  group_id in (select group_id from public.profiles where id = auth.uid())
  and killed_by_user_id = auth.uid()
);
create policy "kill_log_delete" on public.kill_log for delete using (
  killed_by_user_id = auth.uid()
);

-- ─── Realtime ────────────────────────────────────────────────
-- Enable realtime on kill_log so all group members get live updates
alter publication supabase_realtime add table public.kill_log;
