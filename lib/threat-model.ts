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
    mitigations: ["Hidden honeypot field", "Server-side validation of every field and length", "All user input HTML-escaped before it reaches the email"],
    residual: "Medium",
  },
  {
    category: "Tampering",
    threat: "A malicious or compromised npm dependency is introduced (supply chain).",
    mitigations: ["Exact versions locked in package-lock.json", "npm audit and dependency review on every pull request", "Dependabot updates reviewed through CI", "SBOM with integrity hashes published and attested"],
    residual: "Medium",
  },
  {
    category: "Tampering",
    threat: "Unreviewed code reaches production.",
    mitigations: ["Branch protection with required CI checks", "CodeQL, gitleaks, lint, type-check, and build gates", "Deploys only from the main branch via Vercel"],
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
    mitigations: ["No user-generated HTML anywhere", "React output escaping", "JSON-LD escaped against script breakout", "CSP restricts sources, framing, and plugins (see ADR-002)"],
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
    mitigations: ["Static pages served from the CDN edge", "Contact endpoint validates and rejects malformed input early"],
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
  "Add rate limiting to /api/contact (e.g. per-IP limits at the edge) to reduce the remaining spam and abuse risk.",
  "Require signed commits on the main branch.",
  "Enable DNSSEC for krishnaneupane.com if the DNS provider supports it.",
  "Revisit nonce-based CSP if any page becomes dynamic for other reasons.",
];
