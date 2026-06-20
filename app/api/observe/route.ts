import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { after } from "next/server";
import { z } from "zod";
import { corpusForPrompt } from "@/lib/corpus";
import { langSuffix } from "@/lib/ai-lang";
import { logQa } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const cite = z.object({
  sourceId: z.string().describe("source id exactly as written in the pack"),
  passageId: z.string().describe("passage id within that source, exactly as written"),
});

const ObsSchema = z.object({
  stance: z.enum(["confirms", "contradicts", "neutral"]).describe("does the utterance confirm the record, contradict it, or neither"),
  note: z.string().describe("one sentence the chair should note about this utterance against the record; if it contradicts, say what the record actually shows"),
  citation: cite.nullable().describe("the passage that confirms or contradicts, or null"),
  suggestedQuestion: z.string().nullable().describe("a sharp, specific follow-up the chair should ask now, or null if none is needed"),
  commitment: z
    .object({
      entity: z.string().describe("the entity code, or 'Committee' for a chair decision"),
      text: z.string().describe("the commitment or decision, short and imperative"),
      due: z.string().describe("the due date or timeframe, e.g. 'end of Q3', 'next session'"),
    })
    .nullable()
    .describe("a commitment or decision stated in the utterance worth capturing, or null"),
});

const SYSTEM = `You are Majlis, listening live to a committee meeting for the senior official chairing it. You hold the committee pack, the record. For the single utterance below, assess it against the record.

Rules:
- stance: does the utterance CONFIRM the record, CONTRADICT it, or is it neutral?
- note: one sentence for the chair. If it contradicts, state plainly what the record actually shows.
- citation: the passage that confirms or contradicts, citing sourceId and passageId exactly as written, or null.
- suggestedQuestion: a sharp, specific follow-up the chair should ask now, or null if none is needed.
- commitment: if the utterance states a commitment or a decision, capture it (entity code, short imperative text, due/timeframe); otherwise null.
- Use ONLY the pack. Never use outside knowledge. Never use em-dashes or middle-dot separators.

COMMITTEE PACK, the only material you may use:

${corpusForPrompt()}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const speaker = typeof body?.speaker === "string" ? body.speaker : "Unknown";
    const text = typeof body?.text === "string" ? body.text : "";
    if (!text) return Response.json({ error: "Missing utterance" }, { status: 400 });

    const started = Date.now();
    const message = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM + langSuffix(body?.lang),
      output_config: { format: zodOutputFormat(ObsSchema) },
      messages: [{ role: "user", content: `Utterance from ${speaker}: "${text}"` }],
    });
    const latencyMs = Date.now() - started;

    const obs = message.parsed_output ?? { stance: "neutral", note: "", citation: null, suggestedQuestion: null, commitment: null };

    after(() =>
      logQa({
        stage: "during",
        question: `[observe] ${speaker}: ${text}`,
        answer: { notInMaterial: false, summary: obs.note, claims: obs.citation ? [{ confidence: obs.stance === "contradicts" ? "unverified" : "confirmed" }] : [] },
        latencyMs,
      }),
    );

    return Response.json(obs);
  } catch (err) {
    console.error("observe route error:", err);
    return Response.json({ error: "observe_error" }, { status: 500 });
  }
}
