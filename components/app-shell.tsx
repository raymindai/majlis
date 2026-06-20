"use client";

import { type ReactNode } from "react";
import { Info } from "lucide-react";
import { C, StageSpine } from "@/components/ui";
import DetailControl from "@/components/detail-control";
import UserMenu from "@/components/user-menu";
import { useAbout } from "@/components/about-context";
import ThemeSwitcher from "@/components/theme-switcher";
import ChatPanel from "@/components/chat-panel";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

/**
 * Stage chrome: header, the three-zone laptop body, and the reserved chat rail.
 * The floating-window workspace and shared contexts live in <Desk> (one level up),
 * so anything rendered here can open windows from anywhere.
 */
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
  const { open: openAbout } = useAbout();

  return (
    <div className="h-dvh flex flex-col" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* header */}
      <header className="shrink-0 border-b" style={{ borderColor: C.line, background: C.surface }}>
        <div className="px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span style={serif} className="text-xl">Majlis</span>
            <StageSpine active={stage} />
          </div>
          <div className="flex items-center gap-3">
            {meta && <div className="text-[12px] text-right leading-tight hidden xl:block" style={{ color: C.muted }}>{meta}</div>}
            <DetailControl />
            <button type="button" onClick={openAbout} className="inline-flex items-center gap-1.5 text-[12px] cursor-pointer hover:opacity-70" style={{ color: C.muted }} title="What this is and how to use it">
              <Info size={15} strokeWidth={2} />
              <span className="hidden lg:inline">For reviewers</span>
            </button>
            <ThemeSwitcher />
            <UserMenu />
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
  );
}
