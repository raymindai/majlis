"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck, CircleDashed, GripHorizontal, Mail, MapPin, MessageSquareQuote, Phone, X } from "lucide-react";
import { PARTICIPANTS } from "@/lib/meetings";
import { askMajlis } from "@/components/ask-bus";
import { Avatar, deptFor, OrgBadge, StatusTag } from "@/components/rail";
import { C } from "@/components/ui";
import type { ParticipantPos } from "@/components/participant-context";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const pledgeIcon = { kept: CircleCheck, missed: CircleAlert, open: CircleDashed } as const;
const pledgeColor: Record<string, string> = { kept: C.confirmed, missed: C.unverified, open: C.muted };
const pledgeLabel: Record<string, string> = { kept: "Kept", missed: "Missed", open: "Open" };

function Lbl({ children }: { children: string }) {
  return <div className="text-[11px] font-semibold mt-5 mb-2" style={{ color: C.faint }}>{children}</div>;
}

/**
 * Participant profile as a floating window: opens near the click, draggable by its
 * header, resizable from the corner, and persistent (closes only on X or Escape).
 */
export default function ParticipantPopover({ id, pos, onClose }: { id: string | null; pos: ParticipantPos | null; onClose: () => void }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // Place the window near the click when a new participant opens.
  useEffect(() => {
    if (!id || !pos) { setBox(null); return; }
    const W = 360;
    const vw = window.innerWidth, vh = window.innerHeight;
    setBox({
      left: Math.min(Math.max(12, pos.x), Math.max(12, vw - W - 12)),
      top: Math.min(Math.max(12, pos.y), Math.max(12, vh - 360)),
    });
  }, [id, pos]);

  // Reset to the default size on each open (size is then user-controlled via CSS resize,
  // and not part of the React style, so dragging never resets it).
  useEffect(() => {
    const n = nodeRef.current;
    if (n) { n.style.width = "360px"; n.style.height = "480px"; }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, onClose]);

  const p = id ? PARTICIPANTS.find((x) => x.id === id) : null;
  if (!p || !box) return null;
  const dept = deptFor(p.entity);
  const restricted = dept?.status === "restricted";
  const first = p.name.split(" ")[0];

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    drag.current = { dx: e.clientX - box.left, dy: e.clientY - box.top };
    const move = (ev: MouseEvent) => {
      if (!drag.current) return;
      setBox({
        left: Math.min(Math.max(0, ev.clientX - drag.current.dx), window.innerWidth - 60),
        top: Math.min(Math.max(0, ev.clientY - drag.current.dy), window.innerHeight - 40),
      });
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      ref={nodeRef}
      className="fixed z-50 rounded-2xl shadow-2xl flex flex-col"
      style={{
        top: box.top,
        left: box.left,
        minWidth: 280,
        minHeight: 240,
        maxWidth: "92vw",
        maxHeight: "88vh",
        resize: "both",
        overflow: "hidden",
        background: C.surface,
        color: C.ink,
        border: `1px solid ${C.line}`,
      }}
      role="dialog"
    >
      {/* Drag handle */}
      <div onMouseDown={startDrag} className="flex items-center gap-2 px-3 h-9 border-b cursor-move select-none shrink-0" style={{ borderColor: C.line }}>
        <GripHorizontal size={14} style={{ color: C.faint }} />
        <span className="text-[11px] font-semibold" style={{ color: C.faint }}>Participant</span>
        <button type="button" onClick={onClose} className="ml-auto cursor-pointer hover:opacity-70" style={{ color: C.muted }} aria-label="Close">
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 p-5">
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
          {dept?.headline && <div className="text-[12px] mt-1 leading-snug" style={{ color: C.muted }}>{dept.headline}</div>}
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
                  <div className="text-[13px] leading-snug">{pl.text}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{pledgeLabel[pl.status]}, {pl.due}</div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Context */}
        <Lbl>In this programme</Lbl>
        <p className="text-[12px] leading-snug" style={{ color: C.detail }}>{p.history}</p>

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
              <span style={{ color: C.detail }}>{p.ask}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
