"use client";

import { useEffect, useState } from "react";
import { C } from "@/components/ui";

const THEMES = [
  { key: "", label: "Light" },
  { key: "dark", label: "Dark" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("majlis-theme") === "dark" ? "dark" : "";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function pick(t: string) {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    window.localStorage.setItem("majlis-theme", t);
  }

  return (
    <div className="flex items-center rounded-full p-0.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
      {THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => pick(t.key)}
          className="text-[11px] rounded-full px-2.5 py-1 cursor-pointer transition-colors"
          style={theme === t.key ? { background: C.accent, color: C.onAccent } : { background: "transparent", color: C.muted }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
