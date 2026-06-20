"use client";

import { type ReactNode } from "react";
import { C, StageSpine } from "@/components/ui";
import MeetingBar from "@/components/meeting-bar";
import DetailControl from "@/components/detail-control";
import UserMenu from "@/components/user-menu";
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
  leftRail,
  children,
}: {
  stage: "before" | "during" | "after";
  leftRail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="h-dvh flex flex-col" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* header: left = title + meeting + stage, center = zoom, right = theme + profile */}
      <header className="shrink-0 border-b" style={{ borderColor: C.line, background: C.surface }}>
        <div className="px-5 h-14 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span style={serif} className="text-xl shrink-0">Majlis</span>
            <span className="h-6 w-px shrink-0" style={{ background: C.line }} />
            <MeetingBar stage={stage} />
            <span className="h-6 w-px shrink-0 hidden lg:block" style={{ background: C.line }} />
            <div className="hidden lg:block"><StageSpine active={stage} /></div>
          </div>

          <div className="shrink-0 hidden md:block">
            <DetailControl />
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-1 justify-end">
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
