# krishnaneupane.com: Audit, Implementation & 90-Day Strategy

_Prepared November 2026._

## 1. Audit of the live site (before)

The original source code was lost, so this audit is based on the deployed site.

**Stack.** Next.js on Vercel, with images on Vercel Blob storage. Eight top-level routes: `/`, `/research-core`, `/projects`, `/blog`, `/codecanvas`, `/mantras`, `/contact`, `/privacy`.

**Strengths**
- Clear headline positioning: "Senior DevSecOps Engineer, Applied Security Researcher".
- Real, live tools on subdomains (DevOps World, Domain Search, Cheatsheet, Cron Generator, Grafana).
- Verifiable academic record: MSc 2023 and BSc 2018 theses, ORCID, ResearchGate.
- A large Research Core library (140+ articles claimed).

**Weaknesses found**

| Area | Issue | Impact |
|---|---|---|
| Content rendering | `/blog` and `/codecanvas` render their content client-side. Crawlers and AI fetchers saw only navigation. | Search and AI tools can't read them |
| Entity clarity | No standalone About page or single biography. Facts are spread across the homepage. | Weak entity understanding |
| Projects | Projects were external links only, with no page on the domain explaining them. | Lost authority and internal linking |
| Copy quality | Some project cards had boilerplate secondary lines. | Undercuts credibility |
| Navigation | Seven top-level items, two of them personal or unfinished (Mantras, Canvas). | Diluted first impression |
| Experience | "Available upon request", with no timeline. | Recruiters can't verify a career arc |
| Certifications | The site showed 6 of 10. | Incomplete credential record |
| Footer | "Krishna Neupane Since @ 1995" read as a typo. | Polish |
| Structured data | No visible JSON-LD Person / ProfilePage / sameAs graph. | Weak search and AI entity linking |
| AI crawlers | No `llms.txt`. robots.txt policy was unknown. | Lost AI discoverability |

## 2. What was implemented

### Architecture
- **New `/about`**: canonical biography, focus areas, research, a timeline built from verifiable dated items, certifications, tech stack, community work, and verified profiles.
- **New `/projects/[slug]`**: a case-study page per project (overview, problem, audience, features). Architecture, security, decisions, outcomes, stack and repo sections appear automatically once you fill them in `lib/data.ts`.
- **Navigation trimmed** to About / Projects / Research / Writing / Contact. Mantras, Code Canvas and Privacy moved to the footer, keeping the same URLs, so no links broke.
- `/blog` now **server-renders** posts from the Medium RSS feed, so crawlers see real content.
- Redirects: `/research` → `/research-core`, `/canvas` → `/codecanvas`, `/writing` → `/blog`.

### Design system
- **Identity:** paper and ink with a single saffron signal (`#F5A524`). The कृष्ण Devanagari mark is set in Noto Serif Devanagari. It's distinctive, ties to your name and origin, and avoids the generic blue-gradient tech look.
- **Type:** Geist for text and Geist Mono for labels and data, self-hosted through `next/font` with no layout shift.
- **Hero:** name, role, one-line positioning, three CTAs, and an `identity.yaml` card. It's a technical motif built only from real facts.
- **Motion:** one staggered rise on load and a pulsing availability dot. Both are disabled under `prefers-reduced-motion`.
- **Light and dark** follow the OS. Accent text uses `--accent-ink` for AA contrast.
- Accessible patterns: skip link, `aria-current`, `aria-pressed` filters, labelled dialog, visible focus rings, and semantic `dl`/`ol`/`article`.

### Technical SEO
- `pageMeta()` gives every page a unique title, a unique description, a canonical URL, Open Graph and Twitter tags.
- A dynamic **Open Graph image** (`app/opengraph-image.tsx`) for social shares.
- `sitemap.xml` lists **indexable pages only**. `robots.txt` allows all crawlers and blocks `/api/`.
- **Placeholder pages are `noindex`**: Research Core tracks without bodies, mantra chapters, and Code Canvas. Thin pages hurt site-wide quality signals. Set `published: true` on a research item once its article is restored.
- Visible breadcrumbs with `BreadcrumbList` JSON-LD on every inner page.
- Security headers: HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP. `X-Powered-By` is removed.

### Structured data (JSON-LD, one `@graph` per page)
- **Person** (`/#person`): name, alternateName कृष्ण, jobTitle, address, alumniOf, knowsAbout, `hasCredential` (degrees and certifications), and `sameAs` (LinkedIn, GitHub, ResearchGate, ORCID, Medium).
- **WebSite**, plus **ProfilePage** on `/` and `/about`.
- **Thesis** for both theses (author → Person).
- **WebApplication** per project (author/creator → Person, free, no ratings).
- **CollectionPage/ItemList** on `/projects`, **ContactPage** on `/contact`, **TechArticle** on research items once published.
- Nothing is fabricated: no ratings, reviews, awards or employers.

