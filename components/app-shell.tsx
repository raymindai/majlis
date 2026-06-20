"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { resolveCitation, type Citation } from "@/lib/mock";
import { C, StageSpine } from "@/components/ui";
import { CitationContext } from "@/components/citation-context";
import { ParticipantContext } from "@/components/participant-context";
import { OpenMeetingContext } from "@/components/meeting-context";
import ParticipantPopover from "@/components/participant-popover";
import MeetingPopover from "@/components/meeting-popover";
import { FloatingWindow, type WinPos } from "@/components/floating-window";
import NotesLayer from "@/components/notes-layer";
import { Gloss } from "@/components/gloss";
import ThemeSwitcher from "@/components/theme-switcher";
import ChatPanel from "@/components/chat-panel";
import SelectionAsk from "@/components/selection-ask";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

type WinItem =
  | { instanceId: string; kind: "participant"; payload: string; pos: WinPos }
  | { instanceId: string; kind: "meeting"; payload: string; pos: WinPos }
  | { instanceId: string; kind: "source"; payload: Citation; pos: WinPos };

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
  // A stack of floating windows. Each click adds one; it stays until the user closes it.
  const [windows, setWindows] = useState<WinItem[]>([]);
  const idRef = useRef(0);

  function open(kind: "participant", payload: string, pos?: WinPos): void;
  function open(kind: "meeting", payload: string, pos?: WinPos): void;
  function open(kind: "source", payload: Citation, pos?: WinPos): void;
  function open(kind: WinItem["kind"], payload: string | Citation, pos?: WinPos): void {
    setWindows((ws) => {
      const fallback = { x: (typeof window !== "undefined" ? window.innerWidth : 1200) - 420, y: 120 };
      const base = pos ?? fallback;
      const cascade = ws.length % 6;
      const next = { instanceId: String(++idRef.current), kind, payload, pos: { x: base.x + cascade * 8, y: base.y + cascade * 8 } } as WinItem;
      return [...ws, next];
    });
  }
  const closeWin = (instanceId: string) => setWindows((ws) => ws.filter((w) => w.instanceId !== instanceId));

  return (
    <CitationContext.Provider value={{ open: (c, pos) => { if (c) open("source", c, pos); } }}>
      <ParticipantContext.Provider value={{ open: (id, pos) => { if (id) open("participant", id, pos); } }}>
        <OpenMeetingContext.Provider value={{ open: (id, pos) => { if (id) open("meeting", id, pos); } }}>
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

          {/* Stackable floating windows: profiles, sources, meetings. Each persists until closed. */}
          {windows.map((w) => {
            if (w.kind === "participant") return <ParticipantPopover key={w.instanceId} id={w.payload} pos={w.pos} onClose={() => closeWin(w.instanceId)} />;
            if (w.kind === "meeting") return <MeetingPopover key={w.instanceId} id={w.payload} pos={w.pos} onClose={() => closeWin(w.instanceId)} />;
            const s = resolveCitation(w.payload.sourceId, w.payload.passageId);
            return (
              <FloatingWindow
                key={w.instanceId}
                title="Source"
                anchor={w.pos}
                onClose={() => closeWin(w.instanceId)}
                initialW={400}
                initialH={320}
                headerRight={<span className="text-[11px]" style={{ color: C.muted }}>{w.payload.sourceId}</span>}
              >
                <div style={serif} className="text-[18px] leading-snug">{s.title}</div>
                <div className="text-[12px] mt-1" style={{ color: C.muted }}>{s.date ?? "undated"}{s.authority ? `, ${s.authority}` : ""}</div>
                <p className="mt-3 text-[14px] leading-relaxed p-3 rounded-lg" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <Gloss>{s.text || "This passage isn't in the loaded pack."}</Gloss>
                </p>
              </FloatingWindow>
            );
          })}

          <SelectionAsk />
          <NotesLayer />
        </OpenMeetingContext.Provider>
      </ParticipantContext.Provider>
    </CitationContext.Provider>
  );
}
