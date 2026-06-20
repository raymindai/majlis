/**
 * Supabase, server-side admin client + helpers.
 * SERVER ONLY: uses the service-role key (bypasses RLS). Never import from client code.
 * Everything degrades gracefully: if Supabase isn't configured or the table is
 * missing, calls no-op and the app keeps working.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!admin) admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

type AnswerShape = {
  notInMaterial?: boolean;
  summary?: string;
  claims?: { confidence: string }[];
};

/** Append one grounded answer to the audit log (qa_log). Resilient, never throws. */
export async function logQa(entry: {
  stage?: string | null;
  question: string;
  answer: AnswerShape;
  latencyMs?: number;
}): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;
  const claims = entry.answer.claims ?? [];
  const mix: Record<string, number> = { confirmed: 0, likely: 0, unverified: 0 };
  for (const c of claims) if (c.confidence in mix) mix[c.confidence]++;
  const { error } = await db.from("qa_log").insert({
    stage: entry.stage ?? null,
    question: entry.question,
    summary: entry.answer.summary ?? null,
    not_in_material: entry.answer.notInMaterial ?? null,
    claims,
    confidence_mix: mix,
    latency_ms: entry.latencyMs ?? null,
    model: "claude-opus-4-8",
  });
  if (error) console.error("qa_log insert failed (is the schema applied?):", error.message);
}
