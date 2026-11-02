/*
 * Signature hero visual (an illustration, not live data): a feature branch leaves main, passes every security
 * gate, and merges back through GitOps. Pure SVG + CSS (paths draw in, labels appear, a packet travels the branch).
 */
const BRANCH = "M150 92 C150 150 290 140 290 196 L290 372 C290 428 150 418 150 476";

const gates = [
  { y: 196, label: "secrets scan", d: 1.3 },
  { y: 255, label: "sonarqube gate", d: 1.5 },
  { y: 314, label: "terraform plan", d: 1.7 },
  { y: 372, label: "policy ✓ secure", d: 1.9, strong: true },
];

export function HeroGraph() {
  return (
    <figure className="relative mx-auto w-full max-w-[420px]" aria-label="Illustration: a feature branch passes four security gates before merging and syncing to production through GitOps.">
      <svg viewBox="0 0 440 600" className="h-auto w-full overflow-hidden" role="img" aria-hidden>
        {/* main */}
        <line x1="150" y1="20" x2="150" y2="560" stroke="var(--muted)" strokeOpacity="0.45" strokeWidth="2" pathLength={1} className="g-draw" />
        {/* feature branch */}
        <path d={BRANCH} fill="none" stroke="var(--accent-2)" strokeWidth="2.5" pathLength={1} className="g-draw" style={{ ["--d" as string]: "0.5s" }} />

        {/* packet travelling the branch */}
        <circle r="5" fill="var(--accent-2)" className="g-packet" style={{ offsetPath: `path("${BRANCH}")`, opacity: 0.95 }} />

        <Node x={150} y={40} d={0.2} />
        <Label x={128} y={45} anchor="end" d={0.2} text="main" />

        <Node x={150} y={92} d={0.5} accent />
        <Label x={128} y={97} anchor="end" d={0.5} text="feat/hardening" />

        {gates.map((g) => (
          <g key={g.label}>
            <Node x={290} y={g.y} d={g.d} accent />
            <Label x={312} y={g.y + 5} d={g.d} text={g.label} strong={g.strong} />
          </g>
        ))}

        <Node x={150} y={476} d={2.2} accent />
        <Label x={128} y={481} anchor="end" d={2.2} text="merge → main" />

        <Node x={150} y={548} d={2.5} />
        <g className="g-pop" style={{ ["--d" as string]: "2.6s" }}>
          <rect x="176" y="531" width="196" height="34" rx="17" fill="var(--fg)" />
          <text x="274" y="553" textAnchor="middle" className="font-mono" fontSize="13" fontWeight="600" fill="var(--bg)">
            argocd sync → prod
          </text>
        </g>
      </svg>
      <figcaption className="muted mt-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase">illustration · how a change reaches production</figcaption>
    </figure>
  );
}

function Node({ x, y, d, accent }: { x: number; y: number; d: number; accent?: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="9"
      fill="var(--bg)"
      stroke={accent ? "var(--accent-2)" : "var(--muted)"}
      strokeWidth="2.5"
      className="g-pop"
      style={{ ["--d" as string]: `${d}s` }}
    />
  );
}

function Label({ x, y, text, d, anchor = "start", strong }: { x: number; y: number; text: string; d: number; anchor?: "start" | "end"; strong?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="14"
      className="g-pop font-mono"
      fill={strong ? "var(--accent-ink)" : "var(--muted)"}
      fontWeight={strong ? 600 : 400}
      style={{ ["--d" as string]: `${d}s` }}
    >
      {text}
    </text>
  );
}
