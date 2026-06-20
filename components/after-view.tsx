"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadState, resetMeeting, writeToMemory, type MeetingState } from "@/lib/store";
import { MEETING_META } from "@/lib/mock";
import { C, Card, ConfidenceBadge, RailLabel } from "@/components/ui";
import AppShell from "@/components/app-shell";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };
const PARTICIPANTS = ["HSA", "EKD", "MTA", "PSD", "EDD"];
const NAV = ["Decisions", "New commitments", "Action items", "Distribution", "Institutional memory"];

export default function AfterView() {
  const [state, setState] = useState<MeetingState>({ commitments: [], writtenToMemory: false });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const sync = () => setState(loadState());
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const decisions = state.commitments.filter((c) => c.entity === "Committee");
  const commitments = state.commitments.filter((c) => c.entity !== "Committee");
  const empty = state.commitments.length === 0;

  const leftRail = (
    <div className="space-y-6">
      <div>
        <RailLabel>Minutes</RailLabel>
        <nav className="space-y-1 text-[13px]">
          {NAV.map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="block hover:opacity-70" style={{ color: C.muted }}>
              {s}
            </a>
          ))}
        </nav>
      </div>
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
            <p className="text-[15px]" style={{ color: C.muted }}>Nothing captured yet — the minutes draft from what Majlis logs in the room.</p>
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
        <div className="lg:col-span-2">
          <h1 style={serif} className="text-[26px] leading-snug">Q2 Steering Committee — outcomes</h1>
          <p className="mt-1 text-[15px]" style={{ color: C.muted }}>Drafted from what Majlis captured in the room.</p>
        </div>

        {decisions.length > 0 && (
          <Card label="Decisions">
            <ul className="space-y-2">
              {decisions.map((d) => (
                <li key={d.id} className="rounded-lg p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                  <p className="text-[15px]">{d.text}</p>
                  <div className="mt-1.5"><ConfidenceBadge confidence={d.confidence} /></div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card label="New commitments">
          <ul className="space-y-2">
            {commitments.map((c) => (
              <li key={c.id} className="rounded-lg p-4" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[14px]">{c.entity}</span>
                  <span className="text-[12px]" style={{ color: C.muted }}>· due {c.due}</span>
                </div>
                <p className="text-[14px] mt-0.5">{c.text}</p>
                <div className="mt-1.5"><ConfidenceBadge confidence={c.confidence} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <Card label="Action items" span={2}>
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
                  <td className="py-2.5 font-semibold align-top whitespace-nowrap pr-3">{c.entity}</td>
                  <td className="py-2.5 align-top pr-3">{c.text}</td>
                  <td className="py-2.5 align-top whitespace-nowrap" style={{ color: C.muted }}>{c.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card label="Distribution">
          <div className="text-[13px]" style={{ color: C.muted }}>To: {PARTICIPANTS.join(" · ")}</div>
          <button
            type="button"
            onClick={() => setSent(true)}
            disabled={sent}
            className="mt-3 text-[13px] rounded-lg px-3 py-2 cursor-pointer disabled:opacity-70"
            style={sent ? { background: C.surfaceAlt, color: C.muted } : { background: C.accent, color: C.onAccent }}
          >
            {sent ? "✓ Minutes sent to participants" : "Send minutes to participants"}
          </button>
        </Card>

        <Card label="Institutional memory" span={2}>
          {state.writtenToMemory ? (
            <div className="rounded-xl p-4" style={{ background: C.priorBg, border: `1px solid ${C.priorBorder}` }}>
              <div className="font-medium text-[14px]" style={{ color: C.priorInk }}>✓ Written to institutional memory</div>
              <p className="text-[13px] mt-1" style={{ color: C.muted }}>
                These carry forward — they appear in the next Before brief&rsquo;s prior-commitment check, closing the loop.
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
