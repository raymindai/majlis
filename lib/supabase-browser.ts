/**
 * Browser Supabase client (anon key, RLS-guarded). Used for the institutional-memory
 * loop (commitments). Returns null if unconfigured, so callers degrade gracefully.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browser: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!browser) browser = createClient(url, key, { auth: { persistSession: false } });
  return browser;
}
