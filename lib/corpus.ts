/**
 * The Manarah Programme, Q2 Steering Committee corpus.
 *
 * SYNTHETIC demo data. This module is the single source of truth the assistant
 * grounds on; every citation references a { sourceId, passageId } pair here, so
 * the "source drawer" resolves to the exact passage a claim came from.
 * Mirrors /content/*.md.
 */

export type Authority =
  | "foundational" // baseline, may be superseded (Charter)
  | "official-record" // dated official record (Minutes)
  | "official-current" // current official report (Q2 reports, Risk Register)
  | "informal-unverified"; // informal / undated (PMO note)

export type Confidence = "confirmed" | "likely" | "unverified";

export interface Passage {
  id: string;
  text: string;
}

export interface Source {
  id: string;
  title: string;
  date: string | null; // ISO date, or null = undated
  authority: Authority;
  passages: Passage[];
}

export interface Entity {
  id: string;
  name: string;
  scope: string;
  status: "on-track" | "at-risk" | "slipped" | "restricted";
  headline: string;
}

export const MEETING = {
  programme: "Manarah Programme",
  subtitle: "Unified Abu Dhabi government digital services",
  session: "Q2 2026 Steering Committee",
  date: "2026-06-20",
  chairRole: "Programme Director-General",
  totalBudgetAED: 240_000_000,
  agenda: [
    "Q2 status across the 5 entities",
    "Cross-entity dependencies & blockers",
    "Decision: Q2 budget reallocation",
    "AOB",
  ],
  synthetic: true,
} as const;

export const ENTITIES: Entity[] = [
  { id: "HSA", name: "Health Services Authority", scope: "Health services", status: "on-track", headline: "10/10 services migrated; met its March commitment" },
  { id: "EKD", name: "Education & Knowledge Department", scope: "Education incl. Parent Portal", status: "at-risk", headline: "Parent Portal slipped June → August; recovery only informally claimed" },
  { id: "MTA", name: "Municipalities & Transport Authority", scope: "Municipal & transport services", status: "at-risk", headline: "Delivering, but budget figures conflict across sources (40M vs 52M)" },
  { id: "PSD", name: "Public Security Directorate", scope: "Security-related services", status: "restricted", headline: "Detailed status redacted from the shared pack" },
  { id: "EDD", name: "Economic Development Department", scope: "Licensing + shared SSO", status: "slipped", headline: "SSO integration slipped, a dependency blocking others" },
];

