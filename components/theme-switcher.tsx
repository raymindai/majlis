"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { C } from "@/components/ui";
import { useLang } from "@/components/lang-context";

const THEMES = [
  { key: "", labelKey: "light", icon: Sun },
  { key: "dark", labelKey: "dark", icon: Moon },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("");
  const { t: tr } = useLang();

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
      {THEMES.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => pick(t.key)}
            title={tr(t.labelKey)}
            aria-label={tr(t.labelKey)}
            className="rounded-full p-1.5 cursor-pointer transition-colors"
            style={theme === t.key ? { background: C.accent, color: C.onAccent } : { background: "transparent", color: C.muted }}
          >
            <Icon size={14} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
