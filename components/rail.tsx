"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Layers, Users, type LucideIcon } from "lucide-react";
import { openAboutProgramme } from "@/components/programme-bus";
import { ENTITIES, deptNameI18n, meetingFieldI18n } from "@/lib/corpus";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { MEETING_META } from "@/lib/mock";
import { C, TierTag } from "@/components/ui";
import { useParticipant } from "@/components/participant-context";
import { useDetail } from "@/components/detail-context";
import { useLang } from "@/components/lang-context";
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

/** Resolve a loose label (e.g. "MTA delivery" from a live brief) to a clean entity code. */
export function canonicalCode(raw: string): string {
  if (deptFor(raw)) return raw;
  const hit = ENTITIES.find((e) => new RegExp(`\\b${e.id}\\b`, "i").test(raw));
  if (hit) return hit.id;
  return raw.split(/\s+/)[0].slice(0, 4).toUpperCase();
}

/** Rounded-square code badge, represents a DEPARTMENT (status-tinted). Never used for a person. */
export function OrgBadge({ code, size = 28 }: { code: string; size?: number }) {
  const c = canonicalCode(code);
  const dept = deptFor(c);
  const { lang } = useLang();
  const color = dept ? statusColor[dept.status] : C.muted;
  return (
    <Tip
      as="span"
      content={deptNameI18n(c, lang) ?? code}
      className="inline-flex items-center justify-center rounded-md font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.3)), background: `color-mix(in srgb, ${color} 14%, transparent)`, color, letterSpacing: "-0.02em", cursor: "help" }}
    >
      {c}
    </Tip>
  );
}

/** Department row, square badge + full name + status. Use wherever a department is the subject. */
export function OrgRow({ code, size = 28 }: { code: string; size?: number }) {
  const dept = deptFor(code);
  const { lang } = useLang();
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <OrgBadge code={code} size={size} />
      <div className="min-w-0">
        <div className="font-semibold text-[13px] truncate">{deptNameI18n(code, lang) ?? code}</div>
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
  const { t: tr, lang } = useLang();
  // The header carries the session, room, and time. Here the rail frames the wider
  // programme the session sits inside, so the two complement rather than repeat.
  return (
    <div className="rounded-xl p-3 overflow-hidden" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      <div className="-mx-3 -mt-3 mb-2.5 relative h-14 overflow-hidden">
        <Image src="/manarah-beacon.jpg" alt="" fill sizes="260px" className="object-cover" style={{ objectPosition: "center 42%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--c-surface-alt), transparent 68%)" }} />
      </div>
      <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.accent }}>
        <Layers size={11} strokeWidth={2.25} /> {tr("initiativeInFocus")}
      </div>
      <div className="text-[14px] font-semibold leading-tight mt-1">{meetingFieldI18n("programme", lang)}</div>
      <div className="text-[11px] mt-1 leading-snug" style={{ color: C.muted }}>{tr("manarahTagline")}</div>
      <div className="mt-2 pt-2 border-t text-[11px] space-y-0.5" style={{ borderColor: C.line, color: C.faint }}>
        <div>{tr("entitiesScale", { n: ENTITIES.length, b: Math.round(MEETING_META.totalBudgetAED / 1e6) })}</div>
        <div>{tr("sessionOf", { n: idx, m: MEETINGS.length })}</div>
      </div>
      <button type="button" onClick={openAboutProgramme} className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium cursor-pointer hover:opacity-80" style={{ color: C.accent }}>
        {tr("aboutManarah")} <ArrowRight size={12} strokeWidth={2} />
      </button>
    </div>
  );
}

/**
 * One rail section, consistent across the whole sidebar: a left icon, the label,
 * an optional count, and a chevron that collapses the body. Sections default open;
 * secondary lists (the related sessions) pass defaultOpen={false} to stay tucked.
 */
export function RailSection({ icon: Icon, label, count, defaultOpen = true, children }: { icon: LucideIcon; label: string; count?: number; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 text-[11px] font-semibold cursor-pointer hover:opacity-80"
        style={{ color: C.faint }}
      >
        <Icon size={13} strokeWidth={2} className="shrink-0" />
        <span>{label}</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          {count != null && <span style={{ color: C.muted }}>{count}</span>}
          <ChevronDown size={13} strokeWidth={2} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
        </span>
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </div>
  );
}

export function NavList({ items }: { items: { label?: string; key?: string; icon: LucideIcon; min?: number }[] }) {
  // The table of contents tracks the zoom: list only the sections visible at this
  // level, and tier each item so a Headlines, Brief, or Full section reads differently.
  // The anchor is keyed to the stable English key so in-page links keep working in RTL.
  const { level } = useDetail();
  const { t: tr } = useLang();
  const [active, setActive] = useState("");
  const shown = items.filter((n) => !n.min || level >= n.min);
  const anchorKey = shown.map((n) => slug(n.key ?? n.label ?? "")).join(",");

  // Scroll-spy: as the content scrolls, highlight the rail item whose section is
  // nearest the top of the view, so the nav stays tied to where the reader is.
  useEffect(() => {
    const ids = anchorKey.split(",").filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    // A callback only carries the sections whose visibility changed, so keep a
    // running set of everything in view and pick the topmost from the full set.
    // Otherwise a section that was already visible when a neighbour left is skipped.
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const top = els
          .filter((el) => visible.has(el.id))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
        if (top) setActive(top.id);
      },
      { root: els[0].closest("main"), rootMargin: "0px 0px -72% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [anchorKey]);

  return (
    <nav className="-mx-2 space-y-0.5">
      {shown.map((n) => {
        const Icon = n.icon;
        const tier = n.min ?? 1;
        const tone = tier >= 3 ? C.faint : tier === 2 ? C.muted : C.detail;
        const label = n.key ? tr(n.key) : (n.label ?? "");
        const anchor = slug(n.key ?? n.label ?? "");
        const isActive = active === anchor;
        return (
          <a
            key={n.key ?? n.label}
            href={`#${anchor}`}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] hover:bg-[var(--c-surface-alt)]"
            style={{
              color: isActive ? C.ink : tone,
              fontWeight: isActive ? 600 : tier === 1 ? 500 : 400,
              background: isActive ? C.surfaceAlt : "transparent",
              boxShadow: isActive ? `inset 2px 0 0 ${C.accent}` : "none",
            }}
          >
            <Icon size={15} strokeWidth={2} style={{ color: isActive || tier === 1 ? C.accent : C.faint }} className="shrink-0" />
            <span className="flex-1 truncate">{label}</span>
            <TierTag min={n.min} />
          </a>
        );
      })}
    </nav>
  );
}

export function TheRoom() {
  const { open } = useParticipant();
  const { t: tr } = useLang();
  // Participants stay visible at every zoom level; the room is always worth seeing.
  return (
    <RailSection icon={Users} label={tr("participants")} count={PARTICIPANTS.length}>
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
    </RailSection>
  );
}
