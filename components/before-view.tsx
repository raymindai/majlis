"use client";

import { useEffect, useState } from "react";
import { ATTENTION, BOTTOM_LINE, DECISION, MEETING_META, STEADY } from "@/lib/mock";
import { loadState, type Commitment } from "@/lib/store";
import { C, CitationChip, ConfidenceBadge, Section, severityColor, severityGlyph } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const PREP = [
  "Reconcile MTA's budget figure (40 vs 52) before the reallocation vote.",
  "Get a firm SSO recovery date from EDD — it gates HSA and EKD.",
  "Note EKD missed its June commitment; the July 'catch-up' is unverified.",
];

const LIKELY_QS = [
  { q: "Why defer the reallocation?", line: "MTA's figure doesn't reconcile yet — we vote once it does." },
  { q: "Is the SSO slip contained?", line: "No — it blocks HSA and EKD go-lives; EDD owes a recovery date." },
  { q: "Is EKD on track?", line: "It missed the June portal commitment; an informal July catch-up is unverified." },
];

const NAV = ["The bottom line", "Your decision", "Needs attention", "Prep checklist", "Likely questions"];

export default function BeforeView() {
  const { open } = useCitation();
  const [prior, setPrior] = useState<Commitment[]>([]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const sync = () => {
      const s = loadState();
      setPrior(s.writtenToMemory ? s.commitments : []);
    };
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const leftRail = (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.12em" }}>Sections</div>
        <nav className="space-y-1 text-[13px]">
          {NAV.map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="block hover:underline" style={{ color: C.muted }}>
              {s}
            </a>
          ))}
        </nav>
      </div>
      <div>
        <div className="text-[10px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.12em" }}>Roster</div>
        <ul className="space-y-1.5 text-[13px]">
          {ATTENTION.map((a) => (
            <li key={a.id} className="flex items-center gap-2">
              <span style={{ color: severityColor[a.severity] }} aria-hidden>{severityGlyph[a.severity]}</span>
              <span className="font-semibold">{a.id}</span>
            </li>
          ))}
          {STEADY.map((s) => (
            <li key={s.id} className="flex items-center gap-2" style={{ color: C.muted }}>
              <span aria-hidden>·</span>
              <span className="font-semibold">{s.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const meta = (
    <>
      <div style={{ color: C.ink }} className="font-medium">{MEETING_META.session}</div>
      <div>Manarah · in {MEETING_META.minutesUntil} min</div>
    </>
  );

  return (
    <AppShell stage="before" meta={meta} leftRail={leftRail}>
      {prior.length > 0 && (
        <section className="rounded-xl p-4" style={{ background: C.priorBg, border: `1px solid ${C.priorBorder}` }}>
          <div className="text-[11px] uppercase mb-2" style={{ color: C.priorInk, letterSpacing: "0.1em" }}>
            Carried over from last meeting — verify these were kept
          </div>
          <ul className="space-y-1.5">
            {prior.map((c) => (
              <li key={c.id} className="text-[13px] flex items-baseline gap-2">
                <span className="font-semibold">{c.entity}</span>
                <span>{c.text}</span>
                <span className="ml-auto whitespace-nowrap" style={{ color: C.muted }}>was due {c.due}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Section label="The bottom line">
        <h1 style={serif} className="text-[26px] leading-snug">{BOTTOM_LINE.lead}</h1>
        <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.detail }}>{BOTTOM_LINE.detail}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={BOTTOM_LINE.confidence} />
          {BOTTOM_LINE.citations.map((c, i) => (
            <CitationChip key={i} sourceId={c.sourceId} onClick={() => open(c)} />
          ))}
          <span
            className="inline-flex items-center gap-1.5 text-[11px] rounded px-2 py-0.5"
            style={{ background: C.flagBg, color: C.unverified, border: `1px solid ${C.flagBorder}` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.unverified }} />
            {BOTTOM_LINE.conflict.label}
            {BOTTOM_LINE.conflict.citations.map((c, i) => (
              <button key={i} type="button" onClick={() => open(c)} className="underline decoration-dotted underline-offset-2 cursor-pointer">
                {c.sourceId}
              </button>
            ))}
          </span>
        </div>
      </Section>

      <Section label="Your decision">
        <div style={serif} className="text-[19px]">{DECISION.text}</div>
        <div className="mt-2 text-[13px]" style={{ color: C.muted }}>Hinges on → {DECISION.hingesOn.join(" · ")}</div>
      </Section>

      <Section label="Needs attention" aside={<span className="text-[12px]" style={{ color: C.muted }}>{ATTENTION.length} of 5</span>}>
        <ul className="space-y-2.5">
          {ATTENTION.map((a) => (
            <li key={a.id} className="rounded-lg p-4 flex gap-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
              <span className="text-[13px] mt-0.5 shrink-0" style={{ color: severityColor[a.severity] }} aria-hidden>
                {severityGlyph[a.severity]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[14px]">{a.id}</span>
                  <span className="text-[13px] truncate" style={{ color: C.muted }}>{a.name}</span>
                </div>
                <p className="text-[14px] leading-snug mt-1">{a.line}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <ConfidenceBadge confidence={a.confidence} />
                  {a.citations.map((c, i) => (
                    <CitationChip key={i} sourceId={c.sourceId} onClick={() => open(c)} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-[12px]" style={{ color: C.muted }}>▸ {STEADY.map((s) => `${s.id} — ${s.line}`).join("  ·  ")}</div>
      </Section>

      <Section label="Prep checklist">
        <ul className="space-y-2">
          {PREP.map((p, i) => (
            <li key={i}>
              <button type="button" onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} className="flex items-start gap-2.5 text-left cursor-pointer w-full">
                <span
                  className="mt-0.5 h-4 w-4 rounded shrink-0 flex items-center justify-center text-[11px]"
                  style={{ border: `1.5px solid ${checked[i] ? C.confirmed : C.line}`, background: checked[i] ? C.confirmed : "transparent", color: C.onAccent }}
                >
                  {checked[i] ? "✓" : ""}
                </span>
                <span className="text-[14px]" style={{ color: checked[i] ? C.muted : C.ink, textDecoration: checked[i] ? "line-through" : "none" }}>
                  {p}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Likely questions">
        <ul className="space-y-3">
          {LIKELY_QS.map((x, i) => (
            <li key={i}>
              <div className="text-[14px] font-medium">{x.q}</div>
              <div className="text-[13px] mt-0.5" style={{ color: C.muted }}>Your line → {x.line}</div>
            </li>
          ))}
        </ul>
      </Section>
    </AppShell>
  );
}
