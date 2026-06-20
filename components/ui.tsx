"use client";

import Link from "next/link";
import { C } from "@/components/theme";
import { useDetail, type DetailLevel } from "@/components/detail-context";
import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, CircleDashed, FileText, type LucideIcon, OctagonAlert, TriangleAlert } from "lucide-react";
import { sourceLabel, type Confidence } from "@/lib/corpus";
import { Tip } from "@/components/tip";

export { C };

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
const confIcon: Record<Confidence, LucideIcon> = {
  confirmed: CircleCheck,
  likely: CircleDashed,
  unverified: CircleAlert,
};

export const severityColor: Record<string, string> = {
  blocker: C.unverified,
  "at-risk": C.likely,
};
export const severityLabel: Record<string, string> = {
  blocker: "Blocker",
  "at-risk": "At risk",
};
export const severityGlyph: Record<string, string> = {
  blocker: "■",
  "at-risk": "▲",
};

const tint = (color: string, pct = 13) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/** A small tinted status tag with an icon, communicates state at a glance. Hover for what it means. */
export function Pill({ color, icon: Icon, tip, children }: { color: string; icon?: LucideIcon; tip?: ReactNode; children: ReactNode }) {
  const cls = "inline-flex items-center gap-1 text-[11px] font-medium rounded-full py-0.5 whitespace-nowrap";
  const style = { background: tint(color), color, paddingLeft: Icon ? "0.45rem" : "0.6rem", paddingRight: "0.6rem", cursor: tip ? "help" : undefined };
  const inner = (
    <>
      {Icon && <Icon size={12} strokeWidth={2.25} className="shrink-0" />}
      {children}
    </>
  );
  if (tip) return <Tip as="span" content={tip} className={cls} style={style}>{inner}</Tip>;
  return <span className={cls} style={style}>{inner}</span>;
}

const confDef: Record<Confidence, string> = {
  confirmed: "Backed by a current, authoritative source.",
  likely: "Supported but caveated; a later source may supersede it.",
  unverified: "Informal, undated, or conflicting across sources.",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <Pill color={confColor[confidence]} icon={confIcon[confidence]} tip={confDef[confidence]}>
      {confLabel[confidence]}
    </Pill>
  );
}

const sevDef: Record<string, string> = {
  blocker: "Blocks other entities' delivery; needs resolving now.",
  "at-risk": "May slip; watch it closely.",
};

export function SeverityPill({ severity }: { severity: string }) {
  return (
    <Pill color={severityColor[severity]} icon={severity === "blocker" ? OctagonAlert : TriangleAlert} tip={sevDef[severity]}>
      {severityLabel[severity]}
    </Pill>
  );
}

export function CitationChip({ sourceId, onClick }: { sourceId: string; onClick?: (pos: { x: number; y: number }) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => onClick?.({ x: e.clientX, y: e.clientY })}
      className="inline-flex items-center gap-1 text-[11px] rounded-md border px-1.5 py-0.5 cursor-pointer hover:opacity-70"
      style={{ borderColor: C.line, color: C.muted, background: C.surface }}
    >
      <FileText size={11} strokeWidth={2} style={{ color: C.faint }} />
      {sourceLabel(sourceId)}
    </button>
  );
}

export function StageSpine({ active }: { active: "before" | "during" | "after" }) {
  const stages = [
    { key: "before", label: "Before", href: "/" },
    { key: "during", label: "During", href: "/during" },
    { key: "after", label: "After", href: "/after" },
  ] as const;
  return (
    <div className="flex items-center gap-2 text-[13px]">
      {stages.map((s, i) => (
        <span key={s.key} className="flex items-center gap-2">
          <Link
            href={s.href}
            className="hover:opacity-70"
            style={{ color: s.key === active ? C.ink : C.faint, fontWeight: s.key === active ? 600 : 400 }}
          >
            {s.label}
          </Link>
          {i < 2 && <span style={{ color: C.line }}>/</span>}
        </span>
      ))}
    </div>
  );
}

/** Small left-rail group label, sentence case, no all-caps. */
export function RailLabel({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-semibold mb-2.5" style={{ color: C.faint }}>{children}</div>;
}

function Header({ label, aside, icon: Icon }: { label: string; aside?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b" style={{ borderColor: C.line }}>
      {Icon ? (
        <Icon size={15} strokeWidth={2} className="shrink-0" style={{ color: C.accent }} />
      ) : (
        <span aria-hidden className="inline-block w-[3px] h-4 rounded-full shrink-0" style={{ background: C.accent }} />
      )}
      <h2 className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: C.ink }}>{label}</h2>
      {aside && <div className="ml-auto">{aside}</div>}
    </div>
  );
}

export function Section({ label, aside, icon, children }: { label: string; aside?: ReactNode; icon?: LucideIcon; children: ReactNode }) {
  return (
    <section id={label.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-4">
      <Header label={label} aside={aside} icon={icon} />
      {children}
    </section>
  );
}

/** A distinct card with its own surface, hairline border, soft elevation, and a
 *  labelled header. `span={2}` makes it full-width in the center grid. */
export function Card({
  label,
  aside,
  span = 1,
  icon,
  minLevel,
  children,
}: {
  label?: string;
  aside?: ReactNode;
  span?: 1 | 2;
  icon?: LucideIcon;
  minLevel?: DetailLevel;
  children: ReactNode;
}) {
  const { level } = useDetail();
  const id = label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined;
  if (minLevel && level < minLevel) return null;
  return (
    <section
      id={id}
      className={`rounded-2xl p-6 scroll-mt-4 ${span === 2 ? "lg:col-span-2" : ""}`}
      style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}
    >
      {label && <Header label={label} aside={aside} icon={icon} />}
      {children}
    </section>
  );
}
