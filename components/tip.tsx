"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

let SEQ = 0;

/**
 * Click-to-reveal tooltip: hovering only shows the help cursor; clicking toggles a
 * portal-rendered tooltip (never clipped). Only one is open at a time; it closes on
 * an outside click, scroll, or Escape. Used for acronyms and for chip/pill meanings.
 */
export function Tip({
  content,
  children,
  className,
  style,
  as = "span",
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "abbr";
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pos) {
      setPos(null);
      return;
    }
    idRef.current = ++SEQ;
    window.dispatchEvent(new CustomEvent("majlis-tip", { detail: idRef.current }));
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top });
  };

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onOther = (e: Event) => { if ((e as CustomEvent).detail !== idRef.current) setPos(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPos(null); };
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("majlis-tip", onOther);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("majlis-tip", onOther);
    };
  }, [pos]);

  const Tag = as;
  return (
    <Tag onClick={toggle} className={className} style={style}>
      {children}
      {pos &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y - 8,
              transform: "translate(-50%, -100%)",
              background: "var(--c-ink)",
              color: "var(--c-bg)",
              fontSize: "12px",
              lineHeight: 1.35,
              padding: "6px 10px",
              borderRadius: "7px",
              maxWidth: "240px",
              width: "max-content",
              zIndex: 90,
              pointerEvents: "none",
              boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
              textAlign: "center",
            }}
          >
            {content}
          </span>,
          document.body,
        )}
    </Tag>
  );
}
