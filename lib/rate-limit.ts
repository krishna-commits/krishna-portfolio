// Best-effort sliding-window rate limiter, keyed by client IP.
// Serverless instances don't share memory, so this limits per instance: it stops bursts and naive scripts
// cheaply. Hard, global limits belong at the edge (a Vercel Firewall rate-limit rule); see the threat model.

type Window = { hits: number[] };
const buckets = new Map<string, Window>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
    buckets.set(key, bucket);
    return { ok: false as const, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  // Keep memory bounded on long-lived instances.
  if (buckets.size > MAX_KEYS) buckets.delete(buckets.keys().next().value!);
  return { ok: true as const, remaining: limit - bucket.hits.length };
}

/** Client IP as reported by the platform proxy (Vercel sets x-forwarded-for / x-real-ip). */
export function clientIp(req: Request) {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Rejects cross-site POSTs: browsers always send Origin on POST; it must be this site. */
export function isSameOrigin(req: Request, allowed: string[]) {
  const origin = req.headers.get("origin");
  return origin !== null && allowed.includes(origin);
}
