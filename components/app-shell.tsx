"use client";

import { useState, type ReactNode } from "react";
import { resolveCitation, type Citation } from "@/lib/mock";
import { C, StageSpine } from "@/components/ui";
import { CitationContext } from "@/components/citation-context";
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
  const [openCite, setOpenCite] = useState<Citation | null>(null);
  const drawer = openCite ? resolveCitation(openCite.sourceId, openCite.passageId) : null;

  return (
    <CitationContext.Provider value={{ open: setOpenCite }}>
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

      {/* shared source drawer — opened by any citation chip, anywhere */}
      {drawer && openCite && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpenCite(null)} />
          <aside className="fixed right-0 top-0 h-dvh w-full max-w-md p-6 overflow-y-auto shadow-2xl z-50" style={{ background: C.surface, color: C.ink }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase" style={{ color: C.faint, letterSpacing: "0.1em" }}>Source</span>
              <button type="button" onClick={() => setOpenCite(null)} className="text-[13px] cursor-pointer" style={{ color: C.muted }}>
                Close ✕
              </button>
            </div>
            <div style={serif} className="text-xl">{drawer.title}</div>
            <div className="text-[12px] mt-1" style={{ color: C.muted }}>
              {drawer.date ?? "undated"} · {openCite.sourceId}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed p-4 rounded-lg" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
              {drawer.text || "This passage isn't in the loaded pack."}
            </p>
          </aside>
        </>
      )}
      <SelectionAsk />
    </CitationContext.Provider>
  );
}
