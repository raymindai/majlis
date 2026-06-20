import { type Confidence, ENTITIES, getPassage, getSource, MEETING } from "./corpus";

export interface Citation {
  sourceId: string;
  passageId: string;
}

export interface MockClaim {
  text: string;
  confidence: Confidence;
  sourceId: string;
  passageId: string;
}

export interface MockQA {
  question: string;
  claims: MockClaim[];
}

export interface AttentionItem {
  id: string;
  name: string;
  severity: "blocker" | "at-risk";
  confidence: Confidence;
  line: string;
  action: string;
  citations: Citation[];
}

export const MEETING_META = {
  ...MEETING,
  minutesUntil: 18,
};

/** ① The bottom line, the single dominant judgment. */
export const BOTTOM_LINE = {
  lead: "One blocker dominates today, and the budget vote rests on a number that doesn't reconcile.",
  detail:
    "EDD's Single Sign-On has slipped to Q3, stalling HSA and EKD go-lives. The Q2 reallocation hinges on an MTA budget figure that conflicts across sources.",
  confidence: "confirmed" as Confidence,
  citations: [
    { sourceId: "Q2-EDD", passageId: "slip" },
    { sourceId: "RISK", passageId: "R-07" },
  ] as Citation[],
  conflict: {
    label: "MTA budget: 40 vs 52",
    citations: [
      { sourceId: "CHARTER", passageId: "budget-mta" },
      { sourceId: "Q2-MTA", passageId: "budget" },
    ] as Citation[],
  },
};

/** ② The decision at stake. */
export const DECISION = {
  text: "Approve the Q2 budget reallocation across the five entities.",
  hingesOn: ["the MTA figure (unreconciled)", "EDD's SSO slip"],
};

/** ③ Needs attention, exceptions, ranked. */
export const ATTENTION: AttentionItem[] = [
  {
    id: "EDD",
    name: "Economic Development Dept",
    severity: "blocker",
    confidence: "confirmed",
    line: "SSO slipped to Q3, blocking HSA and EKD go-lives.",
    action: "Press EDD for a firm SSO recovery date, and hold the HSA and EKD go-lives until it is committed.",
    citations: [
      { sourceId: "Q2-EDD", passageId: "slip" },
      { sourceId: "RISK", passageId: "R-07" },
    ],
  },
  {
    id: "EKD",
    name: "Education & Knowledge Dept",
    severity: "at-risk",
    confidence: "unverified",
    line: "Parent Portal slipped June→August, missing its March commitment; the informal July claim is unverified.",
    action: "Ask EKD to confirm the August date on the record, and verify the informal July catch-up claim against a source before relying on it.",
    citations: [
      { sourceId: "Q2-EKD", passageId: "slip" },
      { sourceId: "PMO-NOTE", passageId: "claim" },
    ],
  },
  {
    id: "MTA",
    name: "Municipalities & Transport Authority",
    severity: "at-risk",
    confidence: "unverified",
    line: "Budget 40 vs 52 across sources; reconcile before the vote.",
    action: "Defer the reallocation vote until MTA reconciles the 40 vs 52 figure with the finance lead.",
    citations: [
      { sourceId: "CHARTER", passageId: "budget-mta" },
      { sourceId: "Q2-MTA", passageId: "budget" },
    ],
  },
];

/** Tertiary, collapsed, on-track / restricted. */
export const STEADY = [
  { id: "HSA", line: "on track, met its commitment" },
  { id: "PSD", line: "restricted, not in the shared pack" },
];

export const SAMPLE_QA: MockQA = {
  question: "Did EKD meet the commitment it made in March?",
  claims: [
    {
      text: "In Q1, EKD committed to launch the unified Parent Portal by June 2026.",
      confidence: "confirmed",
      sourceId: "Q1-MIN",
      passageId: "commit-ekd",
    },
    {
      text: "Its Q2 status report shows the portal slipped to August, so the commitment was not met.",
      confidence: "confirmed",
      sourceId: "Q2-EKD",
      passageId: "slip",
    },
    {
      text: "An informal PMO note claims a July soft-launch, but it is unverified and conflicts with the official report.",
      confidence: "unverified",
      sourceId: "PMO-NOTE",
      passageId: "claim",
    },
  ],
};

/** Resolve a citation to its source title, date, and exact passage (for the drawer). */
export function resolveCitation(sourceId: string, passageId: string) {
  const s = getSource(sourceId);
  const p = getPassage(sourceId, passageId);
  return {
    title: s?.title ?? sourceId,
    date: s?.date ?? null,
    authority: s?.authority ?? null,
    text: p?.text ?? "",
  };
}

export { ENTITIES };
