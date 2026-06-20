"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";
import ThemeSwitcher from "@/components/theme-switcher";

const USER = { name: "Hamad Al Nuaimi", role: "Programme Director-General" };

/** The official's profile, top-right. A product-style identity chip with a menu. */
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { t: tr } = useLang();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 cursor-pointer rounded-full pl-0.5 pr-1.5 py-0.5 hover:bg-[var(--c-surface-alt)]"
      >
        <Image src="/avatars/CHAIR.png" alt="" width={30} height={30} className="rounded-full object-cover" style={{ width: 30, height: 30 }} />
        <span className="hidden lg:block text-left leading-tight">
          <span className="block text-[12px] font-semibold">{USER.name}</span>
          <span className="block text-[10px]" style={{ color: C.muted }}>{USER.role}</span>
        </span>
        <ChevronDown size={14} strokeWidth={2} style={{ color: C.faint }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-60 rounded-xl p-1.5 z-50"
            style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 3px 10px rgba(0,0,0,0.12)" }}
          >
            <div className="px-2.5 py-2 flex items-center gap-2.5">
              <Image src="/avatars/CHAIR.png" alt="" width={38} height={38} className="rounded-full object-cover" style={{ width: 38, height: 38 }} />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{USER.name}</div>
                <div className="text-[11px] truncate" style={{ color: C.muted }}>{USER.role}</div>
              </div>
            </div>
            <div className="border-t my-1" style={{ borderColor: C.line }} />
            <div className="px-2.5 py-1.5 flex items-center justify-between gap-2">
              <span className="text-[13px]" style={{ color: C.detail }}>{tr("appearance")}</span>
              <ThemeSwitcher />
            </div>
            <div className="border-t my-1" style={{ borderColor: C.line }} />
            {[
              { icon: UserRound, label: tr("profileItem") },
              { icon: Settings, label: tr("preferences") },
              { icon: LogOut, label: tr("signOut") },
            ].map((it) => {
              const Icon = it.icon;
              return (
                <button key={it.label} type="button" onClick={() => setOpen(false)} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] cursor-pointer hover:bg-[var(--c-surface-alt)] text-left" style={{ color: C.detail }}>
                  <Icon size={15} strokeWidth={2} style={{ color: C.faint }} />
                  {it.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
