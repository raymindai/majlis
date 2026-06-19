import type { Confidence } from "@/lib/corpus";

/** Editorial-institutional palette. */
export const C = {
  bg: "#F6F2E9",
  surface: "#FFFFFF",
  surfaceAlt: "#FCFAF4",
  ink: "#14233A",
  muted: "#5B6573",
  faint: "#9A8C70",
  line: "#E4DCCB",
  accent: "#B08D4F",
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
      className="inline-flex items-center gap-1 text-[11px] rounded border px-1.5 py-0.5 transition-colors cursor-pointer hover:bg-[#F1EADB]"
      style={{ borderColor: "#D8CFBD", color: "#5B6573" }}
    >
      {sourceId} <span style={{ color: C.accent }}>›</span>
    </button>
  );
}

export function StageSpine({ active }: { active: "before" | "during" | "after" }) {
  const stages = ["before", "during", "after"] as const;
  return (
    <div className="flex items-center gap-1.5 text-[11px] uppercase" style={{ letterSpacing: "0.08em" }}>
      {stages.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          <span style={{ color: s === active ? C.ink : "#B3A892", fontWeight: s === active ? 600 : 400 }}>{s}</span>
          {i < 2 && <span style={{ color: "#CFC6B2" }}>▸</span>}
        </span>
      ))}
    </div>
  );
}
