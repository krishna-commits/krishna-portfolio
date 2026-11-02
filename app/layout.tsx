import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Enhancements } from "@/components/enhancements";
import { JsonLd } from "@/components/json-ld";
import { themeScript } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/data";
import { getPosts } from "@/lib/posts";
import { graph, personJsonLd, websiteJsonLd } from "@/lib/seo";

// Inter for text, Instrument Serif for the name and headings, JetBrains Mono for technical metadata.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-display", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: site.url, types: { "application/rss+xml": `${site.url}/feed.xml` } },
  openGraph: {
    type: "profile",
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  // Search Console / Bing Webmaster verification: set these env vars in Vercel (DNS verification works too).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0f0d",
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = await getPosts();
  const searchExtra = posts.map((p) => ({ label: p.title, group: "Articles", href: `/blog/${p.slug}` }));

  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <Enhancements />
        <JsonLd data={graph(websiteJsonLd(), personJsonLd())} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
        >
          Skip to main content
        </a>
        <SiteHeader searchExtra={searchExtra} />
        <main id="main-content" className="container-page py-12 sm:py-20">
          {children}
        </main>
        <SiteFooter />
        {/* Cookieless, first-party analytics and real-user Core Web Vitals (active on Vercel only). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
