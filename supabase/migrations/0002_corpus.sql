-- Majlis · committee pack stored in Supabase (synthetic). Run once via supabase db push.
create table if not exists public.corpus_documents (
  id text primary key,
  title text not null,
  doc_type text,
  issuer text,
  doc_ref text,
  doc_date date,
  authority text,
  body text not null default '',
  passages jsonb not null default '[]'::jsonb,
  synthetic boolean not null default true,
  seeded_at timestamptz not null default now()
);
alter table public.corpus_documents enable row level security;
drop policy if exists "demo read corpus" on public.corpus_documents;
create policy "demo read corpus" on public.corpus_documents for select using (true);
