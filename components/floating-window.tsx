"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GripHorizontal, X } from "lucide-react";
import { C } from "@/components/ui";

export type WinPos = { x: number; y: number };

/**
 * A floating window: opens near an anchor point, draggable by its header,
 * resizable from the corner (CSS resize), persistent (closes on X / Escape).
 * Shared by the participant profile, the source viewer, and saved notes, so the
 * right sidebar stays reserved for the chat.
 */
export function FloatingWindow({
  title,
  anchor,
  onClose,
  children,
  initialW = 360,
  initialH = 460,
  headerRight,
  onMove,
}: {
  title: string;
  anchor: WinPos;
  onClose: () => void;
  children: ReactNode;
  initialW?: number;
  initialH?: number;
  headerRight?: ReactNode;
  onMove?: (pos: WinPos) => void;
}) {
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    setBox({
      left: Math.min(Math.max(12, anchor.x), Math.max(12, vw - initialW - 12)),
      top: Math.min(Math.max(12, anchor.y), Math.max(12, vh - initialH - 12)),
    });
  }, [anchor.x, anchor.y, initialW, initialH]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Set the initial size once, on mount. Kept out of React's style so dragging
  // (which re-renders) never resets a size the user has dragged.
  const setNode = useCallback((n: HTMLDivElement | null) => {
    if (n) { n.style.width = `${initialW}px`; n.style.height = `${initialH}px`; }
  }, [initialW, initialH]);

  const startDrag = (e: React.MouseEvent) => {
    if (!box) return;
    e.preventDefault();
    drag.current = { dx: e.clientX - box.left, dy: e.clientY - box.top };
    let last = { left: box.left, top: box.top };
    const move = (ev: MouseEvent) => {
      if (!drag.current) return;
      last = {
        left: Math.min(Math.max(0, ev.clientX - drag.current.dx), window.innerWidth - 60),
        top: Math.min(Math.max(0, ev.clientY - drag.current.dy), window.innerHeight - 40),
      };
      setBox(last);
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      onMove?.({ x: last.left, y: last.top });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!box) return null;

  return (
    <div
      ref={setNode}
      className="fixed z-50 rounded-2xl shadow-2xl flex flex-col"
      style={{
        top: box.top,
        left: box.left,
        minWidth: 280,
        minHeight: 200,
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
      <div onMouseDown={startDrag} className="flex items-center gap-2 px-3 h-9 border-b cursor-move select-none shrink-0" style={{ borderColor: C.line }}>
        <GripHorizontal size={14} style={{ color: C.faint }} />
        <span className="text-[11px] font-semibold" style={{ color: C.faint }}>{title}</span>
        {headerRight}
        <button type="button" onClick={onClose} className="ml-auto cursor-pointer hover:opacity-70" style={{ color: C.muted }} aria-label="Close">
          <X size={15} strokeWidth={2} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-5">{children}</div>
    </div>
  );
}
