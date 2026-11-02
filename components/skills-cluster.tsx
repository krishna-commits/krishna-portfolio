"use client";

import { useState } from "react";
import type { Namespace } from "@/lib/cluster";

type PodWithAge = Namespace["pods"][number] & { age: string };
type NsWithAge = Omit<Namespace, "pods"> & { pods: PodWithAge[] };
type Selected = PodWithAge & { ns: string };

/**
 * Technical capabilities as a cluster map: six namespaces (capability domains) holding the tools.
 * An illustration of the toolkit, not live infrastructure. Select a tool for details, or switch to a table.
 */
export function SkillsCluster({ namespaces }: { namespaces: NsWithAge[] }) {
  const all: Selected[] = namespaces.flatMap((ns) => ns.pods.map((p) => ({ ...p, ns: ns.name })));
  const [selected, setSelected] = useState<Selected>(all.find((p) => p.name === "argocd") ?? all[0]);
  const [view, setView] = useState<"map" | "table">("map");
  const selectedNs = namespaces.find((n) => n.name === selected.ns);

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 font-mono text-[11px]">
        <span className="muted">
          skills cluster · <span className="text-[var(--fg)]">{namespaces.length}</span> domains · <span className="text-[var(--fg)]">{all.length}</span> tools
        </span>
        <span className="flex overflow-hidden rounded-full border" role="tablist" aria-label="View">
          {(["map", "table"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`px-3 py-1 transition-colors ${view === v ? "bg-[var(--fg)] text-[var(--bg)]" : "muted hover:text-[var(--fg)]"}`}
            >
              {v === "map" ? "map" : "kubectl get -A"}
            </button>
          ))}
        </span>
      </div>

      {view === "map" ? (
        <div className="grid lg:grid-cols-[1fr_340px]">
          <div className="grid-bg grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {namespaces.map((ns) => {
              const nsActive = selected.ns === ns.name;
              return (
                <section
                  key={ns.name}
                  aria-label={ns.title}
                  className={`rounded-xl border border-dashed p-3.5 transition-colors ${nsActive ? "border-[var(--accent-2)] bg-[var(--accent-soft)]" : "bg-[var(--card)]"}`}
                >
                  <p className="font-mono text-[10px] tracking-wide">
                    <span className="muted">ns/</span>
                    <span className="accent-ink">{ns.name}</span>
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{ns.title}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {ns.pods.map((p) => {
                      const active = selected.name === p.name;
                      return (
                        <li key={p.name}>
                          <button
                            onClick={() => setSelected({ ...p, ns: ns.name })}
                            aria-pressed={active}
                            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-all duration-200 hover:-translate-y-0.5 ${
                              active ? "border-[var(--accent-2)] text-[var(--fg)]" : "bg-[var(--bg)] hover:border-[var(--muted)]"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-[2px] bg-[var(--accent-2)]" aria-hidden />
                            {p.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="border-t p-5 lg:border-t-0 lg:border-l" aria-live="polite">
            <p className="muted font-mono text-[11px]">$ kubectl describe {selected.name} -n {selected.ns}</p>
            <p className="mt-4 text-xl font-semibold tracking-tight">{selected.name}</p>
            <p className="muted text-sm">{selectedNs?.title}</p>
            <dl className="mt-5 grid grid-cols-[96px_1fr] gap-x-3 gap-y-1.5 font-mono text-[12px]">
              <dt className="muted">covers</dt>
              <dd className="break-words">{selected.image}</dd>
              <dt className="muted">production</dt>
              <dd className="accent-ink">{selected.age}</dd>
            </dl>
            <p className="mt-5 border-t pt-4 text-[14px] leading-relaxed">{selected.purpose}</p>
            <p className="muted mt-4 text-xs">{selectedNs?.summary}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto p-5">
          <table className="w-full font-mono text-[12px]">
            <caption className="sr-only">All tools by capability domain</caption>
            <thead>
              <tr className="muted text-left">
                {["NAMESPACE", "NAME", "COVERS", "PRODUCTION"].map((h) => (
                  <th key={h} scope="col" className="pr-6 pb-2 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="accent-ink py-0.5 pr-6">{p.ns}</td>
                  <td className="pr-6">{p.name}</td>
                  <td className="muted pr-6">{p.image}</td>
                  <td>{p.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
