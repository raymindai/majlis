"use client";

import { CalendarRange, CircleAlert, CircleCheck, CircleDashed, Mail, MapPin, MessageSquareQuote, Phone, X } from "lucide-react";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { askMajlis } from "@/components/ask-bus";
import { Avatar, deptFor, OrgBadge, StatusTag } from "@/components/rail";
import { C } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const pledgeIcon = { kept: CircleCheck, missed: CircleAlert, open: CircleDashed } as const;
const pledgeColor: Record<string, string> = { kept: C.confirmed, missed: C.unverified, open: C.muted };
const pledgeLabel: Record<string, string> = { kept: "Kept", missed: "Missed", open: "Open" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-6 mb-2" style={{ color: C.faint }}>{children}</div>;
}

/** Full participant profile — opened from "the room", a participant card, or distribution. */
export default function ParticipantDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const p = id ? PARTICIPANTS.find((x) => x.id === id) : null;
  if (!p) return null;
  const dept = deptFor(p.entity);
  const restricted = dept?.status === "restricted";
  const first = p.name.split(" ")[0];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-dvh w-full max-w-md p-6 overflow-y-auto shadow-2xl z-50" style={{ background: C.surface, color: C.ink }}>
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-semibold" style={{ color: C.faint }}>Participant</span>
          <button type="button" onClick={onClose} className="cursor-pointer hover:opacity-70" style={{ color: C.muted }} aria-label="Close">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* identity */}
        <div className="flex items-center gap-3.5">
          <Avatar id={p.id} name={p.name} size={60} />
          <div className="min-w-0">
            <div style={serif} className="text-[22px] leading-tight">{p.name}</div>
            <div className="text-[13px] mt-0.5" style={{ color: C.muted }}>{p.role}</div>
          </div>
        </div>

        {/* Represents — the department (status + situation live here, not on the person) */}
        <div className="mt-4 rounded-xl p-3.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
          <div className="text-[11px] mb-2" style={{ color: C.faint }}>Represents</div>
          <div className="flex items-start gap-2.5">
            <OrgBadge code={p.entity} size={32} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[13px]">{dept?.name ?? p.entity}</div>
              {dept && <StatusTag status={dept.status} className="mt-0.5" />}
            </div>
          </div>
          <div className="text-[12px] mt-2.5" style={{ color: C.detail }}>Owns {p.owns}</div>
          {dept?.headline && <div className="text-[12px] mt-1 leading-snug" style={{ color: C.muted }}>{dept.headline}</div>}
          <div className="text-[12px] mt-1.5 leading-snug" style={{ color: C.muted }}>{p.reportsVia}</div>
        </div>

        {/* contact */}
        <Lbl>Contact</Lbl>
        <div className="space-y-2 text-[13px]">
          {[{ icon: Mail, v: p.email }, { icon: Phone, v: p.phone }, { icon: MapPin, v: p.location }].map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <Icon size={14} strokeWidth={2} style={{ color: C.faint }} className="shrink-0" />
                <span style={{ color: restricted ? C.faint : C.detail }}>{r.v}</span>
              </div>
            );
          })}
        </div>

        {/* engagement in the series */}
        <Lbl>Engagement in this programme</Lbl>
        <p className="text-[13px] leading-snug" style={{ color: C.detail }}>{p.history}</p>
        <ul className="mt-2.5 space-y-1.5">
          {p.attended.map((mid) => {
            const m = MEETINGS.find((x) => x.id === mid);
            if (!m) return null;
            return (
              <li key={mid} className="flex items-center gap-2.5 text-[12px]">
                <CalendarRange size={13} strokeWidth={2} style={{ color: m.current ? C.accent : C.faint }} className="shrink-0" />
                <span style={{ color: m.current ? C.accent : C.muted, fontWeight: m.current ? 600 : 400 }}>{m.title}</span>
                {m.current && <span className="text-[11px]" style={{ color: C.accent }}>· today</span>}
              </li>
            );
          })}
        </ul>

        {/* track record */}
        <Lbl>Track record</Lbl>
        <ul className="space-y-2.5">
          {p.pledges.map((pl, i) => {
            const Icon = pledgeIcon[pl.status];
            return (
              <li key={i} className="flex items-start gap-2.5">
                <Icon size={15} strokeWidth={2} style={{ color: pledgeColor[pl.status], marginTop: 1 }} className="shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13px] leading-snug">{pl.text}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{pledgeLabel[pl.status]} · {pl.due}</div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* the one thing to ask them */}
        {p.ask && (
          <button
            type="button"
            onClick={() => { askMajlis(`On ${p.entity}: ${p.ask}`); onClose(); }}
            className="mt-7 w-full flex items-start gap-2 text-left rounded-xl p-3.5 cursor-pointer hover:opacity-90"
            style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
          >
            <MessageSquareQuote size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
            <span className="text-[13px] leading-snug">
              <span className="font-semibold" style={{ color: C.accent }}>Ask {first} this →</span>{" "}
              <span style={{ color: C.detail }}>{p.ask}</span>
            </span>
          </button>
        )}
      </aside>
    </>
  );
}
