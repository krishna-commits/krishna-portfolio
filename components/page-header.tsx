export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="mb-12 max-w-3xl">
      {eyebrow && <p className="eyebrow accent-ink mb-3">{eyebrow}</p>}
      <h1 className="h-page">{title}</h1>
      {intro && <p className="lede mt-4">{intro}</p>}
    </header>
  );
}
