"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AudioLines, CircleCheck, ClipboardCheck, Lightbulb, MessageSquareQuote, TriangleAlert } from "lucide-react";
import { addCommitment, loadState, type Commitment } from "@/lib/store";
import { MEETING_META } from "@/lib/mock";
import { PARTICIPANTS } from "@/lib/meetings";
import { askMajlis } from "@/components/ask-bus";
import { C, Card, CitationChip, RailLabel } from "@/components/ui";
import { Avatar, MeetingContext, TheRoom } from "@/components/rail";
import { useCitation } from "@/components/citation-context";
import { useParticipant } from "@/components/participant-context";
import { Gloss } from "@/components/gloss";
import AppShell from "@/components/app-shell";

type Cite = { sourceId: string; passageId: string };
type FeedItem = {
  id: string;
  speaker: string;
  text: string;
  note?: { kind: "confirm" | "flag"; text: string; cite: Cite };
  suggest?: string;
  capture?: Commitment;
};

const FEED: FeedItem[] = [
  {
    id: "edd",
    speaker: "EDD",
    text: "SSO has slipped, and we now forecast completion at the end of Q3.",
    note: { kind: "confirm", text: "Matches the record (R-07). It blocks HSA and EKD go-lives.", cite: { sourceId: "RISK", passageId: "R-07" } },
    suggest: "Ask EDD for a firm recovery date. Is the identity-vendor contract signed?",
    capture: { id: "c-edd-sso", entity: "EDD", text: "Deliver the shared SSO integration", due: "end of Q3", confidence: "confirmed", capturedAt: "during" },
  },
  {
    id: "ekd",
    speaker: "EKD",
    text: "We're confident the Parent Portal is on track for the original timeline.",
    note: { kind: "flag", text: "Inconsistent with the record: the Q2 report shows the portal slipped to August.", cite: { sourceId: "Q2-EKD", passageId: "slip" } },
    suggest: "Ask EKD to reconcile that confidence with the August date on record.",
  },
  {
    id: "mta",
    speaker: "MTA",
    text: "Our programme spend is well within budget.",
    note: { kind: "flag", text: "The MTA budget conflicts across sources: Charter 40M vs Q2 report 52M.", cite: { sourceId: "Q2-MTA", passageId: "budget" } },
    suggest: "Ask MTA which figure is correct, 40M or 52M, before the reallocation vote.",
    capture: { id: "c-mta-budget", entity: "MTA", text: "Reconcile the 40M vs 52M budget figure", due: "within 2 weeks", confidence: "confirmed", capturedAt: "during" },
  },
  {
    id: "chair",
    speaker: "Chair",
    text: "We'll defer the reallocation pending MTA's reconciliation.",
    capture: { id: "d-defer", entity: "Committee", text: "Q2 reallocation deferred pending MTA reconciliation", due: "next session", confidence: "confirmed", capturedAt: "during" },
  },
];

/** Resolve a transcript speaker code to a name (+ profile id when it's a participant). */
function speakerOf(code: string): { name: string; id?: string; role?: string } {
  const p = PARTICIPANTS.find((x) => x.id === code);
  if (p) return { name: p.name, id: p.id, role: `${p.role}, ${p.entity}` };
  if (code === "Chair") return { name: "You", role: "Chair, Programme Director-General" };
  return { name: code };
}

