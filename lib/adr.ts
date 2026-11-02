// Architecture Decision Records for krishnaneupane.com: real decisions made while building this site.
export type Adr = {
  id: string;
  title: string;
  date: string;
  status: "Accepted" | "Superseded" | "Proposed";
  context: string;
  decision: string;
  consequences: { good: string[]; bad: string[] };
};

export const adrs: Adr[] = [
  {
    id: "ADR-001",
    title: "Render statically by default",
    date: "2026-11-02",
    status: "Accepted",
    context:
      "The site is mostly content that changes on deploy, not per request. Server-rendering every page adds latency, cost, and runtime attack surface for no benefit.",
    decision:
      "Use Next.js static rendering for all content pages. Only /status renders per request (its whole point is live checks) and /api/contact runs as a function. External data (Medium, DEV, GitHub) is revalidated hourly.",
    consequences: {
      good: ["Pages are served from the CDN edge: fast and resilient", "Almost no server-side code is reachable by visitors"],
      bad: ["External content can be up to an hour stale", "Nonce-based CSP isn't possible without giving up static rendering (see ADR-002)"],
    },
  },
  {
    id: "ADR-002",
    title: "Content-Security-Policy with 'unsafe-inline' scripts, not nonces",
    date: "2026-11-02",
    status: "Accepted",
    context:
      "Statically rendered Next.js pages inline their RSC payload as scripts. A strict nonce-based CSP requires a fresh nonce per request, which forces every page to render dynamically.",
    decision:
      "Ship a strict CSP everywhere else (default-src 'self', frame-ancestors 'none', object-src 'none', base-uri 'self', form-action 'self') but allow 'unsafe-inline' for scripts. 'unsafe-eval' is allowed only in local development.",
    consequences: {
      good: ["Keeps static rendering and CDN caching (ADR-001)", "Blocks framing, plugins, base-tag injection, and off-site form posts"],
      bad: ["Inline script injection isn't blocked by CSP; mitigated by React's output escaping and having no user-generated HTML"],
    },
  },
  {
    id: "ADR-003",
    title: "One source of truth for every fact",
    date: "2026-11-02",
    status: "Accepted",
    context:
      "Career facts appear in page copy, meta tags, JSON-LD, llms.txt, RSS, and the resume. Copies drift, and drifting numbers destroy credibility with recruiters and confuse search engines and AI systems.",
    decision:
      "All identity data (roles, dates, impact numbers, certifications, projects) lives in one typed file, lib/data.ts. Every page and machine-readable output is generated from it.",
    consequences: {
      good: ["The site can't contradict itself", "One edit updates the page, the resume, the structured data, and llms.txt together"],
      bad: ["Content edits are code changes and go through the pipeline"],
    },
  },
  {
    id: "ADR-004",
    title: "Generate a deterministic SBOM and sign its provenance",
    date: "2026-11-02",
    status: "Accepted",
    context:
      "A DevSecOps portfolio should be verifiable, not just descriptive. Vercel builds from source, so CI can't attest the deployed artifact directly.",
    decision:
      "Generate a CycloneDX SBOM deterministically from the lockfile (no timestamps, sorted, serial derived from the lockfile hash). CI signs a SLSA build provenance attestation for it with Sigstore; the site serves the byte-identical file at /sbom.json.",
    consequences: {
      good: ["Anyone can verify the dependency inventory with one command", "No extra build dependency was added to produce it"],
      bad: ["The attestation covers the SBOM, not every deployed byte", "Requires the repository to be public for public verification"],
    },
  },
  {
    id: "ADR-005",
    title: "No public email address",
    date: "2026-11-02",
    status: "Accepted",
    context: "A plain email address on every page is harvested by spam crawlers within days.",
    decision:
      "Contact goes through the form and Calendly. The destination address exists only as a server-side environment variable, never in the (public) code; security.txt points researchers to the contact form, which RFC 9116 permits.",
    consequences: {
      good: ["No harvestable address in page source or JavaScript bundles", "The form adds a topic for routing"],
      bad: ["Slightly more friction for people who prefer email", "The form depends on an email delivery provider"],
    },
  },
  {
    id: "ADR-006",
    title: "Cookieless analytics only",
    date: "2026-11-02",
    status: "Accepted",
    context: "Traffic and Core Web Vitals data are useful; tracking visitors across sites is not acceptable.",
    decision: "Use Vercel Web Analytics and Speed Insights (cookieless, no personal identifiers). No third-party trackers, ad pixels, or fingerprinting.",
    consequences: {
      good: ["No cookie banner needed", "Real-user performance data drives optimization"],
      bad: ["Less detailed visitor analytics than tracking-based tools"],
    },
  },
  {
    id: "ADR-007",
    title: "Keep confidential employer names out of the codebase",
    date: "2026-11-02",
    status: "Accepted",
    context:
      "Two earlier employers are listed as available on request. Blurring text with CSS still ships the name in HTML, JavaScript bundles, and search indexes.",
    decision: "Store only a generic description for confidential roles. The blurred placeholder is drawn with CSS so no fake or real name exists in the DOM.",
    consequences: {
      good: ["Names can't leak through page source, bundles, or AI crawlers"],
      bad: ["Dates and responsibilities remain visible, so the career timeline stays credible but less specific"],
    },
  },
];
