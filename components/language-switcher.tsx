"use client";

import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/lang-context";
import { C } from "@/components/ui";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="inline-flex items-stretch rounded-full p-0.5 h-[26px]" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }} title={t("language")}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-label={l.label}
          title={l.label}
          className="inline-flex items-center justify-center rounded-full px-2.5 text-[11px] font-semibold cursor-pointer transition-colors min-w-[30px]"
          style={lang === l.code ? { background: C.accent, color: C.onAccent } : { background: "transparent", color: C.muted }}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
