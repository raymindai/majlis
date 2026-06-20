"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

let SEQ = 0;

/**
 * Click-to-reveal tooltip: hovering only shows the help cursor; clicking toggles a
 * portal-rendered tooltip (never clipped). Only one is open at a time; it closes on
 * an outside click, scroll, or Escape. The position is measured and clamped to the
 * viewport so it never runs off an edge, flipping below the anchor when there is no
 * room above. Used for acronyms and for chip/pill meanings.
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
  const [anchor, setAnchor] = useState<{ cx: number; top: number; bottom: number } | null>(null);
  const [box, setBox] = useState<{ left: number; top: number } | null>(null);
  const idRef = useRef(0);
  const tipRef = useRef<HTMLSpanElement>(null);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (anchor) {
      setAnchor(null);
      return;
    }
    idRef.current = ++SEQ;
    window.dispatchEvent(new CustomEvent("majlis-tip", { detail: idRef.current }));
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBox(null);
    setAnchor({ cx: r.left + r.width / 2, top: r.top, bottom: r.bottom });
  };

  // Measure the rendered tooltip and clamp it inside the viewport before paint.
  useLayoutEffect(() => {
    if (!anchor || !tipRef.current) return;
    const m = 8;
    const w = tipRef.current.offsetWidth;
    const h = tipRef.current.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(m, Math.min(anchor.cx - w / 2, vw - w - m));
    let top = anchor.top - 8 - h;
    if (top < m) top = anchor.bottom + 8; // not enough room above: flip below
    top = Math.max(m, Math.min(top, vh - h - m));
    setBox({ left, top });
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return;
    const close = () => setAnchor(null);
    const onOther = (e: Event) => { if ((e as CustomEvent).detail !== idRef.current) setAnchor(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAnchor(null); };
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    window.addEventListener("majlis-tip", onOther);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("majlis-tip", onOther);
    };
  }, [anchor]);

  const Tag = as;
  return (
    <Tag onClick={toggle} className={className} style={style}>
      {children}
      {anchor &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            ref={tipRef}
            style={{
              position: "fixed",
              left: box ? box.left : -9999,
              top: box ? box.top : -9999,
              visibility: box ? "visible" : "hidden",
              background: "var(--c-ink)",
              color: "var(--c-bg)",
              fontSize: "12px",
              lineHeight: 1.35,
              padding: "6px 10px",
              borderRadius: "7px",
              maxWidth: "240px",
              width: "max-content",
              zIndex: 99999,
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