### GEO / AI discoverability
- **`/llms.txt`**, generated from `lib/data.ts`, so it never drifts from the site: identity, bio, expertise, projects, research, education, certifications. It's a helpful extra layer, not a ranking factor.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, and CCBot.
- **One source of truth.** The name, title, bio and positioning come from `lib/data.ts` and are reused identically in page copy, meta tags, JSON-LD and llms.txt. That consistency is what lets AI systems resolve "Krishna Neupane" to one entity.
- The bio is written to be quotable: short, factual, third-person sentences an answer engine can lift.
- `rel="me"` on profile links, for identity verification on platforms that support it.

### Engineering
- Next.js 16, React 19, Tailwind CSS 4, TypeScript 7 (with `experimental.useTypeScriptCli`), and ESLint 9 flat config.
- No runtime dependencies beyond Next and React. Medium RSS is parsed without a library, and contact email goes through Resend's REST API with no SDK.
- Contact API: server-side validation, a honeypot, HTML escaping, and clear 4xx/5xx errors.

## 3. Remaining issues & what only you can provide

These need real information. I did not invent it.

1. **Professional experience.** Add roles to `experience` in `lib/data.ts`. This is the single biggest credibility gap for recruiters.
2. **Profile photo.** A professional headshot helps people recognize you, and lets Person `image` be set in JSON-LD.
3. **Project engineering details.** For each project, add architecture, stack, security considerations, decisions, real outcomes, and the GitHub repo.
4. **Four missing certifications**, plus issuer and verification URL (Credly etc.) for all of them.
5. **The 61-tool stack list** and the full Grafana dashboard URL.
6. **Research Core articles.** Restore them as MDX and flip `published: true`. These are your strongest topical-authority asset.
7. **Thesis links.** Add the ResearchGate or repository URL to each thesis.
8. **Code Canvas and mantra chapter content.**
9. **Lighthouse and Core Web Vitals:** run after deploy (see the validation checklist in the README). The design is built for it (static rendering, self-hosted fonts, almost no client JS), but I haven't measured it.
10. **A CSP header** isn't set yet. Add a nonce-based CSP once analytics and third-party scripts are settled.

## 4. External actions

- **Vercel:** connect this repo, set `RESEND_API_KEY`, and make `krishnaneupane.com` the primary domain with `www` redirecting to it.
- **Google Search Console and Bing Webmaster Tools:** verify the domain, submit `sitemap.xml`, and request indexing for `/`, `/about`, `/projects`. Bing also feeds ChatGPT search and Copilot.
- **Check Vercel and Cloudflare bot settings** so they don't block the AI crawlers listed above.
- **Make every profile match:** the same name, the same headline ("Senior DevSecOps Engineer & Applied Security Researcher"), and a link to `https://krishnaneupane.com`. That means LinkedIn, GitHub, ORCID, ResearchGate, Medium and Credly.
- **ORCID:** add the website and both theses as works.
- **GitHub:** a profile README linking the site, plus pinned repos for the five projects.
- **Rich Results Test:** validate `/`, `/about` and a project page at search.google.com/test/rich-results.

## 5. 90-day visibility & authority plan

**Days 1–30: foundation and entity consistency**
- Deploy. Complete Search Console and Bing setup. Fix any coverage errors.
- Fill in experience, photo, certifications and project engineering details (section 3).
- Align all external profiles (section 4). Make the GitHub profile README and pinned repos match the projects.
- Restore the 5 highest-value Research Core tracks as full articles: DevSecOps, Kubernetes Security, Zero Trust, Supply Chain Security, Incident Response. Mark them `published`.

**Days 31–60: topical authority**
- Publish two in-depth technical articles a month on the site, cross-posted to Medium with the canonical URL pointing to krishnaneupane.com. Suggested topics drawn from your actual work:
  - Shift-left security gates in Bitbucket and Kubernetes pipelines with SonarQube
  - Continuous threat detection in the cloud: a practical write-up of your MSc thesis
  - Terraform and Terragrunt layouts for multi-cloud with policy scanning
  - Observability for detection: Prometheus, Loki and Grafana alert design
- Write a full case study for DevOps World, your most differentiated project.
- Open-source at least one project repo with a quality README linking back.

**Days 61–90: external signals**
- Submit one talk proposal to a regional DevOps or security meetup or conference (e.g., a DevOpsDays, OWASP chapter, or BSides event).
- Contribute documentation or fixes to one open-source project you use (Terraform providers, Grafana dashboards, Kubernetes security tooling).
- Pitch one guest article to an established engineering publication.
- Review Search Console queries, double down on the topics that get impressions, and refresh the bio with any new verifiable achievements.

**How to measure.** Track these instead of expecting guaranteed rankings or AI citations, which nobody can promise:
- Search Console impressions and clicks for "Krishna Neupane" and topic queries
- Number of indexed pages
- Referral traffic from chatgpt.com, perplexity.ai and copilot
- Whether AI assistants describe you accurately when asked "Who is Krishna Neupane?" (check monthly)
