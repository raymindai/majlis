"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { MEETING_META } from "@/lib/mock";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";

const STAGES = [
  { key: "before", statusKey: "upcoming", labelKey: "before", href: "/" },
  { key: "during", statusKey: "inSession", labelKey: "duringInSession", href: "/during" },
  { key: "after", statusKey: "concluded", labelKey: "after", href: "/after" },
] as const;

/**
 * The meeting in the header. The status chip doubles as the meeting-state selector:
 * click it to move between Before, During (In session), and After.
 */
export default function MeetingBar({ stage }: { stage: "before" | "during" | "after" }) {
  const [open, setOpen] = useState(false);
  const { t: tr } = useLang();
  const current = STAGES.find((s) => s.key === stage)!;
  const live = stage === "during";

  const chipStyle = live
    ? { background: C.flagBg, color: C.unverified, border: `1px solid ${C.flagBorder}` }
    : stage === "before"
      ? { background: C.chipBg, color: C.ink, border: `1px solid ${C.line}` }
      : { background: C.surfaceAlt, color: C.muted, border: `1px solid ${C.line}` };

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="min-w-0 leading-tight hidden md:block">
        <div className="text-[12.5px] font-semibold truncate">{MEETING_META.session}</div>
        <div className="flex items-center gap-1 text-[11px]" style={{ color: C.muted }}>
          <MapPin size={11} strokeWidth={2} className="shrink-0" />
          <span className="truncate">{MEETING_META.room}</span>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] cursor-pointer hover:opacity-90"
          style={chipStyle}
          title={tr("changeStatus")}
        >
          {live && <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.unverified }} />}
          {tr(current.statusKey)}
          {stage === "before" && <span className="opacity-80">{tr("inMinutes", { n: MEETING_META.minutesUntil })}</span>}
          <ChevronDown size={13} strokeWidth={2} className="opacity-80" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
            <div
              className="absolute top-full mt-1.5 z-[91] w-56 rounded-xl p-1 ltr:left-0 rtl:right-0"
              style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: "0 16px 40px rgba(0,0,0,0.22)" }}
            >
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.faint }}>{tr("meetingStatus")}</div>
              {STAGES.map((s) => (
                <Link
                  key={s.key}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] hover:bg-[var(--c-surface-alt)]"
                  style={{ color: s.key === stage ? C.ink : C.detail, fontWeight: s.key === stage ? 600 : 400 }}
                >
                  <span className="w-3.5 shrink-0">{s.key === stage && <Check size={13} strokeWidth={2.5} style={{ color: C.accent }} />}</span>
                  <span className="flex-1">{tr(s.labelKey)}</span>
                  {s.key === "during" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.unverified }} />}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
