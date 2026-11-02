import { clientIp, rateLimit } from "@/lib/rate-limit";

// Receives Content-Security-Policy violation reports (legacy report-uri and the Reporting API) and logs them,
// so injection attempts or broken assets show up in the platform logs instead of going unnoticed.
const MAX_BYTES = 10_000;

export async function POST(req: Request) {
  if (!rateLimit(`csp:${clientIp(req)}`, { limit: 20, windowMs: 60_000 }).ok) {
    return new Response(null, { status: 429 });
  }

  const raw = await req.text().catch(() => "");
  if (raw.length > 0 && raw.length <= MAX_BYTES) {
    try {
      const parsed: unknown = JSON.parse(raw);
      const reports = Array.isArray(parsed) ? parsed : [parsed];
      for (const r of reports) {
        const body = (r as { body?: Record<string, unknown>; "csp-report"?: Record<string, unknown> })?.body ?? (r as { "csp-report"?: Record<string, unknown> })?.["csp-report"];
        if (!body) continue;
        console.warn("csp-violation", {
          directive: body["effectiveDirective"] ?? body["effective-directive"] ?? body["violated-directive"],
          blocked: body["blockedURL"] ?? body["blocked-uri"],
          document: body["documentURL"] ?? body["document-uri"],
        });
      }
    } catch {
      // Malformed report: ignore.
    }
  }
  return new Response(null, { status: 204 });
}
