import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { after } from "next/server";
import { z } from "zod";
import { corpusForPrompt } from "@/lib/corpus";
import { langSuffix } from "@/lib/ai-lang";
import { logQa } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 120;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const conf = z.enum(["confirmed", "likely", "unverified"]);
const cite = z.object({
  sourceId: z.string().describe("source id exactly as written in the pack"),
  passageId: z.string().describe("passage id within that source, exactly as written"),
});

export const BriefSchema = z.object({
  bottomLine: z.object({
    lead: z.string().describe("the single dominant judgment for today, one direct sentence"),
    detail: z.string().describe("one or two sentences elaborating it"),
    confidence: conf,
    citations: z.array(cite),
    conflict: z
      .object({
        label: z.string().describe("short label for a figure or fact that conflicts across sources, e.g. 'MTA budget: 40 vs 52'"),
        citations: z.array(cite),
      })
      .nullable()
      .describe("one cross-source conflict to flag, or null"),
  }),
  decision: z.object({
    text: z.string().describe("the decision the chair must make today, one sentence"),
    recommendation: z.string().describe("the recommended call, one clear sentence"),
    rationale: z.string().describe("2 to 3 sentences of reasoning behind the recommendation, grounded in the pack: why this call over the alternatives, and what risk it manages"),
    hingesOn: z.array(z.string()).describe("the facts the decision depends on"),
    options: z
      .array(
        z.object({
          label: z.string(),
          consequence: z.string(),
          stance: z.enum(["recommended", "against", "neutral"]).describe("'recommended' for the single option your recommendation backs, 'against' for any option you advise against, 'neutral' otherwise"),
        }),
      )
      .describe("each path the chair could take and the consequence of each, with where you stand on it"),
  }),
  attention: z
    .array(
      z.object({
        entity: z.string().describe("the entity code, e.g. EDD"),
        severity: z.enum(["blocker", "at-risk"]),
        line: z.string().describe("what needs attention, one sentence"),
        action: z.string().describe("the concrete action the chair should take on this today, one imperative sentence (e.g. 'Press EDD for a firm SSO recovery date before approving any dependent go-live')"),
        confidence: conf,
        citations: z.array(cite),
      }),
    )
    .describe("the exceptions that need action, ranked most urgent first"),
  steady: z.array(z.object({ entity: z.string(), line: z.string() })).describe("entities that are fine, one short phrase each"),
  agenda: z
    .array(z.object({ item: z.string(), note: z.string().describe("the chair's angle or what to watch on this item") }))
    .describe("today's agenda items, in order"),
  likelyQuestions: z.array(
    z.object({
      q: z.string().describe("a question the chair is likely to face"),
      line: z.string().describe("the grounded line to take"),
      citation: cite.nullable(),
    }),
  ),
  prep: z.array(z.object({ text: z.string().describe("a concrete prep action"), citation: cite.nullable() })),
});

const SYSTEM = `You are Majlis, an AI briefing companion preparing a senior Abu Dhabi government official to chair a high-stakes committee meeting. From the committee pack below, write the official's brief.

Rules:
- Use ONLY the pack. Never use outside knowledge. Ground every factual claim in a passage, citing its exact sourceId and passageId (e.g. sourceId "Q2-EKD", passageId "slip").
- Confidence on each claim: "confirmed" (a current, authoritative source: the Q2 reports, the Risk Register, the Minutes), "likely" (supported but caveated, e.g. the Charter baseline which later reports may supersede), "unverified" (informal, undated, or conflicting across sources, e.g. the PMO note; figures that disagree).
- Lead with the single dominant judgment. Rank the exceptions most urgent first. Where two sources conflict, flag it and mark it unverified, never silently pick one.
- Every exception that needs attention must carry a concrete recommended action for the chair, not just a description of the problem.
- The decision section must give a clear recommendation, the reasoning behind it (why this call over the alternatives, and what risk it manages), and the consequence of each option the chair could take. Mark exactly one option's stance as 'recommended' (the one your recommendation backs) and any option you advise against as 'against'; the rest are 'neutral'.
- Tone: terse, precise, deferential, audit-aware. No filler. Never use em-dashes or middle-dot separators; use commas, colons, or short sentences.

COMMITTEE PACK, the only material you may use:

${corpusForPrompt()}`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const started = Date.now();
    const message = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: SYSTEM + langSuffix(body?.lang),
      output_config: { format: zodOutputFormat(BriefSchema) },
      messages: [{ role: "user", content: "Write the brief for today's committee." }],
    });
    const latencyMs = Date.now() - started;
    const brief = message.parsed_output;
    if (!brief) return Response.json({ error: "brief_empty" }, { status: 502 });

    after(() =>
      logQa({
        stage: "before",
        question: "[brief synthesis]",
        answer: { notInMaterial: false, summary: brief.bottomLine.lead, claims: brief.attention.map((a) => ({ confidence: a.confidence })) },
        latencyMs,
      }),
    );

    return Response.json(brief);
  } catch (err) {
    console.error("brief route error:", err);
    return Response.json({ error: "brief_error" }, { status: 500 });
  }
}
