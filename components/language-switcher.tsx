"use client";

import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/lang-context";
import { C } from "@/components/ui";

/** Language toggle, styled as the same raised-pill segmented control as the detail control. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg p-0.5 h-[26px]" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }} title={t("language")}>
      {LANGS.map((l) => {
        const on = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-label={l.label}
            title={l.label}
            className="inline-flex items-center justify-center rounded-md px-2.5 text-[11px] font-semibold cursor-pointer transition-colors min-w-[28px]"
            style={on ? { background: C.accent, color: C.onAccent } : { color: C.muted }}
          >
            {l.native}
          </button>
        );
      })}
    </div>
  );
}
