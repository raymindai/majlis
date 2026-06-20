import Link from "next/link";
import type { ReactNode } from "react";
import type { Confidence } from "@/lib/corpus";

/** All colours resolve through CSS variables (set per theme in globals.css),
 *  so Institutional / Dossier / Dark all re-theme the whole app. */
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
  blocker: C.unverified,
  "at-risk": C.likely,
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
      className="inline-flex items-center gap-1 text-[11px] rounded border px-1.5 py-0.5 transition-opacity cursor-pointer hover:opacity-70"
      style={{ borderColor: C.line, color: C.muted, background: C.surface }}
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

/** A labelled section block with a clear divider — the spine of the new layout. */
export function Section({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={label.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-20">
      <div className="flex items-baseline justify-between gap-2 pb-2 mb-3 border-b" style={{ borderColor: C.line }}>
        <h2 className="text-[11px] uppercase font-medium" style={{ color: C.faint, letterSpacing: "0.12em" }}>
          {label}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** A distinct card with its own surface, border, and labelled header — clear
 *  separation between sections. `span={2}` makes it full-width in the center grid. */
export function Card({
  label,
  aside,
  span = 1,
  children,
}: {
  label?: string;
  aside?: ReactNode;
  span?: 1 | 2;
  children: ReactNode;
}) {
  const id = label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined;
  return (
    <section
      id={id}
      className={`rounded-xl p-5 scroll-mt-4 ${span === 2 ? "lg:col-span-2" : ""}`}
      style={{ background: C.surface, border: `1px solid ${C.line}` }}
    >
      {label && (
        <div className="flex items-baseline justify-between gap-2 mb-3 pb-2.5 border-b" style={{ borderColor: C.line }}>
          <h2 className="text-[12px] uppercase font-semibold" style={{ color: C.muted, letterSpacing: "0.1em" }}>
            {label}
          </h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
