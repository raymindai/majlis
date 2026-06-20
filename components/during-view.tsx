"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addCommitment, loadState, type Commitment } from "@/lib/store";
import { ATTENTION, MEETING_META } from "@/lib/mock";
import { C, CitationChip, RailLabel, Section, severityColor, severityGlyph } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import AppShell from "@/components/app-shell";

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
  const { open } = useCitation();
  const [revealed, setRevealed] = useState(1);
  const [captured, setCaptured] = useState<Commitment[]>([]);

  useEffect(() => {
    const sync = () => setCaptured(loadState().commitments);
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const capturedIds = new Set(captured.map((c) => c.id));
  const shown = FEED.slice(0, revealed);
  const flagsRaised = shown.filter((i) => i.note?.kind === "flag").length;

  const leftRail = (
    <div className="space-y-6">
      <div>
        <RailLabel>Agenda</RailLabel>
        <ol className="space-y-1 text-[13px]">
          {FEED.map((f, i) => (
            <li key={f.id} className="flex items-center gap-2" style={{ color: i < revealed ? C.ink : C.faint, fontWeight: i === revealed - 1 ? 600 : 400 }}>
              <span aria-hidden style={{ color: i < revealed ? C.confirmed : C.line }}>{i < revealed ? "•" : "○"}</span>
              {f.speaker}
            </li>
          ))}
        </ol>
      </div>
      <div className="text-[12px] space-y-1" style={{ color: C.muted }}>
        <div>Captured: <span className="font-semibold" style={{ color: C.ink }}>{captured.length}</span></div>
        <div>Flags raised: <span className="font-semibold" style={{ color: flagsRaised ? C.unverified : C.ink }}>{flagsRaised}</span></div>
      </div>
      <div>
        <RailLabel>Watch-list</RailLabel>
        <ul className="space-y-1.5 text-[12px]">
          {ATTENTION.map((a) => (
            <li key={a.id} className="flex items-start gap-1.5">
              <span aria-hidden style={{ color: severityColor[a.severity] }}>{severityGlyph[a.severity]}</span>
              <span className="font-semibold">{a.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const meta = (
    <>
      <div className="font-medium inline-flex items-center gap-1.5" style={{ color: C.unverified }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.unverified }} /> In session
      </div>
      <div style={{ color: C.muted }}>{MEETING_META.session}</div>
    </>
  );

  return (
    <AppShell stage="during" meta={meta} leftRail={leftRail}>
      <Section label="Live — as the room speaks">
        <div className="space-y-3">
          {shown.map((item) => (
            <div key={item.id} className="rounded-xl p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
              <span className="font-semibold text-[13px]">{item.speaker}</span>
              <p className="text-[15px] mt-1 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
              {item.note && (
                <div
                  className="mt-3 rounded-lg p-3 text-[13px]"
                  style={item.note.kind === "flag" ? { background: C.flagBg, border: `1px solid ${C.flagBorder}` } : { background: C.surface, border: `1px solid ${C.line}` }}
                >
                  <div className="flex items-start gap-2">
                    <span aria-hidden style={{ color: item.note.kind === "flag" ? C.unverified : C.confirmed }}>{item.note.kind === "flag" ? "▲" : "●"}</span>
                    <div>
                      <span style={{ color: item.note.kind === "flag" ? C.unverified : C.ink, fontWeight: 500 }}>
                        {item.note.kind === "flag" ? "Majlis — inconsistency: " : "Majlis: "}
                      </span>
                      <span style={{ color: C.detail }}>{item.note.text}</span>{" "}
                      <span className="inline-block align-middle">
                        <CitationChip sourceId={item.note.cite.sourceId} onClick={() => open(item.note!.cite)} />
                      </span>
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
                  style={{ background: C.chipBg, color: C.ink }}
                >
                  {capturedIds.has(item.capture.id) ? "✓ Captured" : "+ Capture commitment"}
                </button>
              )}
            </div>
          ))}
        </div>
        {revealed < FEED.length ? (
          <button type="button" onClick={() => setRevealed((r) => r + 1)} className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer" style={{ background: C.ink, color: C.bg }}>
            Next speaker →
          </button>
        ) : (
          <div className="mt-4 text-[12px]" style={{ color: C.muted }}>End of agenda.</div>
        )}
      </Section>

      <Section
        label="Captured this meeting"
        aside={
          captured.length > 0 ? (
            <Link href="/after" className="text-[12px] underline" style={{ color: C.accent }}>
              Proceed to minutes →
            </Link>
          ) : undefined
        }
      >
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
      </Section>
    </AppShell>
  );
}