export const SOURCES: Source[] = [
  {
    id: "CHARTER",
    title: "Programme Charter v2.1",
    date: "2025-08-14",
    authority: "foundational",
    passages: [
      { id: "scope", text: "Manarah consolidates priority government services from 5 entities onto a single unified resident platform, with a shared identity layer (Single Sign-On) delivered by EDD." },
      { id: "budget-mta", text: "Initial budget allocation for MTA (Municipalities & Transport Authority): AED 40M." },
      { id: "budget-total", text: "Total programme budget: AED 240M (including AED 30M central)." },
      { id: "governance", text: "Quarterly steering committee, chaired by the Programme DG. Budget reallocations require committee approval. Quarterly reports supersede baseline figures where they differ." },
    ],
  },
  {
    id: "Q1-MIN",
    title: "Q1 Steering Committee Minutes",
    date: "2026-03-26",
    authority: "official-record",
    passages: [
      { id: "commit-hsa", text: "HSA committed to migrate 10 priority health services to the platform by end of Q2." },
      { id: "commit-ekd", text: "EKD committed to launch the unified Parent Portal by June 2026." },
      { id: "commit-edd", text: "EDD committed to deliver the shared Single Sign-On (SSO) integration by end of Q2. HSA and EKD launches depend on SSO." },
      { id: "decision-sso", text: "Q1-D2: SSO confirmed as a hard cross-entity dependency; EDD to flag any slip immediately." },
    ],
  },
  {
    id: "Q2-HSA",
    title: "Q2 Status Report, HSA",
    date: "2026-06-15",
    authority: "official-current",
    passages: [
      { id: "status", text: "HSA on track. 10/10 priority services migrated; the March commitment was met. Spend AED 38M of 42M." },
      { id: "dep", text: "Go-live of 2 HSA services depends on EDD's SSO." },
    ],
  },
  {
    id: "Q2-EKD",
    title: "Q2 Status Report, EKD",
    date: "2026-06-15",
    authority: "official-current",
    passages: [
      { id: "slip", text: "EKD Parent Portal slipped from June to August 2026 due to integration delays. This misses the Q1 commitment to launch by June." },
      { id: "spend", text: "EKD spend AED 29M of 45M (underspending)." },
    ],
  },
  {
    id: "Q2-MTA",
    title: "Q2 Status Report, MTA",
    date: "2026-06-15",
    authority: "official-current",
    passages: [
      { id: "status", text: "MTA on track: 8/9 services live, the 9th in final testing." },
      { id: "budget", text: "MTA budget AED 52M committed/forecast, exceeding the Charter allocation of AED 40M. Flagged for reconciliation." },
    ],
  },
  {
    id: "Q2-PSD",
    title: "Q2 Status Report, PSD",
    date: "2026-06-15",
    authority: "official-current",
    passages: [
      { id: "restricted", text: "PSD status is reported separately under the restricted annex and is not included in this shared pack. No further PSD detail is available here." },
    ],
  },
  {
    id: "Q2-EDD",
    title: "Q2 Status Report, EDD",
    date: "2026-06-15",
    authority: "official-current",
    passages: [
      { id: "slip", text: "EDD shared SSO integration delayed, now forecast end of Q3 (was end of Q2). This blocks dependent go-lives at HSA and EKD." },
      { id: "spend", text: "EDD spend AED 41M of 45M. Blocker: identity-vendor contract amendment pending." },
    ],
  },
  {
    id: "RISK",
    title: "Risk Register",
    date: "2026-06-18",
    authority: "official-current",
    passages: [
      { id: "R-07", text: "R-07 (High, owner EDD, escalating): SSO integration slip blocks dependent entity launches (HSA, EKD)." },
      { id: "R-03", text: "R-03 (Medium, owner EKD): EKD Parent Portal slip (June → August) may miss the academic-year window." },
      { id: "R-11", text: "R-11 (Medium, owner MTA/PMO): MTA spend (52M) exceeds Charter allocation (40M); figures to reconcile before reallocation." },
    ],
  },
  {
    id: "PMO-NOTE",
    title: "Informal PMO Note, EKD",
    date: null,
    authority: "informal-unverified",
    passages: [
      { id: "claim", text: "Informal, undated PMO email: EKD thinks it can pull the Parent Portal back to a soft launch in July, ahead of the August date in its status report. Not confirmed. Conflicts with the official Q2-EKD report." },
    ],
  },
];

export const getSource = (id: string): Source | undefined =>
  SOURCES.find((s) => s.id === id);

export const getPassage = (sourceId: string, passageId: string): Passage | undefined =>
  getSource(sourceId)?.passages.find((p) => p.id === passageId);

/** The grounding text handed to the model. */
export function corpusForPrompt(): string {
  return SOURCES.map((s) => {
    const head = `### [${s.id}] ${s.title}, ${s.date ?? "undated"}, authority: ${s.authority}`;
    const body = s.passages.map((p) => `- (${s.id}#${p.id}) ${p.text}`).join("\n");
    return `${head}\n${body}`;
  }).join("\n\n");
}

/** Authority → default confidence hint (the model may override with reasoning). */
export const AUTHORITY_CONFIDENCE: Record<Authority, Confidence> = {
  "official-current": "confirmed",
  "official-record": "confirmed",
  foundational: "likely",
  "informal-unverified": "unverified",
};
