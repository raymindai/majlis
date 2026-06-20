"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CalendarRange,
  ChevronRight,
  CircleCheck,
  FileText,
  Gavel,
  History,
  ListChecks,
  Loader2,
  MessageCircleQuestion,
  MessageSquareQuote,
  OctagonAlert,
  RefreshCw,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { loadState, type Commitment } from "@/lib/store";
import { type Brief, BRIEF_CACHE_KEY, MOCK_BRIEF } from "@/lib/brief";
import { SOURCES, SOURCE_META, AUTHORITY_LABEL, deptNameI18n } from "@/lib/corpus";
import { askMajlis } from "@/components/ask-bus";
import { C, Card, CitationChip, ConfidenceBadge, RailLabel, severityColor } from "@/components/ui";
import { Avatar, deptFor, MeetingContext, NavList, OrgBadge, StatusTag, TheRoom } from "@/components/rail";
import { useCitation } from "@/components/citation-context";
import { useParticipant } from "@/components/participant-context";
import { useOpenMeeting } from "@/components/meeting-context";
import { useDetail } from "@/components/detail-context";
import { useLang } from "@/components/lang-context";
import { Gloss } from "@/components/gloss";
import RailCalendar from "@/components/rail-calendar";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

const NAV = [
  { key: "bottomLine", icon: Target },
  { key: "yourDecision", icon: Gavel },
  { key: "needsAttention", icon: TriangleAlert },
  { key: "todaysAgenda", icon: CalendarClock, min: 2 },
  { key: "whoInRoom", icon: Users, min: 2 },
  { key: "meetingSeries", icon: CalendarRange, min: 3 },
  { key: "prepChecklist", icon: ListChecks, min: 2 },
  { key: "likelyQuestions", icon: MessageCircleQuestion, min: 3 },
  { key: "committeePack", icon: FileText, min: 3 },
];

