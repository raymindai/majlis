"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CalendarRange,
  Gavel,
  ListChecks,
  MessageCircleQuestion,
  MessageSquareQuote,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { ATTENTION, BOTTOM_LINE, DECISION, MEETING_META, STEADY } from "@/lib/mock";
import { ENTITIES } from "@/lib/corpus";
import { MEETINGS, PARTICIPANTS } from "@/lib/meetings";
import { loadState, type Commitment } from "@/lib/store";
import { askMajlis } from "@/components/ask-bus";
import { C, Card, CitationChip, ConfidenceBadge, RailLabel, SeverityPill } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const PREP = [
  "Reconcile MTA's budget figure (40 vs 52) before the reallocation vote.",
  "Get a firm SSO recovery date from EDD — it gates HSA and EKD.",
  "Note EKD missed its June commitment; the July 'catch-up' is unverified.",
];

const LIKELY_QS = [
  { q: "Why defer the reallocation?", line: "MTA's figure doesn't reconcile yet — we vote once it does." },
  { q: "Is the SSO slip contained?", line: "No — it blocks HSA and EKD go-lives; EDD owes a recovery date." },
  { q: "Is EKD on track?", line: "It missed the June portal commitment; the July catch-up is unverified." },
];

const NAV = [
  { label: "The bottom line", icon: Target },
  { label: "Your decision", icon: Gavel },
  { label: "Needs attention", icon: TriangleAlert },
  { label: "Who's in the room", icon: Users },
  { label: "Meeting series", icon: CalendarRange },
  { label: "Prep checklist", icon: ListChecks },
  { label: "Likely questions", icon: MessageCircleQuestion },
];

const statusColor: Record<string, string> = { "on-track": C.confirmed, "at-risk": C.likely, slipped: C.unverified, restricted: C.faint };
const statusLabel: Record<string, string> = { "on-track": "On track", "at-risk": "At risk", slipped: "Slipped", restricted: "Restricted" };

