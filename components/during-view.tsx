"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

/** A small live audio-level meter, shown while a speaker is "talking". */
function AudioBars() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] h-full rounded-full origin-bottom"
          style={{ background: "var(--c-unverified)", animation: "majlis-eq 0.7s ease-in-out infinite", animationDelay: `${i * 130}ms` }}
        />
      ))}
    </span>
  );
}

/** Reveals text word by word, as if streamed live, pausing at punctuation; signals completion. */
function StreamText({ text, onDone, speed = 175 }: { text: string; onDone?: () => void; speed?: number }) {
  const words = useMemo(() => text.split(" "), [text]);
  const [n, setN] = useState(1);
  const done = useRef(false);
  useEffect(() => {
    if (n >= words.length) {
      if (!done.current) {
        done.current = true;
        onDone?.();
      }
      return;
    }
    const last = words[n - 1] ?? "";
    const extra = /[.!?]$/.test(last) ? speed * 2.4 : /[,;:]$/.test(last) ? speed * 1.4 : 0;
    const t = setTimeout(() => setN((x) => x + 1), speed + extra);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, words.length, speed]);
  return (
    <>
      {words.slice(0, n).join(" ")}
      <span className="inline-block w-[2px] h-[0.95em] ml-0.5 align-[-0.15em] animate-pulse" style={{ background: "var(--c-accent)" }} />
    </>
  );
}

