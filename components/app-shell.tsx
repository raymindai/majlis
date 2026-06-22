"use client";

import { useState, type ReactNode } from "react";
import { MessageCircleQuestion, X } from "lucide-react";
import { C } from "@/components/ui";
import MeetingBar from "@/components/meeting-bar";
import DetailControl from "@/components/detail-control";
import UserMenu from "@/components/user-menu";
import LanguageSwitcher from "@/components/language-switcher";
import ChatPanel from "@/components/chat-panel";
import FlagBar from "@/components/flag-bar";
import { useLang } from "@/components/lang-context";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

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
  const { t: tr } = useLang();
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div className="h-dvh flex flex-col" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), var(--font-arabic), system-ui, sans-serif" }}>
      {/* header: left = title + meeting + stage, center = zoom, right = theme + profile */}
      <header className="shrink-0 border-b" style={{ borderColor: C.line, background: C.surface }}>
        {/* Row 1: brand left, zoom centered, language + account right */}
        <div className="px-3 md:px-5 h-14 flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 flex-1">
            <span style={serif} className="text-xl shrink-0">Majlis</span>
            {/* large screens keep the meeting inline; smaller screens move it to row 2 */}
            <div className="hidden lg:flex items-center gap-3 min-w-0">
              <span className="h-6 w-px shrink-0" style={{ background: C.line }} />
              <MeetingBar stage={stage} />
            </div>
          </div>

          <div className="shrink-0">
            <DetailControl />
          </div>

          <div className="flex items-center gap-2 md:gap-3 justify-end min-w-0 flex-1">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>

        {/* Row 2: meeting info (left) and its status (right), only when it cannot sit on row 1 */}
        <div className="lg:hidden px-3 md:px-5 pb-2.5">
          <MeetingBar stage={stage} row />
        </div>
      </header>

      {/* 3-zone laptop body */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[230px_1fr_380px]">
        <aside className="hidden lg:block border-r overflow-y-auto p-4 majlis-smooth-scroll" style={{ borderColor: C.line, background: C.surface }}>
          {leftRail}
        </aside>
        <main className="overflow-y-auto px-6 py-6 majlis-smooth-scroll">
          <div className="mx-auto w-full max-w-5xl space-y-6 pb-12">{children}</div>
        </main>

        {/* dim backdrop behind the mobile chat */}
        {chatOpen && <div className="lg:hidden fixed inset-0 z-[96]" style={{ background: "rgba(20,16,10,0.4)" }} onClick={() => setChatOpen(false)} />}

        {/* chat: a static side column on desktop, a full-height slide-in on mobile */}
        <div
          className={`${chatOpen ? "flex fixed inset-y-0 right-0 w-[min(440px,100vw)] z-[97] shadow-2xl majlis-fade-up" : "hidden"} lg:flex lg:static lg:inset-auto lg:right-auto lg:w-auto lg:z-auto lg:shadow-none flex-col border-l min-h-0`}
          style={{ borderColor: C.line, background: C.surface }}
        >
          <button
            type="button"
            onClick={() => setChatOpen(false)}
            aria-label={tr("close")}
            className="lg:hidden absolute top-3 right-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full cursor-pointer"
            style={{ background: "rgba(64,48,24,0.08)", color: C.ink }}
          >
            <X size={18} strokeWidth={2.25} />
          </button>
          <ChatPanel stage={stage} />
        </div>
      </div>

      {/* mobile: a floating button to open Ask Majlis */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label={tr("askMajlis")}
          className="lg:hidden fixed bottom-4 right-4 z-[80] inline-flex items-center justify-center h-12 w-12 rounded-full cursor-pointer active:scale-95 transition"
          style={{ background: C.accent, color: C.onAccent, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
        >
          <MessageCircleQuestion size={22} strokeWidth={2} />
        </button>
      )}

      {/* UAE national accent: a slim flag-colour bar flush at the base */}
      <FlagBar />
    </div>
  );
}
