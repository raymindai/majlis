/**
 * Saved notes: an answer the user pinned to the workspace as a floating window.
 * localStorage-backed so notes persist across the Before / During / After pages.
 */

export interface NoteClaim {
  text: string;
  confidence: string;
  sourceId: string;
  passageId: string;
}

export interface Note {
  id: string;
  title: string; // the question that produced the answer
  summary: string;
  claims: NoteClaim[];
  createdAt: number;
  pos: { x: number; y: number };
}

export const NOTES_EVENT = "majlis-notes";
const KEY = "majlis-notes";

function read(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(notes: Note[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(notes));
  window.dispatchEvent(new CustomEvent(NOTES_EVENT));
}

export function loadNotes(): Note[] {
  return read();
}

export function addNote(input: { title: string; summary: string; claims: NoteClaim[]; pos: { x: number; y: number } }): void {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  write([...read(), { id, createdAt: Date.now(), ...input }]);
}

export function removeNote(id: string): void {
  write(read().filter((n) => n.id !== id));
}

export function updateNotePos(id: string, pos: { x: number; y: number }): void {
  write(read().map((n) => (n.id === id ? { ...n, pos } : n)));
}
