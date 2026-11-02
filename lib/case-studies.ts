import fs from "node:fs";
import path from "node:path";

// Case studies live in content/case-studies/<slug>.mdx and declare `export const metadata = {...}`.
const DIR = path.join(process.cwd(), "content/case-studies");

export type CaseStudyMeta = {
  title: string;
  summary: string;
  context: string; // e.g. "Enterprise SaaS · anonymized"
  role: string;
  period: string;
  date: string; // YYYY-MM-DD, for sorting
  stack: string[];
  outcomes: string[];
  // Drafts render in `next dev` only.
  published: boolean;
};

export type CaseStudy = CaseStudyMeta & { slug: string };

const showDrafts = process.env.NODE_ENV === "development";

export function getCaseStudySlugs() {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  if (!getCaseStudySlugs().includes(slug)) return null;
  const { metadata } = (await import(`@/content/case-studies/${slug}.mdx`)) as { metadata: CaseStudyMeta };
  if (!metadata.published && !showDrafts) return null;
  return { ...metadata, slug };
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const all = await Promise.all(getCaseStudySlugs().map(getCaseStudy));
  return all.filter((c): c is CaseStudy => c !== null).sort((a, b) => b.date.localeCompare(a.date));
}
