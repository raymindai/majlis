import Link from "next/link";
import ZoomImage from "@/components/zoom-image";
import {
  ArrowRight,
  CircleCheck,
  Compass,
  Database,
  GitBranch,
  Languages,
  Layers,
  Library,
  ListChecks,
  MessageCircleQuestion,
  MousePointerClick,
  PenTool,
  Repeat,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  SquareStack,
  StickyNote,
  Target,
  Users,
  ZoomIn,
} from "lucide-react";
import { C } from "@/components/theme";
import Reveal from "@/components/reveal";
import { listProcessDocs } from "@/lib/process-docs";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

export const metadata = {
  title: "Majlis, the case study",
  description: "How an AI briefing companion was scoped, decided, and built.",
};

/** How the work was actually done, in order. */
const PROCESS: { icon: typeof Compass; title: string; body: string }[] = [
  {
    icon: Compass,
    title: "Frame the brief",
    body: "Read the AI Experience Designer brief and pinned the bar: the AI is the product, not a feature, and the user is a time-pressured senior official. Chose reach over the safest sign-off scenario.",
  },
  {
    icon: ListChecks,
    title: "Explore and score",
    body: "Generated candidate scenarios and scored each on three axes: real-world likelihood, how AI-native the core moment is, and fit to the mandate. Likelihood was treated as first-class, not an afterthought.",
  },
  {
    icon: GitBranch,
    title: "Decide in the open",
    body: "Resolved every fork as a decision tree, recording what was chosen, why, and what was deliberately left unbuilt, kept in a running decision log rather than a single final answer.",
  },
  {
    icon: PenTool,
    title: "Design the architecture",
    body: "An exception-led information architecture: bottom line and decision first, then ranked exceptions, then interrogation on demand. A provenance flow runs through everything, claim to confidence to citation to source, on a re-skinnable token system.",
  },
  {
    icon: Rocket,
    title: "Build live, end to end",
    body: "Built a connected Before to During to After spine on real Claude, Supabase, and fal first, so it stayed demoable at every step instead of becoming a set of disconnected screens.",
  },
  {
    icon: Sparkles,
    title: "Deepen and pressure-test",
    body: "Iterated each stage around what the chair actually needs in the moment: a live in-session transcript that listens then checks each statement, a windowed workspace to interrogate in place, bilingual Arabic with RTL, a level-of-detail zoom, and the institutional-memory loop that carries commitments between cycles.",
  },
];

/** The decision spine. Each fork shows what was chosen, why, and what was left unbuilt. */
const DECISIONS: { n: string; fork: string; chose: string; why: string; notBuilt?: string }[] = [
  {
    n: "D1",
    fork: "Which scenario should the prototype be?",
    chose: "A meeting-prep briefing assistant, not a single-principal sign-off tool.",
    why: "The recommendation was a procurement award sign-off (cleanest data, on-mandate fit). It was overruled on reach: the briefing pattern is not limited to principals. Every participant in every meeting can use it, which raises both real-world likelihood and the size of the bet.",
    notBuilt: "A one-principal procurement approval flow.",
  },
  {
    n: "D4",
    fork: "What is the hero capability?",
    chose: "Grounded Q&A with a confidence rating and a citation on every claim.",
    why: "It is the most AI-native moment and the one the brief grades hardest: streaming, sourcing, confidence, and honest uncertainty. For a senior official, confidence is the difference between acting and re-checking.",
    notBuilt: "A generic chatbot with no provenance.",
  },
  {
    n: "D5",
    fork: "What meeting, and what data?",
    chose: "A cross-government programme steering committee (the synthetic Manarah programme, five entities).",
    why: "It is the best fit for the second persona, the richest source for grounded Q&A, and it builds in natural confidence variation: official reports, a baseline charter that can be superseded, a risk register, and one informal note that conflicts with the record.",
  },
  {
    n: "D8",
    fork: "Mock the AI, or run it live?",
    chose: "Live. Real Claude over the whole pack, on every question.",
    why: "A single meeting is bounded, so there is a ceiling on what can be asked. The whole corpus fits in context (no retrieval gaps), structured outputs carry the claims and confidence, and a behavioral-contract prompt keeps answers honest and in-scope.",
    notBuilt: "Pre-canned answers that only survive a scripted demo.",
  },
  {
    n: "D9",
    fork: "How much of the lifecycle?",
    chose: "All three stages, Before, During, After, connected by an institutional-memory loop.",
    why: "The most ambitious option, chosen over a safer one-stage build. De-risked by building a connected end-to-end spine first, then deepening each stage. Commitments captured After become next cycle's prior positions in Before.",
  },
  {
    n: "D10",
    fork: "What does it look like?",
    chose: "An exception-led information architecture on an editorial-institutional skin.",
    why: "Lead with the bottom line and the decision, then ranked exceptions, then interrogation on demand. The skin reads as trust and calm, scales to dense data, and avoids a generic-AI look. Built on a re-skinnable token system.",
  },
  {
    n: "D11",
    fork: "How are the people in the room shown?",
    chose: "Dignified, lightly stylised editorial portraits, generated with fal.",
    why: "Faces humanise the room so the official maps people to what they own. Stylised rather than photoreal avoids the uncanny valley and reads as honestly synthetic. The restricted participant is an anonymous silhouette, which signals its own status.",
  },
  {
    n: "IA",
    fork: "Department or person?",
    chose: "A person represents a department; status belongs to the department, never the person.",
    why: "One visual language across every surface: a circular face is a person, a square code badge is a department. A person is never 'slipped'; their department's deliverable is. Department facts live in one source of truth so they cannot drift.",
  },
];

