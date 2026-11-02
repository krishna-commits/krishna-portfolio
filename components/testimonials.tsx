import { formatMonth, socials, testimonials } from "@/lib/data";

/** LinkedIn recommendations, quoted verbatim with dates. Renders nothing while the list is empty. */
export function Testimonials({ heading = true }: { heading?: boolean }) {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials" data-reveal>
      {heading && (
        <>
          <p className="eyebrow accent-ink">Recommendations</p>
          <h2 id="testimonials" className="h-section mt-3 mb-10">What colleagues have said.</h2>
        </>
      )}
      <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name}>
            <figure className="flex h-full flex-col border-t pt-6">
              <blockquote className="display text-[1.35rem] leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-6 text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="muted block">{t.title}</span>
                <span className="muted block font-mono text-[11px]">{t.relation} · {formatMonth(t.date)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="muted mt-8 text-sm">
        Excerpts from recommendations on{" "}
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-hover text-[var(--fg)]">LinkedIn ↗</a>, where the full text is public.
      </p>
    </section>
  );
}
