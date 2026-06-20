"use client";

import Image from "next/image";
import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import { ENTITIES } from "@/lib/corpus";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { MEETING_META } from "@/lib/mock";
import { C, RailLabel } from "@/components/ui";
import { useParticipant } from "@/components/participant-context";
import { useDetail } from "@/components/detail-context";
import { Tip } from "@/components/tip";
import { Gloss } from "@/components/gloss";

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const statusColor: Record<string, string> = { "on-track": C.confirmed, "at-risk": C.likely, slipped: C.unverified, restricted: C.faint };
export const statusLabel: Record<string, string> = { "on-track": "On track", "at-risk": "At risk", slipped: "Slipped", restricted: "Restricted" };

/** The single source of truth for a department's name + delivery status. */
export const deptFor = (code: string) => ENTITIES.find((e) => e.id === code);

export function initials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
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

const statusDef: Record<string, string> = {
  "on-track": "Delivering to plan.",
  "at-risk": "May miss its commitment; watch closely.",
  slipped: "Has missed its committed date.",
  restricted: "Status withheld from the shared pack.",
};

/** A status dot + label, always a DEPARTMENT's delivery status, never a person's. Hover for its meaning. */
export function StatusTag({ status, className = "" }: { status: string; className?: string }) {
  return (
    <Tip as="span" content={statusDef[status] ?? statusLabel[status]} className={`inline-flex items-center gap-1 text-[11px] ${className}`} style={{ color: statusColor[status], cursor: "help" }}>
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: statusColor[status] }} />
      {statusLabel[status]}
    </Tip>
  );
}

/** Rounded-square code badge, represents a DEPARTMENT (status-tinted). Never used for a person. */
export function OrgBadge({ code, size = 28 }: { code: string; size?: number }) {
  const dept = deptFor(code);
  const color = dept ? statusColor[dept.status] : C.muted;
  return (
    <Tip
      as="span"
      content={dept?.name ?? code}
      className="inline-flex items-center justify-center rounded-md font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.3)), background: `color-mix(in srgb, ${color} 14%, transparent)`, color, letterSpacing: "-0.02em", cursor: "help" }}
    >
      {code}
    </Tip>
  );
}

/** Department row, square badge + full name + status. Use wherever a department is the subject. */
export function OrgRow({ code, size = 28 }: { code: string; size?: number }) {
  const dept = deptFor(code);
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <OrgBadge code={code} size={size} />
      <div className="min-w-0">
        <div className="font-semibold text-[13px] truncate">{dept?.name ?? code}</div>
        {dept && <StatusTag status={dept.status} />}
      </div>
    </div>
  );
}

/** Person row, circular face + name + sub-line. Use wherever a person is the subject. */
export function PersonRow({ id, size = 28, sub }: { id: string; size?: number; sub?: string }) {
  const p = PARTICIPANTS.find((x) => x.id === id);
  if (!p) return null;
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Avatar id={p.id} name={p.name} size={size} />
      <div className="min-w-0">
        <div className="font-semibold text-[13px] truncate">{p.name}</div>
        <div className="text-[11px] truncate" style={{ color: C.muted }}>{sub ?? p.role}</div>
      </div>
    </div>
  );
}

export function MeetingContext() {
  const idx = MEETINGS.findIndex((m) => m.current) + 1;
  // The header carries the session, room, and time. Here the rail frames the wider
  // programme the session sits inside, so the two complement rather than repeat.
  return (
    <div className="rounded-xl p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.accent }}>Programme</div>
      <div className="text-[13px] font-semibold leading-tight mt-1">{MEETING_META.programme}</div>
      <div className="text-[11px] mt-0.5 leading-snug" style={{ color: C.muted }}>{MEETING_META.subtitle}</div>
      <div className="mt-2 pt-2 border-t text-[11px] space-y-0.5" style={{ borderColor: C.line, color: C.faint }}>
        <div>Session {idx} of {MEETINGS.length} in the series</div>
        <div>{ENTITIES.length} entities, AED {Math.round(MEETING_META.totalBudgetAED / 1e6)}M programme</div>
      </div>
    </div>
  );
}

export function NavList({ items }: { items: { label: string; icon: LucideIcon; min?: number }[] }) {
  // The table of contents tracks the zoom: only list sections visible at this level.
  const { level } = useDetail();
  const shown = items.filter((n) => !n.min || level >= n.min);
  return (
    <nav className="-mx-2 space-y-0.5">
      {shown.map((n) => {
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
  const { level } = useDetail();
  // The room is reference detail; at the Headlines zoom the rail stays minimal.
  if (level < 2) return null;
  return (
    <div>
      <RailLabel>The room</RailLabel>
      <ul className="space-y-0.5">
        {PARTICIPANTS.map((p) => {
          const dept = deptFor(p.entity);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={(e) => open(p.id, { x: e.clientX, y: e.clientY })}
                className="flex items-center gap-2.5 w-full text-left -mx-2 px-2 py-1.5 rounded-lg hover:bg-[var(--c-surface-alt)] cursor-pointer"
              >
                <Avatar id={p.id} name={p.name} size={28} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{p.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] min-w-0">
                    <span style={{ color: C.faint }}><Gloss>{p.entity}</Gloss></span>
                    {dept && <StatusTag status={dept.status} />}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
