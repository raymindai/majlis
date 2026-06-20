/**
 * The DG's meeting portfolio + the people in today's room.
 * SYNTHETIC demo data — fictional, no real person implied.
 */

export type MeetingStatus = "past" | "today" | "upcoming";

export interface MeetingRef {
  id: string;
  title: string;
  date: string; // ISO
  when: string; // relative
  status: MeetingStatus;
  kind: string;
  current?: boolean;
  relation?: string; // how it relates to today's meeting
}

/** Today's steering committee sits in a string of related meetings. */
export const MEETINGS: MeetingRef[] = [
  {
    id: "q1-steering",
    title: "Q1 Manarah Steering Committee",
    date: "2026-03-26",
    when: "13 weeks ago",
    status: "past",
    kind: "Steering",
    relation: "Last cycle — the commitments made here are what today checks against.",
  },
  {
    id: "budget-review",
    title: "Manarah Budget Review",
    date: "2026-06-14",
    when: "6 days ago",
    status: "past",
    kind: "Review",
    relation: "Where the MTA 40-vs-52 figure first surfaced — it feeds today's reallocation vote.",
  },
  {
    id: "sso-sync",
    title: "EDD–HSA Single Sign-On Sync",
    date: "2026-06-18",
    when: "2 days ago",
    status: "past",
    kind: "Sync",
    relation: "Where EDD's SSO slip was first flagged — it's today's headline blocker.",
  },
  {
    id: "q2-steering",
    title: "Q2 Manarah Steering Committee",
    date: "2026-06-20",
    when: "in 18 min",
    status: "today",
    kind: "Steering",
    current: true,
    relation: "You are here.",
  },
  {
    id: "vendor-identity",
    title: "Identity-Vendor Contract Review",
    date: "2026-06-27",
    when: "in 1 week",
    status: "upcoming",
    kind: "Review",
    relation: "EDD's SSO recovery depends on this contract closing.",
  },
  {
    id: "digital-council",
    title: "Abu Dhabi Digital Council",
    date: "2026-07-11",
    when: "in 3 weeks",
    status: "upcoming",
    kind: "Council",
    relation: "Manarah reports up to this — today's decisions land here.",
  },
];

export interface Participant {
  id: string;
  name: string;
  role: string;
  entity: string;
  owns: string;
  status?: "on-track" | "at-risk" | "slipped" | "restricted";
  ask?: string; // the question to put to this person
}

/** Who's in today's room — and what to ask each of them. */
export const PARTICIPANTS: Participant[] = [
  {
    id: "EDD",
    name: "Khalid Al Marri",
    role: "Director-General",
    entity: "Economic Development Dept",
    owns: "the shared Single Sign-On",
    status: "slipped",
    ask: "Give a firm SSO recovery date — is the identity-vendor contract signed?",
  },
  {
    id: "EKD",
    name: "Aisha Al Hammadi",
    role: "Under-Secretary",
    entity: "Education & Knowledge Dept",
    owns: "the Parent Portal",
    status: "at-risk",
    ask: "Is the July soft-launch real, or is August the true date?",
  },
  {
    id: "MTA",
    name: "Omar Saif",
    role: "Programme Lead",
    entity: "Municipalities & Transport",
    owns: "municipal services + the budget line",
    status: "at-risk",
    ask: "Reconcile the 40M vs 52M figure before the reallocation vote.",
  },
  {
    id: "HSA",
    name: "Sara Khoury",
    role: "Chief Information Officer",
    entity: "Health Services Authority",
    owns: "health-services migration",
    status: "on-track",
    ask: "Does EDD's SSO slip put either of your two pending go-lives at risk?",
  },
  {
    id: "PSD",
    name: "Liaison (restricted)",
    role: "Security liaison",
    entity: "Public Security Directorate",
    owns: "security-related services",
    status: "restricted",
    ask: "Request the restricted status annex if it's material to the vote.",
  },
];
