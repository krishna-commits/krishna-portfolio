import { site } from "@/lib/data";

// RFC 9116. Regenerated daily so Expires always stays in the future.
export const revalidate = 86400;

export function GET() {
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
  const body = `Contact: mailto:${site.email}
Contact: ${site.url}/contact
Expires: ${expires}
Preferred-Languages: en, ne
Canonical: ${site.url}/.well-known/security.txt
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
