import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { corpusForPrompt } from "@/lib/corpus";
import { langSuffix } from "@/lib/ai-lang";
import { logQa } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const AnswerSchema = z.object({
  notInMaterial: z.boolean().describe("true if the committee pack does not contain the answer"),
  summary: z.string().describe("a direct one or two sentence answer for a time-pressured official; empty if notInMaterial"),
  claims: z
    .array(
      z.object({
        text: z.string().describe("a single factual claim"),
        confidence: z.enum(["confirmed", "likely", "unverified"]),
        sourceId: z.string().describe("the source id this claim comes from, exactly as written in the pack"),
        passageId: z.string().describe("the passage id within that source, exactly as written in the pack"),
      }),
    )
    .describe("the claims supporting the answer, each grounded in one passage"),
});

const SYSTEM = `You are Majlis, an AI briefing companion for a senior Abu Dhabi government official preparing for a high-stakes committee meeting. Answer ONLY from the committee pack below. Never use outside knowledge.

Rules:
- Ground every claim in exactly one passage, citing its sourceId and passageId exactly as written (e.g. sourceId "Q2-EKD", passageId "slip").
- Rate each claim's confidence:
  - "confirmed": a current, authoritative source (Q2 status reports, the Risk Register, the Minutes).
  - "likely": supported but caveated (e.g. the Charter baseline, which later reports may supersede).
  - "unverified": informal, undated, or conflicting across sources (e.g. the PMO note; figures that disagree).
- If two sources conflict, include both as separate claims and mark them unverified; never silently pick one.
- If the pack does not contain the answer, set notInMaterial=true, leave claims empty, and say so plainly in summary. Never guess or fabricate.
- Tone: terse, precise, deferential, audit-aware. No editorialising, no filler.
- Writing: never use em-dashes or middle-dot separators; use commas, colons, semicolons, or short sentences.

COMMITTEE PACK, the only material you may use:

${corpusForPrompt()}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question;
    if (!question || typeof question !== "string") {
      return Response.json({ error: "Missing question" }, { status: 400 });
    }
    const stage = typeof body?.stage === "string" ? body.stage : null;
    const started = Date.now();

    // Stream the structured answer. The client renders the summary as it arrives,
    // then parses the full JSON for the grounded claims (confidence + citations).
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      system: SYSTEM + langSuffix(body?.lang),
      output_config: { format: zodOutputFormat(AnswerSchema) },
      messages: [{ role: "user", content: question }],
    });

    const encoder = new TextEncoder();
    const rs = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buf = "";
        stream.on("text", (delta: string) => {
          buf += delta;
          controller.enqueue(encoder.encode(delta));
        });
        try {
          await stream.finalMessage();
          let answer: { notInMaterial?: boolean; summary?: string; claims?: { confidence: string }[] };
          try {
            answer = JSON.parse(buf);
          } catch {
            answer = { notInMaterial: true, summary: "", claims: [] };
          }
          await logQa({ stage, question, answer, latencyMs: Date.now() - started }).catch(() => {});
        } catch (e) {
          console.error("ask stream error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(rs, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  } catch (err) {
    console.error("ask route error:", err);
    return Response.json({ error: "assistant_error" }, { status: 500 });
  }
}