const CRAFT: { icon: typeof Sparkles; title: string; body: string }[] = [
  { icon: MessageCircleQuestion, title: "Grounded answers", body: "Every claim cites one passage and carries a confidence rating. Conflicting sources are shown as separate, unverified claims, never silently merged." },
  { icon: ShieldCheck, title: "Honest uncertainty", body: "If the pack does not contain the answer, it says so plainly rather than guessing. The system prompt is a behavioral contract, not a personality." },
  { icon: Database, title: "Auditable", body: "Every grounded answer is logged to Supabase with its sources, confidence mix, and latency. The institutional-memory loop persists to the same database." },
  { icon: Sparkles, title: "AI-built assets", body: "Participant portraits, the Ask Majlis brand, and the Manarah programme identity, all generated with fal (Nano Banana Pro). The committee pack, the people, and this case study itself were authored AI-first." },
];

/** The signature capabilities, highlighted up front. */
const FEATURES: { icon: typeof Sparkles; title: string; body: string }[] = [
  { icon: MessageCircleQuestion, title: "Grounded Q&A", body: "Ask anything in plain language. Answers stream in with a confidence rating and a citation on every claim, and say plainly when the pack does not hold the answer." },
  { icon: Target, title: "Exception-led brief", body: "The bottom line and the decision come first, then the exceptions that need attention, ranked by severity, never a flat wall of five status reports." },
  { icon: ScanSearch, title: "Live record-check", body: "During the meeting each statement is checked against the record as it is said, and a contradiction is flagged the moment it happens, with its source." },
  { icon: Repeat, title: "Memory that closes the loop", body: "Commitments captured after the meeting are written to memory and return as the next cycle's prior positions, so nothing is silently dropped." },
  { icon: ZoomIn, title: "Level-of-detail zoom", body: "Reshape the whole brief from headlines to full detail in one click, for a reader with eighteen minutes or with the afternoon." },
  { icon: Languages, title: "Bilingual, right-to-left", body: "Full Arabic with a right-to-left layout and answers written in Arabic, not just translated labels over an English product." },
  { icon: MousePointerClick, title: "Select to ask", body: "Highlight any line in the brief, a transcript, or a source, right-click, and ask Majlis about it in place, without losing where you were." },
  { icon: SquareStack, title: "Persistent windows", body: "Open any person, document, or citation as a draggable window. It stays with you across Before, During, and After until you close it." },
  { icon: StickyNote, title: "Save to notes", body: "Pin any answer or passage to a sticky note on the desk, so the threads you are pulling stay in view while you read." },
];

