"use client";

import { useEffect, useState } from "react";
import type { ChecklistGroup } from "@/lib/checklist";

/** Self-assessment checklist. Progress is saved in this browser only (localStorage); nothing is sent anywhere. */
export function Checklist({ id, groups }: { id: string; groups: ChecklistGroup[] }) {
  const key = `checklist:${id}`;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setChecked(new Set(JSON.parse(saved) as string[]));
    } catch {}
  }, [key]);

  const toggle = (itemId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      try {
        localStorage.setItem(key, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const reset = () => {
    setChecked(new Set());
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  const score = Math.round((checked.size / total) * 100);
  const rating = score >= 90 ? "Hardened" : score >= 70 ? "Solid" : score >= 40 ? "Gaps to close" : "High risk";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
      <div className="space-y-12">
        {groups.map((g) => {
          const done = g.items.filter((i) => checked.has(i.id)).length;
          return (
            <section key={g.title} aria-labelledby={`cl-${g.title}`}>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 id={`cl-${g.title}`} className="text-xl font-semibold tracking-tight">{g.title}</h2>
                <span className="muted num font-mono text-xs">{done}/{g.items.length}</span>
              </div>
              <ul className="divide-y rule border-y">
                {g.items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer gap-4 py-4">
                      <input
                        type="checkbox"
                        checked={checked.has(item.id)}
                        onChange={() => toggle(item.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span>
                        <span className={`block font-medium ${checked.has(item.id) ? "muted line-through decoration-[var(--accent)]" : ""}`}>{item.text}</span>
                        <span className="muted mt-1 block text-sm">{item.why}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <aside className="no-print lg:sticky lg:top-24 lg:self-start">
        <div className="card" aria-live="polite">
          <p className="eyebrow muted">Your score</p>
          <p className="num mt-2 text-5xl font-semibold tracking-tight">{score}%</p>
          <p className="mt-1 font-medium">{rating}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--border)]" aria-hidden>
            <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${score}%` }} />
          </div>
          <p className="muted mt-3 text-sm">{checked.size} of {total} controls in place. Saved in this browser only.</p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => window.print()} className="btn-outline flex-1 justify-center">Print</button>
            <button onClick={reset} className="btn-outline flex-1 justify-center">Reset</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
