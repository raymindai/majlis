"use client";

import { useEffect, useState } from "react";
import { C } from "@/components/ui";

const THEMES = [
  { key: "", label: "Institutional" },
  { key: "dossier", label: "Dossier" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("majlis-theme") || "";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function pick(t: string) {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    window.localStorage.setItem("majlis-theme", t);
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 flex items-center gap-1 rounded-full p-1 shadow-lg"
      style={{ background: C.surface, border: `1px solid ${C.line}` }}
    >
      <span className="text-[10px] uppercase px-2" style={{ color: C.faint, letterSpacing: "0.08em" }}>
        Skin
      </span>
      {THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => pick(t.key)}
          className="text-[12px] rounded-full px-2.5 py-1 cursor-pointer transition-colors"
          style={theme === t.key ? { background: C.accent, color: "#fff" } : { background: "transparent", color: C.muted }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
