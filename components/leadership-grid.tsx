import { leadership } from "@/lib/data";

/** "Leadership & ownership": what senior looks like day to day, each item backed by the resume. */
export function LeadershipGrid() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
      {leadership.map((l, i) => (
        <li key={l.title} className="spotlight bg-[var(--card)] p-6">
          <p className="accent-ink num font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 font-bold tracking-tight">{l.title}</h3>
          <p className="muted mt-2 text-sm leading-relaxed">{l.body}</p>
        </li>
      ))}
    </ul>
  );
}
