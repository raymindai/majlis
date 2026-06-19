"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addCommitment, loadState, type Commitment } from "@/lib/store";
import { ATTENTION, MEETING_META, resolveCitation } from "@/lib/mock";
import { C, severityColor, severityGlyph, StageSpine } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

type Cite = { sourceId: string; passageId: string };
type FeedItem = {
  id: string;
  speaker: string;
  text: string;
  note?: { kind: "confirm" | "flag"; text: string; cite: Cite };
  capture?: Commitment;
};

const FEED: FeedItem[] = [
  {
    id: "edd",
    speaker: "EDD",
    text: "SSO has slipped — we now forecast completion at the end of Q3.",
    note: { kind: "confirm", text: "Matches the record (R-07). It blocks HSA and EKD go-lives.", cite: { sourceId: "RISK", passageId: "R-07" } },
    capture: { id: "c-edd-sso", entity: "EDD", text: "Deliver the shared SSO integration", due: "end of Q3", confidence: "confirmed", capturedAt: "during" },
  },
  {
    id: "ekd",
    speaker: "EKD",
    text: "We're confident the Parent Portal is on track for the original timeline.",
    note: { kind: "flag", text: "Inconsistent with the record — the Q2 report shows the portal slipped to August.", cite: { sourceId: "Q2-EKD", passageId: "slip" } },
  },
  {
    id: "mta",
    speaker: "MTA",
    text: "Our programme spend is well within budget.",
    note: { kind: "flag", text: "The MTA budget conflicts across sources — Charter 40M vs Q2 report 52M. Reconcile before the vote.", cite: { sourceId: "Q2-MTA", passageId: "budget" } },
    capture: { id: "c-mta-budget", entity: "MTA", text: "Reconcile the 40M vs 52M budget figure", due: "within 2 weeks", confidence: "confirmed", capturedAt: "during" },
  },
  {
    id: "chair",
    speaker: "Chair",
    text: "We'll defer the reallocation pending MTA's reconciliation.",
    capture: { id: "d-defer", entity: "Committee", text: "Q2 reallocation deferred pending MTA reconciliation", due: "next session", confidence: "confirmed", capturedAt: "during" },
  },
];

export default function DuringView() {
  const [revealed, setRevealed] = useState(1);
  const [captured, setCaptured] = useState<Commitment[]>([]);
  const [openCite, setOpenCite] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setCaptured(loadState().commitments);
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const capturedIds = new Set(captured.map((c) => c.id));

  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span style={serif} className="text-2xl">Majlis</span>
            <StageSpine active="during" />
          </div>
          <div className="text-[12px] text-right" style={{ color: C.muted }}>
            <div className="font-medium inline-flex items-center gap-1.5" style={{ color: "#A23B2D" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#A23B2D" }} /> In session
            </div>
            <div>{MEETING_META.session}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* live feed */}
        <section>
          <div className="text-[11px] uppercase mb-3" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            Live — as the room speaks
          </div>
          <div className="space-y-3">
            {FEED.slice(0, revealed).map((item) => (
              <div key={item.id} className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                <span className="font-semibold text-[13px]">{item.speaker}</span>
                <p className="text-[15px] mt-1 leading-relaxed">&ldquo;{item.text}&rdquo;</p>

                {item.note && (
                  <div
                    className="mt-3 rounded-lg p-3 text-[13px]"
                    style={
                      item.note.kind === "flag"
                        ? { background: "#FBF1EC", border: "1px solid #E7C9BE" }
                        : { background: C.surfaceAlt, border: `1px solid ${C.line}` }
                    }
                  >
                    <div className="flex items-start gap-2">
                      <span style={{ color: item.note.kind === "flag" ? "#A23B2D" : "#2F6B4F" }} aria-hidden>
                        {item.note.kind === "flag" ? "▲" : "●"}
                      </span>
                      <div>
                        <span style={{ color: item.note.kind === "flag" ? "#A23B2D" : C.ink, fontWeight: 500 }}>
                          {item.note.kind === "flag" ? "Majlis — inconsistency: " : "Majlis: "}
                        </span>
                        <span style={{ color: "#33404F" }}>{item.note.text}</span>{" "}
                        <button
                          type="button"
                          onClick={() => setOpenCite(openCite === item.id ? null : item.id)}
                          className="underline decoration-dotted underline-offset-2 cursor-pointer"
                          style={{ color: C.muted }}
                        >
                          {item.note.cite.sourceId}
                        </button>
                        {openCite === item.id && (
                          <div className="mt-2 text-[12px] p-2 rounded" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.muted }}>
                            {resolveCitation(item.note.cite.sourceId, item.note.cite.passageId).text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {item.capture && (
                  <button
                    type="button"
                    disabled={capturedIds.has(item.capture.id)}
                    onClick={() => addCommitment(item.capture!)}
                    className="mt-3 text-[12px] rounded px-2.5 py-1 cursor-pointer disabled:opacity-50"
                    style={{ background: "#EFE8D8", color: C.ink }}
                  >
                    {capturedIds.has(item.capture.id) ? "✓ Captured" : "+ Capture commitment"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {revealed < FEED.length ? (
            <button
              type="button"
              onClick={() => setRevealed((r) => r + 1)}
              className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer"
              style={{ background: C.ink, color: "#fff" }}
            >
              Next speaker →
            </button>
          ) : (
            <div className="mt-4 text-[12px]" style={{ color: C.muted }}>End of agenda.</div>
          )}
        </section>

        {/* captured + watch-list */}
        <aside>
          <div className="text-[11px] uppercase mb-3" style={{ color: C.faint, letterSpacing: "0.1em" }}>
            Captured this meeting
          </div>
          {captured.length === 0 ? (
            <div className="text-[13px] rounded-lg p-4" style={{ background: C.surfaceAlt, color: C.muted, border: `1px solid ${C.line}` }}>
              Nothing captured yet. Commitments and decisions you log appear here, then flow into the minutes.
            </div>
          ) : (
            <ul className="space-y-2">
              {captured.map((c) => (
                <li key={c.id} className="rounded-lg p-3" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[13px]">{c.entity}</span>
                    <span className="text-[12px] ml-auto" style={{ color: C.muted }}>{c.due}</span>
                  </div>
                  <p className="text-[14px] mt-0.5">{c.text}</p>
                </li>
              ))}
            </ul>
          )}
          {captured.length > 0 && (
            <Link href="/after" className="mt-4 inline-block text-[13px] rounded-lg px-3 py-2" style={{ background: "#EFE8D8", color: C.ink }}>
              Proceed to minutes →
            </Link>
          )}

          <div className="text-[11px] uppercase mt-8 mb-3" style={{ color: C.faint, letterSpacing: "0.1em" }}>Watch-list</div>
          <ul className="space-y-1.5">
            {ATTENTION.map((a) => (
              <li key={a.id} className="text-[13px] flex items-start gap-2">
                <span style={{ color: severityColor[a.severity] }} aria-hidden>{severityGlyph[a.severity]}</span>
                <span><span className="font-semibold">{a.id}</span> — {a.line}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
