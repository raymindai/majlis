/**
 * Seed the committee pack into Supabase (corpus_documents) from the in-code corpus.
 * Run: node --env-file=.env.local --import tsx scripts/seed-corpus.ts
 */
import { createClient } from "@supabase/supabase-js";
import { SOURCES, SOURCE_META } from "../lib/corpus";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const rows = SOURCES.map((s) => {
  const m = SOURCE_META[s.id];
  return {
    id: s.id,
    title: s.title,
    doc_type: m?.docType ?? null,
    issuer: m?.issuer ?? null,
    doc_ref: m?.ref ?? null,
    doc_date: s.date,
    authority: s.authority,
    body: s.passages.map((p) => p.text).join("\n\n"),
    passages: s.passages,
    synthetic: true,
  };
});

const { error } = await db.from("corpus_documents").upsert(rows, { onConflict: "id" });
console.log(error ? `ERROR: ${error.message}` : `seeded ${rows.length} documents into corpus_documents`);
