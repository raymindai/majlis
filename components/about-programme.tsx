"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { FloatingWindow } from "@/components/floating-window";
import { C } from "@/components/ui";
import { OrgBadge, StatusTag, deptFor } from "@/components/rail";
import { useLang } from "@/components/lang-context";
import { ENTITIES, meetingFieldI18n, deptNameI18n } from "@/lib/corpus";
import { MEETING_META } from "@/lib/mock";
import { ABOUT_PROGRAMME_EVENT } from "@/components/programme-bus";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2 uppercase tracking-wide" style={{ color: C.accent }}>{children}</div>;
}

/** The overarching initiative this whole experience governs. Opened from the rail anchor. */
export default function AboutProgramme() {
  const [open, setOpen] = useState(false);
  const { t: tr, lang } = useLang();

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener(ABOUT_PROGRAMME_EVENT, h);
    return () => window.removeEventListener(ABOUT_PROGRAMME_EVENT, h);
  }, []);

  if (!open) return null;
  const anchor = {
    x: typeof window !== "undefined" ? Math.max(20, window.innerWidth / 2 - 230) : 200,
    y: 72,
  };
  const budgetM = Math.round(MEETING_META.totalBudgetAED / 1e6);

  return (
    <FloatingWindow title={tr("aboutManarah")} anchor={anchor} onClose={() => setOpen(false)} initialW={460} initialH={560}>
      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.accent }}>
        <Layers size={13} strokeWidth={2.25} /> {tr("initiativeInFocus")}
      </div>
      <div style={{ ...serif, letterSpacing: "-0.015em" }} className="text-[24px] leading-tight mt-1">{meetingFieldI18n("programme", lang)}</div>
      <p className="text-[13.5px] mt-1.5 leading-relaxed" style={{ color: C.detail }}>{tr("manarahTagline")}</p>
      <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: C.detail }}>{tr("manarahWhat")}</p>

      <div className="mt-4 rounded-xl p-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[12px]" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
        <span><span className="font-semibold text-[15px]">{ENTITIES.length}</span> <span style={{ color: C.muted }}>{tr("entities")}</span></span>
        <span><span className="font-semibold text-[15px]">AED {budgetM}M</span> <span style={{ color: C.muted }}>{tr("programme")}</span></span>
        <span><span className="font-semibold text-[15px]">6</span> <span style={{ color: C.muted }}>{tr("meetingSeries")}</span></span>
      </div>

      <Lbl>{tr("theEntities")}</Lbl>
      <ul className="space-y-1.5">
        {ENTITIES.map((e) => {
          const dept = deptFor(e.id);
          return (
            <li key={e.id} className="flex items-center gap-2.5">
              <OrgBadge code={e.id} size={26} />
              <span className="font-medium text-[13px] flex-1 min-w-0 truncate">{deptNameI18n(e.id, lang) ?? e.id}</span>
              {dept && <StatusTag status={dept.status} />}
            </li>
          );
        })}
      </ul>

      <Lbl>{tr("governanceLabel")}</Lbl>
      <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>{tr("governanceText")}</p>

      <Lbl>{tr("whereMajlisFits")}</Lbl>
      <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>{tr("whyMajlisText")}</p>

      <p className="text-[11px] mt-5" style={{ color: C.faint }}>{tr("syntheticNote")}</p>

      <Link href="/process" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center gap-1.5 text-[13px] rounded-lg px-3 py-2" style={{ background: C.accent, color: C.onAccent }}>
        {tr("forReviewers")} <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </FloatingWindow>
  );
}
