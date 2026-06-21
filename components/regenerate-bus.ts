// Lets the reviewer guide (bottom-left) trigger a live re-synthesis of the brief
// that the Before view owns, and lets the Before view report its syncing state
// back so the guide's button can show progress. Kept out of the chair-facing
// brief chrome on purpose: regenerating is a reviewer/demo affordance.

export const REGENERATE_BRIEF_EVENT = "majlis-regenerate-brief";
export const BRIEF_SYNCING_EVENT = "majlis-brief-syncing";

export function regenerateBrief() {
  window.dispatchEvent(new CustomEvent(REGENERATE_BRIEF_EVENT));
}

export function emitBriefSyncing(syncing: boolean) {
  window.dispatchEvent(new CustomEvent(BRIEF_SYNCING_EVENT, { detail: syncing }));
}
