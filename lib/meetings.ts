/**
 * The DG's meeting portfolio + the people in today's room.
 * SYNTHETIC demo data. Fictional, no real person implied.
 *
 * IA rule (see process/14): a PERSON represents a DEPARTMENT.
 * - Person facts live here (name, role, contacts, track record, the question to ask).
 * - Department facts (full name, delivery STATUS, scope) live in lib/corpus ENTITIES,
 *   the single source of truth. Look them up by `entity` code. Status is never a
 *   property of a person.
 */

export type MeetingStatus = "past" | "today" | "upcoming";

export interface MeetingDetails {
  purpose: string;
  points: string[];
  attendees?: string[]; // entity codes present
}

export interface MeetingRef {
  id: string;
  title: string;
  date: string; // ISO
  when: string; // relative
  status: MeetingStatus;
  kind: string;
  current?: boolean;
  relation?: string; // how it relates to today's meeting
  summary: string; // shown when the entry is clicked
  details?: MeetingDetails; // expandable full detail
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
    relation: "Last cycle: the commitments made here are what today checks against.",
    summary: "The opening steering committee. Each entity set its Q2 commitments, and SSO was confirmed as a hard cross-entity dependency.",
    details: {
      purpose: "Set Q2 commitments across the five entities and lock the governance baseline.",
      points: [
        "HSA committed to migrate 10 priority health services by end of Q2.",
        "EKD committed to launch the unified Parent Portal by June 2026.",
        "EDD committed to deliver the shared Single Sign-On by end of Q2.",
        "SSO confirmed as a hard dependency; EDD to flag any slip immediately.",
      ],
      attendees: ["HSA", "EKD", "MTA", "PSD", "EDD"],
    },
  },
  {
    id: "budget-review",
    title: "Manarah Budget Review",
    date: "2026-06-14",
    when: "6 days ago",
    status: "past",
    kind: "Review",
    relation: "Where the MTA 40-vs-52 figure first surfaced, and it feeds today's reallocation vote.",
    summary: "A finance review where MTA's forecast diverged from the Charter allocation, the discrepancy that drives today's reallocation vote.",
    details: {
      purpose: "Reconcile programme spend against the Charter ahead of the Q2 steering committee.",
      points: [
        "MTA forecast AED 52M against a Charter allocation of AED 40M; flagged for reconciliation.",
        "EKD running well under budget (AED 29M of 45M).",
        "Reallocation decision deferred to the Q2 steering committee.",
      ],
      attendees: ["MTA", "EKD", "EDD"],
    },
  },
  {
    id: "sso-sync",
    title: "EDD-HSA Single Sign-On Sync",
    date: "2026-06-18",
    when: "2 days ago",
    status: "past",
    kind: "Sync",
    relation: "Where EDD's SSO slip was first flagged; it's today's headline blocker.",
    summary: "A working sync on the shared identity layer. EDD's slip to Q3 was first flagged here, and it now blocks HSA and EKD go-lives.",
    details: {
      purpose: "Track SSO integration progress and the go-lives that depend on it.",
      points: [
        "EDD reported the SSO slip to end of Q3 (was end of Q2).",
        "Root cause: the identity-vendor contract amendment is still pending.",
        "HSA flagged two go-lives now at risk.",
      ],
      attendees: ["EDD", "HSA"],
    },
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
    summary: "Today's session. Status across the five entities, the cross-entity blockers, and the Q2 budget reallocation decision.",
    details: {
      purpose: "Review Q2 status, resolve cross-entity blockers, and decide the budget reallocation.",
      points: [
        "Q2 status across the five entities.",
        "Cross-entity dependencies and blockers, led by the SSO slip.",
        "Decision: whether to approve the Q2 budget reallocation.",
      ],
      attendees: ["HSA", "EKD", "MTA", "PSD", "EDD"],
    },
  },
  {
    id: "vendor-identity",
    title: "Identity-Vendor Contract Review",
    date: "2026-06-27",
    when: "in 1 week",
    status: "upcoming",
    kind: "Review",
    relation: "EDD's SSO recovery depends on this contract closing.",
    summary: "An upcoming contract review. EDD's SSO recovery depends on closing the identity-vendor amendment.",
    details: {
      purpose: "Close the identity-vendor contract amendment that gates SSO recovery.",
      points: [
        "Approve the vendor contract amendment.",
        "Commit to a firm SSO recovery date.",
      ],
      attendees: ["EDD"],
    },
  },
  {
    id: "digital-council",
    title: "Abu Dhabi Digital Council",
    date: "2026-07-11",
    when: "in 3 weeks",
    status: "upcoming",
    kind: "Council",
    relation: "Manarah reports up to this; today's decisions land here.",
    summary: "The council Manarah reports up to. Today's decisions and the programme's status land here.",
    details: {
      purpose: "Report Manarah status and risks up to the Abu Dhabi Digital Council.",
      points: [
        "Programme status and the live risk register.",
        "Outcomes carried up from the Q2 steering committee.",
      ],
      attendees: ["MTA"],
    },
  },
];

export interface Pledge {
  text: string;
  due: string;
  status: "kept" | "missed" | "open";
}

export interface Participant {
  id: string; // entity code, also the avatar key (public/avatars/<id>.png)
  name: string;
  role: string;
  entity: string; // department code → join to lib/corpus ENTITIES for name + status
  owns: string;
  ask?: string; // the one question to put to this person
  email: string;
  phone: string;
  location: string;
  reportsVia: string; // why they're in the room / how they relate to the programme
  history: string; // one-line engagement note for context
  pledges: Pledge[]; // their track record this programme
  attended: string[]; // ids of meetings in the series they're part of
}

/** Who's in today's room, names, how to reach them, and their track record. */
export const PARTICIPANTS: Participant[] = [
  {
    id: "EDD",
    name: "Khalid Al Marri",
    role: "Director-General",
    entity: "EDD",
    owns: "the shared Single Sign-On",
    ask: "Give a firm SSO recovery date. Is the identity-vendor contract signed?",
    email: "k.almarri@edd.gov.ae",
    phone: "+971 2 555 0143",
    location: "EDD HQ, Al Maryah Island",
    reportsVia: "Owns the identity layer every other entity's go-live depends on. It is the programme's critical path.",
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
    owns: "the Parent Portal",
    ask: "Is the July soft-launch real, or is August the true date?",
    email: "a.alhammadi@ekd.gov.ae",
    phone: "+971 2 555 0177",
    location: "EKD Tower, Corniche",
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
    owns: "municipal services + the programme budget line",
    ask: "Reconcile the 40M vs 52M figure before the reallocation vote.",
    email: "o.saif@mta.gov.ae",
    phone: "+971 2 555 0192",
    location: "MTA Complex, Mussafah",
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
    owns: "health-services migration",
    ask: "Does EDD's SSO slip put either of your two pending go-lives at risk?",
    email: "s.khoury@hsa.gov.ae",
    phone: "+971 2 555 0120",
    location: "HSA Centre, Khalifa City",
    reportsVia: "On track, but both pending go-lives ride on the shared SSO.",
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
    owns: "security-related services",
    ask: "Request the restricted status annex if it's material to the vote.",
    email: "(restricted)",
    phone: "(restricted)",
    location: "(restricted)",
    reportsVia: "Attends in a restricted capacity; status reported under a separate annex.",
    history: "Detail withheld; request the annex if it bears on today's decision.",
    pledges: [{ text: "Status annex, access on request", due: "on request", status: "open" }],
    attended: ["q2-steering"],
  },
];
