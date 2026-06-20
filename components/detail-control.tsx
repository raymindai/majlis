"use client";

import { useDetail, type DetailLevel } from "@/components/detail-context";
import { C } from "@/components/ui";

const LEVELS: { v: DetailLevel; label: string }[] = [
  { v: 1, label: "Headlines" },
  { v: 2, label: "Brief" },
  { v: 3, label: "Full" },
];

/** Level-of-detail control: zoom the whole stage from headlines to full detail. */
export default function DetailControl() {
  const { level, setLevel } = useDetail();
  return (
    <div className="inline-flex items-center rounded-lg p-0.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      {LEVELS.map((l) => (
        <button
          key={l.v}
          type="button"
          onClick={() => setLevel(l.v)}
          className="text-[11px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
          style={level === l.v ? { background: C.surface, color: C.ink, fontWeight: 600, boxShadow: C.shadow } : { color: C.muted }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
