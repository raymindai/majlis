"use client";

import { Fragment, type ReactNode } from "react";
import { Tip } from "@/components/tip";
import { C } from "@/components/ui";

/** Acronyms used across the product. Hovering any of them reveals the full term. */
export const GLOSSARY: Record<string, string> = {
  EDD: "Economic Development Department",
  EKD: "Education & Knowledge Department",
  MTA: "Municipalities & Transport Authority",
  HSA: "Health Services Authority",
  PSD: "Public Security Directorate",
  SSO: "Single Sign-On",
  DGE: "Department of Government Enablement",
  DG: "Director-General",
  PMO: "Project Management Office",
  AED: "UAE Dirham",
  AOB: "Any Other Business",
  CIO: "Chief Information Officer",
};

// Longest keys first so e.g. "DGE" wins over "DG".
const KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const RE = new RegExp(`\\b(${KEYS.join("|")})\\b`, "g");

const abbrStyle: React.CSSProperties = {
  textDecoration: "underline dotted",
  textDecorationColor: C.faint,
  textUnderlineOffset: "2px",
  cursor: "help",
};

/** Wraps known acronyms in `children` (a string) with a hover tooltip showing the full term. */
export function Gloss({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(children)) !== null) {
    if (m.index > last) out.push(children.slice(last, m.index));
    const term = m[0];
    out.push(
      <Tip key={m.index} as="abbr" content={GLOSSARY[term]} style={abbrStyle}>
        {term}
      </Tip>,
    );
    last = m.index + term.length;
  }
  if (last < children.length) out.push(children.slice(last));
  return <>{out.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}
