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

export interface Pledge {
  text: string;
  due: string;
  status: "kept" | "missed" | "open";
}

export interface Participant {
  id: string; // entity code — also the avatar key (public/avatars/<id>.png)
  name: string;
  role: string;
  entity: string; // entity code
  entityName: string; // full organisation name
  owns: string;
  status?: "on-track" | "at-risk" | "slipped" | "restricted";
  ask?: string; // the one question to put to this person
  email: string;
  phone: string;
  location: string;
  reportsVia: string; // why they're in the room / how they relate to the programme
  history: string; // one-line engagement note for context
  pledges: Pledge[]; // their track record this programme
  attended: string[]; // ids of meetings in the series they're part of
}

/** Who's in today's room — names, how to reach them, and their track record. */
export const PARTICIPANTS: Participant[] = [
  {
    id: "EDD",
    name: "Khalid Al Marri",
    role: "Director-General",
    entity: "EDD",
    entityName: "Economic Development Department",
    owns: "the shared Single Sign-On",
    status: "slipped",
    ask: "Give a firm SSO recovery date — is the identity-vendor contract signed?",
    email: "k.almarri@edd.gov.ae",
    phone: "+971 2 555 0143",
    location: "EDD HQ · Al Maryah Island",
    reportsVia: "Owns the identity layer every other entity's go-live depends on — the programme's critical path.",
    history: "Chaired the SSO sync two days ago; has owed a recovery date since.",
    pledges: [
      { text: "Single Sign-On live across all five entities", due: "due 15 Jun", status: "missed" },
      { text: "Identity-vendor contract signed", due: "due 27 Jun", status: "open" },
    ],
    attended: ["q1-steering", "budget-review", "sso-sync", "q2-steering", "vendor-identity"],
  },
  {
    id: "EKD",
    name: "Aisha Al Hammadi",
    role: "Under-Secretary",
    entity: "EKD",
    entityName: "Education & Knowledge Department",
    owns: "the Parent Portal",
    status: "at-risk",
    ask: "Is the July soft-launch real, or is August the true date?",
    email: "a.alhammadi@ekd.gov.ae",
    phone: "+971 2 555 0177",
    location: "EKD Tower · Corniche",
    reportsVia: "Parent Portal go-live can't complete until EDD's SSO lands.",
    history: "Missed the June portal commitment; the July catch-up date is unverified.",
    pledges: [
      { text: "Parent Portal soft-launch", due: "due 30 Jun", status: "missed" },
      { text: "Confirm the true go-live date", due: "due today", status: "open" },
    ],
    attended: ["q1-steering", "budget-review", "q2-steering"],
  },
  {
    id: "MTA",
    name: "Omar Saif",
    role: "Programme Lead",
    entity: "MTA",
    entityName: "Municipalities & Transport Authority",
    owns: "municipal services + the programme budget line",
    status: "at-risk",
    ask: "Reconcile the 40M vs 52M figure before the reallocation vote.",
    email: "o.saif@mta.gov.ae",
    phone: "+971 2 555 0192",
    location: "MTA Complex · Mussafah",
    reportsVia: "Holds the budget line the reallocation vote would move.",
    history: "Surfaced the 40-vs-52 discrepancy at the budget review six days ago.",
    pledges: [
      { text: "Reconcile reallocation figure (40M vs 52M)", due: "due today", status: "open" },
      { text: "Municipal services phase 1", due: "Apr", status: "kept" },
    ],
    attended: ["q1-steering", "budget-review", "q2-steering", "digital-council"],
  },
  {
    id: "HSA",
    name: "Sara Khoury",
    role: "Chief Information Officer",
    entity: "HSA",
    entityName: "Health Services Authority",
    owns: "health-services migration",
    status: "on-track",
    ask: "Does EDD's SSO slip put either of your two pending go-lives at risk?",
    email: "s.khoury@hsa.gov.ae",
    phone: "+971 2 555 0120",
    location: "HSA Centre · Khalifa City",
    reportsVia: "On track — but both pending go-lives ride on the shared SSO.",
    history: "Delivering to plan; flagged the EDD dependency at the SSO sync.",
    pledges: [
      { text: "Health-records migration wave 1", due: "May", status: "kept" },
      { text: "Two go-lives pending SSO", due: "Q3", status: "open" },
    ],
    attended: ["q1-steering", "sso-sync", "q2-steering"],
  },
  {
    id: "PSD",
    name: "Liaison (restricted)",
    role: "Security liaison",
    entity: "PSD",
    entityName: "Public Security Directorate",
    owns: "security-related services",
    status: "restricted",
    ask: "Request the restricted status annex if it's material to the vote.",
    email: "(restricted)",
    phone: "(restricted)",
    location: "(restricted)",
    reportsVia: "Attends in a restricted capacity; status reported under a separate annex.",
    history: "Detail withheld — request the annex if it bears on today's decision.",
    pledges: [{ text: "Status annex — access on request", due: "—", status: "open" }],
    attended: ["q2-steering"],
  },
];
