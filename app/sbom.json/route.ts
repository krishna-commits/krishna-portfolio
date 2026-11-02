import { buildSbom } from "@/lib/sbom.mjs";

export const dynamic = "force-static";

// The software bill of materials for this site (CycloneDX 1.5), byte-identical to the file CI attests.
export function GET() {
  return new Response(buildSbom(), {
    headers: { "Content-Type": "application/vnd.cyclonedx+json; charset=utf-8" },
  });
}