/** An explicit map of the deliverable onto the brief's evaluation, for the reviewer. */
const AGAINST: { crit: string; body: string }[] = [
  { crit: "The AI is the product", body: "Every moment that matters is the AI's judgment, not a feature bolted on: the brief it writes from the pack, the answers it grounds, the contradictions it catches live in the room." },
  { crit: "Thinking", body: "The decision spine above records every fork, what was chosen, why, and what was deliberately left unbuilt. The scenario itself was chosen for reach and for a moment where confidence genuinely varies." },
  { crit: "UI craft, the AI-states", body: "An exception-led, re-skinnable architecture, with the AI-states treated as first-class: streaming, confidence tiers, a citation on every claim, an honest “not in the pack”, and a costly failure mode in a figure that does not reconcile." },
  { crit: "Working with LLMs", body: "A behavioral contract decides when Majlis answers, flags, or refuses. And the build was AI-first the whole way down: the prototype, the corpus, the people, the assets, and this case study were all written with Claude Code in a native terminal, no Figma and no IDE in the loop." },
];

const LIFECYCLE: { icon: typeof Layers; stage: string; line: string; href: string }[] = [
  { icon: Layers, stage: "Before", line: "The brief: bottom line, the decision, ranked exceptions, who is in the room, and grounded Q&A on demand.", href: "/" },
  { icon: Users, stage: "During", line: "Convene the room, then a live transcript checks each statement against the record as it is spoken, flags contradictions, suggests questions, and captures commitments.", href: "/during" },
  { icon: GitBranch, stage: "After", line: "Minutes that draft themselves from what was captured, then write commitments to memory, closing the loop.", href: "/after" },
];

function Eyebrow({ children }: { children: string }) {
  return <div className="text-[12px] font-semibold mb-3 uppercase" style={{ color: C.accent, letterSpacing: "0.06em" }}>{children}</div>;
}

function SectionTitle({ children }: { children: string }) {
  return <h2 style={{ ...serif, letterSpacing: "-0.016em" }} className="text-[28px] md:text-[32px] leading-snug">{children}</h2>;
}

