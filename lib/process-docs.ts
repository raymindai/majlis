import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// The working process archive lives in /process at the repo root and is git-tracked,
// so it is present at build time. These pages are statically generated, so the file
// reads happen during the build, never at request time.
const DIR = join(process.cwd(), "process");

export type ProcessDoc = {
  slug: string; // filename without .md, e.g. "05-decision-log"
  order: string; // numeric prefix, e.g. "05"
  title: string; // clean display title (authored here, not derived from the heading)
  summary: string; // one-line description for the index
  markdown: string; // raw markdown body
};

// Display titles and summaries are authored here so the chrome stays clean; the
// document bodies are rendered faithfully as the historical record they are.
const TITLE: Record<string, string> = {
  "00-readme": "Overview and snapshot",
  "01-role-and-brief": "The role and the brief",
  "02-scenario-exploration": "Scenario exploration",
  "03-selection-lenses-and-rescore": "Selection lenses and re-score",
  "04-decision-trees": "Decision trees",
  "05-decision-log": "Decision log",
  "06-conversation-log": "Conversation log",
  "07-concept-onepager": "Concept one-pager",
  "08-scenario-instance": "Scenario instance: Manarah",
  "09-build-plan": "Build plan and checklist",
  "10-journey-and-features": "Meeting journey and features",
  "11-design-criteria": "Design-direction criteria",
  "12-information-architecture": "Information architecture",
  "13-service-ux-definition": "Service and UX definition",
  "14-ia-naming-rules": "IA naming rules",
  "15-before-gap-assessment": "Before: gap assessment",
};

const SUMMARY: Record<string, string> = {
  "00-readme": "The index and project snapshot, with the locked decisions at a glance.",
  "01-role-and-brief": "The source role and brief, and what the brief is really testing.",
  "02-scenario-exploration": "Seven candidate scenarios, each checked against four tests.",
  "03-selection-lenses-and-rescore": "Scoring the scenarios through impact, platform, and presentation lenses.",
  "04-decision-trees": "The decision-tree spine: every fork, with the rejected branch left visible.",
  "05-decision-log": "The running record of every locked decision and its rationale.",
  "06-conversation-log": "A cleaned, chronological record of the working conversation.",
  "07-concept-onepager": "The Majlis concept on a single page, for Scenario A.",
  "08-scenario-instance": "The synthetic Manarah steering review that makes it concrete.",
  "09-build-plan": "The execution plan and checklist for the live prototype.",
  "10-journey-and-features": "The meeting journey and the feature inventory across the lifecycle.",
  "11-design-criteria": "The criteria for choosing a design direction, fixed before pixels.",
  "12-information-architecture": "Hierarchy and data flow: fixing the skeleton before the skin.",
  "13-service-ux-definition": "Defining the service and the UX before pixels, to lower risk.",
  "14-ia-naming-rules": "Naming and attribution rules: departments versus people.",
  "15-before-gap-assessment": "A gap assessment of the Before stage before moving on.",
};

export function listProcessDocs(): ProcessDoc[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.md$/, "").toLowerCase();
      const order = (slug.match(/^\d+/) ?? [""])[0];
      return {
        slug,
        order,
        title: TITLE[slug] ?? slug,
        summary: SUMMARY[slug] ?? "",
        markdown: readFileSync(join(DIR, file), "utf8"),
      };
    });
}

export function getProcessDoc(slug: string): ProcessDoc | null {
  return listProcessDocs().find((d) => d.slug === slug) ?? null;
}

/**
 * The body with its leading H1 removed (the page renders the title itself), and
 * with em-dashes, en-dashes, and middots replaced so the rendered archive reads
 * clean. The source .md files are kept verbatim as the raw record.
 */
export function bodyWithoutTitle(markdown: string): string {
  return markdown
    .replace(/^#\s+.*(?:\r?\n)+/, "")
    .replace(/ *— */g, ", ")
    .replace(/ *· */g, ", ")
    .replace(/–/g, "-");
}
