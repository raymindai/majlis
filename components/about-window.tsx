"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitBranch, Layers, MousePointerClick, Sparkles, Users } from "lucide-react";
import { FloatingWindow } from "@/components/floating-window";
import { C } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2" style={{ color: C.accent }}>{children}</div>;
}

const HOW = [
  { icon: Layers, t: "Switch stages from the top: Before, During, After. They are one loop." },
  { icon: Sparkles, t: "Zoom detail with Headlines / Brief / Full in the header for a busy reader." },
  { icon: MousePointerClick, t: "Click any person, meeting, or citation to open a draggable window; select text to Ask Majlis." },
  { icon: Users, t: "Ask anything in the right panel; answers stream in with a confidence rating and a source." },
  { icon: GitBranch, t: "Capture commitments live, draft the minutes, then write them to memory for the next cycle." },
];

/** The information a reviewer needs: what this is, the scenario, and how to use it. */
export default function AboutWindow({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (open === false) return null;
  const anchor = {
    x: typeof window !== "undefined" ? Math.max(20, window.innerWidth / 2 - 245) : 200,
    y: 64,
  };
  return (
    <FloatingWindow title="For reviewers" anchor={anchor} onClose={onClose} initialW={490} initialH={580}>
      <div className="-mx-5 -mt-5 relative h-32 overflow-hidden">
        <Image src="/manarah-hero.jpg" alt="" fill sizes="490px" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--c-surface), transparent 70%)" }} />
      </div>

      <div style={serif} className="text-[24px] leading-tight mt-1">Majlis</div>
      <p className="text-[13px] mt-1 leading-snug" style={{ color: C.muted }}>
        An AI briefing companion that prepares a senior Abu Dhabi government official for a high-stakes committee, across the whole
        meeting lifecycle, with an institutional memory that carries between cycles.
      </p>

      <Lbl>The case study</Lbl>
      <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
        A five-day prototype for the AI Experience Designer brief at the Department of Government Enablement. Built AI-first: live
        Claude, a synthetic committee pack, fal-generated people, and a Supabase audit trail. All data is synthetic.
      </p>

      <Lbl>The scenario</Lbl>
      <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
        The Q2 steering committee of Manarah, a cross-government digital-services programme. Five entities report; one blocker
        dominates, a budget figure does not reconcile across sources, and an informal note contradicts an official report.
      </p>

      <Lbl>What is genuinely live AI</Lbl>
      <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
        Claude writes the brief from the pack (with a recommendation, weighed options, and citations); the Q&amp;A streams grounded
        answers; During, it checks each utterance against the record live; After, it drafts the minutes. Every call is audit-logged.
      </p>

      <Lbl>How to use it</Lbl>
      <ul className="space-y-2">
        {HOW.map((h, i) => {
          const Icon = h.icon;
          return (
            <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: C.detail }}>
              <Icon size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
              {h.t}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Link href="/process" onClick={onClose} className="inline-flex items-center gap-1.5 text-[13px] rounded-lg px-3 py-2" style={{ background: C.accent, color: C.onAccent }}>
          Read the full case study <ArrowRight size={14} strokeWidth={2} />
        </Link>
        <a href="https://github.com/raymindai/majlis" target="_blank" rel="noreferrer" className="text-[13px]" style={{ color: C.muted }}>
          View the code
        </a>
      </div>
    </FloatingWindow>
  );
}
