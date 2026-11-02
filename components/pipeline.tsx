"use client";

import { useState } from "react";
import { pipeline } from "@/lib/data";

/**
 * Signature visual: the secure delivery pipeline. A signal travels the rail (CSS only);
 * each stage is a tab that reveals its control, rationale, and tools.
 */
export function Pipeline() {
  const [active, setActive] = useState(0);
  const stage = pipeline[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const idx = (next + pipeline.length) % pipeline.length;
    setActive(idx);
    document.getElementById(`pipe-tab-${idx}`)?.focus();
  };

  return (
    <figure aria-label="Secure delivery pipeline: every stage from commit to production has a security control.">
      <div role="tablist" aria-label="Pipeline stages" className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        <span aria-hidden className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px -translate-y-1/2 lg:block" style={{ background: "var(--border)" }}>
          <span className="pipe-pulse absolute top-1/2 h-1.5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
        </span>
        {pipeline.map((s, i) => (
          <button
            key={s.label}
            id={`pipe-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls="pipe-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className="pipe-node cursor-pointer text-left transition-transform hover:-translate-y-0.5"
            style={{ ["--i" as string]: i }}
          >
            <span className="flex w-full items-center justify-between">
              <span className="eyebrow muted num">{String(i + 1).padStart(2, "0")}</span>
              <span className="pipe-dot" aria-hidden />
            </span>
            <span className="text-sm font-semibold">{s.label}</span>
            <span className="muted font-mono text-[11px]">{s.control}</span>
          </button>
        ))}
      </div>

      <div id="pipe-panel" role="tabpanel" aria-labelledby={`pipe-tab-${active}`} className="card mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start" aria-live="polite">
        <div>
          <p className="eyebrow accent-ink">Stage {String(active + 1).padStart(2, "0")} · {stage.label}</p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{stage.title}</p>
          <p className="muted mt-2 max-w-2xl leading-relaxed">{stage.detail}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5 sm:max-w-[220px] sm:justify-end" aria-label="Tools">
          {stage.tools.map((t) => <li key={t} className="tag text-[var(--fg)]">{t}</li>)}
        </ul>
      </div>
    </figure>
  );
}
