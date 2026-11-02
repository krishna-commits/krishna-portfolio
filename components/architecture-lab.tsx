"use client";

import Link from "next/link";
import { useState } from "react";
import { FlowDiagram } from "@/components/flow-diagram";
import type { Architecture } from "@/lib/architectures";

/** Architecture Laboratory: switch between reference architectures and read the design decisions behind each. */
export function ArchitectureLab({ architectures }: { architectures: Architecture[] }) {
  const [active, setActive] = useState(0);
  const a = architectures[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + architectures.length) % architectures.length;
    setActive(next);
    document.getElementById(`arch-tab-${next}`)?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div role="tablist" aria-label="Reference architectures" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {architectures.map((arch, i) => (
          <button
            key={arch.id}
            id={`arch-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls="arch-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-colors ${
              i === active ? "border-[var(--accent-2)] bg-[var(--accent-soft)]" : "hover:border-[var(--muted)]"
            }`}
          >
            <span className="muted block font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
            <span className="block text-sm font-semibold whitespace-nowrap lg:whitespace-normal">{arch.tab}</span>
          </button>
        ))}
      </div>

      <div id="arch-panel" role="tabpanel" aria-labelledby={`arch-tab-${active}`} className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-2xl font-bold tracking-tight">{a.title}</h3>
          <Link href={`/architecture/${a.id}`} className="tag shrink-0 px-3 py-1 hover:border-[var(--fg)] hover:text-[var(--fg)]">
            Full page &amp; share ↗
          </Link>
        </div>
        <p className="muted mt-2 max-w-2xl">{a.summary}</p>
        <FlowDiagram title={a.title} stages={a.stages} planes={a.planes} />
        <div className="grid gap-3 sm:grid-cols-3">
          {a.decisions.map((d, i) => (
            <div key={d} className="rounded-xl border p-4">
              <p className="accent-ink font-mono text-[10px]">DECISION {i + 1}</p>
              <p className="mt-1.5 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
