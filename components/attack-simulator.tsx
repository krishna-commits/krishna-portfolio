"use client";

import { useEffect, useRef, useState } from "react";
import { attacks, pipeline } from "@/lib/data";

/**
 * "Try to break it": an illustration of defense in depth. Pick an attack; a packet travels the pipeline,
 * a terminal log streams each stage's verdict, and the stage that stops it explains how.
 */
export function AttackSimulator() {
  const [attackId, setAttackId] = useState(attacks[0].id);
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const attack = attacks.find((a) => a.id === attackId)!;
  const done = step >= attack.blockedAt;
  const last = pipeline.length - 1;

  const run = (id: string) => {
    const target = attacks.find((a) => a.id === id)!;
    setAttackId(id);
    if (timer.current) clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(target.blockedAt);
      return;
    }
    setStep(0);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= target.blockedAt && timer.current) clearInterval(timer.current);
    }, 550);
  };

  useEffect(() => {
    run(attacks[0].id);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reached = Math.min(Math.max(step, 0), attack.blockedAt);

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b px-5 py-3 font-mono text-[11px]">
        <span className="muted">illustration · defense in depth</span>
        <span className="muted">{attacks.length} attack paths</span>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr]">
        <div className="border-b p-4 lg:border-r lg:border-b-0">
          <p className="eyebrow muted mb-3 text-[10px]">Choose an attack</p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="radiogroup" aria-label="Attack">
            {attacks.map((a) => (
              <li key={a.id} className="shrink-0">
                <button
                  role="radio"
                  aria-checked={a.id === attackId}
                  onClick={() => run(a.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    a.id === attackId ? "border-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_8%,transparent)] font-medium" : "muted hover:border-[var(--muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 p-5 sm:p-7">
          <p className="eyebrow text-[10px]" style={{ color: "var(--bad)" }}>Attack vector</p>
          <p className="mt-1.5 text-lg font-semibold tracking-tight">{attack.vector}</p>

          {/* Track */}
          <div className="relative mt-10 mb-12 px-3" aria-hidden>
            <div className="absolute top-1/2 right-3 left-3 h-px -translate-y-1/2 bg-[var(--border)]" />
            <div
              className="absolute top-1/2 left-3 h-px -translate-y-1/2 transition-[width] duration-500 ease-out"
              style={{ width: `calc((100% - 1.5rem) * ${reached / last})`, background: "var(--bad)" }}
            />
            <div className="relative flex justify-between">
              {pipeline.map((s, i) => {
                const blocked = done && i === attack.blockedAt;
                const passed = i < reached;
                return (
                  <div key={s.label} className="relative flex flex-col items-center">
                    <span
                      className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${blocked ? "scale-125" : ""}`}
                      style={{
                        borderColor: blocked ? "var(--ok)" : passed ? "var(--bad)" : "var(--border)",
                        background: blocked ? "var(--ok)" : "var(--bg)",
                        boxShadow: blocked ? "0 0 0 6px color-mix(in srgb, var(--ok) 20%, transparent)" : "none",
                      }}
                    />
                    <span className={`absolute top-6 font-mono text-[10px] whitespace-nowrap ${blocked ? "font-semibold" : "muted"}`} style={blocked ? { color: "var(--ok)" } : undefined}>
                      {s.label.toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal log */}
          <pre className="overflow-x-auto rounded-xl border bg-[var(--bg)] p-4 font-mono text-[12px] leading-6" aria-live="polite">
            <code>
              <span className="muted block">$ pipeline run --scenario {attack.id}</span>
              {pipeline.slice(0, reached + (done ? 1 : 0)).map((s, i) =>
                i === attack.blockedAt && done ? (
                  <span key={s.label} className="block">
                    <span style={{ color: "var(--ok)" }}>[{String(i + 1).padStart(2, "0")} {s.label.toLowerCase()}] ✗ BLOCKED</span>{" "}
                    <span className="muted">{s.title.toLowerCase()}</span>
                  </span>
                ) : (
                  <span key={s.label} className="block">
                    <span className="muted">[{String(i + 1).padStart(2, "0")} {s.label.toLowerCase()}]</span> <span style={{ color: "var(--bad)" }}>passed</span>{" "}
                    <span className="muted">· not this stage&apos;s job</span>
                  </span>
                ),
              )}
              {!done && <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-[var(--accent-2)]" />}
              {done && <span className="muted block">→ attack contained at stage {attack.blockedAt + 1} of {pipeline.length}</span>}
            </code>
          </pre>

          <div className={`mt-5 transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}>
            <p className="text-sm font-semibold">How {pipeline[attack.blockedAt].label.toLowerCase()} stops it</p>
            <p className="muted mt-1 text-sm leading-relaxed">{attack.how}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
