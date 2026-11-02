import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How krishnaneupane.com handles personal data submitted through the contact form.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl space-y-10">
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section>
        <h2 className="text-xl font-semibold">What I collect</h2>
        <p className="muted mt-3 leading-7">
          When you use the contact form, I receive the details you submit (name, email, and optionally phone, company,
          and your message). I use them only to reply to you and do not share them with third parties, other than the
          email provider that delivers the message.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Analytics &amp; cookies</h2>
        <p className="muted mt-3 leading-7">
          This site uses Vercel Web Analytics and Speed Insights to count page views and measure performance. They are
          cookieless, collect no personal identifiers, and do not track you across sites. The site sets no tracking
          cookies and never sells personal data. Your theme preference is stored only in your browser.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="muted mt-3 leading-7">
          Questions or deletion requests: use the <Link href="/contact" className="link-hover text-[var(--fg)]">contact form</Link>.
        </p>
      </section>
    </article>
  );
}
