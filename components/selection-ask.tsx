"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { C } from "@/components/ui";
import { askMajlis } from "@/components/ask-bus";
import { useLang } from "@/components/lang-context";

type Menu = { x: number; y: number; text: string };

export default function SelectionAsk() {
  const { t: tr } = useLang();
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      const sel = window.getSelection?.()?.toString().trim() ?? "";
      if (sel.length > 1) {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY, text: sel });
      } else {
        setMenu(null);
      }
    }
    const dismiss = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("click", dismiss);
    document.addEventListener("scroll", dismiss, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("click", dismiss);
      document.removeEventListener("scroll", dismiss, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!menu) return null;

  const truncated = menu.text.length > 64 ? menu.text.slice(0, 64) + "…" : menu.text;
  const left = Math.min(menu.x, window.innerWidth - 280);
  const top = Math.min(menu.y + 4, window.innerHeight - 90);

  return (
    <div
      className="fixed z-[60] rounded-xl overflow-hidden"
      style={{ left, top, width: 264, background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          askMajlis(`What should I know about "${menu.text}"?`);
          setMenu(null);
          window.getSelection?.()?.removeAllRanges();
        }}
        className="w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:opacity-80 cursor-pointer"
        style={{ color: C.ink }}
      >
        <MessageSquareQuote size={16} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
        <span className="min-w-0">
          <span className="text-[13px] font-medium block">{tr("askAboutThis")}</span>
          <span className="text-[12px] italic block truncate mt-0.5" style={{ color: C.muted }}>&ldquo;{truncated}&rdquo;</span>
        </span>
      </button>
    </div>
  );
}
