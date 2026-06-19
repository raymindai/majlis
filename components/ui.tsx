import Link from "next/link";
import type { Confidence } from "@/lib/corpus";

/**
 * Editorial palette. Core surfaces resolve through CSS variables (set per theme
 * in globals.css) with the Institutional values as fallbacks, so the live skin
 * switcher can re-theme the whole app without touching components.
 */
export const C = {
  bg: "var(--c-bg, #F6F2E9)",
  surface: "var(--c-surface, #FFFFFF)",
  surfaceAlt: "var(--c-surface-alt, #FCFAF4)",
  ink: "var(--c-ink, #14233A)",
  muted: "var(--c-muted, #5B6573)",
  faint: "var(--c-faint, #9A8C70)",
  line: "var(--c-line, #E4DCCB)",
  accent: "var(--c-accent, #B08D4F)",
  confirmed: "#2F6B4F",
  likely: "#B5852F",
  unverified: "#A23B2D",
};

export const confColor: Record<Confidence, string> = {
  confirmed: C.confirmed,
  likely: C.likely,
  unverified: C.unverified,
};
export const confLabel: Record<Confidence, string> = {
  confirmed: "Confirmed",
  likely: "Likely",
  unverified: "Unverified",
};

export const severityColor: Record<string, string> = {
  blocker: "#A23B2D",
  "at-risk": "#B5852F",
};
// Shape + colour, so severity never reads on colour alone.
export const severityGlyph: Record<string, string> = {
  blocker: "■",
  "at-risk": "▲",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] uppercase font-medium"
      style={{ color: confColor[confidence], letterSpacing: "0.06em" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: confColor[confidence] }} />
      {confLabel[confidence]}
    </span>
  );
}

export function CitationChip({ sourceId, onClick }: { sourceId: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[11px] rounded border px-1.5 py-0.5 transition-colors cursor-pointer"
      style={{ borderColor: C.line, color: C.muted }}
    >
      {sourceId} <span style={{ color: C.accent }}>›</span>
    </button>
  );
}

export function StageSpine({ active }: { active: "before" | "during" | "after" }) {
  const stages = [
    { key: "before", label: "before", href: "/" },
    { key: "during", label: "during", href: "/during" },
    { key: "after", label: "after", href: "/after" },
  ] as const;
  return (
    <div className="flex items-center gap-1.5 text-[11px] uppercase" style={{ letterSpacing: "0.08em" }}>
      {stages.map((s, i) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <Link
            href={s.href}
            className="hover:underline"
            style={{ color: s.key === active ? C.ink : C.faint, fontWeight: s.key === active ? 600 : 400 }}
          >
            {s.label}
          </Link>
          {i < 2 && <span style={{ color: C.line }}>▸</span>}
        </span>
      ))}
    </div>
  );
}
