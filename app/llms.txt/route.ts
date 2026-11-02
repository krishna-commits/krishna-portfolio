import {
  certifications,
  education,
  experience,
  expertise,
  formatMonth,
  formatRange,
  profile,
  projects,
  publicCompany,
  research,
  sameAs,
  site,
  socials,
  theses,
} from "@/lib/data";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a plain-markdown summary for LLM tools. Generated from lib/data.ts so it never drifts.
export async function GET() {
  const posts = (await getPosts()).filter((p) => p.published);

  const body = `# ${site.name}

> ${site.description}

${profile.bio.join("\n\n")}

## Identity

- Name: ${site.name} (${site.logo})
- Role: ${profile.roles.join(", ")}
- Current position: ${experience[0].title}, ${experience[0].company}
- Location: ${site.location.city}, ${site.location.country} (open to remote)
- Languages: ${profile.languages.join(", ")}
- Website: ${site.url}
- Contact: ${site.contactUrl}
- Book a call: ${socials.calendly}
- Verified profiles: ${sameAs.join(", ")}

## Experience

${experience
  .map((r) => `- ${r.title}, ${r.confidential ? publicCompany(r) : `${r.company}${r.context ? ` (${r.context})` : ""}`}, ${formatRange(r.start, r.end)}: ${r.summary}`)
  .join("\n")}

## Expertise

${expertise.map((e) => `- ${e}`).join("\n")}

## Projects

${projects.map((p) => `- [${p.title}](${site.url}/projects/${p.slug}): ${p.summary} Live: ${p.href}`).join("\n")}

## Research

${theses.map((t) => `- ${t.title} (${t.degree}, ${t.institution}, ${t.year})`).join("\n")}
- [Research Core](${site.url}/research-core): ${research.length} applied research tracks on DevSecOps, cloud security, platform engineering, and reliability.
${posts.length ? `\n## Articles\n\n${posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join("\n")}\n` : ""}
## Education

${education.map((e) => `- ${e.degree}, ${e.awardedBy} (delivered through ${e.school}), ${formatMonth(e.date)}`).join("\n")}

## Courses & certifications

${certifications.map((c) => `- ${c.name}${c.issuer ? `, ${c.issuer}` : ""}${c.date ? ` (${formatMonth(c.date)})` : ""}`).join("\n")}

## Pages

- [About](${site.url}/about): biography, experience, architecture, research, certifications, technology stack
- [Projects](${site.url}/projects)
- [Research Core](${site.url}/research-core)
- [Writing](${site.url}/blog)
- [Contact](${site.url}/contact)
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
