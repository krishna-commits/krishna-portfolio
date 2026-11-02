import { techExperience } from "@/lib/data";

/** Years and organizations per technology, computed from work history. Bar length = years, relative to the longest. */
export function TechExperience() {
  const rows = techExperience(12);
  const max = Math.max(...rows.map((r) => r.years));

  return (
    <ul className="divide-y rule border-y">
      {rows.map((r) => (
        <li key={r.tool} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[180px_1fr_auto]">
          <span className="font-medium">{r.tool}</span>
          <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)] sm:order-none sm:col-span-1" aria-hidden>
            <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${(r.years / max) * 100}%` }} />
          </span>
          <span className="muted num text-right font-mono text-xs">
            {r.years >= 1 ? `${Math.floor(r.years)}+ yrs` : "<1 yr"} · since {r.since} · {r.orgs} {r.orgs === 1 ? "org" : "orgs"}
          </span>
        </li>
      ))}
    </ul>
  );
}
