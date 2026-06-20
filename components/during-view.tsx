"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AudioLines, CircleCheck, ClipboardCheck, Gavel, Lightbulb, MessageSquareQuote, Sparkles, TriangleAlert } from "lucide-react";
import { addCommitment, loadState, type Commitment } from "@/lib/store";
import { type Brief, BRIEF_CACHE_KEY, MOCK_BRIEF } from "@/lib/brief";
import { PARTICIPANTS } from "@/lib/meetings";
import { askMajlis } from "@/components/ask-bus";
import { C, Card, CitationChip, RailLabel } from "@/components/ui";
import { Avatar, MeetingContext, TheRoom } from "@/components/rail";
import { useCitation } from "@/components/citation-context";
import { useParticipant } from "@/components/participant-context";
import { useDetail } from "@/components/detail-context";
import { useLang } from "@/components/lang-context";
import { Gloss } from "@/components/gloss";
import RailCalendar from "@/components/rail-calendar";
import MeetingTimer from "@/components/meeting-timer";
import AppShell from "@/components/app-shell";

type Cite = { sourceId: string; passageId: string };

/** A scripted utterance. Majlis observes each one live against the record. */
type FeedItem = { id: string; speaker: string; text: string };

type Obs = {
  stance: "confirms" | "contradicts" | "neutral";
  note: string;
  citation: Cite | null;
  suggestedQuestion: string | null;
  commitment: { entity: string; text: string; due: string } | null;
};

const FEED: FeedItem[] = [
  { id: "edd", speaker: "EDD", text: "SSO has slipped, and we now forecast completion at the end of Q3." },
  { id: "ekd", speaker: "EKD", text: "We're confident the Parent Portal is on track for the original timeline." },
  { id: "mta", speaker: "MTA", text: "Our programme spend is well within budget." },
  { id: "chair", speaker: "Chair", text: "We'll defer the reallocation pending MTA's reconciliation." },
];

function speakerOf(code: string): { name: string; id?: string; role?: string } {
  const p = PARTICIPANTS.find((x) => x.id === code);
  if (p) return { name: p.name, id: p.id, role: `${p.role}, ${p.entity}` };
  if (code === "Chair") return { name: "You", role: "Chair, Programme Director-General" };
  return { name: code };
}

