"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MEETINGS } from "@/lib/meetings";
import { FloatingWindow, type WinPos } from "@/components/floating-window";
import { OrgBadge } from "@/components/rail";
import { C } from "@/components/ui";
import { Gloss } from "@/components/gloss";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

/** A meeting from the series: its summary, with a toggle for full details. */
export default function MeetingPopover({ id, pos, onClose, raise }: { id: string | null; pos: WinPos | null; onClose: () => void; raise?: number }) {
  const [expanded, setExpanded] = useState(false);
  const m = id ? MEETINGS.find((x) => x.id === id) : null;
  if (!m || !pos) return null;

  return (
    <FloatingWindow
      title="Meeting"
      anchor={pos}
      onClose={onClose}
      initialW={380}
      initialH={340}
      raise={raise}
      headerRight={<span className="text-[11px]" style={{ color: C.faint }}>{m.when}</span>}
    >
      <div style={serif} className="text-[17px] leading-snug">{m.title}</div>
      <div className="text-[12px] mt-1" style={{ color: C.muted }}>{m.kind}{m.current ? ", in progress" : `, ${m.when}`}</div>
      <p className="text-[13px] mt-3 leading-relaxed" style={{ color: C.detail }}><Gloss>{m.summary}</Gloss></p>

      {m.details && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 flex items-center gap-1 text-[12px] cursor-pointer hover:opacity-70"
            style={{ color: C.accent }}
          >
            {expanded ? <ChevronDown size={14} strokeWidth={2} /> : <ChevronRight size={14} strokeWidth={2} />}
            {expanded ? "Hide details" : "Full details"}
          </button>
          {expanded && (
            <div className="mt-3 space-y-4">
              <div>
                <div className="text-[11px] font-semibold mb-1" style={{ color: C.faint }}>Purpose</div>
                <p className="text-[12px] leading-snug" style={{ color: C.detail }}><Gloss>{m.details.purpose}</Gloss></p>
              </div>
              <div>
                <div className="text-[11px] font-semibold mb-1.5" style={{ color: C.faint }}>Key points</div>
                <ul className="space-y-1.5">
                  {m.details.points.map((p, i) => (
                    <li key={i} className="text-[12px] flex gap-2 leading-snug" style={{ color: C.detail }}>
                      <span className="shrink-0" style={{ color: C.faint }}>-</span>
                      <Gloss>{p}</Gloss>
                    </li>
                  ))}
                </ul>
              </div>
              {m.details.attendees && m.details.attendees.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold mb-2" style={{ color: C.faint }}>Attended</div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.details.attendees.map((code) => <OrgBadge key={code} code={code} size={26} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </FloatingWindow>
  );
}
