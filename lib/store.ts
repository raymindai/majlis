/**
 * Meeting state for the before -> during -> after loop.
 * localStorage-backed so the loop works with no database. Swappable for Supabase later.
 */
import type { Confidence } from "./corpus";

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
  saveState({ ...loadState(), writtenToMemory: true });
}

export function resetMeeting() {
  saveState(EMPTY);
}