function initials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

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

  const currentIndex = MEETINGS.findIndex((m) => m.current) + 1;

  const leftRail = (
    <div className="space-y-6">
      <div className="rounded-xl p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
        <div className="flex items-start gap-2">
          <CalendarClock size={15} strokeWidth={2} style={{ color: C.accent, marginTop: 1 }} className="shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold leading-tight">{MEETING_META.session}</div>
            <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>
              in {MEETING_META.minutesUntil} min · {currentIndex} of {MEETINGS.length} in the series
            </div>
          </div>
        </div>
      </div>

      <div>
        <RailLabel>In this brief</RailLabel>
        <nav className="-mx-2 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <a
                key={n.label}
                href={`#${slug(n.label)}`}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] hover:bg-[var(--c-surface-alt)]"
                style={{ color: C.muted }}
              >
                <Icon size={15} strokeWidth={2} style={{ color: C.faint }} className="shrink-0" />
                {n.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div>
        <RailLabel>The room</RailLabel>
        <ul className="space-y-2.5">
          {ENTITIES.map((e) => (
            <li key={e.id} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: statusColor[e.status] }} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[13px]">{e.id}</span>
                  <span className="text-[11px]" style={{ color: statusColor[e.status] }}>{statusLabel[e.status]}</span>
                </div>
                <div className="text-[11px] truncate" style={{ color: C.muted }}>{e.name}</div>
              </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {prior.length > 0 && (
          <Card label="Carried over — verify these were kept" span={2}>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
              {prior.map((c) => (
                <li key={c.id} className="text-[13px] flex items-baseline gap-2">
                  <span className="font-semibold">{c.entity}</span>
                  <span>{c.text}</span>
                  <span className="ml-auto whitespace-nowrap" style={{ color: C.muted }}>was due {c.due}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card label="The bottom line" span={2}>
          <h1 style={serif} className="text-[30px] leading-tight">{BOTTOM_LINE.lead}</h1>
          <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.detail }}>{BOTTOM_LINE.detail}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ConfidenceBadge confidence={BOTTOM_LINE.confidence} />
            {BOTTOM_LINE.citations.map((c, i) => (
              <CitationChip key={i} sourceId={c.sourceId} onClick={() => open(c)} />
            ))}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] rounded-full px-2 py-0.5"
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
        </Card>

        <Card label="Your decision" span={2}>
          <div style={serif} className="text-[20px] leading-snug">{DECISION.text}</div>
          <div className="mt-2 text-[13px]" style={{ color: C.muted }}>Hinges on → {DECISION.hingesOn.join(" · ")}</div>
        </Card>

        <Card label="Needs attention" span={2} aside={<span className="text-[12px]" style={{ color: C.muted }}>3 of 5 need action</span>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ATTENTION.map((a) => (
              <div key={a.id} className="rounded-xl p-3.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[14px]">{a.id}</span>
                  <SeverityPill severity={a.severity} />
                </div>
                <div className="text-[12px] mt-1" style={{ color: C.muted }}>{a.name}</div>
                <p className="text-[13px] leading-snug mt-2">{a.line}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <ConfidenceBadge confidence={a.confidence} />
                  {a.citations.map((c, i) => (
                    <CitationChip key={i} sourceId={c.sourceId} onClick={() => open(c)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[12px]" style={{ color: C.muted }}>Also: {STEADY.map((s) => `${s.id} — ${s.line}`).join("  ·  ")}</div>
        </Card>

        <Card label="Who's in the room" span={2} aside={<span className="text-[12px]" style={{ color: C.muted }}>ask the right person</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PARTICIPANTS.map((p) => (
              <div key={p.id} className="rounded-xl p-3.5 flex gap-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                  style={{ background: `color-mix(in srgb, ${C.accent} 16%, transparent)`, color: C.accent }}
                >
                  {initials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[14px]">{p.name}</span>
                    {p.status && (
                      <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: statusColor[p.status] }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[p.status] }} />
                        {statusLabel[p.status]}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px]" style={{ color: C.muted }}>{p.role} · {p.entity}</div>
                  <div className="text-[12px] mt-1" style={{ color: C.detail }}>Owns: {p.owns}</div>
                  {p.ask && (
                    <button
                      type="button"
                      onClick={() => askMajlis(`On ${p.entity}: ${p.ask}`)}
                      className="mt-2 flex items-start gap-1.5 text-left text-[12px] cursor-pointer hover:opacity-70"
                      style={{ color: C.accent }}
                    >
                      <MessageSquareQuote size={13} strokeWidth={2} className="mt-0.5 shrink-0" />
                      <span><span className="font-medium">Ask them:</span> <span style={{ color: C.detail }}>{p.ask}</span></span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card label="Meeting series" span={2}>
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
                <div className="flex-1 pb-4 rounded-lg" style={m.current ? { background: C.surfaceAlt, padding: "2px 8px", marginLeft: "-8px" } : undefined}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[12px] w-20 shrink-0" style={{ color: C.faint }}>{m.when}</span>
                    <span className="font-semibold text-[14px]" style={{ color: m.current ? C.accent : C.ink }}>{m.title}</span>
                  </div>
                  {m.relation && <div className="text-[13px] mt-0.5 ml-[5.5rem]" style={{ color: C.detail }}>{m.relation}</div>}
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card label="Prep checklist">
          <ul className="space-y-2.5">
            {PREP.map((p, i) => (
              <li key={i}>
                <button type="button" onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} className="flex items-start gap-2.5 text-left cursor-pointer w-full">
                  <span
                    className="mt-0.5 h-4 w-4 rounded shrink-0 flex items-center justify-center text-[11px]"
                    style={{ border: `1.5px solid ${checked[i] ? C.confirmed : C.line}`, background: checked[i] ? C.confirmed : "transparent", color: C.onAccent }}
                  >
                    {checked[i] ? "✓" : ""}
                  </span>
                  <span className="text-[14px] leading-snug" style={{ color: checked[i] ? C.muted : C.ink, textDecoration: checked[i] ? "line-through" : "none" }}>
                    {p}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card label="Likely questions">
          <ul className="space-y-3">
            {LIKELY_QS.map((x, i) => (
              <li key={i}>
                <div className="text-[14px] font-medium">{x.q}</div>
                <div className="text-[13px] mt-0.5" style={{ color: C.muted }}>Your line → {x.line}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