export default function BeforeView() {
  const { open } = useCitation();
  const { open: openProfile } = useParticipant();
  const { open: openMeeting } = useOpenMeeting();
  const { level } = useDetail();
  const { lang, t: tr } = useLang();
  const [prior, setPrior] = useState<Commitment[]>([]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [brief, setBrief] = useState<Brief>(MOCK_BRIEF);
  const [syncing, setSyncing] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const sync = () => {
      const s = loadState();
      setPrior(s.writtenToMemory ? s.commitments : []);
    };
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  async function regenerate() {
    setSyncing(true);
    try {
      const res = await fetch("/api/brief", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang }) });
      const data = await res.json();
      if (data && !data.error) {
        setBrief(data);
        setLive(true);
        localStorage.setItem(`${BRIEF_CACHE_KEY}:${lang}`, JSON.stringify(data));
      }
    } catch {
      /* keep the current brief */
    } finally {
      setSyncing(false);
    }
  }

  // On load and whenever the language changes, use the cached brief for that
  // language if present, else synthesise it fresh in that language.
  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(`${BRIEF_CACHE_KEY}:${lang}`) : null;
    if (cached) {
      try {
        setBrief(JSON.parse(cached));
        setLive(true);
        return;
      } catch {
        /* fall through to fetch */
      }
    }
    setLive(false);
    setBrief(MOCK_BRIEF);
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>{tr("inThisBrief")}</RailLabel>
        <NavList items={NAV} />
      </div>
      <RailCalendar />
      <TheRoom />
    </div>
  );

  const bl = brief.bottomLine;

  return (
    <AppShell stage="before" leftRail={leftRail}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: C.faint }}>
          <Sparkles size={13} strokeWidth={2} />
          {live ? tr("briefingLive") : tr("briefingSample")}
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 text-[12px] rounded-lg px-3 py-1.5 cursor-pointer hover:opacity-80 disabled:opacity-50"
          style={{ background: C.surfaceAlt, border: `1px solid ${C.line}`, color: C.muted }}
        >
          {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2} />}
          {syncing ? tr("synthesising") : tr("regenerateBrief")}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {prior.length > 0 && (
          <Card labelKey="carriedOver" span={2} icon={History}>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
              {prior.map((c) => (
                <li key={c.id} className="text-[13px] leading-snug">
                  <span className="font-semibold"><Gloss>{c.entity}</Gloss></span>{" "}
                  <Gloss>{c.text}</Gloss>{" "}
                  <span className="whitespace-nowrap" style={{ color: C.muted }}>({tr("wasDue")} {c.due})</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card labelKey="bottomLine" span={2} icon={Target}>
          <h1 style={serif} className="text-[30px] leading-tight"><Gloss>{bl.lead}</Gloss></h1>
          {level >= 2 && <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.detail }}><Gloss>{bl.detail}</Gloss></p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium" style={{ color: C.faint }}>{tr("confidence")}</span>
            <ConfidenceBadge confidence={bl.confidence} />
            <span className="text-[11px] font-medium ml-1" style={{ color: C.faint }}>{tr("sources")}</span>
            {bl.citations.map((c, i) => (
              <CitationChip key={i} sourceId={c.sourceId} onClick={(pos) => open(c, pos)} />
            ))}
            {bl.conflict && (
              <>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] rounded-full px-2 py-0.5"
                  style={{ background: C.flagBg, color: C.unverified, border: `1px solid ${C.flagBorder}` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.unverified }} />
                  {bl.conflict.label}
                </span>
                {bl.conflict.citations.map((c, i) => (
                  <CitationChip key={`cf-${i}`} sourceId={c.sourceId} onClick={(pos) => open(c, pos)} />
                ))}
              </>
            )}
          </div>
        </Card>

        <Card labelKey="yourDecision" span={2} icon={Gavel}>
          <div style={serif} className="text-[20px] leading-snug"><Gloss>{brief.decision.text}</Gloss></div>
          <div className="mt-3 rounded-xl p-3.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
            <div className="text-[11px] font-semibold mb-1" style={{ color: C.accent }}>{tr("recommendation")}</div>
            <p className="text-[14px] leading-snug"><Gloss>{brief.decision.recommendation}</Gloss></p>
            {brief.decision.rationale && (
              <p className="text-[13px] leading-relaxed mt-2.5 pt-2.5 border-t" style={{ borderColor: C.line, color: C.detail }}>
                <span className="font-medium" style={{ color: C.ink }}>{tr("why")}: </span>
                <Gloss>{brief.decision.rationale}</Gloss>
              </p>
            )}
          </div>
          {level >= 2 && (
            <>
              <div className="mt-3 text-[13px]" style={{ color: C.muted }}>{tr("hingesOn")} → <Gloss>{brief.decision.hingesOn.join(", ")}</Gloss></div>
              {brief.decision.options.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-semibold mb-2" style={{ color: C.faint }}>{tr("yourOptions")}</div>
                  <ul className="space-y-2">
                    {brief.decision.options.map((o, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px]">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: C.faint }} />
                        <span>
                          <span className="font-medium"><Gloss>{o.label}</Gloss>.</span>{" "}
                          <span style={{ color: C.detail }}><Gloss>{o.consequence}</Gloss></span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Card>

        <Card labelKey="needsAttention" span={2} icon={TriangleAlert} aside={<span className="text-[12px]" style={{ color: C.muted }}>{tr("needAction", { n: brief.attention.length, m: PARTICIPANTS.length })}</span>}>
          <div className="space-y-5">
            {(["blocker", "at-risk"] as const).map((sev) => {
              const items = brief.attention.filter((a) => a.severity === sev);
              if (items.length === 0) return null;
              const tint =
                sev === "blocker"
                  ? { background: C.flagBg, border: `1px solid ${C.flagBorder}` }
                  : { background: C.surfaceAlt, border: `1px solid ${C.line}` };
              return (
                <div key={sev}>
                  <div className="flex items-center gap-2 mb-3">
                    {sev === "blocker" ? (
                      <OctagonAlert size={15} strokeWidth={2.25} style={{ color: severityColor[sev] }} className="shrink-0" />
                    ) : (
                      <TriangleAlert size={15} strokeWidth={2.25} style={{ color: severityColor[sev] }} className="shrink-0" />
                    )}
                    <h3 className="text-[13px] font-semibold" style={{ color: C.ink }}>{tr(sev === "blocker" ? "blocker" : "atRisk")}</h3>
                    <span className="text-[11px]" style={{ color: C.faint }}>{items.length} {tr(items.length === 1 ? "entity" : "entities")}</span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-3">
                    {items.map((a) => {
                      const sources = a.citations.filter((c, i, arr) => arr.findIndex((x) => x.sourceId === c.sourceId) === i);
                      return (
                        <div key={a.entity} className="rounded-xl p-3.5 flex flex-col" style={tint}>
                          <div className="flex items-center gap-2.5">
                            <OrgBadge code={a.entity} size={30} />
                            <div className="font-semibold text-[14px] leading-tight min-w-0 flex-1">{deptNameI18n(a.entity, lang) ?? a.entity}</div>
                          </div>
                          <p className="text-[13px] leading-snug mt-3"><Gloss>{a.line}</Gloss></p>
                          {a.action && (
                            <div className="mt-3.5 pl-3 border-l-2" style={{ borderColor: C.accent }}>
                              <div className="text-[11px] font-semibold mb-1 inline-flex items-center gap-1" style={{ color: C.accent }}>
                                <Sparkles size={11} strokeWidth={2.5} /> {tr("recommendedAction")}
                              </div>
                              <p className="text-[13px] leading-snug" style={{ color: C.detail }}><Gloss>{a.action}</Gloss></p>
                            </div>
                          )}
                          {/* Evidence stays visible at every zoom: the claim is always linked to its source. */}
                          <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: C.line }}>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-semibold" style={{ color: C.faint }}>{tr("confidence")}</span>
                              <ConfidenceBadge confidence={a.confidence} />
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-semibold" style={{ color: C.faint }}>{tr("sources")}</span>
                              {sources.map((c, i) => (
                                <CitationChip key={i} sourceId={c.sourceId} onClick={(pos) => open(c, pos)} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {brief.steady.length > 0 && (
              <div className="pt-4 border-t" style={{ borderColor: C.line }}>
                <div className="flex items-center gap-2 mb-3">
                  <CircleCheck size={15} strokeWidth={2.25} style={{ color: C.confirmed }} className="shrink-0" />
                  <h3 className="text-[13px] font-semibold" style={{ color: C.ink }}>{tr("onTrack")}</h3>
                  <span className="text-[11px]" style={{ color: C.faint }}>{brief.steady.length} {tr(brief.steady.length === 1 ? "entity" : "entities")}</span>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
                  {brief.steady.map((s) => {
                    const dept = deptFor(s.entity);
                    return (
                      <div key={s.entity} className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                        <OrgBadge code={s.entity} size={28} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[13px]">{deptNameI18n(s.entity, lang) ?? s.entity}</span>
                            {dept && <StatusTag status={dept.status} />}
                          </div>
                          <p className="text-[12px] mt-0.5" style={{ color: C.muted }}><Gloss>{s.line}</Gloss></p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card labelKey="todaysAgenda" span={2} icon={CalendarClock} minLevel={2}>
          <ol className="space-y-3">
            {brief.agenda.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[12px] font-semibold mt-0.5 shrink-0 w-5 text-right" style={{ color: C.faint }}>{i + 1}</span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium"><Gloss>{a.item}</Gloss></div>
                  <div className="text-[13px] mt-0.5" style={{ color: C.muted }}><Gloss>{a.note}</Gloss></div>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card labelKey="whoInRoom" span={2} icon={Users} minLevel={2} aside={<span className="text-[12px]" style={{ color: C.muted }}>{tr("tapPerson")}</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PARTICIPANTS.map((p) => {
              const dept = deptFor(p.entity);
              return (
                <div key={p.id} className="rounded-xl flex flex-col overflow-hidden" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <button type="button" onClick={(e) => openProfile(p.id, { x: e.clientX, y: e.clientY })} className="group flex items-center gap-3 p-3.5 text-left cursor-pointer hover:bg-[var(--c-surface)]">
                    <Avatar id={p.id} name={p.name} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14px] truncate">{p.name}</div>
                      <div className="text-[12px] truncate" style={{ color: C.muted }}>{p.role}</div>
                    </div>
                    <ChevronRight size={16} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: C.faint }} />
                  </button>
                  <div className="px-3.5 pb-3">
                    <div className="text-[11px] mb-1.5" style={{ color: C.faint }}>Represents</div>
                    <div className="flex items-center gap-2.5">
                      <OrgBadge code={p.entity} size={26} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{deptNameI18n(p.entity, lang) ?? p.entity}</div>
                        <div className="text-[12px] truncate" style={{ color: C.detail }}>Owns {p.owns}</div>
                      </div>
                      {dept && <StatusTag status={dept.status} className="self-start shrink-0" />}
                    </div>
                  </div>
                  {p.ask && (
                    <button
                      type="button"
                      onClick={() => askMajlis(`On ${p.entity}: ${p.ask}`)}
                      className="flex items-start gap-2 text-left px-3.5 py-2.5 border-t cursor-pointer hover:bg-[var(--c-surface)]"
                      style={{ borderColor: C.line }}
                    >
                      <MessageSquareQuote size={14} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
                      <span className="text-[12px] leading-snug">
                        <span className="font-semibold" style={{ color: C.accent }}>Ask {p.name.split(" ")[0]}:</span>{" "}
                        <span style={{ color: C.detail }}>{p.ask}</span>
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card labelKey="meetingSeries" span={2} icon={CalendarRange} minLevel={3}>
          <div className="text-[12px] mb-4" style={{ color: C.muted }}>Today&rsquo;s steering committee sits in a string of related meetings.</div>
          <ol>
            {MEETINGS.map((m, i) => (
              <li key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: m.current ? C.accent : m.status === "past" ? C.muted : "transparent", border: m.current ? "none" : `1.5px solid ${C.line}` }}
                  />
                  {i < MEETINGS.length - 1 && <span className="w-px flex-1 my-1" style={{ background: C.line }} />}
                </div>
                <button
                  type="button"
                  onClick={(e) => openMeeting(m.id, { x: e.clientX, y: e.clientY })}
                  className={`group flex-1 flex items-start justify-between gap-2 text-left cursor-pointer rounded-lg px-2 -mx-2 pt-1 pb-4 hover:bg-[var(--c-surface-alt)] ${m.current ? "bg-[var(--c-surface-alt)]" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[12px] w-20 shrink-0" style={{ color: C.faint }}>{m.when}</span>
                      <span className="font-semibold text-[14px]" style={{ color: m.current ? C.accent : C.ink }}>{m.title}</span>
                    </span>
                    {m.relation && <span className="block text-[13px] mt-0.5 ml-[5.5rem]" style={{ color: C.detail }}><Gloss>{m.relation}</Gloss></span>}
                  </span>
                  <ChevronRight size={15} strokeWidth={2} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.faint }} />
                </button>
              </li>
            ))}
          </ol>
        </Card>

        <Card labelKey="prepChecklist" icon={ListChecks} minLevel={2}>
          <ul className="space-y-2.5">
            {brief.prep.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <button type="button" onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} className="mt-0.5 shrink-0 cursor-pointer" aria-label="toggle">
                  <span
                    className="h-4 w-4 rounded flex items-center justify-center text-[11px]"
                    style={{ border: `1.5px solid ${checked[i] ? C.confirmed : C.line}`, background: checked[i] ? C.confirmed : "transparent", color: C.onAccent }}
                  >
                    {checked[i] ? "✓" : ""}
                  </span>
                </button>
                <div className="flex-1">
                  <span className="text-[14px] leading-snug" style={{ color: checked[i] ? C.muted : C.ink, textDecoration: checked[i] ? "line-through" : "none" }}>
                    <Gloss>{p.text}</Gloss>
                  </span>
                  {p.citation && (
                    <span className="ml-1.5 inline-block align-middle">
                      <CitationChip sourceId={p.citation.sourceId} onClick={(pos) => open(p.citation!, pos)} />
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card labelKey="likelyQuestions" icon={MessageCircleQuestion} minLevel={3}>
          <ul className="space-y-3">
            {brief.likelyQuestions.map((x, i) => (
              <li key={i}>
                <div className="text-[14px] font-medium"><Gloss>{x.q}</Gloss></div>
                <div className="text-[13px] mt-0.5" style={{ color: C.muted }}>Your line → <Gloss>{x.line}</Gloss></div>
                {x.citation && (
                  <div className="mt-1">
                    <CitationChip sourceId={x.citation.sourceId} onClick={(pos) => open(x.citation!, pos)} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card labelKey="committeePack" span={2} icon={FileText} minLevel={3} aside={<span className="text-[12px]" style={{ color: C.muted }}>{SOURCES.length} {tr("documents")}</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SOURCES.map((s) => {
              const m = SOURCE_META[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => open({ sourceId: s.id, passageId: s.passages[0].id }, { x: e.clientX, y: e.clientY })}
                  className="flex items-start gap-2.5 text-left rounded-xl p-3 cursor-pointer hover:bg-[var(--c-surface)]"
                  style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
                >
                  <FileText size={16} strokeWidth={2} style={{ color: C.faint, marginTop: 1 }} className="shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold leading-tight">{s.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{[m?.docType, m?.issuer, s.date ?? "undated"].filter(Boolean).join(", ")}</div>
                    <div className="text-[11px] mt-1" style={{ color: C.faint }}>{AUTHORITY_LABEL[s.authority]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
