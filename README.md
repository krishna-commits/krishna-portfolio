# krishna-portfolio

Source for [krishnaneupane.com](https://krishnaneupane.com), the personal site of Krishna Neupane, Senior DevSecOps Engineer and Applied Security Researcher.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript 7

## Run locally

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # production build + type check
npm run lint
npm run typecheck
```

## Writing articles

Articles are MDX files in `content/posts/<slug>.mdx`, served at `/blog/<slug>`:

```mdx
export const metadata = {
  title: "…",
  description: "…",          // used for meta description and the article list
  date: "2026-11-02",
  tags: ["DevSecOps"],
  published: false,           // drafts show only in `npm run dev`
};

Body in Markdown. <FlowDiagram /> and <Callout /> are available without importing.
```

Publishing an article (`published: true`) adds it to the blog index, sitemap, `llms.txt`, ⌘K search, and TechArticle JSON-LD automatically.

## CI/CD

| Workflow | Runs |
|---|---|
| `.github/workflows/ci.yml` | Lint → type-check → build → security-header check → SEO endpoint check → Lighthouse CI (budgets in `lighthouserc.json`) → internal link check |
| `.github/workflows/security.yml` | CodeQL SAST, `npm audit`, gitleaks secret scan, dependency review on PRs (weekly + every push) |
| `.github/dependabot.yml` | Weekly npm and GitHub Actions updates |

## Editing content

All content and identity data lives in **`lib/data.ts`**. Page copy, meta tags, JSON-LD, and `/llms.txt` are all generated from it, so keep facts there and only there.

| To change | Edit in `lib/data.ts` |
|---|---|
| Bio, positioning, title | `profile`, `site` |
| Projects (and case-study sections) | `projects[].engineering` |
| Work history (About, homepage, llms.txt) | `experience` |
| Architecture diagrams | `referenceArchitecture`, `projects[].engineering.diagram` |
| Certifications | `certifications` (add `issuer` + `url`) |
| Research tracks | `research` (set `published: true` when an article is live, which makes it indexable) |

## Structure

| Path | What |
|---|---|
| `app/` | Routes: `/`, `/about`, `/projects`, `/projects/[slug]`, `/research-core`, `/research-core/[slug]`, `/blog`, `/contact`, `/mantras`, `/codecanvas`, `/privacy` |
| `app/llms.txt/route.ts` | Machine-readable profile for LLM tools |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap (indexable pages only) and crawler policy |
| `app/opengraph-image.tsx` | Generated social share image |
| `app/api/contact/route.ts` | Contact form endpoint (Resend) |
| `lib/seo.ts` | `pageMeta()` and JSON-LD builders (Person, WebSite, Thesis, BreadcrumbList) |
| `lib/medium.ts` | Medium RSS → `/blog` (server-rendered, hourly revalidate) |
| `docs/AUDIT-AND-STRATEGY.md` | Audit, implementation notes, and the 90-day plan |

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables (or `.env.local`):

| Name | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | For contact form | From [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | No | Defaults to `neupane.krishna33@gmail.com` |
| `CONTACT_FROM_EMAIL` | No | A sender on a domain verified in Resend |

## Validation checklist (after deploy)

- [ ] Rich Results Test on `/`, `/about`, `/projects/devops-world`
- [ ] `https://krishnaneupane.com/robots.txt`, `/sitemap.xml`, `/llms.txt` load
- [ ] Lighthouse (mobile) on `/` and `/about`
- [ ] Contact form sends (needs `RESEND_API_KEY`)
- [ ] Sitemap submitted in Google Search Console and Bing Webmaster Tools
