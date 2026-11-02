"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalTime } from "@/components/local-time";
import { socials } from "@/lib/data";

/** Closing contact band: a "ping" that always gets a reply. Hidden on /contact, where it would repeat the page. */
export function FooterCta() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center" aria-labelledby="footer-cta">
      <div>
        <p className="eyebrow accent-ink">$ ping krishna</p>
        <h2 id="footer-cta" className="h-section mt-4 text-4xl text-balance sm:text-5xl">
          Let&apos;s build something secure by default.
        </h2>
        <p className="lede mt-5 max-w-lg text-base">
          Hiring for a senior DevSecOps or platform role, or want a second pair of eyes on your platform? Book a call or send a message. I reply within 24 hours.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={socials.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a 30-min call <span aria-hidden>↗</span></a>
          <Link href="/contact" className="btn-outline">Send a message</Link>
          <Link href="/resume" className="btn-outline">Resume (PDF)</Link>
        </div>
      </div>

      <pre className="card overflow-x-auto p-5 font-mono text-[12px] leading-6 sm:p-6" aria-label="Availability">
        <code>
          <span className="muted block">$ ping -c 3 krishnaneupane.com</span>
          <Reply seq={1}>status=<span className="accent-ink">open_to_remote</span></Reply>
          <Reply seq={2}>reply_within=24h</Reply>
          <Reply seq={3}>
            local=<LocalTime className="inline" />
          </Reply>
          <span className="muted mt-2 block">--- krishnaneupane.com ping statistics ---</span>
          <span className="block">3 packets transmitted, 3 received, <span style={{ color: "var(--ok)" }}>0% packet loss</span></span>
        </code>
      </pre>
    </section>
  );
}

function Reply({ seq, children }: { seq: number; children: React.ReactNode }) {
  return (
    <span className="block whitespace-pre-wrap">
      <span className="muted">64 bytes from kathmandu: seq={seq} </span>
      {children}
    </span>
  );
}
