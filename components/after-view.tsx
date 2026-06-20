"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, FileText, Gavel, Handshake, ListChecks, Send, Sparkles } from "lucide-react";
import { loadState, resetMeeting, writeToMemory, type MeetingState } from "@/lib/store";
import { MEETING_META } from "@/lib/mock";
import { PARTICIPANTS } from "@/lib/meetings";
import { C, Card, ConfidenceBadge, RailLabel } from "@/components/ui";
import { Avatar, MeetingContext, NavList, TheRoom } from "@/components/rail";
import { useParticipant } from "@/components/participant-context";
import { Gloss } from "@/components/gloss";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

const NAV = [
  { label: "Decisions", icon: Gavel },
  { label: "New commitments", icon: Handshake },
  { label: "Action items", icon: ListChecks },
  { label: "Distribution", icon: Send },
  { label: "Institutional memory", icon: Database },
];

export default function AfterView() {
  const { open: openProfile } = useParticipant();
  const [state, setState] = useState<MeetingState>({ commitments: [], writtenToMemory: false });
  const [sent, setSent] = useState(false);
  const [minutes, setMinutes] = useState<{ headline: string; summary: string; distributionNote: string } | null>(null);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    const sync = () => setState(loadState());
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const decisions = state.commitments.filter((c) => c.entity === "Committee");
  const commitments = state.commitments.filter((c) => c.entity !== "Committee");
  const empty = state.commitments.length === 0;

  // Draft the minutes live from what was captured, re-drafting if the set changes.
  const sig = state.commitments.map((c) => c.id).join(",");
  useEffect(() => {
    if (!sig) {
      setMinutes(null);
      return;
    }
    let cancelled = false;
    setDrafting(true);
    const items = state.commitments.map((c) => ({ entity: c.entity, text: c.text, due: c.due, kind: c.entity === "Committee" ? "decision" : "commitment" }));
    fetch("/api/minutes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items }) })
      .then((r) => r.json())
      .then((m) => {
        if (!cancelled && m && !m.error) setMinutes(m);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDrafting(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  const leftRail = (
    <div className="space-y-6">
      <MeetingContext />
      <div>
        <RailLabel>Minutes</RailLabel>
        <NavList items={NAV} />
      </div>
      <TheRoom />
      <button type="button" onClick={resetMeeting} className="text-[12px] cursor-pointer hover:opacity-70" style={{ color: C.muted }}>
        Reset demo
      </button>
    </div>
  );

  const meta = (
    <>
      <div className="font-medium" style={{ color: C.ink }}>Draft minutes</div>
      <div style={{ color: C.muted }}>{MEETING_META.session}</div>
    </>
  );

  if (empty) {
    return (
      <AppShell stage="after" meta={meta} leftRail={leftRail}>
        <Card>
          <div className="text-center py-6">
            <p className="text-[15px]" style={{ color: C.muted }}>Nothing captured yet. The minutes draft from what Majlis logs in the room.</p>
            <Link href="/during" className="mt-3 inline-block text-[13px] rounded-lg px-3 py-2" style={{ background: C.ink, color: C.bg }}>
              Go to the live meeting →
            </Link>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell stage="after" meta={meta} leftRail={leftRail}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card label="Minutes" span={2} icon={FileText}>
          {minutes ? (
            <>
              <h1 style={serif} className="text-[24px] leading-snug"><Gloss>{minutes.headline}</Gloss></h1>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.detail }}><Gloss>{minutes.summary}</Gloss></p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[11px]" style={{ color: C.faint }}>
                <Sparkles size={12} strokeWidth={2} /> Drafted by Majlis from what was captured{drafting ? ", updating…" : ""}
              </div>
            </>
          ) : (
            <div className="text-[14px] flex items-center gap-2 py-2" style={{ color: C.muted }}>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: C.accent }} /> Majlis is drafting the minutes…
            </div>
          )}
        </Card>

        {decisions.length > 0 && (
          <Card label="Decisions" icon={Gavel}>
            <ul className="space-y-2">
              {decisions.map((d) => (
                <li key={d.id} className="rounded-lg p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <p className="text-[15px]"><Gloss>{d.text}</Gloss></p>
                  <div className="mt-1.5"><ConfidenceBadge confidence={d.confidence} /></div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card label="New commitments" icon={Handshake}>
          <ul className="space-y-2">
            {commitments.map((c) => (
              <li key={c.id} className="rounded-lg p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[14px]"><Gloss>{c.entity}</Gloss></span>
                  <span className="text-[12px]" style={{ color: C.muted }}>due {c.due}</span>
                </div>
                <p className="text-[14px] mt-0.5"><Gloss>{c.text}</Gloss></p>
                <div className="mt-1.5"><ConfidenceBadge confidence={c.confidence} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <Card label="Action items" span={2} icon={ListChecks}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ color: C.faint }}>
                <th className="text-left font-medium pb-2">Owner</th>
                <th className="text-left font-medium pb-2">Action</th>
                <th className="text-left font-medium pb-2">Due</th>
              </tr>
            </thead>
            <tbody>
              {commitments.map((c) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="py-2.5 font-semibold align-top whitespace-nowrap pr-3"><Gloss>{c.entity}</Gloss></td>
                  <td className="py-2.5 align-top pr-3"><Gloss>{c.text}</Gloss></td>
                  <td className="py-2.5 align-top whitespace-nowrap" style={{ color: C.muted }}>{c.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card label="Distribution" icon={Send}>
          {minutes?.distributionNote && (
            <div className="text-[13px] leading-snug mb-3 rounded-lg p-3" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}`, color: C.detail }}>
              <Gloss>{minutes.distributionNote}</Gloss>
            </div>
          )}
          <div className="text-[11px] font-semibold mb-2.5" style={{ color: C.faint }}>Recipients</div>
          <div className="flex flex-wrap gap-2">
            {PARTICIPANTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => openProfile(p.id, { x: e.clientX, y: e.clientY })}
                className="inline-flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 cursor-pointer hover:opacity-80"
                style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}
              >
                <Avatar id={p.id} name={p.name} size={20} />
                <span className="text-[12px]">{p.name}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSent(true)}
            disabled={sent}
            className="mt-4 text-[13px] rounded-lg px-3 py-2 cursor-pointer disabled:opacity-70"
            style={sent ? { background: C.surfaceAlt, color: C.muted } : { background: C.accent, color: C.onAccent }}
          >
            {sent ? "✓ Minutes sent to participants" : "Send minutes to participants"}
          </button>
        </Card>

        <Card label="Institutional memory" span={2} icon={Database}>
          {state.writtenToMemory ? (
            <div className="rounded-xl p-4" style={{ background: C.priorBg, border: `1px solid ${C.priorBorder}` }}>
              <div className="font-medium text-[14px]" style={{ color: C.priorInk }}>✓ Written to institutional memory</div>
              <p className="text-[13px] mt-1" style={{ color: C.muted }}>
                These carry forward. They appear in the next Before brief&rsquo;s prior-commitment check, closing the loop.
              </p>
              <Link href="/" className="mt-3 inline-block text-[13px] rounded-lg px-3 py-2" style={{ background: C.ink, color: C.bg }}>
                See them in the next brief →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-[13px]" style={{ color: C.muted }}>
                Persist these so the next cycle&rsquo;s brief checks whether they were kept. This is the loop.
              </p>
              <button type="button" onClick={writeToMemory} className="mt-3 text-[13px] rounded-lg px-3 py-2 cursor-pointer" style={{ background: C.accent, color: C.onAccent }}>
                Write {state.commitments.length} items to memory →
              </button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
