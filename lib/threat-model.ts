// STRIDE threat model for krishnaneupane.com. Honest about residual risk and open items.
export type Threat = {
  category: "Spoofing" | "Tampering" | "Repudiation" | "Information disclosure" | "Denial of service" | "Elevation of privilege";
  threat: string;
  mitigations: string[];
  residual: "Low" | "Medium" | "High";
};

export const assets = [
  { name: "Site integrity", detail: "The code and content served at krishnaneupane.com, and the reputation attached to it." },
  { name: "Contact submissions", detail: "Names, emails, and messages sent through the contact form." },
  { name: "Deployment credentials", detail: "GitHub and Vercel accounts and tokens that can change what's deployed." },
  { name: "Third-party API keys", detail: "The email delivery key (Resend) and optional GitHub token, held as server-side environment variables." },
  { name: "Domain and DNS", detail: "Control of krishnaneupane.com and its records." },
];

export const boundaries = [
  "Visitor browser ↔ Vercel edge (public internet, TLS)",
  "Vercel functions ↔ external APIs: Resend, GitHub, Medium, DEV",
  "GitHub repository ↔ GitHub Actions ↔ Vercel deployment",
  "Domain registrar and DNS provider ↔ Vercel",
];

export const threats: Threat[] = [
  {
    category: "Spoofing",
    threat: "Domain or DNS hijack redirects visitors to an impostor site.",
    mitigations: ["HSTS with preload eligibility", "Registrar and DNS accounts protected with MFA", "Canonical URLs and security.txt published"],
    residual: "Low",
  },
  {
    category: "Spoofing",
    threat: "Automated or forged contact-form submissions (spam, phishing payloads).",
    mitigations: [
      "Same-origin check: cross-site POSTs are rejected (403)",
      "Per-IP rate limit: 5 messages per 10 minutes (429 with Retry-After)",
      "Hidden honeypot field and JSON-only requests",
      "Server-side validation of every field and length; all input HTML-escaped before it reaches the email",
    ],
    residual: "Low",
  },
  {
    category: "Tampering",
    threat: "A malicious or compromised npm dependency is introduced (supply chain).",
    mitigations: [
      "Exact versions locked in package-lock.json; installs with npm ci",
      "npm audit signatures verifies registry signatures and provenance on every build",
      "npm audit and dependency review on every pull request; Dependabot updates reviewed through CI",
      "SBOM with integrity hashes published and attested",
      "Daily Grype scan of the deployed SBOM flags new CVEs even when no code changed",
    ],
    residual: "Low",
  },
  {
    category: "Tampering",
    threat: "Unreviewed code reaches production.",
    mitigations: [
      "Branch ruleset with required CI checks and CODEOWNERS review",
      "CodeQL, gitleaks, lint, type-check, and build gates",
      "GitHub Actions pinned to major-version tags and updated by Dependabot; CI network egress audited with harden-runner",
      "Workflows audited by zizmor for script injection, excessive permissions, and persisted credentials",
      "Deploys only from the main branch via Vercel",
    ],
    residual: "Low",
  },
  {
    category: "Repudiation",
    threat: "No reliable record of who changed the site and when.",
    mitigations: ["Every change is a Git commit with CI history", "Deploy stamp exposes the live commit", "Build provenance attestation ties the SBOM to a commit"],
    residual: "Low",
  },
  {
    category: "Information disclosure",
    threat: "Cross-site scripting exposes visitors or session data.",
    mitigations: [
      "No user-generated HTML anywhere",
      "React output escaping; JSON-LD escaped against script breakout",
      "CSP restricts sources, framing, and plugins (see ADR-002)",
      "CSP violations are reported to /api/csp-report and logged",
    ],
    residual: "Low",
  },
  {
    category: "Information disclosure",
    threat: "Secrets or personal data leak through the repository or bundles.",
    mitigations: ["Secrets only in server-side environment variables", "gitleaks secret scanning on every push", "No public email or confidential employer names in code (ADR-005, ADR-007)"],
    residual: "Low",
  },
  {
    category: "Denial of service",
    threat: "Traffic floods or abuse of the contact endpoint.",
    mitigations: [
      "Static pages served from the CDN edge",
      "Per-IP rate limiting on the contact and CSP-report endpoints",
      "Malformed or cross-site requests rejected before any processing",
    ],
    residual: "Medium",
  },
  {
    category: "Elevation of privilege",
    threat: "A compromised GitHub or Vercel account deploys malicious content.",
    mitigations: ["MFA on GitHub and Vercel", "Least-privilege CI token permissions (contents: read by default)", "OpenSSF Scorecard monitors repository hygiene"],
    residual: "Medium",
  },
];

// Known gaps, stated openly: a threat model that lists no gaps isn't believable.
export const openItems = [
  "Add a global rate-limit rule at the edge (Vercel Firewall). The in-app limiter works per serverless instance, so it stops bursts but not a distributed flood.",
  "Require signed commits on the main branch.",
  "Pin GitHub Actions to full commit SHAs. Version tags are mutable, so a compromised action could change what CI runs.",
  "Move harden-runner from audit to block mode once the allowed egress endpoints are known from audit logs.",
  "Enable DNSSEC for krishnaneupane.com if the DNS provider supports it.",
  "Revisit nonce-based CSP if any page becomes dynamic for other reasons.",
];
