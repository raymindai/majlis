"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarClock, type LucideIcon } from "lucide-react";
import { ENTITIES } from "@/lib/corpus";
import { MEETINGS } from "@/lib/meetings";
import { MEETING_META } from "@/lib/mock";
import { C, RailLabel } from "@/components/ui";
import { useParticipant } from "@/components/participant-context";

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const statusColor: Record<string, string> = { "on-track": C.confirmed, "at-risk": C.likely, slipped: C.unverified, restricted: C.faint };
export const statusLabel: Record<string, string> = { "on-track": "On track", "at-risk": "At risk", slipped: "Slipped", restricted: "Restricted" };

export function initials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function Avatar({ id, name, size = 44 }: { id: string; name: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="rounded-full flex items-center justify-center font-semibold shrink-0"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.32), background: `color-mix(in srgb, ${C.accent} 16%, transparent)`, color: C.accent }}
      >
        {initials(name)}
      </div>
    );
  }
  return (
    <Image
      src={`/avatars/${id}.png`}
      alt=""
      width={size}
      height={size}
      onError={() => setErr(true)}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function MeetingContext() {
  const idx = MEETINGS.findIndex((m) => m.current) + 1;
  return (
    <div className="rounded-xl p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      <div className="flex items-start gap-2">
        <CalendarClock size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight">{MEETING_META.session}</div>
          <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>
            in {MEETING_META.minutesUntil} min · {idx} of {MEETINGS.length} in the series
          </div>
        </div>
      </div>
    </div>
  );
}

export function NavList({ items }: { items: { label: string; icon: LucideIcon }[] }) {
  return (
    <nav className="-mx-2 space-y-0.5">
      {items.map((n) => {
        const Icon = n.icon;
        return (
          <a
            key={n.label}
            href={`#${slug(n.label)}`}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] hover:bg-[var(--c-surface-alt)]"
            style={{ color: C.muted }}
          >
            <Icon size={15} strokeWidth={2} style={{ color: C.faint }} className="shrink-0" />
            {n.label}
          </a>
        );
      })}
    </nav>
  );
}

export function TheRoom() {
  const { open } = useParticipant();
  return (
    <div>
      <RailLabel>The room</RailLabel>
      <ul className="space-y-0.5">
        {ENTITIES.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => open(e.id)}
              className="flex items-center gap-2.5 w-full text-left -mx-2 px-2 py-1.5 rounded-lg hover:bg-[var(--c-surface-alt)] cursor-pointer"
            >
              <Avatar id={e.id} name={e.name} size={26} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[13px]">{e.id}</span>
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: statusColor[e.status] }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[e.status] }} />
                    {statusLabel[e.status]}
                  </span>
                </div>
                <div className="text-[11px] truncate" style={{ color: C.muted }}>{e.name}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
