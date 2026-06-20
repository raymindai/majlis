import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { after } from "next/server";
import { z } from "zod";
import { logQa } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const MinutesSchema = z.object({
  headline: z.string().describe("one line capturing the meeting's outcome"),
  summary: z.string().describe("2 to 4 sentences of narrative minutes: what was decided and what each entity committed to, most important first"),
  distributionNote: z.string().describe("a brief, formal cover note to accompany the minutes when circulated to participants"),
});

const SYSTEM = `You are Majlis, drafting the official minutes of an Abu Dhabi government committee meeting from the decisions and commitments captured during it.

Write:
- headline: one line capturing the meeting's outcome.
- summary: 2 to 4 sentences of narrative minutes, what was decided and what each entity committed to, most important first. Use the entity codes as given.
- distributionNote: a brief, formal cover note to accompany the minutes when circulated to participants.

Tone: terse, precise, official, audit-aware. Use only the captured items below. Never use em-dashes or middle-dot separators.`;

type Item = { entity: string; text: string; due: string; kind: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: Item[] = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) return Response.json({ error: "no_items" }, { status: 400 });

    const list = items
      .map((i) => `- [${i.kind}] ${i.entity}: ${i.text} (due ${i.due})`)
      .join("\n");

    const started = Date.now();
    const message = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM,
      output_config: { format: zodOutputFormat(MinutesSchema) },
      messages: [{ role: "user", content: `Captured this meeting:\n${list}\n\nDraft the minutes.` }],
    });
    const latencyMs = Date.now() - started;

    const minutes = message.parsed_output;
    if (!minutes) return Response.json({ error: "minutes_empty" }, { status: 502 });

    after(() => logQa({ stage: "after", question: "[minutes draft]", answer: { notInMaterial: false, summary: minutes.headline, claims: [] }, latencyMs }));

    return Response.json(minutes);
  } catch (err) {
    console.error("minutes route error:", err);
    return Response.json({ error: "minutes_error" }, { status: 500 });
  }
}
