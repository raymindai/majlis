import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CircleCheck,
  Database,
  GitBranch,
  Layers,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { C } from "@/components/theme";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

export const metadata = {
  title: "Majlis, the case study",
  description: "How an AI briefing companion was scoped, decided, and built.",
};

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
  { icon: Sparkles, title: "AI-built assets", body: "Participant portraits generated with fal (Nano Banana Pro). The committee pack, the people, and this case study were authored AI-first." },
];

const LIFECYCLE: { icon: typeof Layers; stage: string; line: string; href: string }[] = [
  { icon: Layers, stage: "Before", line: "The brief: bottom line, the decision, ranked exceptions, who is in the room, and grounded Q&A on demand.", href: "/" },
  { icon: Users, stage: "During", line: "A live transcript that flags inconsistencies against the record and suggests the next question to ask.", href: "/during" },
  { icon: GitBranch, stage: "After", line: "Minutes that draft themselves from what was captured, then write commitments to memory, closing the loop.", href: "/after" },
];

function Eyebrow({ children }: { children: string }) {
  return <div className="text-[12px] font-semibold mb-3" style={{ color: C.accent, letterSpacing: "0.04em" }}>{children}</div>;
}

export default function ProcessPage() {
  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), var(--font-arabic), system-ui, sans-serif" }}>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-10" style={{ border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
          <Image src="/manarah-hero.jpg" alt="The Manarah programme" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>
        {/* Hero */}
        <div className="text-[12px] font-semibold" style={{ color: C.muted }}>Case study</div>
        <h1 style={serif} className="text-[44px] md:text-[56px] leading-[1.05] mt-3">Majlis</h1>
        <p className="text-[19px] md:text-[21px] leading-relaxed mt-4" style={{ color: C.detail }}>
          An AI briefing companion that prepares a senior government official for a high-stakes meeting, across the whole
          lifecycle, Before, During, and After, with an institutional memory that carries between cycles.
        </p>
        <p className="text-[14px] mt-4" style={{ color: C.muted }}>
          A five-day prototype for the AI Experience Designer brief at the Department of Government Enablement, Abu Dhabi.
          Built AI-first: live Claude, a synthetic committee pack, fal-generated people, and a Supabase audit trail.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] rounded-lg px-4 py-2.5" style={{ background: C.accent, color: C.onAccent }}>
            Open the prototype <ArrowRight size={15} strokeWidth={2} />
          </Link>
          <a href="https://github.com/raymindai/majlis" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] rounded-lg px-4 py-2.5" style={{ border: `1px solid ${C.line}`, color: C.ink }}>
            View the code
          </a>
        </div>

        {/* The case */}
        <section className="mt-20">
          <Eyebrow>The case</Eyebrow>
          <h2 style={serif} className="text-[28px] leading-snug">A bounded moment, made trustworthy</h2>
          <p className="text-[16px] leading-relaxed mt-4" style={{ color: C.detail }}>
            The scenario is a quarterly steering committee where five government entities report on a shared digital-services
            programme. One blocker dominates, a budget figure does not reconcile across sources, and an informal note
            contradicts an official report. The official has eighteen minutes. The product has to surface what matters,
            show its work, and be honest about what it does not know.
          </p>
        </section>

        {/* The decision spine */}
        <section className="mt-20">
          <Eyebrow>How I decided</Eyebrow>
          <h2 style={serif} className="text-[28px] leading-snug">The decision spine</h2>
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
        </section>

        {/* The experience */}
        <section className="mt-20">
          <Eyebrow>The experience</Eyebrow>
          <h2 style={serif} className="text-[28px] leading-snug">One loop, three stages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {LIFECYCLE.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.stage} href={s.href} className="rounded-2xl p-5 block hover:opacity-90" style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}>
                  <Icon size={18} strokeWidth={2} style={{ color: C.accent }} />
                  <div className="font-semibold text-[15px] mt-3">{s.stage}</div>
                  <p className="text-[13px] leading-snug mt-1.5" style={{ color: C.detail }}>{s.line}</p>
                  <div className="inline-flex items-center gap-1 text-[12px] mt-3" style={{ color: C.accent }}>Open <ArrowRight size={13} strokeWidth={2} /></div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* The AI craft */}
        <section className="mt-20">
          <Eyebrow>The AI craft</Eyebrow>
          <h2 style={serif} className="text-[28px] leading-snug">What makes it trustworthy</h2>
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
        </section>

        {/* Honest next */}
        <section className="mt-20">
          <Eyebrow>If I had longer</Eyebrow>
          <h2 style={serif} className="text-[28px] leading-snug">What I would do next</h2>
          <ul className="mt-5 space-y-2.5">
            {[
              "Pull the live transcript from real audio, rather than a stepped script.",
              "Role-scope what each participant can see, since the restricted annex is a real constraint.",
              "Let the official correct a claim and have that correction become part of the record.",
              "Measure trust: how often the official opens a citation before acting on a claim.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: C.detail }}>
                <ArrowRight size={15} strokeWidth={2} style={{ color: C.faint, marginTop: 3 }} className="shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </section>

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
