"use client";

import { AlignJustify, Equal, type LucideIcon, Minus } from "lucide-react";
import { useDetail, type DetailLevel } from "@/components/detail-context";
import { useLang } from "@/components/lang-context";
import { C } from "@/components/ui";

// A magnifier frames it as zoom; the glyphs grow in line-density from one line
// (headlines) to a full block (full detail), so the control reads as zooming.
const LEVELS: { v: DetailLevel; key: string; icon: LucideIcon }[] = [
  { v: 1, key: "headlines", icon: Minus },
  { v: 2, key: "standard", icon: Equal },
  { v: 3, key: "full", icon: AlignJustify },
];

/** Level-of-detail control: zoom the whole stage from headlines to full detail. */
export default function DetailControl() {
  const { level, setLevel } = useDetail();
  const { t: tr } = useLang();
  return (
    <div className="inline-flex items-center gap-1 rounded-lg p-0.5 h-[26px]" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      {LEVELS.map((l) => {
        const Icon = l.icon;
        const on = level === l.v;
        return (
          <button
            key={l.v}
            type="button"
            onClick={() => setLevel(l.v)}
            title={`${tr("zoom")}: ${tr(l.key)}`}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
            style={on ? { background: C.surface, color: C.ink, fontWeight: 600, boxShadow: C.shadow } : { color: C.muted }}
          >
            <Icon size={12} strokeWidth={2.25} style={{ color: on ? C.accent : C.faint }} />
            {tr(l.key)}
          </button>
        );
      })}
    </div>
  );
}
