"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadState, resetMeeting, writeToMemory, type MeetingState } from "@/lib/store";
import { MEETING_META } from "@/lib/mock";
import { C, ConfidenceBadge, StageSpine } from "@/components/ui";

const serif = { fontFamily: "var(--font-newsreader), Georgia, serif" };

export default function AfterView() {
  const [state, setState] = useState<MeetingState>({ commitments: [], writtenToMemory: false });

  useEffect(() => {
    const sync = () => setState(loadState());
    sync();
    window.addEventListener("majlis-store", sync);
    return () => window.removeEventListener("majlis-store", sync);
  }, []);

  const decisions = state.commitments.filter((c) => c.entity === "Committee");
  const commitments = state.commitments.filter((c) => c.entity !== "Committee");

  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="border-b" style={{ borderColor: C.line }}>
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span style={serif} className="text-2xl">Majlis</span>
            <StageSpine active="after" />
          </div>
          <div className="text-[12px] text-right" style={{ color: C.muted }}>
            <div style={{ color: C.ink }} className="font-medium">Draft minutes</div>
            <div>{MEETING_META.session}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        {state.commitments.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            <p className="text-[15px]" style={{ color: C.muted }}>Nothing captured yet — the minutes draft from what Majlis logs in the room.</p>
            <Link href="/during" className="mt-3 inline-block text-[13px] rounded-lg px-3 py-2" style={{ background: C.ink, color: "#fff" }}>
              Go to the live meeting →
            </Link>
          </div>
        ) : (
          <>
            <section>
              <div className="text-[11px] uppercase mb-1" style={{ color: C.faint, letterSpacing: "0.1em" }}>Draft minutes</div>
              <h1 style={serif} className="text-[24px] leading-snug">Q2 Steering Committee — outcomes</h1>
              <p className="mt-2 text-[15px]" style={{ color: C.muted }}>
                Drafted from what Majlis captured in the room. Review, then write to memory.
              </p>
            </section>

            {decisions.length > 0 && (
              <section>
                <div className="text-[11px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.1em" }}>Decisions</div>
                <ul className="space-y-2">
                  {decisions.map((d) => (
                    <li key={d.id} className="rounded-lg p-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                      <p className="text-[15px]">{d.text}</p>
                      <div className="mt-1.5"><ConfidenceBadge confidence={d.confidence} /></div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <div className="text-[11px] uppercase mb-2" style={{ color: C.faint, letterSpacing: "0.1em" }}>
                New commitments — owners & due dates
              </div>
              <ul className="space-y-2">
                {commitments.map((c) => (
                  <li key={c.id} className="rounded-lg p-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[14px]">{c.entity}</span>
                      <span className="text-[12px]" style={{ color: C.muted }}>· due {c.due}</span>
                    </div>
                    <p className="text-[14px] mt-0.5">{c.text}</p>
                    <div className="mt-1.5"><ConfidenceBadge confidence={c.confidence} /></div>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="rounded-xl p-5"
              style={{ background: state.writtenToMemory ? "#F0F4EF" : C.surface, border: `1px solid ${state.writtenToMemory ? "#CBD9CB" : C.line}` }}
            >
              {state.writtenToMemory ? (
                <div>
                  <div className="font-medium text-[14px]" style={{ color: "#2F6B4F" }}>✓ Written to institutional memory</div>
                  <p className="text-[13px] mt-1" style={{ color: C.muted }}>
                    These commitments now carry forward. They appear in the next Before brief&rsquo;s prior-commitment check — closing the loop.
                  </p>
                  <Link href="/" className="mt-3 inline-block text-[13px] rounded-lg px-3 py-2" style={{ background: C.ink, color: "#fff" }}>
                    See them in the next brief →
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="font-medium text-[14px]">Write to institutional memory</div>
                  <p className="text-[13px] mt-1" style={{ color: C.muted }}>
                    Persist these so the next cycle&rsquo;s brief checks whether they were kept. This is the loop.
                  </p>
                  <button
                    type="button"
                    onClick={writeToMemory}
                    className="mt-3 text-[13px] rounded-lg px-3 py-2 cursor-pointer"
                    style={{ background: C.accent, color: "#fff" }}
                  >
                    Write {state.commitments.length} items to memory →
                  </button>
                </div>
              )}
            </section>

            <button type="button" onClick={resetMeeting} className="text-[12px] cursor-pointer" style={{ color: C.muted }}>
              Reset demo (clear captured state)
            </button>
          </>
        )}
      </main>
    </div>
  );
}
