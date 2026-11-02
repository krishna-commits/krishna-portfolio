import type { Diagram } from "@/lib/data";

/**
 * Architecture diagram as real HTML (readable by crawlers and screen readers, themed, responsive).
 * Stages flow left→right on desktop and top→bottom on mobile; planes span every stage.
 */
export function FlowDiagram({ title, caption, stages, planes }: Diagram) {
  return (
    <figure className="not-prose my-10" aria-label={title}>
      <div className="card grid-bg overflow-hidden p-5 sm:p-7">
        <p className="eyebrow muted mb-5">{title}</p>
        <ol
          className="grid gap-6 lg:gap-5 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
          style={{ ["--cols" as string]: stages.length }}
        >
          {stages.map((stage, i) => (
            <li key={stage.label} className="relative">
              <div className="h-full rounded-xl border bg-[var(--card)] p-3.5" style={{ borderColor: i === 0 || i === stages.length - 1 ? "var(--fg)" : "var(--border)" }}>
                <p className="eyebrow accent-ink num text-[10px]">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-semibold leading-tight">{stage.label}</p>
                <ul className="mt-2.5 space-y-1">
                  {stage.items.map((item) => (
                    <li key={item} className="muted font-mono text-[11px] leading-snug">{item}</li>
                  ))}
                </ul>
              </div>
              {i < stages.length - 1 && (
                <>
                  <span aria-hidden className="accent-ink absolute top-1/2 -right-[15px] hidden -translate-y-1/2 text-sm lg:block">→</span>
                  <span aria-hidden className="accent-ink absolute -bottom-[22px] left-1/2 -translate-x-1/2 text-sm lg:hidden">↓</span>
                </>
              )}
            </li>
          ))}
        </ol>
        {planes && planes.length > 0 && (
          <div className="mt-6 space-y-2.5">
            {planes.map((plane) => (
              <div key={plane.label} className="flex flex-col gap-2 rounded-xl border border-dashed px-4 py-3 sm:flex-row sm:items-center sm:gap-4" style={{ borderColor: "var(--muted)" }}>
                <p className="eyebrow shrink-0 text-[10px]">{plane.label}</p>
                <p className="muted font-mono text-[11px]">{plane.items.join("  ·  ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {caption && <figcaption className="muted mt-3 text-sm">{caption}</figcaption>}
    </figure>
  );
}
