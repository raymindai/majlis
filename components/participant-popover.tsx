"use client";

import { CircleAlert, CircleCheck, CircleDashed, Mail, MapPin, MessageSquareQuote, Phone } from "lucide-react";
import { PARTICIPANTS } from "@/lib/meetings";
import { askMajlis } from "@/components/ask-bus";
import { Avatar, deptFor, OrgBadge, StatusTag } from "@/components/rail";
import { C } from "@/components/ui";
import { FloatingWindow } from "@/components/floating-window";
import { Gloss } from "@/components/gloss";
import type { ParticipantPos } from "@/components/participant-context";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const pledgeIcon = { kept: CircleCheck, missed: CircleAlert, open: CircleDashed } as const;
const pledgeColor: Record<string, string> = { kept: C.confirmed, missed: C.unverified, open: C.muted };
const pledgeLabel: Record<string, string> = { kept: "Kept", missed: "Missed", open: "Open" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2" style={{ color: C.faint }}>{children}</div>;
}

/** Participant profile in a draggable, resizable floating window. */
export default function ParticipantPopover({ id, pos, onClose, raise }: { id: string | null; pos: ParticipantPos | null; onClose: () => void; raise?: number }) {
  const p = id ? PARTICIPANTS.find((x) => x.id === id) : null;
  if (!p || !pos) return null;
  const dept = deptFor(p.entity);
  const restricted = dept?.status === "restricted";
  const first = p.name.split(" ")[0];

  return (
    <FloatingWindow title="Participant" anchor={pos} onClose={onClose} initialW={360} initialH={480} raise={raise}>
      {/* Identity */}
      <div className="flex items-center gap-3">
        <Avatar id={p.id} name={p.name} size={52} />
        <div className="min-w-0">
          <div style={serif} className="text-[19px] leading-tight">{p.name}</div>
          <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>{p.role}</div>
        </div>
      </div>

      {/* Represents */}
      <div className="mt-4 rounded-xl p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
        <div className="text-[11px] mb-2" style={{ color: C.faint }}>Represents</div>
        <div className="flex items-start gap-2.5">
          <OrgBadge code={p.entity} size={30} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[13px]">{dept?.name ?? p.entity}</div>
            {dept && <StatusTag status={dept.status} className="mt-0.5" />}
          </div>
        </div>
        <div className="text-[12px] mt-2.5" style={{ color: C.detail }}>Owns {p.owns}</div>
        {dept?.headline && <div className="text-[12px] mt-1 leading-snug" style={{ color: C.muted }}><Gloss>{dept.headline}</Gloss></div>}
      </div>

      {/* Contact */}
      <Lbl>Contact</Lbl>
      <div className="space-y-1.5 text-[13px]">
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

      {/* Track record */}
      <Lbl>Track record</Lbl>
      <ul className="space-y-2">
        {p.pledges.map((pl, i) => {
          const Icon = pledgeIcon[pl.status];
          return (
            <li key={i} className="flex items-start gap-2.5">
              <Icon size={15} strokeWidth={2} style={{ color: pledgeColor[pl.status], marginTop: 1 }} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-[13px] leading-snug"><Gloss>{pl.text}</Gloss></div>
                <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{pledgeLabel[pl.status]}, {pl.due}</div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Context */}
      <Lbl>In this programme</Lbl>
      <p className="text-[12px] leading-snug" style={{ color: C.detail }}><Gloss>{p.history}</Gloss></p>

      {/* The one thing to ask */}
      {p.ask && (
        <button
          type="button"
          onClick={() => { askMajlis(`On ${p.entity}: ${p.ask}`); onClose(); }}
          className="mt-5 w-full flex items-start gap-2 text-left rounded-xl p-3 cursor-pointer hover:opacity-90"
          style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
        >
          <MessageSquareQuote size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
          <span className="text-[12px] leading-snug">
            <span className="font-semibold" style={{ color: C.accent }}>Ask {first}:</span>{" "}
            <span style={{ color: C.detail }}><Gloss>{p.ask}</Gloss></span>
          </span>
        </button>
      )}
    </FloatingWindow>
  );
}
