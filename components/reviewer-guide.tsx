"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, Layers, MousePointerClick, Sparkles, Users, X } from "lucide-react";
import { C } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2 uppercase tracking-wide" style={{ color: C.accent }}>{children}</div>;
}

const HOW = [
  { icon: Layers, t: "Switch stages from the header: Before, During, After. They are one loop." },
  { icon: Sparkles, t: "Zoom detail with Headlines / Brief / Full for a busy reader; it reshapes the page and the rail." },
  { icon: MousePointerClick, t: "Click any person, meeting, or citation to open a draggable window; select text to Ask Majlis." },
  { icon: Users, t: "Ask anything in the right panel; answers stream in with a confidence rating and a source." },
  { icon: GitBranch, t: "Capture commitments live, draft the minutes, then write them to memory for the next cycle." },
];

/**
 * The reviewer's guide. Deliberately not a floating window: it is a fixed panel
 * anchored bottom-left with its own chrome, so it reads as a guide laid over the
 * product rather than another draggable popup the reviewer has to manage.
 */
export default function ReviewerGuide() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[60] inline-flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-2 text-[12.5px] font-medium cursor-pointer hover:opacity-90"
        style={{ background: C.ink, color: C.bg, boxShadow: "0 8px 24px rgba(0,0,0,0.22)" }}
      >
        <BookOpen size={15} strokeWidth={2} /> For reviewers
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[80] w-[min(400px,calc(100vw-2rem))] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
      style={{ background: C.surface, border: `1.5px solid ${C.accent}`, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
    >
      {/* accent ribbon, the signal that this is a guide and not a document window */}
      <div className="shrink-0 px-4 py-2.5 flex items-center justify-between" style={{ background: C.accent, color: C.onAccent }}>
        <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide">
          <BookOpen size={14} strokeWidth={2.25} /> Reviewer&rsquo;s guide
        </span>
        <button type="button" onClick={() => setOpen(false)} className="cursor-pointer hover:opacity-80" aria-label="Close guide">
          <X size={16} strokeWidth={2.25} />
        </button>
      </div>

      <div className="overflow-y-auto px-5 pb-5">
        <div className="-mx-5 relative h-24 overflow-hidden">
          <Image src="/manarah-hero.jpg" alt="" fill sizes="400px" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--c-surface), transparent 70%)" }} />
        </div>

        <div style={serif} className="text-[22px] leading-tight mt-1">Majlis</div>
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
          <Link href="/process" className="inline-flex items-center gap-1.5 text-[13px] rounded-lg px-3 py-2" style={{ background: C.accent, color: C.onAccent }}>
            Read the full case study <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <a href="https://github.com/raymindai/majlis" target="_blank" rel="noreferrer" className="text-[13px]" style={{ color: C.muted }}>
            View the code
          </a>
        </div>
      </div>
    </div>
  );
}
