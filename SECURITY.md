# Security policy

## Reporting a vulnerability

Please report vulnerabilities privately. Do not open a public issue.

- **Preferred:** [Report a vulnerability](https://github.com/krishna-commits/krishna-portfolio/security/advisories/new) through GitHub private vulnerability reporting.
- **Alternative:** the contact form at <https://krishnaneupane.com/contact> (choose the "Other" topic and start the subject with "Security").

Machine-readable contact details are published at <https://krishnaneupane.com/.well-known/security.txt> (RFC 9116).

I aim to acknowledge reports within 3 working days and will keep you updated until the issue is resolved. Good-faith research is welcome; please avoid accessing other people's data, degrading the site, or social engineering.

## Scope

- In scope: krishnaneupane.com and this repository's code and CI workflows.
- Out of scope: third-party services the site uses (Vercel, Resend, GitHub), and findings that need a compromised device or browser.

## Verifying this site

The deployed dependency inventory is published at `/sbom.json` with a signed build provenance attestation. See <https://krishnaneupane.com/verify>.