export default function DuringView() {
  const { open } = useCitation();
  const { open: openProfile } = useParticipant();
  const { level } = useDetail();
  const { lang, t: tr } = useLang();
  const [revealed, setRevealed] = useState(1);
  const [captured, setCaptured] = useState<Commitment[]>([]);
  const [observations, setObservations] = useState<Record<string, Obs | "loading">>({});
  const [brief, setBrief] = useState<Brief>(MOCK_BRIEF);
  const requested = useRef<Set<string>>(new Set());

  useEffect(() => {
    const sync = () => setCaptured(loadState().commitments);
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  // Reuse the brief the chair was just reading, so the decision in the room is the
  // same one Before recommended. Falls back to the mock if Before was skipped.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${BRIEF_CACHE_KEY}:${lang}`);
      if (raw) setBrief(JSON.parse(raw) as Brief);
    } catch {
      /* keep mock */
    }
  }, [lang]);

  // Observe each utterance live as it is revealed.
  useEffect(() => {
    const item = FEED[revealed - 1];
    if (!item || requested.current.has(item.id)) return;
    requested.current.add(item.id);
    setObservations((o) => ({ ...o, [item.id]: "loading" }));
    fetch("/api/observe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ speaker: item.speaker, text: item.text, lang }) })
      .then((r) => r.json())
      .then((obs: Obs & { error?: string }) => {
        setObservations((o) => {
          if (obs && !obs.error) return { ...o, [item.id]: obs };
          const n = { ...o };
          delete n[item.id];
          return n;
        });
      })
      .catch(() => {
        setObservations((o) => {
          const n = { ...o };
          delete n[item.id];
          return n;
        });
      });
  }, [revealed]);

  const capturedIds = new Set(captured.map((c) => c.id));
  const shown = FEED.slice(0, revealed);
  const obsList = shown.map((i) => observations[i.id]).filter((o): o is Obs => !!o && o !== "loading");
  const flagsRaised = obsList.filter((o) => o.stance === "contradicts").length;
  const insights = obsList.filter((o) => o.stance !== "neutral");
  const suggestions = obsList.map((o) => o.suggestedQuestion).filter((q): q is string => !!q);

  // The decision the chair is steering toward, tracked from the brief to the moment it lands.
  const decisionId = "decision-reallocation";
  const chairText = FEED.find((f) => f.id === "chair")?.text ?? "";
  const entitiesTotal = FEED.filter((f) => f.speaker !== "Chair").length;
  const entitiesHeard = shown.filter((f) => f.speaker !== "Chair").length;
  const chairSpoke = revealed >= FEED.length;
  const decisionRecorded = capturedIds.has(decisionId);

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>{tr("speakingOrder")}</RailLabel>
        <ol className="space-y-0.5 -mx-2">
          {FEED.map((f, i) => {
            const sp = speakerOf(f.speaker);
            const done = i < revealed;
            const current = i === revealed - 1;
            return (
              <li key={f.id} className="flex items-start gap-2 rounded-lg px-2 py-1.5" style={current ? { background: C.surfaceAlt } : undefined}>
                <span aria-hidden className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: current ? C.unverified : done ? C.confirmed : C.line }} />
                <span className="min-w-0 leading-tight flex-1">
                  <span className="block text-[13px] truncate" style={{ color: done ? C.ink : C.faint, fontWeight: current ? 600 : 400 }}>{sp.name}</span>
                  {sp.role && <span className="block text-[11px] truncate" style={{ color: C.faint }}><Gloss>{sp.role}</Gloss></span>}
                </span>
                {current && (
                  <span className="inline-flex items-center gap-1 text-[10px] shrink-0 mt-0.5" style={{ color: C.unverified }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.unverified }} />
                    {tr("speakingNow")}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <RailLabel>{tr("liveTally")}</RailLabel>
        <div className="rounded-xl p-3 grid grid-cols-2 gap-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
          <div>
            <div className="text-[22px] font-semibold leading-none" style={{ color: C.ink }}>{captured.length}</div>
            <div className="text-[11px] mt-1.5" style={{ color: C.muted }}>{tr("captured")}</div>
          </div>
          <div>
            <div className="text-[22px] font-semibold leading-none" style={{ color: flagsRaised ? C.unverified : C.ink }}>{flagsRaised}</div>
            <div className="text-[11px] mt-1.5" style={{ color: C.muted }}>{tr("flagsRaised")}</div>
          </div>
        </div>
      </div>
      <RailCalendar />
      <TheRoom />
    </div>
  );

  return (
    <AppShell stage="during" leftRail={leftRail}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card
          labelKey="liveTranscript"
          span={2}
          icon={AudioLines}
          aside={
            <span className="inline-flex items-center gap-2.5 text-[12px]">
              <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: C.unverified }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.unverified }} />
                <MeetingTimer />
              </span>
              <span className="hidden sm:inline" style={{ color: C.muted }}>{tr("majlisListening")}</span>
            </span>
          }
        >
          <div className="space-y-3">
            {shown.map((item) => {
              const sp = speakerOf(item.speaker);
              const obs = observations[item.id];
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

                  {obs === "loading" && (
                    <div className="mt-3 text-[12px] flex items-center gap-2" style={{ color: C.muted }}>
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.accent }} /> Majlis is checking the record…
                    </div>
                  )}
                  {obs && obs !== "loading" && (
                    <>
                      {obs.stance !== "neutral" ? (
                        <div className="mt-3 rounded-lg p-3 text-[13px]" style={obs.stance === "contradicts" ? { background: C.flagBg, border: `1px solid ${C.flagBorder}` } : { background: C.surface, border: `1px solid ${C.line}` }}>
                          <div className="flex items-start gap-2">
                            {obs.stance === "contradicts" ? (
                              <TriangleAlert size={14} strokeWidth={2.25} style={{ color: C.unverified, marginTop: 1 }} className="shrink-0" />
                            ) : (
                              <CircleCheck size={14} strokeWidth={2.25} style={{ color: C.confirmed, marginTop: 1 }} className="shrink-0" />
                            )}
                            <div>
                              <span style={{ color: obs.stance === "contradicts" ? C.unverified : C.ink, fontWeight: 500 }}>
                                {obs.stance === "contradicts" ? "Inconsistency: " : "Confirmed: "}
                              </span>
                              <span style={{ color: C.detail }}><Gloss>{obs.note}</Gloss></span>{" "}
                              {obs.citation && (
                                <span className="inline-block align-middle">
                                  <CitationChip sourceId={obs.citation.sourceId} onClick={(pos) => open(obs.citation!, pos)} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        obs.note && level >= 3 && <p className="mt-3 text-[13px]" style={{ color: C.detail }}><Gloss>{obs.note}</Gloss></p>
                      )}

                      {obs.suggestedQuestion && level >= 2 && (
                        <button type="button" onClick={() => askMajlis(obs.suggestedQuestion!)} className="mt-2 flex items-start gap-1.5 text-left text-[12px] cursor-pointer hover:opacity-70" style={{ color: C.accent }}>
                          <MessageSquareQuote size={13} strokeWidth={2} className="mt-0.5 shrink-0" />
                          <span><span className="font-medium">Suggested:</span> <span style={{ color: C.detail }}><Gloss>{obs.suggestedQuestion}</Gloss></span></span>
                        </button>
                      )}

                      {obs.commitment && (
                        <div className="mt-3">
                          <button
                            type="button"
                            disabled={capturedIds.has(`c-${item.id}`)}
                            onClick={() =>
                              addCommitment({ id: `c-${item.id}`, entity: obs.commitment!.entity, text: obs.commitment!.text, due: obs.commitment!.due, confidence: "confirmed", capturedAt: "during", citation: obs.citation ?? undefined })
                            }
                            className="text-[12px] rounded-lg px-2.5 py-1 cursor-pointer disabled:opacity-50"
                            style={{ background: C.chipBg, color: C.ink }}
                          >
                            {capturedIds.has(`c-${item.id}`) ? "✓ Captured" : "+ Capture commitment"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {revealed < FEED.length ? (
            <button type="button" onClick={() => setRevealed((r) => r + 1)} className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer" style={{ background: C.ink, color: C.bg }}>
              {tr("nextSpeaker")} →
            </button>
          ) : (
            <div className="mt-4 text-[12px]" style={{ color: C.muted }}>{tr("endOfAgenda")}</div>
          )}
        </Card>

        <Card
          labelKey="decisionOnTable"
          span={2}
          icon={Gavel}
          aside={
            <span className="text-[12px]" style={{ color: chairSpoke ? C.confirmed : C.muted }}>
              {chairSpoke ? "Decided" : `${entitiesHeard} of ${entitiesTotal} inputs heard`}
            </span>
          }
        >
          <p className="text-[15px] font-medium leading-snug"><Gloss>{brief.decision.text}</Gloss></p>
          {brief.decision.hingesOn.length > 0 && (
            <p className="mt-1.5 text-[12px]" style={{ color: C.muted }}>Hinges on: <Gloss>{brief.decision.hingesOn.join("; ")}</Gloss></p>
          )}

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {brief.decision.options.map((o) => (
              <div key={o.label} className="rounded-lg p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div className="text-[13px] font-semibold"><Gloss>{o.label}</Gloss></div>
                <div className="text-[12px] mt-0.5" style={{ color: C.muted }}><Gloss>{o.consequence}</Gloss></div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg p-3 text-[13px] flex items-start gap-2" style={{ background: C.chipBg }}>
            <Sparkles size={14} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
            <span style={{ color: C.detail }}>
              <span className="font-medium" style={{ color: C.ink }}>Majlis recommends: </span><Gloss>{brief.decision.recommendation}</Gloss>
              {brief.decision.rationale && <span className="block mt-1.5"><Gloss>{brief.decision.rationale}</Gloss></span>}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t flex items-center gap-3 flex-wrap" style={{ borderColor: C.line }}>
            {!chairSpoke ? (
              <span className="text-[12px]" style={{ color: C.muted }}>
                {flagsRaised > 0 ? `${flagsRaised} inconsistency flagged so far. ` : ""}Majlis is gathering the inputs the vote depends on.
              </span>
            ) : decisionRecorded ? (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.confirmed }}>
                <CircleCheck size={15} strokeWidth={2.25} /> Decision recorded, it will appear in the minutes.
              </span>
            ) : (
              <>
                <span className="text-[13px]" style={{ color: C.ink }}>The chair ruled: <span style={{ color: C.detail }}>&ldquo;<Gloss>{chairText}</Gloss>&rdquo;</span></span>
                <button
                  type="button"
                  onClick={() => addCommitment({ id: decisionId, entity: "Committee", text: chairText, due: "Next session", confidence: "confirmed", capturedAt: "during", citation: brief.bottomLine.citations[0] })}
                  className="text-[12px] rounded-lg px-2.5 py-1 cursor-pointer"
                  style={{ background: C.accent, color: C.onAccent }}
                >
                  Record decision
                </button>
              </>
            )}
          </div>
        </Card>

        <Card labelKey="insights" icon={Lightbulb} minLevel={2}>
          {insights.length === 0 && suggestions.length === 0 ? (
            <div className="text-[13px]" style={{ color: C.muted }}>Majlis surfaces insights and questions as the meeting progresses.</div>
          ) : (
            <div className="space-y-3">
              {insights.map((ins, idx) => (
                <div key={`i-${idx}`} className="flex items-start gap-2 text-[13px]">
                  {ins.stance === "contradicts" ? (
                    <TriangleAlert size={14} style={{ color: C.unverified, marginTop: 1 }} className="shrink-0" />
                  ) : (
                    <CircleCheck size={14} style={{ color: C.confirmed, marginTop: 1 }} className="shrink-0" />
                  )}
                  <span style={{ color: C.detail }}><Gloss>{ins.note}</Gloss></span>
                </div>
              ))}
              {suggestions.length > 0 && (
                <div className="pt-3 border-t" style={{ borderColor: C.line }}>
                  <div className="text-[11px] font-semibold mb-2" style={{ color: C.faint }}>Questions you could ask</div>
                  <ul className="space-y-2">
                    {suggestions.map((s, idx) => (
                      <li key={`q-${idx}`}>
                        <button type="button" onClick={() => askMajlis(s)} className="text-left text-[13px] hover:opacity-70 cursor-pointer flex items-start gap-1.5" style={{ color: C.accent }}>
                          <MessageSquareQuote size={13} className="mt-0.5 shrink-0" />
                          <span style={{ color: C.detail }}><Gloss>{s}</Gloss></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card labelKey="capturedThisMeeting" icon={ClipboardCheck} aside={captured.length > 0 ? <Link href="/after" className="text-[12px] hover:opacity-70" style={{ color: C.accent }}>{tr("toMinutes")} →</Link> : undefined}>
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
