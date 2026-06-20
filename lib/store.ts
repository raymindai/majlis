/**
 * Meeting state for the before -> during -> after loop.
 * localStorage-backed so the loop works with no database. Swappable for Supabase later.
 */
import type { Confidence } from "./corpus";
import { supabaseBrowser } from "./supabase-browser";

export interface Commitment {
  id: string;
  entity: string;
  text: string;
  due: string;
  confidence: Confidence;
  capturedAt: "during";
}

export interface MeetingState {
  commitments: Commitment[];
  writtenToMemory: boolean;
}

const KEY = "majlis_meeting_state_q2";
const EMPTY: MeetingState = { commitments: [], writtenToMemory: false };

export function loadState(): MeetingState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function saveState(s: MeetingState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("majlis-store"));
}

export function addCommitment(c: Commitment) {
  const s = loadState();
  if (s.commitments.some((x) => x.id === c.id)) return;
  saveState({ ...s, commitments: [...s.commitments, c] });
}

export function writeToMemory() {
  const s = loadState();
  saveState({ ...s, writtenToMemory: true });
  // Persist the loop to Supabase so commitments are durable, not just local.
  persistCommitments(s.commitments).catch((e) => console.error("commitments persist failed:", e));
}

async function persistCommitments(commitments: Commitment[]) {
  const db = supabaseBrowser();
  if (!db || commitments.length === 0) return;
  const rows = commitments.map((c) => ({
    id: c.id,
    cycle: "manarah-q2",
    entity: c.entity,
    text: c.text,
    due: c.due,
    confidence: c.confidence,
    captured_at: c.capturedAt,
    written_to_memory: true,
  }));
  const { error } = await db.from("commitments").upsert(rows, { onConflict: "id" });
  if (error) console.error("commitments upsert:", error.message);
}

export function resetMeeting() {
  saveState(EMPTY);
}
