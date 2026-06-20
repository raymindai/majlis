/**
 * Language steering for the live AI. When the user is in Arabic, every model
 * call gets this suffix so the human-readable output is Arabic while the machine
 * identifiers (source ids, passage ids, entity codes) stay exactly as written,
 * since those are used to look documents back up.
 */
export function langSuffix(lang: unknown): string {
  if (lang !== "ar") return "";
  return `\n\nLANGUAGE: Write ALL human-readable text (every lead, detail, line, recommendation, rationale, action, summary, headline, note, and question) in fluent Modern Standard Arabic. But keep every sourceId, passageId, and entity code (EDD, EKD, MTA, HSA, PSD) EXACTLY as written in the pack, in Latin script. Never translate those identifiers. Never use em-dashes or middle-dot separators.`;
}