export default function DuringView() {
  const { open } = useCitation();
  const { open: openProfile } = useParticipant();
  const { level } = useDetail();
  const { lang, t: tr } = useLang();
  const [revealed, setRevealed] = useState(1);
  const [captured, setCaptured] = useState<Commitment[]>([]);
  const [observations, setObservations] = useState<Record<string, Obs | "loading">>({});
  const [transcribed, setTranscribed] = useState<Set<string>>(() => new Set());
  const [noteShown, setNoteShown] = useState<Set<string>>(() => new Set());
  const [sugShown, setSugShown] = useState<Set<string>>(() => new Set());
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

  // Once an utterance finishes "transcribing", Majlis observes it against the record.
  useEffect(() => {
    FEED.slice(0, revealed).forEach((item) => {
      if (!transcribed.has(item.id) || requested.current.has(item.id)) return;
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
    });
  }, [transcribed, revealed, lang]);

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

  // "End of agenda" only after the final speaker's transcript and insight finish streaming.
  const lastId = FEED[FEED.length - 1].id;
  const lastObs = observations[lastId];
  const lastNoteText = lastObs && lastObs !== "loading" ? (lastObs.stance !== "neutral" ? lastObs.note : level >= 3 ? lastObs.note : "") : "";
  const lastHasSug = !!(lastObs && lastObs !== "loading" && lastObs.suggestedQuestion) && level >= 2;
  const lastStreamed =
    revealed >= FEED.length &&
    transcribed.has(lastId) &&
    requested.current.has(lastId) &&
    lastObs !== "loading" &&
    (!lastNoteText || noteShown.has(lastId)) &&
    (!lastHasSug || sugShown.has(lastId));

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>{tr("speakingOrder")}</RailLabel>
        <ol className="space-y-0.5 -mx-2">
          {FEED.slice(0, revealed).map((f, i) => {
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
              const typing = !transcribed.has(item.id);
              const noteText = obs && obs !== "loading" ? (obs.stance !== "neutral" ? obs.note : level >= 3 ? obs.note : "") : "";
              const noteDone = !noteText || noteShown.has(item.id);
              const addNoteDone = () => setNoteShown((s) => { const n = new Set(s); n.add(item.id); return n; });
              const hasSug = obs && obs !== "loading" && !!obs.suggestedQuestion && level >= 2;
              const sugDone = !hasSug || sugShown.has(item.id);
              const addSugDone = () => setSugShown((s) => { const n = new Set(s); n.add(item.id); return n; });
              return (
                <div key={item.id} className="rounded-xl p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <div className="flex items-center justify-between gap-2">
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
                    {typing && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] shrink-0" style={{ color: C.unverified }}>
                        <AudioBars />
                        <span className="hidden sm:inline">{tr("transcribing")}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[15px] mt-2 leading-relaxed">
                    &ldquo;
                    {typing ? (
                      <StreamText text={item.text} onDone={() => setTranscribed((s) => { const n = new Set(s); n.add(item.id); return n; })} />
                    ) : (
                      <Gloss>{item.text}</Gloss>
                    )}
                    &rdquo;
                  </p>

                  {obs === "loading" && (
                    <div className="mt-3 inline-flex items-center gap-2 text-[12px]" style={{ color: C.muted }}>
                      <Sparkles size={13} strokeWidth={2} className="animate-pulse" style={{ color: C.accent }} />
                      <span>{tr("thinking")}</span>
                      <span className="inline-flex items-end gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-1 h-1 rounded-full" style={{ background: C.accent, animation: "majlis-bounce 0.9s ease-in-out infinite", animationDelay: `${i * 150}ms` }} />
                        ))}
                      </span>
                    </div>
                  )}
                  {obs && obs !== "loading" && (
                    <div className="majlis-fade-up">
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
                                {obs.stance === "contradicts" ? `${tr("inconsistency")}: ` : `${tr("confirmedColon")}: `}
                              </span>
                              <span style={{ color: C.detail }}>{noteDone ? <Gloss>{obs.note}</Gloss> : <StreamText text={obs.note} speed={85} onDone={addNoteDone} />}</span>{" "}
                              {noteDone && obs.citation && (
                                <span className="inline-block align-middle">
                                  <CitationChip sourceId={obs.citation.sourceId} onClick={(pos) => open(obs.citation!, pos)} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        obs.note && level >= 3 && <p className="mt-3 text-[13px]" style={{ color: C.detail }}>{noteDone ? <Gloss>{obs.note}</Gloss> : <StreamText text={obs.note} speed={85} onDone={addNoteDone} />}</p>
                      )}

                      {noteDone && obs.suggestedQuestion && level >= 2 && (
                        <button type="button" onClick={() => askMajlis(obs.suggestedQuestion!)} className="mt-2 flex items-start gap-1.5 text-left text-[12px] cursor-pointer hover:opacity-70" style={{ color: C.accent }}>
                          <MessageSquareQuote size={13} strokeWidth={2} className="mt-0.5 shrink-0" />
                          <span><span className="font-medium">{tr("suggested")}:</span> <span style={{ color: C.detail }}>{sugShown.has(item.id) ? <Gloss>{obs.suggestedQuestion}</Gloss> : <StreamText text={obs.suggestedQuestion!} speed={85} onDone={addSugDone} />}</span></span>
                        </button>
                      )}

                      {noteDone && sugDone && obs.commitment && (
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
                            {capturedIds.has(`c-${item.id}`) ? `✓ ${tr("capturedTick")}` : `+ ${tr("captureCommitment")}`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {revealed < FEED.length ? (
            <button type="button" onClick={() => setRevealed((r) => r + 1)} className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer transition active:scale-95 hover:opacity-90" style={{ background: C.ink, color: C.bg }}>
              {tr("nextSpeaker")} →
            </button>
          ) : lastStreamed ? (
            <div className="mt-4 text-[12px] majlis-fade-up" style={{ color: C.muted }}>{tr("endOfAgenda")}</div>
          ) : null}
        </Card>

        <Card
          labelKey="decisionOnTable"
          span={2}
          icon={Gavel}
          aside={
            <span className="text-[12px]" style={{ color: chairSpoke ? C.confirmed : C.muted }}>
              {chairSpoke ? tr("decided") : tr("inputsHeard", { n: entitiesHeard, m: entitiesTotal })}
            </span>
          }
        >
          <p className="text-[16px] font-medium leading-snug"><Gloss>{brief.decision.text}</Gloss></p>

          {/* Live view stays glanceable: the recommendation and the choices, not the full essay (that is in Before). */}
          <div className="mt-3 flex items-start gap-2 text-[14px] leading-snug">
            <Sparkles size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 2 }} className="shrink-0" />
            <span>
              <span className="font-semibold" style={{ color: C.accent }}>{tr("majlisRecommends")}: </span>
              <span style={{ color: C.ink }}><Gloss>{brief.decision.recommendation}</Gloss></span>
            </span>
          </div>

          {brief.decision.options.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] font-semibold mb-1.5" style={{ color: C.faint }}>{tr("yourOptions")}</div>
              <div className="space-y-1">
                {brief.decision.options.map((o) => (
                  <div key={o.label} className="flex items-start gap-2 text-[13px]" style={{ color: C.detail }}>
                    <span className="mt-[7px] h-1 w-1 rounded-full shrink-0" style={{ background: C.faint }} />
                    <span><Gloss>{o.label}</Gloss></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t flex items-center gap-3 flex-wrap" style={{ borderColor: C.line }}>
            {!chairSpoke ? (
              <span className="text-[12px]" style={{ color: C.muted }}>{tr("gatheringInputs")}</span>
            ) : decisionRecorded ? (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.confirmed }}>
                <CircleCheck size={15} strokeWidth={2.25} /> {tr("decisionRecorded")}
              </span>
            ) : (
              <>
                <span className="text-[13px]" style={{ color: C.ink }}>{tr("chairRuled")}: <span style={{ color: C.detail }}>&ldquo;<Gloss>{chairText}</Gloss>&rdquo;</span></span>
                <button
                  type="button"
                  onClick={() => addCommitment({ id: decisionId, entity: "Committee", text: chairText, due: "Next session", confidence: "confirmed", capturedAt: "during", citation: brief.bottomLine.citations[0] })}
                  className="text-[12px] rounded-lg px-2.5 py-1 cursor-pointer"
                  style={{ background: C.accent, color: C.onAccent }}
                >
                  {tr("recordDecision")}
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
