"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { type Citation } from "@/lib/mock";
import { getSource, SOURCE_META, AUTHORITY_LABEL } from "@/lib/corpus";
import { C, StageSpine } from "@/components/ui";
import { CitationContext } from "@/components/citation-context";
import { ParticipantContext } from "@/components/participant-context";
import { OpenMeetingContext } from "@/components/meeting-context";
import ParticipantPopover from "@/components/participant-popover";
import MeetingPopover from "@/components/meeting-popover";
import { FloatingWindow, type WinPos } from "@/components/floating-window";
import NotesLayer from "@/components/notes-layer";
import { Gloss } from "@/components/gloss";
import { DetailContext, type DetailLevel } from "@/components/detail-context";
import DetailControl from "@/components/detail-control";
import ThemeSwitcher from "@/components/theme-switcher";
import ChatPanel from "@/components/chat-panel";
import SelectionAsk from "@/components/selection-ask";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

type WinItem =
  | { instanceId: string; kind: "participant"; payload: string; pos: WinPos; raise: number }
  | { instanceId: string; kind: "meeting"; payload: string; pos: WinPos; raise: number }
  | { instanceId: string; kind: "source"; payload: Citation; pos: WinPos; raise: number };

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
  const [level, setLevelState] = useState<DetailLevel>(3);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? Number(localStorage.getItem("majlis-detail")) : 0;
    if (saved === 1 || saved === 2 || saved === 3) setLevelState(saved as DetailLevel);
  }, []);
  const setLevel = (l: DetailLevel) => {
    setLevelState(l);
    if (typeof window !== "undefined") localStorage.setItem("majlis-detail", String(l));
  };

  function open(kind: "participant", payload: string, pos?: WinPos): void;
  function open(kind: "meeting", payload: string, pos?: WinPos): void;
  function open(kind: "source", payload: Citation, pos?: WinPos): void;
  function open(kind: WinItem["kind"], payload: string | Citation, pos?: WinPos): void {
    setWindows((ws) => {
      // If this exact window is already open, bring it to the front instead of duplicating.
      const key = JSON.stringify(payload);
      const existing = ws.find((w) => w.kind === kind && JSON.stringify(w.payload) === key);
      if (existing) return ws.map((w) => (w === existing ? ({ ...w, raise: w.raise + 1 } as WinItem) : w));
      const fallback = { x: (typeof window !== "undefined" ? window.innerWidth : 1200) - 420, y: 120 };
      const base = pos ?? fallback;
      const cascade = ws.length % 6;
      const next = { instanceId: String(++idRef.current), kind, payload, pos: { x: base.x + cascade * 8, y: base.y + cascade * 8 }, raise: 0 } as WinItem;
      return [...ws, next];
    });
  }
  const closeWin = (instanceId: string) => setWindows((ws) => ws.filter((w) => w.instanceId !== instanceId));

  return (
    <DetailContext.Provider value={{ level, setLevel }}>
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
                  {meta && <div className="text-[12px] text-right leading-tight hidden md:block" style={{ color: C.muted }}>{meta}</div>}
                  <DetailControl />
                  <Link href="/process" className="text-[12px] hover:opacity-70 hidden lg:block" style={{ color: C.muted }}>Case study</Link>
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
            if (w.kind === "participant") return <ParticipantPopover key={w.instanceId} id={w.payload} pos={w.pos} raise={w.raise} onClose={() => closeWin(w.instanceId)} />;
            if (w.kind === "meeting") return <MeetingPopover key={w.instanceId} id={w.payload} pos={w.pos} raise={w.raise} onClose={() => closeWin(w.instanceId)} />;
            const s = getSource(w.payload.sourceId);
            const m = SOURCE_META[w.payload.sourceId];
            return (
              <FloatingWindow
                key={w.instanceId}
                title="Document"
                anchor={w.pos}
                raise={w.raise}
                onClose={() => closeWin(w.instanceId)}
                initialW={430}
                initialH={400}
                headerRight={m && <span className="text-[11px]" style={{ color: C.muted }}>{m.ref}</span>}
              >
                {s ? (
                  <>
                    <div style={serif} className="text-[18px] leading-snug">{s.title}</div>
                    <div className="text-[11px] mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5" style={{ color: C.muted }}>
                      {m && <span>{m.docType}</span>}
                      {m && <span>·</span>}
                      {m && <span>{m.issuer}</span>}
                      <span>·</span>
                      <span>{s.date ?? "undated"}</span>
                    </div>
                    <span className="text-[11px] mt-2 inline-block rounded px-2 py-0.5" style={{ background: C.surfaceAlt, color: C.muted }}>{AUTHORITY_LABEL[s.authority]}</span>
                    <div className="text-[11px] font-semibold mt-4 mb-2" style={{ color: C.faint }}>Document</div>
                    <div className="space-y-2">
                      {s.passages.map((p) => {
                        const cited = p.id === w.payload.passageId;
                        return (
                          <p
                            key={p.id}
                            className="text-[13px] leading-relaxed p-2.5 rounded-lg"
                            style={cited ? { background: C.flagBg, border: `1px solid ${C.flagBorder}` } : { background: C.surfaceAlt, border: `1px solid ${C.line}` }}
                          >
                            <Gloss>{p.text}</Gloss>
                          </p>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-[14px]" style={{ color: C.muted }}>This document is not in the loaded pack.</p>
                )}
              </FloatingWindow>
            );
          })}

          <SelectionAsk />
          <NotesLayer />
        </OpenMeetingContext.Provider>
      </ParticipantContext.Provider>
    </CitationContext.Provider>
    </DetailContext.Provider>
  );
}
