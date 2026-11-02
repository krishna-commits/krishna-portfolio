import type { Metadata } from "next";
import { certifications, currentRole, education, expertise, profile, sameAs, site, theses } from "@/lib/data";

export const PERSON_ID = `${site.url}/#person`;
export const WEBSITE_ID = `${site.url}/#website`;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "profile" | "article";
};

/** Per-page metadata with canonical URL and matching Open Graph / Twitter tags. */
export function pageMeta({ title, description, path, noindex, type = "website" }: PageMetaInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type, siteName: site.name, locale: site.locale },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: site.logo,
    url: site.url,
    image: { "@type": "ImageObject", url: `${site.url}${profile.photo.src}`, width: profile.photo.width, height: profile.photo.height, caption: site.name },
    contactPoint: { "@type": "ContactPoint", contactType: "professional inquiries", url: site.contactUrl, availableLanguage: profile.languages },
    jobTitle: profile.jobTitle,
    worksFor: { "@type": "Organization", name: currentRole.company },
    knowsLanguage: profile.languages,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: site.location.countryCode,
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Islington College" },
      { "@type": "CollegeOrUniversity", name: "London Metropolitan University" },
    ],
    knowsAbout: expertise,
    hasCredential: [
      ...education.map((e) => ({
        "@type": "EducationalOccupationalCredential",
        name: e.degree,
        credentialCategory: "degree",
        dateCreated: e.date,
        recognizedBy: { "@type": "CollegeOrUniversity", name: e.awardedBy },
      })),
      ...certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        credentialCategory: "certificate",
        ...(c.date ? { dateCreated: c.date } : {}),
        ...(c.issuer ? { recognizedBy: { "@type": "Organization", name: c.issuer } } : {}),
        ...(c.url ? { url: c.url } : {}),
      })),
    ],
    sameAs,
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

export function thesesJsonLd() {
  return theses.map((t) => ({
    "@type": "Thesis",
    "@id": `${site.url}/about#${t.slug}`,
    name: t.title,
    datePublished: String(t.year),
    inSupportOf: t.degree,
    author: { "@id": PERSON_ID },
    sourceOrganization: { "@type": "CollegeOrUniversity", name: t.institution },
    ...(t.url ? { url: t.url } : {}),
  }));
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/** Wraps nodes in a single @graph document. */
export function graph(...nodes: (object | object[])[]) {
  return { "@context": "https://schema.org", "@graph": nodes.flat() };
}