export default function ProcessPage() {
  const docCount = listProcessDocs().length;
  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), var(--font-arabic), system-ui, sans-serif" }}>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Hero, a branded gradient rather than a stock photo */}
        <header className="relative overflow-hidden rounded-3xl p-8 md:p-12 majlis-fade-up" style={{ border: `1px solid ${C.line}`, background: `linear-gradient(135deg, ${C.chipBg}, ${C.surface} 72%)`, boxShadow: C.shadow }}>
          <svg aria-hidden className="absolute -right-12 -top-12 opacity-[0.06]" width="300" height="300" viewBox="0 0 100 100" style={{ color: C.accent }}>
            <g fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="18" y="18" width="64" height="64" />
              <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="45" />
            </g>
          </svg>
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1" style={{ background: C.surface, color: C.accent, border: `1px solid ${C.line}` }}>
                <Sparkles size={12} strokeWidth={2.5} /> Case study
              </div>
              <div className="text-[12px]" style={{ color: C.muted }}>Abu Dhabi, United Arab Emirates</div>
            </div>
            <h1 style={{ ...serif, letterSpacing: "-0.025em" }} className="text-[52px] md:text-[68px] leading-[1.02] mt-4">Majlis</h1>
            <p className="text-[18px] md:text-[20px] leading-relaxed mt-3 max-w-xl" style={{ color: C.detail }}>
              An AI briefing companion that prepares a senior government official for a high-stakes meeting, across the whole
              lifecycle, with a memory that carries between cycles.
            </p>
            <p className="text-[14px] mt-4 max-w-xl" style={{ color: C.muted }}>
              A five-day prototype for the AI Experience Designer brief at the Department of Government Enablement, Abu Dhabi.
              Built AI-first, every line written with Claude Code in a terminal: live Claude, a synthetic committee pack, fal-generated people, and a Supabase audit trail.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] rounded-lg px-4 py-2.5" style={{ background: C.accent, color: C.onAccent }}>
                Open the prototype <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <a href="https://github.com/raymindai/majlis" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] rounded-lg px-4 py-2.5" style={{ border: `1px solid ${C.line}`, color: C.ink, background: C.surface }}>
                View the code
              </a>
            </div>
          </div>
        </header>

        {/* The build, in one screen */}
        <Reveal className="mt-12">
          <figure className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
            <ZoomImage
              src="/working-screen.png"
              alt="The Majlis prototype running in a browser on the left, Claude Code writing it in a terminal on the right."
              width={5120}
              height={2880}
              className="w-full h-auto block"
            />
          </figure>
          <figcaption className="text-[12.5px] mt-3 text-center" style={{ color: C.muted }}>
            The build, in one screen: the running prototype on the left, Claude Code writing it on the right. No Figma, no IDE.
          </figcaption>
        </Reveal>

        {/* The case */}
        <Reveal className="mt-20"><section>
          <Eyebrow>The case</Eyebrow>
          <SectionTitle>A bounded moment, made trustworthy</SectionTitle>
          <p className="text-[16px] leading-relaxed mt-4" style={{ color: C.detail }}>
            The scenario is a quarterly steering committee where five government entities report on a shared digital-services
            programme. One blocker dominates, a budget figure does not reconcile across sources, and an informal note
            contradicts an official report. The official has eighteen minutes. The product has to surface what matters,
            show its work, and be honest about what it does not know.
          </p>
          <p className="text-[16px] leading-relaxed mt-4 font-medium" style={{ color: C.ink }}>
            So the real design problem is not the screens, it is trust: the official has to act on what the AI says, in
            minutes, with no time to re-check it. Everything that follows, every decision and every feature, is in service
            of earning it. The AI is the product, and that trust is the whole job.
          </p>
        </section></Reveal>

        {/* The process */}
        <Reveal className="mt-20"><section>
          <Eyebrow>How it was made</Eyebrow>
          <SectionTitle>The process</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3" style={{ color: C.muted }}>
            Six moves, from reading the brief to a live, bilingual prototype. The work was kept demoable and documented at
            every step, not saved for a big reveal.
          </p>
          <div className="relative mt-8">
            <div aria-hidden className="absolute left-[19px] top-3 bottom-3 w-px" style={{ background: C.line }} />
            <ol className="space-y-7">
              {PROCESS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={p.title} className="relative flex gap-4">
                    <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                      <Icon size={17} strokeWidth={2} style={{ color: C.accent }} />
                    </div>
                    <div className="pt-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12px] font-semibold tabular-nums" style={{ color: C.faint }}>{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="text-[16px] font-semibold">{p.title}</h3>
                      </div>
                      <p className="text-[14px] leading-relaxed mt-1" style={{ color: C.detail }}>{p.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section></Reveal>

        {/* The decision spine */}
        <Reveal className="mt-20"><section>
          <Eyebrow>How I decided</Eyebrow>
          <SectionTitle>The decision spine</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3 mb-8" style={{ color: C.muted }}>
            The brief asks for judgment, not just a screen. Each fork below records what was chosen, why, and, where it
            matters, what was deliberately left unbuilt.
          </p>
          <ol className="space-y-5">
            {DECISIONS.map((d) => (
              <li key={d.n} className="rounded-2xl p-5 md:p-6" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[12px] font-semibold rounded-md px-2 py-0.5 shrink-0" style={{ background: `color-mix(in srgb, ${C.accent} 13%, transparent)`, color: C.accent }}>{d.n}</span>
                  <h3 className="text-[17px] font-semibold leading-snug">{d.fork}</h3>
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <CircleCheck size={16} strokeWidth={2} style={{ color: C.confirmed, marginTop: 2 }} className="shrink-0" />
                  <p className="text-[15px] leading-snug font-medium">{d.chose}</p>
                </div>
                <p className="text-[14px] leading-relaxed mt-2.5" style={{ color: C.detail }}>{d.why}</p>
                {d.notBuilt && (
                  <p className="text-[13px] mt-3 pt-3 border-t" style={{ color: C.muted, borderColor: C.line }}>
                    <span className="font-medium" style={{ color: C.ink }}>Not built: </span>{d.notBuilt}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section></Reveal>

        {/* The experience */}
        <Reveal className="mt-20"><section>
          <Eyebrow>The experience</Eyebrow>
          <SectionTitle>One loop, three stages</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3" style={{ color: C.muted }}>
            Majlis is one product across the whole meeting lifecycle, not three tools. The same brief and the same memory
            carry from preparation, into the room, to the record.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
            {LIFECYCLE.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.stage} href={s.href} className="rounded-2xl p-5 block majlis-lift" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                  <Icon size={18} strokeWidth={2} style={{ color: C.accent }} />
                  <div className="font-semibold text-[15px] mt-3">{s.stage}</div>
                  <p className="text-[13px] leading-snug mt-1.5" style={{ color: C.detail }}>{s.line}</p>
                  <div className="inline-flex items-center gap-1 text-[12px] mt-3" style={{ color: C.accent }}>Open <ArrowRight size={13} strokeWidth={2} /></div>
                </Link>
              );
            })}
          </div>
        </section></Reveal>

        {/* Key features */}
        <Reveal className="mt-20"><section>
          <Eyebrow>Key features</Eyebrow>
          <SectionTitle>What it actually does</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3" style={{ color: C.muted }}>
            Across the three stages, here is what the AI does, and how you work alongside it. Each one is live in the prototype, not a mockup.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-7">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl p-5 majlis-lift" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${C.accent} 12%, transparent)` }}>
                    <Icon size={19} strokeWidth={2} style={{ color: C.accent }} />
                  </div>
                  <div className="font-semibold text-[15px] mt-3.5">{f.title}</div>
                  <p className="text-[13.5px] leading-relaxed mt-1.5" style={{ color: C.detail }}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </section></Reveal>

        {/* The AI craft */}
        <Reveal className="mt-20"><section>
          <Eyebrow>The AI craft</Eyebrow>
          <SectionTitle>What makes it trustworthy</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {CRAFT.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                  <Icon size={18} strokeWidth={2} style={{ color: C.accent }} />
                  <div className="font-semibold text-[15px] mt-3">{c.title}</div>
                  <p className="text-[13px] leading-relaxed mt-1.5" style={{ color: C.detail }}>{c.body}</p>
                </div>
              );
            })}
          </div>
        </section></Reveal>

        {/* Against the brief */}
        <Reveal className="mt-20"><section>
          <Eyebrow>Against the brief</Eyebrow>
          <SectionTitle>How this answers what they asked</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3 mb-8" style={{ color: C.muted }}>
            The brief grades three things, on top of one non-negotiable. Here is where each one lives.
          </p>
          <ol className="space-y-4">
            {AGAINST.map((a) => (
              <li key={a.crit} className="rounded-2xl p-5 md:p-6" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                <div className="text-[12px] font-semibold uppercase" style={{ color: C.accent, letterSpacing: "0.06em" }}>{a.crit}</div>
                <p className="text-[15px] leading-relaxed mt-1.5" style={{ color: C.detail }}>{a.body}</p>
              </li>
            ))}
          </ol>
        </section></Reveal>

        {/* The full working record, surfaced as part of the project */}
        <Reveal className="mt-20"><section>
          <Eyebrow>The full record</Eyebrow>
          <SectionTitle>The process archive</SectionTitle>
          <p className="text-[15px] leading-relaxed mt-3" style={{ color: C.muted }}>
            Everything above is the summary. Underneath it sits the working archive: the running series of documents written
            as the work happened, from the first read of the brief through the decision log to the gap assessments. Kept
            diligently as the assignment progressed, not reconstructed afterwards.
          </p>
          <Link href="/process/archive" className="mt-6 group flex items-center justify-between gap-4 rounded-2xl p-5 majlis-lift" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
            <span className="flex items-center gap-4 min-w-0">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${C.accent} 12%, transparent)` }}>
                <Library size={20} strokeWidth={2} style={{ color: C.accent }} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-[16px]">Read the working archive</span>
                <span className="block text-[13px] mt-0.5" style={{ color: C.muted }}>{docCount} documents: scenario exploration, the decision log, the information architecture, and more.</span>
              </span>
            </span>
            <ArrowRight size={18} strokeWidth={2} className="shrink-0" style={{ color: C.accent }} />
          </Link>
        </section></Reveal>

        <div className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: C.line }}>
          <span className="text-[13px]" style={{ color: C.muted }}>Majlis, a five-day prototype. Synthetic data throughout.</span>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[14px]" style={{ color: C.accent }}>
            Open the prototype <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
