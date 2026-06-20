"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";

/** Join the live meeting. Hidden once the meeting has concluded. */
export default function JoinButton({ stage }: { stage: "before" | "during" | "after" }) {
  const { t: tr } = useLang();
  if (stage === "after") return null;
  return (
    <Link
      href="/during"
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90 shrink-0"
      style={{ background: C.accent, color: C.onAccent }}
    >
      <Video size={14} strokeWidth={2} />
      <span className="hidden sm:inline">{stage === "during" ? tr("joinCall") : tr("joinMeeting")}</span>
    </Link>
  );
}
