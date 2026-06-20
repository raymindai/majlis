"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { MEETINGS } from "@/lib/meetings";
import { C } from "@/components/ui";
import { useOpenMeeting } from "@/components/meeting-context";
import { useLang } from "@/components/lang-context";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m || 1) - 1]} ${y}`;
}

/**
 * The chair's meeting portfolio in the rail, as a collapsible section so it stays
 * out of the way until needed. Each entry opens that meeting's window.
 */
export default function RailCalendar() {
  const [open, setOpen] = useState(false);
  const { open: openMeeting } = useOpenMeeting();
  const { t: tr } = useLang();
  const meetings = [...MEETINGS].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 text-[11px] font-semibold cursor-pointer hover:opacity-80"
        style={{ color: C.faint }}
      >
        <CalendarDays size={13} strokeWidth={2} />
        <span>{tr("calendar")}</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span style={{ color: C.muted }}>{meetings.length}</span>
          <ChevronDown size={13} strokeWidth={2} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
        </span>
      </button>

      {open && (
        <ul className="mt-2 space-y-0.5">
          {meetings.map((mt) => (
            <li key={mt.id}>
              <button
                type="button"
                onClick={(e) => openMeeting(mt.id, { x: e.clientX, y: e.clientY })}
                className="w-full text-left -mx-2 px-2 py-1.5 rounded-lg hover:bg-[var(--c-surface-alt)] cursor-pointer flex items-start gap-2"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: mt.current ? C.accent : C.line }} />
                <span className="min-w-0">
                  <span className="block text-[12.5px] leading-tight truncate" style={{ color: mt.current ? C.ink : C.detail, fontWeight: mt.current ? 600 : 400 }}>
                    {mt.title}
                  </span>
                  <span className="block text-[11px]" style={{ color: C.muted }}>
                    {fmtDate(mt.date)}{mt.current ? ` (${tr("today")})` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
