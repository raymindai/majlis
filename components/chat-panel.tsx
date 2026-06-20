"use client";

import { useEffect, useRef, useState } from "react";
import { StickyNote } from "lucide-react";
import { ASK_EVENT } from "@/components/ask-bus";
import { C, CitationChip, ConfidenceBadge } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import { addNote, loadNotes } from "@/lib/notes";
import { Gloss } from "@/components/gloss";
import type { Confidence } from "@/lib/corpus";

type Claim = { text: string; confidence: Confidence; sourceId: string; passageId: string };
type Answer = { notInMaterial: boolean; summary: string; claims: Claim[] };
type Msg = { role: "user"; text: string } | { role: "assistant"; answer: Answer };

const STAGE_HINT: Record<string, string> = {
  before: "e.g. Did EKD meet its March commitment?",
  during: "e.g. What did EDD just commit to?",
  after: "e.g. What's still outstanding?",
};

export default function ChatPanel({ stage }: { stage: "before" | "during" | "after" }) {
  const { open } = useCitation();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function ask(text?: string) {
    const t = (text ?? q).trim();
    if (!t || loading) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setQ("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: t }),
      });
      const data = (await res.json()) as Answer;
      setMsgs((m) => [...m, { role: "assistant", answer: data }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", answer: { notInMaterial: false, summary: "Couldn't reach the assistant. Try again.", claims: [] } }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));
    }
  }

  const askRef = useRef(ask);
  askRef.current = ask;
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent).detail;
      if (typeof q === "string") askRef.current(q);
    };
    window.addEventListener(ASK_EVENT, handler);
    return () => window.removeEventListener(ASK_EVENT, handler);
  }, []);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="shrink-0 px-4 py-3 border-b" style={{ borderColor: C.line }}>
        <div className="text-[13px] font-semibold" style={{ color: C.ink }}>Ask Majlis</div>
        <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>Grounded in the committee pack. Every answer cites its source.</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {msgs.length === 0 && (
          <div className="text-[13px] leading-relaxed" style={{ color: C.muted }}>
            Ask anything about what&rsquo;s happening. Each answer carries a confidence rating and a citation you can open.
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="text-[14px] rounded-lg px-3 py-2 ml-6" style={{ background: C.chipBg, color: C.ink }}>
              {m.text}
            </div>
          ) : (
            <div key={i} className="text-[14px]">
              {m.answer.summary && <p className="leading-relaxed mb-2"><Gloss>{m.answer.summary}</Gloss></p>}
              {m.answer.notInMaterial ? (
                <div className="text-[12px] rounded px-2 py-1 inline-block" style={{ background: C.surfaceAlt, color: C.muted }}>Not in the pack.</div>
              ) : (
                <div className="space-y-2">
                  {m.answer.claims?.map((c, j) => (
                    <div key={j} className="rounded-lg p-2.5" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
                      <p className="text-[13px] leading-relaxed"><Gloss>{c.text}</Gloss></p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ConfidenceBadge confidence={c.confidence} />
                        <CitationChip sourceId={c.sourceId} onClick={(pos) => open({ sourceId: c.sourceId, passageId: c.passageId }, pos)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!m.answer.notInMaterial && m.answer.summary && (
                <button
                  type="button"
                  onClick={() => {
                    const prev = msgs[i - 1];
                    const title = i > 0 && prev.role === "user" ? prev.text : "Saved answer";
                    const n = loadNotes().length;
                    addNote({ title, summary: m.answer.summary, claims: m.answer.claims ?? [], pos: { x: 140 + (n % 5) * 26, y: 130 + (n % 5) * 26 } });
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] cursor-pointer hover:opacity-70"
                  style={{ color: C.muted }}
                >
                  <StickyNote size={13} strokeWidth={2} /> Save as note
                </button>
              )}
            </div>
          ),
        )}
        {loading && (
          <div className="text-[13px] flex items-center gap-2" style={{ color: C.muted }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: C.accent }} /> thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="shrink-0 p-3 border-t flex items-center gap-2"
        style={{ borderColor: C.line }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={STAGE_HINT[stage]}
          disabled={loading}
          className="flex-1 bg-transparent outline-none text-[14px]"
          style={{ color: C.ink }}
        />
        <button type="submit" disabled={loading} className="text-[14px] px-2 py-1 rounded cursor-pointer disabled:opacity-50" style={{ color: C.accent }}>
          ↵
        </button>
      </form>
    </div>
  );
}
