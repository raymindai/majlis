"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { resolveCitation, type Citation } from "@/lib/mock";
import { C, StageSpine } from "@/components/ui";
import { CitationContext } from "@/components/citation-context";
import { ParticipantContext, type ParticipantPos } from "@/components/participant-context";
import ParticipantPopover from "@/components/participant-popover";
import { FloatingWindow, type WinPos } from "@/components/floating-window";
import NotesLayer from "@/components/notes-layer";
import ThemeSwitcher from "@/components/theme-switcher";
import ChatPanel from "@/components/chat-panel";
import SelectionAsk from "@/components/selection-ask";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

export default function AppShell({
  stage,
  meta,
  leftRail,
  children,
}: {
  stage: "before" | "during" | "after";
  meta?: ReactNode;
  leftRail?: ReactNode;
  children: ReactNode;
}) {
  const [cite, setCite] = useState<{ citation: Citation; pos: WinPos } | null>(null);
  const [participant, setParticipant] = useState<{ id: string; pos: ParticipantPos } | null>(null);
  const src = cite ? resolveCitation(cite.citation.sourceId, cite.citation.passageId) : null;
  const openParticipant = (id: string | null, pos?: ParticipantPos) =>
    setParticipant(id ? { id, pos: pos ?? { x: window.innerWidth - 220, y: 120 } } : null);

  return (
    <CitationContext.Provider value={{ open: (c, pos) => setCite(c ? { citation: c, pos: pos ?? { x: window.innerWidth - 420, y: 120 } } : null) }}>
      <ParticipantContext.Provider value={{ open: openParticipant }}>
      <div className="h-dvh flex flex-col" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {/* header */}
        <header className="shrink-0 border-b" style={{ borderColor: C.line, background: C.surface }}>
          <div className="px-5 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span style={serif} className="text-xl">Majlis</span>
              <StageSpine active={stage} />
            </div>
            <div className="flex items-center gap-4">
              {meta && <div className="text-[12px] text-right leading-tight" style={{ color: C.muted }}>{meta}</div>}
              <Link href="/process" className="text-[12px] hover:opacity-70 hidden sm:block" style={{ color: C.muted }}>Case study</Link>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* 3-zone laptop body */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[230px_1fr_380px]">
          <aside className="hidden lg:block border-r overflow-y-auto p-4" style={{ borderColor: C.line, background: C.surface }}>
            {leftRail}
          </aside>
          <main className="overflow-y-auto px-6 py-6">
            <div className="mx-auto w-full max-w-5xl space-y-6 pb-12">{children}</div>
          </main>
          <div className="hidden lg:flex flex-col border-l min-h-0" style={{ borderColor: C.line, background: C.surface }}>
            <ChatPanel stage={stage} />
          </div>
        </div>
      </div>

      {/* shared source viewer, opened by any citation chip, anywhere (off the right rail) */}
      {src && cite && (
        <FloatingWindow
          title="Source"
          anchor={cite.pos}
          onClose={() => setCite(null)}
          initialW={400}
          initialH={320}
          headerRight={<span className="text-[11px]" style={{ color: C.muted }}>{cite.citation.sourceId}</span>}
        >
          <div style={serif} className="text-[18px] leading-snug">{src.title}</div>
          <div className="text-[12px] mt-1" style={{ color: C.muted }}>{src.date ?? "undated"}{src.authority ? `, ${src.authority}` : ""}</div>
          <p className="mt-3 text-[14px] leading-relaxed p-3 rounded-lg" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
            {src.text || "This passage isn't in the loaded pack."}
          </p>
        </FloatingWindow>
      )}
      <SelectionAsk />
      <ParticipantPopover id={participant?.id ?? null} pos={participant?.pos ?? null} onClose={() => setParticipant(null)} />
      <NotesLayer />
      </ParticipantContext.Provider>
    </CitationContext.Provider>
  );
}
