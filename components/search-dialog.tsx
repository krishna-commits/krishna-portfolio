"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cycleTheme } from "@/components/theme-toggle";
import { nav, projects, research, secondaryNav, site, socials } from "@/lib/data";

type Action = "book-call" | "copy-link" | "theme";
export type SearchEntry = { label: string; group: string; href: string; action?: Action };

const actions: SearchEntry[] = [
  { label: "Book a 30-minute call", group: "Action", href: socials.calendly, action: "book-call" },
  { label: "Request resume", group: "Action", href: "/contact?topic=resume#send-a-message" },
  { label: "Copy link to this page", group: "Action", href: "#", action: "copy-link" },
  { label: "Switch theme", group: "Action", href: "#", action: "theme" },
];

const pages: SearchEntry[] = [
  ...[...nav, ...secondaryNav].map((n) => ({
    label: n.label,
    group: "Pages",
    href: n.href,
  })),
];

const content: SearchEntry[] = [
  ...projects.map((p) => ({ label: p.title, group: "Projects", href: `/projects/${p.slug}` })),
  ...research.map((r) => ({ label: r.title, group: "Research", href: `/research-core/${r.slug}` })),
];

export function SearchDialog({ extra = [] }: { extra?: SearchEntry[] }) {
  const entries = useMemo(() => [...actions, ...pages, ...extra, ...content], [extra]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((e) => e.label.toLowerCase().includes(q)) : entries.slice(0, 10);
  }, [query, entries]);

  useEffect(() => setSelected(0), [query]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      go(results[selected]);
    }
  };

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const go = async (entry: SearchEntry) => {
    setOpen(false);
    setQuery("");
    switch (entry.action) {
      case "book-call":
        window.open(entry.href, "_blank", "noopener,noreferrer");
        return;
      case "copy-link":
        try {
          await navigator.clipboard.writeText(`${site.url}${window.location.pathname}`);
          notify("Link copied");
        } catch {}
        return;
      case "theme":
        cycleTheme();
        return;
      default:
        router.push(entry.href);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tag gap-2 px-3 py-1.5 hover:border-[var(--fg)]"
        aria-label="Search the site"
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <kbd className="hidden sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="card w-full max-w-lg overflow-hidden p-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search, or try: book, resume, theme…"
              aria-label="Search query"
              role="combobox"
              aria-expanded="true"
              aria-controls="search-results"
              aria-activedescendant={results[selected] ? `search-opt-${selected}` : undefined}
              className="w-full border-b bg-transparent px-5 py-4 text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            />
            <ul id="search-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
              {results.map((r, i) => (
                <li
                  key={r.group + r.href + r.label}
                  id={`search-opt-${i}`}
                  role="option"
                  aria-selected={i === selected}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => go(r)}
                  className={`flex cursor-pointer justify-between rounded-lg px-3 py-2.5 text-sm ${i === selected ? "bg-[var(--bg)]" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    {i === selected && <span className="signal" aria-hidden />}
                    {r.label}
                  </span>
                  <span className="eyebrow muted">{r.group}</span>
                </li>
              ))}
              {results.length === 0 && <li className="muted px-3 py-2 text-sm">No results.</li>}
            </ul>
            <div className="muted flex gap-4 border-t px-5 py-2.5 font-mono text-[11px]" style={{ borderColor: "var(--border)" }}>
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="card fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 py-2.5 text-sm shadow-xl">
          <span className="accent-ink" aria-hidden>✓</span> {toast}
        </div>
      )}
    </>
  );
}
