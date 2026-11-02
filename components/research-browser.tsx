"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pillars, type ResearchItem } from "@/lib/data";

type Sort = "date" | "title";

export function ResearchBrowser({ items }: { items: ResearchItem[] }) {
  const venues = useMemo(() => Array.from(new Set(items.map((i) => i.venue))).sort(), [items]);
  const [pillar, setPillar] = useState("All");
  const [venue, setVenue] = useState("All");
  const [sort, setSort] = useState<Sort>("date");

  const filtered = items
    .filter((i) => (pillar === "All" || i.pillar === pillar) && (venue === "All" || i.venue === venue))
    .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : (b.year ?? 0) - (a.year ?? 0)));

  const groups = pillars
    .map((p) => ({ pillar: p, items: filtered.filter((i) => i.pillar === p) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-4 border-y py-4 rule">
        <Select label="Pillar" value={pillar} onChange={setPillar} options={["All", ...pillars]} />
        <Select label="Venue" value={venue} onChange={setVenue} options={["All", ...venues]} />
        <Select label="Sort" value={sort} onChange={(v) => setSort(v as Sort)} options={["date", "title"]} />
      </div>

      <div className="space-y-16">
        {groups.map((g) => (
          <section key={g.pillar} aria-label={g.pillar}>
            <h2 className="h-section mb-6">
              {g.pillar} <span className="muted font-mono text-sm font-normal">{g.items.length}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.items.map((item) => (
                <Link key={item.slug} href={`/research-core/${item.slug}`} className="card spotlight block">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.featured && <span className="tag shrink-0 border-[var(--accent)] accent-ink">Featured</span>}
                  </div>
                  <p className="muted mt-2 text-sm">{item.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
                    <span className="eyebrow muted">
                      {item.venue}
                      {item.year ? ` · ${item.year}` : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {groups.length === 0 && <p className="muted">No research notes match these filters.</p>}
      </div>
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="eyebrow muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input w-auto py-1.5" style={{ background: "var(--bg)" }}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
