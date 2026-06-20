"use client";

import { MEETINGS } from "@/lib/meetings";
import { C, RailLabel } from "@/components/ui";
import { useOpenMeeting } from "@/components/meeting-context";
import { useLang } from "@/components/lang-context";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m || 1) - 1]} ${y}`;
}

/** The chair's meeting portfolio, in the rail. Each entry opens that meeting's window. */
export default function RailCalendar() {
  const { open: openMeeting } = useOpenMeeting();
  const { t: tr } = useLang();
  const meetings = [...MEETINGS].sort((a, b) => (a.date < b.date ? -1 : 1));
  return (
    <div>
      <RailLabel>{tr("calendar")}</RailLabel>
      <ul className="space-y-0.5">
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
    </div>
  );
}
