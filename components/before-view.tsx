"use client";

import { useEffect, useState } from "react";
import {
  ATTENTION,
  BOTTOM_LINE,
  DECISION,
  MEETING_META,
  resolveCitation,
  STEADY,
  type Citation,
} from "@/lib/mock";
import type { Confidence } from "@/lib/corpus";
import { loadState, type Commitment } from "@/lib/store";
import { C, CitationChip, ConfidenceBadge, severityColor, severityGlyph, StageSpine } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

type LiveAnswer = {
  notInMaterial: boolean;
  summary: string;
  claims: { text: string; confidence: Confidence; sourceId: string; passageId: string }[];
};

const SUGGESTIONS = [
  "What's the one thing I can't miss?",
  "Did EKD meet its March commitment?",
  "What does the MTA budget conflict change for the vote?",
];

export default function BeforeView() {
  const [openCite, setOpenCite] = useState<Citation | null>(null);
  const [answer, setAnswer] = useState<LiveAnswer | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prior, setPrior] = useState<Commitment[]>([]);

  useEffect(() => {
    const sync = () => {
      const s = loadState();
      setPrior(s.writtenToMemory ? s.commitments : []);
    };
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const drawer = openCite ? resolveCitation(openCite.sourceId, openCite.passageId) : null;

  async function ask(question?: string) {
    const text = (question ?? q).trim();
    if (!text || loading) return;
    setQ(text);
    setAnswer(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as LiveAnswer;
      setAnswer(data);
    } catch {
      setError("Couldn't reach the assistant. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnswer(null);
    setError(null);
    setQ("");
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
        {/* loop: commitments carried over from last cycle's After stage */}
        {prior.length > 0 && (
          <section className="rounded-xl p-4" style={{ background: "#F0F4EF", border: "1px solid #CBD9CB" }}>
            <div className="text-[11px] uppercase mb-2" style={{ color: "#3F7A5B", letterSpacing: "0.1em" }}>
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

        {/* ④ interrogate — live Claude */}
        <section>
          <div className="text-[11px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            Interrogate
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-3"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask the brief…"
              disabled={loading}
              className="flex-1 bg-transparent outline-none text-[15px] disabled:opacity-60"
              style={{ color: C.ink }}
            />
            <button
              type="submit"
              disabled={loading}
              className="text-[13px] px-2 py-1 rounded cursor-pointer disabled:opacity-50"
              style={{ color: C.accent }}
            >
              {loading ? "…" : "Ask ↵"}
            </button>
          </form>

          {!answer && !loading && !error && (
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
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

          {loading && (
            <div className="mt-4 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[13px] mb-3 flex items-center gap-2" style={{ color: C.muted }}>
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: C.accent }} />
                Consulting the committee pack…
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded animate-pulse" style={{ background: "#EFE8D8", width: "92%" }} />
                <div className="h-3 rounded animate-pulse" style={{ background: "#EFE8D8", width: "78%" }} />
                <div className="h-3 rounded animate-pulse" style={{ background: "#EFE8D8", width: "64%" }} />
              </div>
            </div>
          )}

          {error && (
            <div
              className="mt-4 rounded-xl p-5 text-[14px] flex items-center justify-between"
              style={{ background: "#FBF1EC", border: "1px solid #E7C9BE", color: C.unverified }}
            >
              <span>{error}</span>
              <button type="button" onClick={() => ask()} className="underline cursor-pointer">Retry</button>
            </div>
          )}

          {answer && (
            <div className="mt-4 rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
              <div className="text-[14px] mb-1" style={{ color: C.muted }}>{q}</div>
              {answer.summary && <p className="text-[16px] leading-relaxed mt-2 mb-4">{answer.summary}</p>}

              {answer.notInMaterial ? (
                <div
                  className="text-[13px] rounded-lg px-3 py-2"
                  style={{ background: C.surfaceAlt, color: C.muted, border: `1px solid ${C.line}` }}
                >
                  Not in the shared committee pack — nothing to cite.
                </div>
              ) : (
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
              )}

              <button type="button" onClick={reset} className="mt-4 text-[12px] cursor-pointer" style={{ color: C.muted }}>
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
              {drawer.text || "This passage isn't in the loaded pack."}
            </p>
          </aside>
        </>
      )}
    </div>
  );
}
