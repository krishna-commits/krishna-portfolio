import { site } from "@/lib/data";

// RFC 9116. Regenerated daily so Expires always stays in the future.
export const revalidate = 86400;

export function GET() {
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
  // RFC 9116 allows an https URI as the contact; reports go through the contact form (topic: "Something else").
  const body = `Contact: ${site.contactUrl}
Expires: ${expires}
Preferred-Languages: en, ne
Canonical: ${site.url}/.well-known/security.txt
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
