-- Majlis · carry the grounding citation onto each captured commitment,
-- so a decision made in the room stays traceable to the document behind it.
alter table public.commitments add column if not exists source_ref jsonb;
