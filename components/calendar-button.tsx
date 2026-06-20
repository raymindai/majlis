"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { MEETINGS } from "@/lib/meetings";
import { C } from "@/components/ui";
import { useOpenMeeting } from "@/components/meeting-context";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m || 1) - 1]} ${y}`;
}

/** Header calendar: the chair's meeting portfolio. Each entry opens its meeting window. */
export default function CalendarButton() {
  const [open, setOpen] = useState(false);
  const { open: openMeeting } = useOpenMeeting();
  const meetings = [...MEETINGS].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Open the calendar"
        aria-label="Open the calendar"
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] cursor-pointer hover:opacity-80"
        style={{ color: C.muted, border: `1px solid ${C.line}` }}
      >
        <CalendarDays size={15} strokeWidth={2} />
        <span className="hidden xl:inline">Calendar</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full mt-1.5 z-[91] w-72 rounded-xl p-1.5"
            style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: "0 16px 40px rgba(0,0,0,0.22)" }}
          >
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.faint }}>Meeting series</div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {meetings.map((mt) => (
                <li key={mt.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      openMeeting(mt.id, { x: e.clientX, y: e.clientY });
                      setOpen(false);
                    }}
                    className="w-full text-left flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--c-surface-alt)] cursor-pointer"
                  >
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: mt.current ? C.accent : C.line }} />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium leading-tight" style={{ color: C.ink }}>
                        {mt.title}
                        {mt.current && <span className="ml-1.5 text-[10px] font-semibold" style={{ color: C.accent }}>today</span>}
                      </span>
                      <span className="block text-[11px]" style={{ color: C.muted }}>{fmtDate(mt.date)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
