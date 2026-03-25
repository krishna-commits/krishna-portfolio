import type { Metadata } from "next"
import Link from "next/link"
import { generatePageMetadata } from "../metadata"
import { siteConfig } from "config/site"
import { PAGE_CARD, PAGE_H1, PAGE_SHELL_NARROW } from "lib/page-layout"

export const metadata: Metadata = generatePageMetadata({
	title: "Privacy Policy",
	description:
		"How Krishna Neupane’s portfolio collects, uses, and protects personal data including contact forms, newsletter sign-ups, and analytics.",
	path: "/privacy",
})

export default function PrivacyPage() {
	const contactEmail = siteConfig.copyright.email
	const siteUrl = new URL(
		siteConfig.url.startsWith("http") ? siteConfig.url : `https://${siteConfig.url}`,
	).origin

	return (
		<div className="min-h-screen bg-background">
			<div className={PAGE_SHELL_NARROW}>
				<p className="text-sm font-medium text-muted-foreground">
					<Link href="/" className="text-primary hover:underline">
						Home
					</Link>
					<span className="mx-2" aria-hidden>
						/
					</span>
					Privacy
				</p>
				<h1 className={`mt-4 ${PAGE_H1}`}>Privacy Policy</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
				</p>

				<div
					className={`prose prose-slate dark:prose-invert mt-10 max-w-none prose-headings:scroll-mt-24 prose-a:text-primary ${PAGE_CARD} p-8 sm:p-10`}
				>
					<p>
						This policy describes how personal information is handled when you visit{" "}
						<a href={siteUrl}>{siteUrl.replace(/^https?:\/\//, "")}</a> (the &quot;Site&quot;), operated by{" "}
						{siteConfig.name}. If you do not agree with this policy, please do not use the Site.
					</p>

					<h2>Information you provide</h2>
					<ul>
						<li>
							<strong>Contact form.</strong> If you send a message through the contact page, we process the details you
							enter (such as name, email, phone, company, country, and message content) to read and respond to your
							inquiry. This may involve email or other systems you use to operate the Site.
						</li>
						<li>
							<strong>Newsletter.</strong> If you subscribe to a newsletter, we store your email address (and any other
							fields you submit) to send updates or related communications, until you unsubscribe or we delete it as
							described below.
						</li>
					</ul>

					<h2>Analytics and performance</h2>
					<p>We use several tools to understand how the Site is used and to improve performance:</p>
					<ul>
						<li>
							<strong>Vercel Analytics and Speed Insights.</strong> Provided by Vercel when the Site is hosted on their
							platform. These services help measure traffic and web performance. See{" "}
							<a href="https://vercel.com/docs/analytics/privacy-policy" rel="noopener noreferrer" target="_blank">
								Vercel&apos;s documentation
							</a>{" "}
							for how they handle data.
						</li>
						<li>
							<strong>First-party analytics.</strong> The Site may send anonymized or aggregated usage events (for
							example page views, session identifiers stored in your browser&apos;s session storage, scroll depth, or
							referrer) and performance metrics (such as Core Web Vitals) to our own APIs. That data may be stored in our
							database to improve the Site and understand usage patterns.
						</li>
					</ul>

					<h2>Cookies and similar technologies</h2>
					<p>
						We may use cookies, local storage, or session storage where needed for the Site to function, for preferences
						(such as theme), or for analytics as described above. You can control cookies through your browser settings;
						disabling some cookies may limit certain features.
					</p>

					<h2>Legal bases and use</h2>
					<p>
						We process information as necessary to operate the Site, respond to you, meet legal obligations, and pursue
						legitimate interests such as security, analytics, and product improvement—always consistent with applicable
						law.
					</p>

					<h2>Sharing</h2>
					<p>
						We do not sell your personal information. We may share data with service providers (for example hosting,
						email delivery, or analytics) that process it on our behalf under appropriate safeguards, or when required
						by law.
					</p>

					<h2>Retention</h2>
					<p>
						We keep information only as long as needed for the purposes above, unless a longer period is required by law.
						Newsletter and contact records are retained until you ask for deletion, unsubscribe, or we no longer need them.
					</p>

					<h2>Your rights</h2>
					<p>
						Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your
						personal data, or to object to certain processing. To exercise these rights or ask questions, contact:{" "}
						<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
					</p>

					<h2>International transfers</h2>
					<p>
						Your information may be processed in countries other than your own (for example where our hosting or
						providers operate). We take steps designed to ensure appropriate protection where required.
					</p>

					<h2>Children</h2>
					<p>The Site is not directed at children under 13, and we do not knowingly collect their personal information.</p>

					<h2>Changes</h2>
					<p>
						We may update this policy from time to time. The &quot;Last updated&quot; date at the top will change when we
						do; continued use of the Site after changes means you accept the updated policy.
					</p>

					<h2>Contact</h2>
					<p>
						For privacy-related requests: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
					</p>
				</div>
			</div>
		</div>
	)
}
