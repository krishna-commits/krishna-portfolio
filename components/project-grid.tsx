"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/data";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const tags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags))).sort()];
  const [active, setActive] = useState("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by tag">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            aria-pressed={t === active}
            className={`tag px-3 py-1 ${t === active ? "border-[var(--fg)] text-[var(--fg)]" : "hover:text-[var(--fg)]"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <ul className="divide-y rule border-y">
        {shown.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="group grid gap-4 py-8 sm:grid-cols-[64px_1fr_auto] sm:items-start">
              <span className="eyebrow muted pt-1.5">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h2>
                <p className="muted mt-2 max-w-2xl">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <span className="text-sm font-medium transition-transform group-hover:translate-x-1">Case study →</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
