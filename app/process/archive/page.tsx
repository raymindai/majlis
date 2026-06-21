import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { C } from "@/components/theme";
import Reveal from "@/components/reveal";
import { listProcessDocs } from "@/lib/process-docs";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

export const metadata = {
  title: "Process archive, Majlis",
  description: "The working record of how the Majlis case study was thought through and built.",
};

export default function ProcessArchivePage() {
  const docs = listProcessDocs();

  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), var(--font-arabic), system-ui, sans-serif" }}>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <Link href="/process" className="inline-flex items-center gap-1.5 text-[13px] mb-8" style={{ color: C.muted }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to the case study
        </Link>

        <div className="text-[12px] font-semibold mb-3 uppercase" style={{ color: C.accent, letterSpacing: "0.06em" }}>Process archive</div>
        <h1 style={{ ...serif, letterSpacing: "-0.02em" }} className="text-[34px] md:text-[42px] leading-[1.08]">How this was thought through</h1>
        <p className="text-[16px] leading-relaxed mt-4" style={{ color: C.detail }}>
          The case study is the summary. This is the working record underneath it: the running series of documents written
          as the assignment was scoped, decided, and built, kept diligently rather than reconstructed afterwards. Every
          decision, and what was deliberately left unbuilt, is here in full. All scenario data is synthetic.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: C.muted }}>
          <span><span className="font-semibold" style={{ color: C.ink }}>{docs.length}</span> documents</span>
          <span><span className="font-semibold" style={{ color: C.ink }}>5 days</span> from brief to live prototype</span>
          <span><span className="font-semibold" style={{ color: C.ink }}>AI Experience Designer</span>, DGE Abu Dhabi</span>
        </div>

        <ol className="mt-10 space-y-3">
          {docs.map((d, i) => (
            <Reveal key={d.slug} delay={Math.min(i * 35, 280)}>
              <Link
                href={`/process/archive/${d.slug}`}
                className="group flex items-start gap-4 rounded-2xl p-5 majlis-lift"
                style={{ background: C.surface, border: `1px solid ${C.line}`, boxShadow: C.shadow }}
              >
                <span className="text-[13px] font-semibold tabular-nums shrink-0 mt-0.5 rounded-md px-2 py-0.5" style={{ background: `color-mix(in srgb, ${C.accent} 12%, transparent)`, color: C.accent }}>
                  {d.order || "—"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[16px] leading-snug">{d.title}</span>
                  <span className="block text-[13.5px] leading-snug mt-1" style={{ color: C.detail }}>{d.summary}</span>
                </span>
                <ArrowRight size={16} strokeWidth={2} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.accent }} />
              </Link>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: C.line }}>
          <Link href="/process" className="inline-flex items-center gap-1.5 text-[14px]" style={{ color: C.muted }}>
            <ArrowLeft size={15} strokeWidth={2} /> The case study
          </Link>
          <a href="https://github.com/raymindai/majlis/tree/main/process" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px]" style={{ color: C.accent }}>
            View the source on GitHub <ArrowUpRight size={15} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}
