"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, StickyNote } from "lucide-react";
import { ASK_EVENT } from "@/components/ask-bus";
import { C, CitationChip, ConfidenceBadge } from "@/components/ui";
import { useCitation } from "@/components/citation-context";
import { useLang } from "@/components/lang-context";
import { addNote, loadNotes } from "@/lib/notes";
import { Gloss } from "@/components/gloss";
import type { Confidence } from "@/lib/corpus";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

type Claim = { text: string; confidence: Confidence; sourceId: string; passageId: string };
type Answer = { notInMaterial: boolean; summary: string; claims: Claim[] };
type Msg = { role: "user"; text: string } | { role: "assistant"; answer: Answer; streaming?: boolean };

const STAGE_HINT: Record<string, string> = {
  before: "e.g. Did EKD meet its March commitment?",
  during: "e.g. What did EDD just commit to?",
  after: "e.g. What's still outstanding?",
};

const STARTERS = ["Did EKD meet its March commitment?", "Is the SSO slip contained?", "Which MTA budget figure is correct?"];

/** Pull the (possibly partial) summary string out of the streaming JSON buffer. */
function extractSummary(buf: string): string {
  const m = buf.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!m) return "";
  try {
    return JSON.parse('"' + m[1] + '"');
  } catch {
    return m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
}

export default function ChatPanel({ stage }: { stage: "before" | "during" | "after" }) {
  const { open } = useCitation();
  const { lang, t: tr } = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toBottom = () => requestAnimationFrame(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));

  async function ask(text?: string) {
    const t = (text ?? q).trim();
    if (!t || loading) return;
    setMsgs((m) => [...m, { role: "user", text: t }, { role: "assistant", answer: { notInMaterial: false, summary: "", claims: [] }, streaming: true }]);
    setQ("");
    setLoading(true);
    toBottom();

    const setLast = (patch: { answer: Answer; streaming: boolean }) =>
      setMsgs((m) => m.map((msg, idx) => (idx === m.length - 1 && msg.role === "assistant" ? { role: "assistant", ...patch } : msg)));

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: t, stage, lang }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setLast({ answer: { notInMaterial: false, summary: extractSummary(buf), claims: [] }, streaming: true });
        toBottom();
      }
      let parsed: Answer;
      try {
        parsed = JSON.parse(buf);
      } catch {
        parsed = { notInMaterial: true, summary: extractSummary(buf) || "Couldn't parse the answer.", claims: [] };
      }
      setLast({ answer: parsed, streaming: false });
    } catch {
      setLast({ answer: { notInMaterial: false, summary: "Couldn't reach the assistant. Try again.", claims: [] }, streaming: false });
    } finally {
      setLoading(false);
      toBottom();
    }
  }

  // Add the typed text straight to the notes layer, without asking the AI.
  function addAsNote() {
    const t = q.trim();
    if (!t) return;
    const n = loadNotes().length;
    addNote({ title: "My note", summary: t, claims: [], pos: { x: 300 + (n % 5) * 28, y: 120 + (n % 5) * 28 } });
    setQ("");
  }

  const askRef = useRef(ask);
  askRef.current = ask;
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string") askRef.current(detail);
    };
    window.addEventListener(ASK_EVENT, handler);
    return () => window.removeEventListener(ASK_EVENT, handler);
  }, []);

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Branded header: a gradient wash, a generated brand motif, and a girih star. */}
      <div className="shrink-0 relative overflow-hidden border-b" style={{ borderColor: C.line }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.chipBg}, ${C.surface} 72%)` }} />
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.14]" style={{ backgroundImage: "url(/ask-majlis-brand.jpg)" }} />
        <svg aria-hidden className="absolute -right-5 -top-5 opacity-[0.07]" width="128" height="128" viewBox="0 0 100 100" style={{ color: C.accent }}>
          <g fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="22" y="22" width="56" height="56" />
            <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
          </g>
        </svg>
        <div className="relative px-4 pt-3 pb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5" style={{ background: C.surface, color: C.accent, border: `1px solid ${C.line}` }}>
            <Sparkles size={11} strokeWidth={2.5} /> {tr("majlisAI")}
          </span>
          <div style={serif} className="text-[19px] leading-tight mt-1.5" >{tr("askMajlis")}</div>
          <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>{tr("chatSubtitle")}</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {msgs.length === 0 && (
          <div className="text-[13px] leading-relaxed" style={{ color: C.muted }}>
            <p>{tr("chatEmpty")}</p>
            <div className="mt-3 flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="text-left text-[13px] rounded-lg px-3 py-2 cursor-pointer hover:opacity-90 majlis-lift active:scale-[0.98]"
                  style={{ background: C.surfaceAlt, border: `1px solid ${C.line}`, color: C.ink }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="text-[14px] rounded-lg px-3 py-2 ml-6" style={{ background: C.chipBg, color: C.ink }}>
              {m.text}
            </div>
          ) : (
            <div key={i} className="text-[14px]">
              {m.answer.summary ? (
                <p className="leading-relaxed mb-2">
                  <Gloss>{m.answer.summary}</Gloss>
                  {m.streaming && <span className="inline-block w-[3px] h-[0.95em] ml-0.5 align-[-0.1em] animate-pulse" style={{ background: C.accent }} />}
                </p>
              ) : m.streaming ? (
                <div className="flex items-center gap-2 mb-2 text-[13px]" style={{ color: C.muted }}>
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: C.accent }} /> reading the pack…
                </div>
              ) : null}

              {!m.streaming &&
                (m.answer.notInMaterial ? (
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
                ))}

              {!m.streaming && !m.answer.notInMaterial && m.answer.summary && (
                <button
                  type="button"
                  onClick={() => {
                    const prev = msgs[i - 1];
                    const title = i > 0 && prev.role === "user" ? prev.text : "Saved answer";
                    const n = loadNotes().length;
                    addNote({ title, summary: m.answer.summary, claims: m.answer.claims ?? [], pos: { x: 300 + (n % 5) * 28, y: 120 + (n % 5) * 28 } });
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
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="shrink-0 p-3 border-t"
        style={{ borderColor: C.line }}
      >
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ar" ? `${tr("askMajlis")}…` : STAGE_HINT[stage]}
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{ color: C.ink }}
          />
          <button
            type="button"
            onClick={addAsNote}
            disabled={!q.trim()}
            title="Add your text as a note, without asking the AI"
            className="inline-flex items-center gap-1 text-[12px] px-2 py-1 rounded-md cursor-pointer disabled:opacity-40 hover:opacity-80"
            style={{ color: C.muted, border: `1px solid ${C.line}` }}
          >
            <StickyNote size={13} strokeWidth={2} /> {tr("note")}
          </button>
          <button type="submit" disabled={loading} className="text-[14px] px-2 py-1 rounded cursor-pointer disabled:opacity-50 transition active:scale-90" style={{ color: C.accent }}>
            ↵
          </button>
        </div>
        <div className="mt-1.5 text-[10.5px]" style={{ color: C.faint }}>{tr("chatHelper")}</div>
      </form>
    </div>
  );
}
