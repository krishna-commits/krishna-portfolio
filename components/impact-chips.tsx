import type { Role } from "@/lib/data";

/** Measurable results for a role. Renders nothing until real numbers are added in lib/data.ts. */
export function ImpactChips({ role, className = "" }: { role: Role; className?: string }) {
  if (!role.impact?.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Impact">
      {role.impact.map((m) => (
        <li key={m.label} className="rounded-lg border bg-[var(--accent-soft)] px-3 py-1.5">
          <span className="num font-semibold" style={{ color: "var(--accent-ink)" }}>{m.value}</span>{" "}
          <span className="muted text-xs">{m.label}</span>
        </li>
      ))}
    </ul>
  );
}
