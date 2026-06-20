"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CalendarRange,
  ChevronRight,
  Gavel,
  History,
  ListChecks,
  Loader2,
  MessageCircleQuestion,
  MessageSquareQuote,
  RefreshCw,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { MEETING_META } from "@/lib/mock";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { loadState, type Commitment } from "@/lib/store";
import { type Brief, BRIEF_CACHE_KEY, MOCK_BRIEF } from "@/lib/brief";
import { askMajlis } from "@/components/ask-bus";
import { C, Card, CitationChip, ConfidenceBadge, RailLabel, SeverityPill } from "@/components/ui";
import { Avatar, deptFor, MeetingContext, NavList, OrgBadge, StatusTag, TheRoom } from "@/components/rail";
import { useCitation } from "@/components/citation-context";
import { useParticipant } from "@/components/participant-context";
import { useOpenMeeting } from "@/components/meeting-context";
import { useDetail } from "@/components/detail-context";
import { Gloss } from "@/components/gloss";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const NAV = [
  { label: "The bottom line", icon: Target },
  { label: "Your decision", icon: Gavel },
  { label: "Needs attention", icon: TriangleAlert },
  { label: "Today's agenda", icon: CalendarClock },
  { label: "Who's in the room", icon: Users },
  { label: "Meeting series", icon: CalendarRange },
  { label: "Prep checklist", icon: ListChecks },
  { label: "Likely questions", icon: MessageCircleQuestion },
];

export default function BeforeView() {
  const { open } = useCitation();
  const { open: openProfile } = useParticipant();
  const { open: openMeeting } = useOpenMeeting();
  const { level } = useDetail();
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
      const res = await fetch("/api/brief", { method: "POST" });
      const data = await res.json();
      if (data && !data.error) {
        setBrief(data);
        setLive(true);
        localStorage.setItem(BRIEF_CACHE_KEY, JSON.stringify(data));
      }
    } catch {
      /* keep the current brief */
    } finally {
      setSyncing(false);
    }
  }

  // On first load, use the cached live brief if present, else synthesise it.
  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(BRIEF_CACHE_KEY) : null;
    if (cached) {
      try {
        setBrief(JSON.parse(cached));
        setLive(true);
        return;
      } catch {
        /* fall through to fetch */
      }
    }
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>In this brief</RailLabel>
        <NavList items={NAV} />
      </div>
      <TheRoom />
    </div>
  );

  const meta = (
    <>
      <div style={{ color: C.ink }} className="font-medium">{MEETING_META.session}</div>
      <div>Manarah, in {MEETING_META.minutesUntil} min</div>
    </>
  );

  const bl = brief.bottomLine;

  return (
    <AppShell stage="before" meta={meta} leftRail={leftRail}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {prior.length > 0 && (
          <Card label="Carried over, verify these were kept" span={2} icon={History}>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
              {prior.map((c) => (
                <li key={c.id} className="text-[13px] flex items-baseline gap-2">
                  <span className="font-semibold"><Gloss>{c.entity}</Gloss></span>
                  <span>{c.text}</span>
                  <span className="ml-auto whitespace-nowrap" style={{ color: C.muted }}>was due {c.due}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card
          label="The bottom line"
          span={2}
          icon={Target}
          aside={
            <button
              type="button"
              onClick={regenerate}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 text-[12px] cursor-pointer hover:opacity-70 disabled:opacity-50"
              style={{ color: C.muted }}
            >
              {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} strokeWidth={2} />}
              {syncing ? "Synthesising" : "Regenerate"}
            </button>
          }
        >
          <h1 style={serif} className="text-[30px] leading-tight"><Gloss>{bl.lead}</Gloss></h1>
          {level >= 2 && <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.detail }}><Gloss>{bl.detail}</Gloss></p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ConfidenceBadge confidence={bl.confidence} />
            {level >= 2 &&
              bl.citations.map((c, i) => (
                <CitationChip key={i} sourceId={c.sourceId} onClick={(pos) => open(c, pos)} />
              ))}
            {level >= 2 && bl.conflict && (
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
          {level >= 2 && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px]" style={{ color: C.faint }}>
              <Sparkles size={12} strokeWidth={2} />
              {live ? "Synthesised by Majlis from the committee pack" : "Sample brief, regenerating from the pack"}
            </div>
          )}
        </Card>

        <Card label="Your decision" span={2} icon={Gavel}>
          <div style={serif} className="text-[20px] leading-snug"><Gloss>{brief.decision.text}</Gloss></div>
          <div className="mt-3 rounded-xl p-3.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
            <div className="text-[11px] font-semibold mb-1" style={{ color: C.accent }}>Recommendation</div>
            <p className="text-[14px] leading-snug"><Gloss>{brief.decision.recommendation}</Gloss></p>
          </div>
          {level >= 2 && (
            <>
              <div className="mt-3 text-[13px]" style={{ color: C.muted }}>Hinges on → <Gloss>{brief.decision.hingesOn.join(", ")}</Gloss></div>
              {brief.decision.options.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-semibold mb-2" style={{ color: C.faint }}>Your options</div>
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

        <Card label="Needs attention" span={2} icon={TriangleAlert} aside={<span className="text-[12px]" style={{ color: C.muted }}>{brief.attention.length} of {PARTICIPANTS.length} need action</span>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {brief.attention.map((a) => {
              const sources = a.citations.filter((c, i, arr) => arr.findIndex((x) => x.sourceId === c.sourceId) === i);
              return (
                <div key={a.entity} className="rounded-xl p-3.5 flex flex-col" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  {/* Identity: the department (its short code lives in the badge), then its severity. */}
                  <div className="flex items-start gap-2.5">
                    <OrgBadge code={a.entity} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[14px] leading-tight">{deptFor(a.entity)?.name ?? a.entity}</div>
                      <div className="mt-1.5"><SeverityPill severity={a.severity} /></div>
                    </div>
                  </div>
                  {/* The issue. */}
                  <p className="text-[13px] leading-snug mt-3"><Gloss>{a.line}</Gloss></p>
                  {/* Evidence: how grounded, and in what. */}
                  {level >= 2 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: C.line }}>
                      <div className="text-[11px] font-semibold mb-1.5" style={{ color: C.faint }}>Evidence</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <ConfidenceBadge confidence={a.confidence} />
                        {sources.map((c, i) => (
                          <CitationChip key={i} sourceId={c.sourceId} onClick={(pos) => open(c, pos)} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {brief.steady.length > 0 && (
            <div className="mt-3 text-[12px]" style={{ color: C.muted }}>Also: <Gloss>{brief.steady.map((s) => `${s.entity} ${s.line}`).join(";  ")}</Gloss></div>
          )}
        </Card>

        <Card label="Today's agenda" span={2} icon={CalendarClock} minLevel={2}>
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

        <Card label="Who's in the room" span={2} icon={Users} minLevel={2} aside={<span className="text-[12px]" style={{ color: C.muted }}>tap a person for their full profile</span>}>
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
                        <div className="text-[13px] font-medium truncate">{dept?.name ?? p.entity}</div>
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

        <Card label="Meeting series" span={2} icon={CalendarRange} minLevel={3}>
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

        <Card label="Prep checklist" icon={ListChecks} minLevel={2}>
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

        <Card label="Likely questions" icon={MessageCircleQuestion} minLevel={3}>
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
      </div>
    </AppShell>
  );
}
