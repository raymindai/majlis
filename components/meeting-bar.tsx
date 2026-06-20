"use client";

import Link from "next/link";
import { DoorOpen, MapPin } from "lucide-react";
import { MEETING_META } from "@/lib/mock";
import { C } from "@/components/ui";

/**
 * The meeting the chair is in, shown in the header. The join control is situational:
 * before, it offers to enter the live room; during, it shows the session is live;
 * after, it shows the session concluded.
 */
export default function MeetingBar({ stage }: { stage: "before" | "during" | "after" }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="min-w-0 leading-tight hidden md:block">
        <div className="text-[12.5px] font-semibold truncate">{MEETING_META.session}</div>
        <div className="flex items-center gap-1 text-[11px]" style={{ color: C.muted }}>
          <MapPin size={11} strokeWidth={2} className="shrink-0" />
          <span className="truncate">{MEETING_META.room}</span>
        </div>
      </div>

      {stage === "before" && (
        <Link
          href="/during"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] cursor-pointer hover:opacity-90"
          style={{ background: C.accent, color: C.onAccent }}
        >
          <DoorOpen size={13} strokeWidth={2} /> Join room
          <span className="opacity-80">in {MEETING_META.minutesUntil} min</span>
        </Link>
      )}
      {stage === "during" && (
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]"
          style={{ background: C.flagBg, color: C.unverified, border: `1px solid ${C.flagBorder}` }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.unverified }} /> In session
        </span>
      )}
      {stage === "after" && (
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]"
          style={{ background: C.surfaceAlt, color: C.muted, border: `1px solid ${C.line}` }}
        >
          Concluded
        </span>
      )}
    </div>
  );
}
