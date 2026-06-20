"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * A reliable hover tooltip: rendered to a portal at a fixed position, so it shows
 * instantly and is never clipped by an overflow-hidden parent. Used for acronyms
 * and for the augmented meaning behind chips and pills.
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
  const show = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top });
  };
  const Tag = as;
  return (
    <Tag onMouseEnter={show} onMouseLeave={() => setPos(null)} className={className} style={style}>
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
              padding: "5px 9px",
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
