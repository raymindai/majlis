"use client";

import Link from "next/link";
import { LogOut, Play, Video } from "lucide-react";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";

const base = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90 shrink-0";

/**
 * The meeting-presence control, next to the status. It tracks the stage:
 * join the call before, leave it during, replay the recording after.
 */
export default function JoinButton({ stage }: { stage: "before" | "during" | "after" }) {
  const { t: tr } = useLang();

  if (stage === "during") {
    return (
      <Link href="/after" className={base} style={{ background: C.surfaceAlt, color: C.unverified, border: `1px solid ${C.flagBorder}` }}>
        <LogOut size={14} strokeWidth={2} />
        <span className="hidden sm:inline">{tr("leave")}</span>
      </Link>
    );
  }
  if (stage === "after") {
    return (
      <Link href="/during" className={base} style={{ background: C.surfaceAlt, color: C.detail, border: `1px solid ${C.line}` }}>
        <Play size={14} strokeWidth={2} />
        <span className="hidden sm:inline">{tr("replayRecording")}</span>
      </Link>
    );
  }
  return (
    <Link href="/during" className={base} style={{ background: C.accent, color: C.onAccent }}>
      <Video size={14} strokeWidth={2} />
      <span className="hidden sm:inline">{tr("joinCall")}</span>
    </Link>
  );
}
