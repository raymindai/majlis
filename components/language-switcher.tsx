"use client";

import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/lang-context";
import { C } from "@/components/ui";

/** Language toggle, styled as the same raised-pill segmented control as the detail control. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="inline-flex items-center gap-0.5 rounded-[10px] p-1 h-[30px]" style={{ background: C.chipBg }} title={t("language")}>
      {LANGS.map((l) => {
        const on = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-label={l.label}
            title={l.label}
            className="inline-flex items-center justify-center h-full rounded-md px-2.5 text-[11.5px] font-semibold cursor-pointer transition-all min-w-[30px]"
            style={on ? { background: C.surface, color: C.ink, boxShadow: "0 1px 2px rgba(64,48,24,0.10), 0 1px 1px rgba(64,48,24,0.06)" } : { color: C.muted }}
          >
            {l.native}
          </button>
        );
      })}
    </div>
  );
}
