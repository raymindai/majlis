"use client";

import { useState } from "react";
import {
  ATTENTION,
  BOTTOM_LINE,
  DECISION,
  MEETING_META,
  resolveCitation,
  SAMPLE_QA,
  STEADY,
  type Citation,
  type MockQA,
} from "@/lib/mock";
import { C, CitationChip, ConfidenceBadge, severityColor, severityGlyph, StageSpine } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

export default function BeforeView() {
  const [openCite, setOpenCite] = useState<Citation | null>(null);
  const [answer, setAnswer] = useState<MockQA | null>(null);
  const [q, setQ] = useState("");

  const drawer = openCite ? resolveCitation(openCite.sourceId, openCite.passageId) : null;

  function ask(question?: string) {
    setAnswer(SAMPLE_QA); // mock for now; live Claude wired next
    setQ(question ?? SAMPLE_QA.question);
  }

  return (
    <div
      className="min-h-dvh"
      style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <header className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span style={serif} className="text-2xl">Majlis</span>
            <StageSpine active="before" />
          </div>
          <div className="text-[12px] text-right" style={{ color: C.muted }}>
            <div style={{ color: C.ink }} className="font-medium">{MEETING_META.session}</div>
            <div>Manarah · in {MEETING_META.minutesUntil} min</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        {/* ① the bottom line */}
        <section>
          <div className="text-[11px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            The bottom line
          </div>
          <h1 style={serif} className="text-[26px] leading-snug">{BOTTOM_LINE.lead}</h1>
          <p className="mt-3 text-[16px] leading-relaxed" style={{ color: "#33404F" }}>{BOTTOM_LINE.detail}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConfidenceBadge confidence={BOTTOM_LINE.confidence} />
            {BOTTOM_LINE.citations.map((c, i) => (
              <CitationChip key={i} sourceId={c.sourceId} onClick={() => setOpenCite(c)} />
            ))}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] rounded px-2 py-0.5"
              style={{ background: "#FBF1EC", color: C.unverified, border: "1px solid #E7C9BE" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.unverified }} />
              {BOTTOM_LINE.conflict.label}
              {BOTTOM_LINE.conflict.citations.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenCite(c)}
                  className="underline decoration-dotted underline-offset-2 cursor-pointer"
                >
                  {c.sourceId}
                </button>
              ))}
            </span>
          </div>
        </section>

        {/* ② your decision */}
        <section className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
          <div className="text-[11px] uppercase mb-1.5" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            Your decision
          </div>
          <div style={serif} className="text-[19px]">{DECISION.text}</div>
          <div className="mt-2 text-[13px]" style={{ color: C.muted }}>
            Hinges on → {DECISION.hingesOn.join(" · ")}
          </div>
        </section>

        {/* ③ needs your attention */}
        <section>
          <div
            className="text-[11px] uppercase mb-3 flex items-baseline gap-2"
            style={{ color: C.faint, letterSpacing: "0.1em" }}
          >
            Needs your attention <span style={{ color: C.muted }}>{ATTENTION.length} of 5</span>
          </div>
          <ul className="space-y-2.5">
            {ATTENTION.map((a) => (
              <li
                key={a.id}
                className="rounded-lg p-4 flex gap-3"
                style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
              >
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
                      <CitationChip key={i} sourceId={c.sourceId} onClick={() => setOpenCite(c)} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[12px]" style={{ color: C.muted }}>
            ▸ {STEADY.map((s) => `${s.id} — ${s.line}`).join("  ·  ")}
          </div>
        </section>

        {/* ④ interrogate */}
        <section>
          <div className="text-[11px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            Interrogate
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(q || undefined);
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-3"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask the brief…"
              className="flex-1 bg-transparent outline-none text-[15px]"
              style={{ color: C.ink }}
            />
            <button type="submit" className="text-[13px] px-2 py-1 rounded cursor-pointer" style={{ color: C.accent }}>
              Ask ↵
            </button>
          </form>
          {!answer && (
            <div className="mt-2 flex flex-wrap gap-2">
              {["Did EKD meet its March commitment?", "What does the MTA conflict change?"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="text-[12px] rounded-full px-3 py-1 cursor-pointer"
                  style={{ background: "#EFE8D8", color: C.muted }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {answer && (
            <div className="mt-4 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[15px] mb-4" style={serif}>{answer.question}</div>
              <div className="space-y-4">
                {answer.claims.map((c, i) => (
                  <div key={i}>
                    <p className="text-[15px] leading-relaxed">{c.text}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ConfidenceBadge confidence={c.confidence} />
                      <CitationChip
                        sourceId={c.sourceId}
                        onClick={() => setOpenCite({ sourceId: c.sourceId, passageId: c.passageId })}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnswer(null);
                  setQ("");
                }}
                className="mt-4 text-[12px] cursor-pointer"
                style={{ color: C.muted }}
              >
                ← Ask something else
              </button>
            </div>
          )}
        </section>
      </main>

      {/* source drawer — provenance: claim → confidence → exact passage */}
      {drawer && openCite && (
        <>
          <div className="fixed inset-0 bg-black/20" onClick={() => setOpenCite(null)} />
          <aside
            className="fixed right-0 top-0 h-dvh w-full max-w-md p-6 overflow-y-auto shadow-2xl"
            style={{ background: C.surface }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase" style={{ color: C.faint, letterSpacing: "0.1em" }}>Source</span>
              <button type="button" onClick={() => setOpenCite(null)} className="text-[13px] cursor-pointer" style={{ color: C.muted }}>
                Close ✕
              </button>
            </div>
            <div style={serif} className="text-xl">{drawer.title}</div>
            <div className="text-[12px] mt-1" style={{ color: C.muted }}>
              {drawer.date ?? "undated"} · {openCite.sourceId}
            </div>
            <p
              className="mt-4 text-[15px] leading-relaxed p-4 rounded-lg"
              style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
            >
              {drawer.text}
            </p>
          </aside>
        </>
      )}
    </div>
  );
}
