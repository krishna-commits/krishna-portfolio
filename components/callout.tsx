export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-8 rounded-xl border-l-2 bg-[var(--card)] px-5 py-4 text-[15px] leading-7" style={{ borderColor: "var(--accent)" }}>
      {title && <p className="eyebrow accent-ink mb-1">{title}</p>}
      <div>{children}</div>
    </aside>
  );
}
