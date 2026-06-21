import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { C } from "@/components/theme";
import { bodyWithoutTitle, getProcessDoc, listProcessDocs } from "@/lib/process-docs";

const serif = { fontFamily: "var(--font-newsreader), var(--font-arabic), Georgia, serif" };

// Only the documents in the archive are valid routes; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listProcessDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getProcessDoc(slug);
  if (!doc) return {};
  return { title: `${doc.title}, process archive`, description: doc.summary };
}

export default async function ProcessDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getProcessDoc(slug);
  if (!doc) notFound();

  const html = await marked.parse(bodyWithoutTitle(doc.markdown), { gfm: true });

  const docs = listProcessDocs();
  const idx = docs.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? docs[idx - 1] : null;
  const next = idx < docs.length - 1 ? docs[idx + 1] : null;

  return (
    <div className="min-h-dvh" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-inter), var(--font-arabic), system-ui, sans-serif" }}>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <Link href="/process/archive" className="inline-flex items-center gap-1.5 text-[13px] mb-8" style={{ color: C.muted }}>
          <ArrowLeft size={14} strokeWidth={2} /> Process archive
        </Link>

        <header className="mb-9">
          <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase mb-3" style={{ color: C.accent, letterSpacing: "0.06em" }}>
            <span className="tabular-nums rounded-md px-2 py-0.5" style={{ background: `color-mix(in srgb, ${C.accent} 12%, transparent)` }}>{doc.order || "00"}</span>
            <span>Working document</span>
          </div>
          <h1 style={{ ...serif, letterSpacing: "-0.02em" }} className="text-[32px] md:text-[40px] leading-[1.1]">{doc.title}</h1>
          {doc.summary && <p className="text-[16px] leading-relaxed mt-3" style={{ color: C.muted }}>{doc.summary}</p>}
        </header>

        <article className="process-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <nav className="mt-14 pt-8 border-t grid grid-cols-2 gap-4" style={{ borderColor: C.line }}>
          <div>
            {prev && (
              <Link href={`/process/archive/${prev.slug}`} className="group block rounded-xl p-4 majlis-lift" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: C.muted }}><ArrowLeft size={12} strokeWidth={2} /> Previous</span>
                <span className="block text-[14px] font-medium mt-1 leading-snug">{prev.title}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/process/archive/${next.slug}`} className="group block rounded-xl p-4 majlis-lift" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: C.muted }}>Next <ArrowRight size={12} strokeWidth={2} /></span>
                <span className="block text-[14px] font-medium mt-1 leading-snug">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[13px]">
          <Link href="/process" className="inline-flex items-center gap-1.5" style={{ color: C.muted }}>
            <ArrowLeft size={14} strokeWidth={2} /> The case study
          </Link>
          <a href={`https://github.com/raymindai/majlis/blob/main/process/${doc.slug.replace(/^(\d+)-readme$/, "$1-README")}.md`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5" style={{ color: C.accent }}>
            View raw on GitHub <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}
