"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Lang, t as translate } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<Ctx>({ lang: "en", dir: "ltr", setLang: () => {}, t: (k) => k });

function apply(l: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("majlis-lang");
    const l: Lang = saved === "ar" ? "ar" : "en";
    setLangState(l);
    apply(l);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("majlis-lang", l);
    apply(l);
  }

  const dir = lang === "ar" ? "rtl" : "ltr";
  const tt = (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars);

  return <LangContext.Provider value={{ lang, dir, setLang, t: tt }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
