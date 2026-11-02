import { projects } from "@/lib/data";

export type Check = {
  name: string;
  slug: string;
  url: string;
  ok: boolean;
  status: number | null;
  ms: number | null;
};

// Monitored endpoints: the live tools, plus this site. Projects with incomplete URLs are skipped.
export const monitored = [
  { name: "krishnaneupane.com", slug: "site", url: "https://krishnaneupane.com" },
  ...projects.filter((p) => p.monitor !== false).map((p) => ({ name: p.title, slug: p.slug, url: p.href })),
];

async function check(target: (typeof monitored)[number]): Promise<Check> {
  const start = performance.now();
  try {
    const res = await fetch(target.url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "krishnaneupane.com-status/1.0 (+https://krishnaneupane.com/status)" },
    });
    return { ...target, ok: res.ok, status: res.status, ms: Math.round(performance.now() - start) };
  } catch {
    return { ...target, ok: false, status: null, ms: null };
  }
}

export async function runChecks() {
  const checks = await Promise.all(monitored.map(check));
  return { checks, checkedAt: new Date().toISOString(), allOk: checks.every((c) => c.ok) };
}
