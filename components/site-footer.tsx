import Link from "next/link";
import { FooterCta } from "@/components/footer-cta";
import { LogoMark } from "@/components/logo-mark";
import { nav, secondaryNav, site, socials } from "@/lib/data";
import { deploy } from "@/lib/deploy";

const FOUNDED = 1995;

const columns = [
  { title: "Navigate", links: [{ label: "Home", href: "/" }, ...nav] },
  {
    title: "Platform",
    links: [
      { label: "System status", href: "/status" },
      { label: "Colophon", href: "/colophon" },
      { label: "RSS feed", href: "/feed.xml" },
      { label: "security.txt", href: "/.well-known/security.txt" },
    ],
  },
  { title: "More", links: secondaryNav },
];

const profiles = [
  { label: "LinkedIn", href: socials.linkedin },
  { label: "GitHub", href: socials.github },
  { label: "ORCID", href: socials.orcid },
  { label: "ResearchGate", href: socials.researchgate },
  { label: "Medium", href: socials.medium },
  { label: "DEV", href: socials.devto },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-24 border-t" style={{ borderColor: "var(--border)" }}>
      <FooterCta />

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${site.name}, home`}>
              <LogoMark />

              <span className="font-medium tracking-tight">{site.name}</span>
            </Link>
            <p className="muted mt-4 max-w-xs text-sm leading-relaxed">
              Senior DevSecOps Engineer &amp; Applied Security Researcher. Secure, observable cloud platforms, from {site.location.city}, {site.location.country}.
            </p>
            <Link href="/status" className="tag mt-5 gap-2 px-3 py-1 hover:border-[var(--fg)] hover:text-[var(--fg)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ok)" }} aria-hidden />
              status
            </Link>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow muted mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="link-hover">{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Verified profiles">
            <p className="eyebrow muted mb-4">Profiles</p>
            <ul className="space-y-2.5 text-sm">
              {profiles.map((p) => (
                <li key={p.label}>
                  <a href={p.href} target="_blank" rel="me noopener noreferrer" className="link-hover">{p.label} <span className="muted" aria-hidden>↗</span></a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-page muted flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {FOUNDED}–{year} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/colophon" className="font-mono hover:text-[var(--fg)]">
              deployed {deploy.sha} · {deploy.ref} · {deploy.builtAt.slice(0, 10)}
            </Link>
            <a href="#main-content" className="hover:text-[var(--fg)]">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
