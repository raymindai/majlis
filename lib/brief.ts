/**
 * The brief Majlis writes for the chair, synthesised live from the committee pack
 * by /api/brief. This is the client-side type plus a mock fallback so Before renders
 * instantly and then swaps to the live synthesis.
 */
import type { Confidence } from "./corpus";
import { ATTENTION, BOTTOM_LINE, DECISION, STEADY } from "./mock";

export type Cite = { sourceId: string; passageId: string };

export interface Brief {
  bottomLine: {
    lead: string;
    detail: string;
    confidence: Confidence;
    citations: Cite[];
    conflict: { label: string; citations: Cite[] } | null;
  };
  decision: {
    text: string;
    recommendation: string;
    rationale: string;
    hingesOn: string[];
    options: { label: string; consequence: string }[];
  };
  attention: { entity: string; severity: "blocker" | "at-risk"; line: string; confidence: Confidence; citations: Cite[] }[];
  steady: { entity: string; line: string }[];
  agenda: { item: string; note: string }[];
  likelyQuestions: { q: string; line: string; citation: Cite | null }[];
  prep: { text: string; citation: Cite | null }[];
}

export const BRIEF_CACHE_KEY = "majlis-brief-q2";

/** Fallback brief (the prior hand-written content), shown instantly before the live synthesis lands. */
export const MOCK_BRIEF: Brief = {
  bottomLine: {
    lead: BOTTOM_LINE.lead,
    detail: BOTTOM_LINE.detail,
    confidence: BOTTOM_LINE.confidence,
    citations: BOTTOM_LINE.citations,
    conflict: BOTTOM_LINE.conflict,
  },
  decision: {
    text: DECISION.text,
    recommendation: "Defer the reallocation until MTA reconciles its figure, and press EDD for a firm SSO recovery date.",
    rationale:
      "The reallocation rests on MTA's spend forecast, and that figure conflicts across sources (AED 52M against the Charter's 40M), so voting now would move money on an unreconciled number that is hard to defend on audit. The SSO blocker is the binding constraint on two go-lives, so a firm recovery date matters more this session than the budget split.",
    hingesOn: DECISION.hingesOn,
    options: [
      { label: "Defer the reallocation", consequence: "Avoids voting on an unreconciled figure; the budget question returns next session." },
      { label: "Approve as proposed", consequence: "Moves money on a figure that conflicts across sources; hard to defend on audit." },
    ],
  },
  attention: ATTENTION.map((a) => ({ entity: a.id, severity: a.severity, line: a.line, confidence: a.confidence, citations: a.citations })),
  steady: STEADY.map((s) => ({ entity: s.id, line: s.line })),
  agenda: [
    { item: "Q2 status across the five entities", note: "Lead with the SSO blocker; it gates two go-lives." },
    { item: "Cross-entity dependencies and blockers", note: "EDD's SSO is the binding constraint." },
    { item: "Decision: Q2 budget reallocation", note: "Defer pending MTA reconciliation." },
    { item: "Any other business", note: "Request the PSD restricted annex if it bears on the vote." },
  ],
  likelyQuestions: [
    { q: "Why defer the reallocation?", line: "MTA's figure doesn't reconcile yet; we vote once it does.", citation: { sourceId: "RISK", passageId: "R-11" } },
    { q: "Is the SSO slip contained?", line: "No. It blocks HSA and EKD go-lives, and EDD owes a recovery date.", citation: { sourceId: "RISK", passageId: "R-07" } },
    { q: "Is EKD on track?", line: "It missed the June portal commitment; the July catch-up is unverified.", citation: { sourceId: "Q2-EKD", passageId: "slip" } },
  ],
  prep: [
    { text: "Reconcile MTA's budget figure (40 vs 52) before the reallocation vote.", citation: { sourceId: "RISK", passageId: "R-11" } },
    { text: "Get a firm SSO recovery date from EDD; it gates HSA and EKD.", citation: { sourceId: "Q2-EDD", passageId: "slip" } },
    { text: "Note EKD missed its June commitment; the July catch-up is unverified.", citation: { sourceId: "PMO-NOTE", passageId: "claim" } },
  ],
};
