/** All colours resolve through CSS variables (set per theme in globals.css).
 *  Kept in its own (non-client) module so both server and client components can use it. */
export const C = {
  bg: "var(--c-bg)",
  surface: "var(--c-surface)",
  surfaceAlt: "var(--c-surface-alt)",
  ink: "var(--c-ink)",
  detail: "var(--c-detail)",
  muted: "var(--c-muted)",
  faint: "var(--c-faint)",
  line: "var(--c-line)",
  accent: "var(--c-accent)",
  onAccent: "var(--c-on-accent)",
  confirmed: "var(--c-confirmed)",
  likely: "var(--c-likely)",
  unverified: "var(--c-unverified)",
  flagBg: "var(--c-flag-bg)",
  flagBorder: "var(--c-flag-border)",
  priorBg: "var(--c-prior-bg)",
  priorBorder: "var(--c-prior-border)",
  priorInk: "var(--c-prior-ink)",
  chipBg: "var(--c-chip-bg)",
  shadow: "var(--c-shadow)",
};
