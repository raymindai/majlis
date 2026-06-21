"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, GitBranch, Layers, Loader2, MousePointerClick, RefreshCw, Sparkles, Users, X } from "lucide-react";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";
import { BRIEF_SYNCING_EVENT, regenerateBrief } from "@/components/regenerate-bus";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2 uppercase tracking-wide" style={{ color: C.accent }}>{children}</div>;
}

const HOW = [
  { icon: Layers, t: "Switch stages from the dock: Before, During, After. They are one loop." },
  { icon: Sparkles, t: "Zoom detail with Headlines / Brief / Full for a busy reader; it reshapes the page and the rail." },
  { icon: MousePointerClick, t: "Click any person, meeting, or citation to open a draggable window; select text to Ask Majlis." },
  { icon: Users, t: "Ask anything in the right panel; answers stream in with a confidence rating and a source." },
  { icon: GitBranch, t: "Capture commitments live, draft the minutes, then write them to memory for the next cycle." },
];

const STAGES = [
  { key: "before", label: "Before", href: "/" },
  { key: "during", label: "During", href: "/during" },
  { key: "after", label: "After", href: "/after" },
] as const;

/**
 * The reviewer's surface, anchored bottom-left. It is deliberately not a floating
 * window: a persistent dock carries the Before / During / After stage switch (the
 * reviewer's way to move through the lifecycle, visible even when the guide is
 * collapsed) plus a toggle for the guide panel, which rises above it with its own
 * accent chrome so it reads as a guide laid over the product.
 */
export default function ReviewerGuide() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const { t: tr } = useLang();
  const pathname = usePathname();
  const active = pathname === "/during" ? "during" : pathname === "/after" ? "after" : "before";

  // The Before view reports when a synthesis finishes; clear pending then. The
  // button only shows progress for a regeneration the reviewer triggered, not the
  // initial synthesis that runs automatically on first load.
  useEffect(() => {
    const handler = (e: Event) => {
      if (!(e as CustomEvent).detail) setPending(false);
    };
    window.addEventListener(BRIEF_SYNCING_EVENT, handler);
    return () => window.removeEventListener(BRIEF_SYNCING_EVENT, handler);
  }, []);

  // First-time visitors get the guide open so they know how to read the demo;
  // after that it stays out of the way unless reopened.
  useEffect(() => {
    try {
      if (!localStorage.getItem("majlis-guide-seen")) {
        setOpen(true);
        localStorage.setItem("majlis-guide-seen", "1");
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[70] flex flex-col items-start gap-2">
      {open && (
        <div
          className="w-[min(400px,calc(100vw-2rem))] max-h-[78vh] rounded-2xl overflow-hidden flex flex-col majlis-pop"
          style={{ background: C.surface, border: `1.5px solid ${C.accent}`, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
        >
          {/* accent ribbon: the signal that this is a guide and not a document window */}
          <div className="shrink-0 px-4 py-2.5 flex items-center justify-between" style={{ background: C.accent, color: C.onAccent }}>
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide">
              <BookOpen size={14} strokeWidth={2.25} /> {tr("reviewersGuide")}
            </span>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer hover:opacity-80" aria-label="Close guide">
              <X size={16} strokeWidth={2.25} />
            </button>
          </div>

          <div className="overflow-y-auto px-5 pb-5">
            <div className="-mx-5 relative h-24 overflow-hidden">
              <Image src="/manarah-beacon.jpg" alt="" fill sizes="400px" className="object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--c-surface), transparent 70%)" }} />
            </div>

            <div style={serif} className="text-[22px] leading-tight mt-1">Majlis</div>
            <p className="text-[13px] mt-1 leading-snug" style={{ color: C.muted }}>
              An AI briefing companion that prepares a senior Abu Dhabi government official for a high-stakes committee, across the
              whole meeting lifecycle, with an institutional memory that carries between cycles.
            </p>

            <Lbl>The case study</Lbl>
            <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
              A five-day prototype for the AI Experience Designer brief at the Department of Government Enablement. Built AI-first:
              live Claude, a synthetic committee pack, fal-generated people, and a Supabase audit trail. All data is synthetic.
            </p>

            <Lbl>The scenario</Lbl>
            <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
              The Q2 steering committee of Manarah, a cross-government digital-services programme. Five entities report; one blocker
              dominates, a budget figure does not reconcile across sources, and an informal note contradicts an official report.
            </p>

            <Lbl>What is genuinely live AI</Lbl>
            <p className="text-[13px] leading-relaxed" style={{ color: C.detail }}>
              Claude writes the brief from the pack (with a recommendation, weighed options, and citations); the Q&amp;A streams
              grounded answers; During, it checks each utterance against the record live; After, it drafts the minutes. Every call is
              audit-logged.
            </p>

            {active === "before" && (
              <div className="mt-4 rounded-xl p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div className="flex items-start gap-2 text-[12.5px] leading-snug" style={{ color: C.detail }}>
                  <Sparkles size={14} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
                  <span>The Before brief is synthesised live from the committee pack. Regenerate to watch Claude write a fresh one.</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setPending(true); regenerateBrief(); }}
                  disabled={pending}
                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-medium rounded-lg px-3 py-2 cursor-pointer hover:opacity-90 disabled:opacity-60 transition active:scale-[0.98]"
                  style={{ background: C.accent, color: C.onAccent }}
                >
                  {pending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2} />}
                  {pending ? "Synthesising…" : "Regenerate the brief"}
                </button>
              </div>
            )}

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
      )}

      {/* persistent dock: stage switch + guide toggle, always visible */}
      <div
        className="flex items-center gap-1 rounded-full p-1"
        style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
      >
        <nav className="flex items-center gap-0.5 pl-1.5 pr-1 text-[12px]">
          {STAGES.map((s, i) => (
            <span key={s.key} className="flex items-center">
              <Link
                href={s.href}
                className="px-1.5 py-1 rounded-full hover:opacity-80"
                style={s.key === active ? { color: C.ink, fontWeight: 600 } : { color: C.faint }}
              >
                {tr(s.key)}
              </Link>
              {i < STAGES.length - 1 && <span style={{ color: C.line }}>/</span>}
            </span>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90"
          style={{ background: C.ink, color: C.bg }}
        >
          <BookOpen size={14} strokeWidth={2} /> {tr("forReviewers")}
        </button>
      </div>
    </div>
  );
}
