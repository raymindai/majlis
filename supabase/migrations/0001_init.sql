-- Majlis · Supabase schema (synthetic demo data only)
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- 1) Q&A audit log -----------------------------------------------------------
-- Every grounded answer Majlis gives, with its sources, confidence mix, latency.
-- The audit trail a government deployment would require.
create table if not exists public.qa_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stage text,
  question text not null,
  summary text,
  not_in_material boolean,
  claims jsonb not null default '[]'::jsonb,
  confidence_mix jsonb,
  latency_ms integer,
  model text
);
alter table public.qa_log enable row level security;
-- Written + read server-side with the service-role key (bypasses RLS). No anon policy,
-- so the log is not readable from the browser.

-- 2) Commitments — the institutional-memory loop -----------------------------
create table if not exists public.commitments (
  id text primary key,
  created_at timestamptz not null default now(),
  cycle text not null default 'manarah-q2',
  entity text not null,
  text text not null,
  due text,
  confidence text,
  captured_at text,
  written_to_memory boolean not null default false
);
alter table public.commitments enable row level security;
drop policy if exists "demo read commitments" on public.commitments;
drop policy if exists "demo write commitments" on public.commitments;
create policy "demo read commitments" on public.commitments for select using (true);
create policy "demo write commitments" on public.commitments for all using (true) with check (true);
