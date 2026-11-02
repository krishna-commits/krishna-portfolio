# Competitive design analysis

_November 2026. Ten reference sites reviewed; chrisbox.ca returned HTTP 403 to automated review and is excluded._

## Sites reviewed

| Site | Positioning | Signature idea | Main weakness |
|---|---|---|---|
| souravkundu.dev | DevOps / SRE / Platform | One metaphor everywhere ("production", "page me"). Interactive *Journey Trace* of a request from DNS to response. Terminal and keyboard navigation. | Blocks narrow screens. No writing, no measured outcomes. |
| rajankarki.com.np | AWS Cloud Engineer | Metric-led hero and outcome-first project cards with filters. Writing previews. | Contradicts itself (5+ vs 6+ years). Long single page. No case studies. |
| orelbello.com | Senior DevOps & Platform | Hover-driven architecture diagram. Dual identity (engineer and community builder). Talks and podcasts. | About 20 sections and many competing CTAs. Animated counters render as "0". |
| thehumble.dev | Cybersecurity Architect | Tight, specialized positioning line. | Almost no proof on the homepage. |
| ahmouden.com | Security Engineer | Clean blog-first layout with hands-on CTF and cloud-challenge write-ups. RSS and search. | No case studies or outcomes. Projects read as unfinished. |
| ernestbaker.me | DevSecOps Engineer | Specific, metric-backed project paragraphs (e.g. 47 findings triaged to 1). | No navigation, no writing, unsorted projects. |
| rounakneema.in | DevOps / Security / Pentest | "Who is…?" FAQ (good for AI answers). Resume-first CTA. | Projects are bare bullets. Title is framed differently from one page to the next. |
| aradhyapuneeth.github.io | DevOps & Platform | Full terminal/git metaphor (`whoami`, `git log --career`). Boot loader, live clock, verify links on certifications. | Novelty over readability. No writing or project detail. |
| philipoludolamu.com | DevOps (secure delivery) | Two deep case studies with architecture diagrams, screenshots, and *Decision → Trade-off → Result* cards. Principles section. Resume in PDF and in the browser. | Metrics without baselines, and figures that don't match (70% vs ~65%). |

## Patterns that work

1. **One coherent metaphor** makes a site memorable (Sourav, Puneeth).
2. **Interactive explanations** of how systems work beat tool logos (Sourav's trace, Orel's diagram).
3. **Architecture-first case studies** with reasoning, not just results (Philip).
4. **Recruiter utilities:** a resume one click away, availability, time zone (Rounak, Philip, Puneeth).
5. **Verifiable credentials:** "verify" links on certifications (Puneeth).
6. **Plain-language identity Q&A**, which feeds AI answers (Rounak).
7. **Practical writing** tied to real work (Rajan, Ahmed).

## Patterns to avoid

- Numbers that contradict each other or have no baseline. **None of the competitors link a claim to evidence.**
- Too many calls to action (Orel), no navigation (Ernest), blocking mobile visitors (Sourav).
- Terminal gimmicks that make content harder to read (boot loaders, fake shells) when the content itself is thin.
- Long single pages that bury the key facts.

## Krishna's differentiator: "Verified"

Every competitor *asserts*. A DevSecOps and supply-chain engineer should *attest*. The identity is a signed artifact: every claim carries its provenance.

| Element | Implementation |
|---|---|
| Identity card | `identity.yaml` hero card built only from verifiable facts |
| Proof strip | Each figure links to its source (experience, stack, certifications, live tool), with a "verified" marker |
| Signature visual | **Interactive secure delivery pipeline**: six stages, each a selectable tab revealing its control, rationale, and the tools Krishna uses. Keyboard-accessible, CSS-animated signal. Different from Sourav's request trace: it explains *how he ships safely*, which is his job. |
| Architecture | `FlowDiagram` with security and resilience planes, used on /about, in articles, and on project pages |
| Principles | Four operating principles ("Fail closed", …), drafts for Krishna to edit |
| Recruiter utilities | Live Kathmandu time (UTC+5:45) in the hero and on Contact; resume on request through the contact form (topic preselected) |
| Identity Q&A | "Quick facts" on /about with FAQPage markup |
| Writing | MDX articles with reading time, RSS (`/feed.xml`), TechArticle markup |
| Consistency | Every figure comes from `lib/data.ts`, so the site can't contradict itself the way competitors do |

## What still needs Krishna's input

- **Certification verification URLs** (Credly, Okta) to add "verify" links, like Puneeth's but on more credentials.
- **Two flagship case studies** (Philip's strongest pattern): architecture, screenshots, and Decision / Trade-off / Result for real platform work, anonymized as needed.
- **A professional photo.** Seven of the nine sites use one.
- **Talks or community work**, if any (Orel's strongest proof).