export default function DuringView() {
  const { open } = useCitation();
  const { open: openProfile } = useParticipant();
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
  const insights = shown.filter((i) => i.note).map((i) => ({ id: i.id, kind: i.note!.kind, text: i.note!.text }));
  const suggestions = shown.filter((i) => i.suggest).map((i) => ({ id: i.id, q: i.suggest! }));

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>Speaking order</RailLabel>
        <ol className="space-y-1.5 text-[13px]">
          {FEED.map((f, i) => {
            const sp = speakerOf(f.speaker);
            return (
              <li key={f.id} className="flex items-center gap-2" style={{ color: i < revealed ? C.ink : C.faint, fontWeight: i === revealed - 1 ? 600 : 400 }}>
                <span aria-hidden className="text-[9px]" style={{ color: i < revealed ? C.confirmed : C.line }}>{i < revealed ? "●" : "○"}</span>
                <span className="truncate">{sp.name}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="text-[12px] space-y-1" style={{ color: C.muted }}>
        <div>Captured: <span className="font-semibold" style={{ color: C.ink }}>{captured.length}</span></div>
        <div>Flags raised: <span className="font-semibold" style={{ color: flagsRaised ? C.unverified : C.ink }}>{flagsRaised}</span></div>
      </div>
      <TheRoom />
    </div>
  );

  const meta = (
    <>
      <div className="font-medium inline-flex items-center gap-1.5" style={{ color: C.unverified }}>
        <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: C.unverified }} /> Recording
      </div>
      <div style={{ color: C.muted }}>{MEETING_META.session}</div>
    </>
  );

  return (
    <AppShell stage="during" meta={meta} leftRail={leftRail}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card
          label="Live transcript"
          span={2}
          icon={AudioLines}
          aside={
            <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: C.unverified }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.unverified }} />
              Majlis is listening
            </span>
          }
        >
          <div className="space-y-3">
            {shown.map((item) => {
              const sp = speakerOf(item.speaker);
              return (
                <div key={item.id} className="rounded-xl p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  {sp.id ? (
                    <button type="button" onClick={(e) => openProfile(sp.id!, { x: e.clientX, y: e.clientY })} className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-70">
                      <Avatar id={sp.id} name={sp.name} size={28} />
                      <span className="leading-tight">
                        <span className="font-semibold text-[13px]">{sp.name}</span>
                        {sp.role && <span className="block text-[11px]" style={{ color: C.muted }}><Gloss>{sp.role}</Gloss></span>}
                      </span>
                    </button>
                  ) : (
                    <span className="leading-tight">
                      <span className="font-semibold text-[13px]">{sp.name}</span>
                      {sp.role && <span className="block text-[11px]" style={{ color: C.muted }}><Gloss>{sp.role}</Gloss></span>}
                    </span>
                  )}
                  <p className="text-[15px] mt-2 leading-relaxed">&ldquo;<Gloss>{item.text}</Gloss>&rdquo;</p>
                  {item.note && (
                    <div className="mt-3 rounded-lg p-3 text-[13px]" style={item.note.kind === "flag" ? { background: C.flagBg, border: `1px solid ${C.flagBorder}` } : { background: C.surface, border: `1px solid ${C.line}` }}>
                      <div className="flex items-start gap-2">
                        {item.note.kind === "flag" ? (
                          <TriangleAlert size={14} strokeWidth={2.25} style={{ color: C.unverified, marginTop: 1 }} className="shrink-0" />
                        ) : (
                          <CircleCheck size={14} strokeWidth={2.25} style={{ color: C.confirmed, marginTop: 1 }} className="shrink-0" />
                        )}
                        <div>
                          <span style={{ color: item.note.kind === "flag" ? C.unverified : C.ink, fontWeight: 500 }}>
                            {item.note.kind === "flag" ? "Inconsistency: " : "Confirmed: "}
                          </span>
                          <span style={{ color: C.detail }}><Gloss>{item.note.text}</Gloss></span>{" "}
                          <span className="inline-block align-middle">
                            <CitationChip sourceId={item.note.cite.sourceId} onClick={(pos) => open(item.note!.cite, pos)} />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.suggest && (
                    <button type="button" onClick={() => askMajlis(item.suggest!)} className="mt-2 flex items-start gap-1.5 text-left text-[12px] cursor-pointer hover:opacity-70" style={{ color: C.accent }}>
                      <MessageSquareQuote size={13} strokeWidth={2} className="mt-0.5 shrink-0" />
                      <span><span className="font-medium">Suggested:</span> <span style={{ color: C.detail }}><Gloss>{item.suggest}</Gloss></span></span>
                    </button>
                  )}
                  {item.capture && (
                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={capturedIds.has(item.capture.id)}
                        onClick={() => addCommitment(item.capture!)}
                        className="text-[12px] rounded-lg px-2.5 py-1 cursor-pointer disabled:opacity-50"
                        style={{ background: C.chipBg, color: C.ink }}
                      >
                        {capturedIds.has(item.capture.id) ? "✓ Captured" : "+ Capture commitment"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {revealed < FEED.length ? (
            <button type="button" onClick={() => setRevealed((r) => r + 1)} className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer" style={{ background: C.ink, color: C.bg }}>
              Next speaker →
            </button>
          ) : (
            <div className="mt-4 text-[12px]" style={{ color: C.muted }}>End of agenda.</div>
          )}
        </Card>

        <Card label="Insights & suggested questions" icon={Lightbulb}>
          {insights.length === 0 && suggestions.length === 0 ? (
            <div className="text-[13px]" style={{ color: C.muted }}>Majlis surfaces insights and questions as the meeting progresses.</div>
          ) : (
            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={`i-${ins.id}`} className="flex items-start gap-2 text-[13px]">
                  {ins.kind === "flag" ? (
                    <TriangleAlert size={14} style={{ color: C.unverified, marginTop: 1 }} className="shrink-0" />
                  ) : (
                    <CircleCheck size={14} style={{ color: C.confirmed, marginTop: 1 }} className="shrink-0" />
                  )}
                  <span style={{ color: C.detail }}><Gloss>{ins.text}</Gloss></span>
                </div>
              ))}
              {suggestions.length > 0 && (
                <div className="pt-3 border-t" style={{ borderColor: C.line }}>
                  <div className="text-[11px] font-semibold mb-2" style={{ color: C.faint }}>Questions you could ask</div>
                  <ul className="space-y-2">
                    {suggestions.map((s) => (
                      <li key={`q-${s.id}`}>
                        <button type="button" onClick={() => askMajlis(s.q)} className="text-left text-[13px] hover:opacity-70 cursor-pointer flex items-start gap-1.5" style={{ color: C.accent }}>
                          <MessageSquareQuote size={13} className="mt-0.5 shrink-0" />
                          <span style={{ color: C.detail }}><Gloss>{s.q}</Gloss></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card label="Captured this meeting" icon={ClipboardCheck} aside={captured.length > 0 ? <Link href="/after" className="text-[12px] hover:opacity-70" style={{ color: C.accent }}>To minutes →</Link> : undefined}>
          {captured.length === 0 ? (
            <div className="text-[13px]" style={{ color: C.muted }}>Commitments and decisions you log appear here, then flow into the minutes.</div>
          ) : (
            <ul className="space-y-2">
              {captured.map((c) => (
                <li key={c.id} className="rounded-lg p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[13px]"><Gloss>{c.entity}</Gloss></span>
                    <span className="text-[12px] ml-auto" style={{ color: C.muted }}>{c.due}</span>
                  </div>
                  <p className="text-[14px] mt-0.5">{c.text}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
