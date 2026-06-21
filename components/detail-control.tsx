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
    <div className="inline-flex items-center gap-0.5 rounded-[10px] p-1 h-[30px]" style={{ background: C.chipBg }}>
      {LEVELS.map((l) => {
        const Icon = l.icon;
        const on = level === l.v;
        return (
          <button
            key={l.v}
            type="button"
            onClick={() => setLevel(l.v)}
            title={`${tr("zoom")}: ${tr(l.key)}`}
            className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 h-full rounded-md cursor-pointer transition-all"
            style={on ? { background: C.surface, color: C.ink, fontWeight: 600, boxShadow: "0 1px 2px rgba(64,48,24,0.10), 0 1px 1px rgba(64,48,24,0.06)" } : { color: C.muted, fontWeight: 500 }}
          >
            <Icon size={12} strokeWidth={2.5} style={{ color: on ? C.accent : C.faint }} />
            {tr(l.key)}
          </button>
        );
      })}
    </div>
  );
}
