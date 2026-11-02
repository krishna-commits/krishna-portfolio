import { testimonials } from "@/lib/data";

/** Renders nothing until real, attributed recommendations are added to lib/data.ts. */
export function Testimonials({ heading = true }: { heading?: boolean }) {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials" data-reveal>
      {heading && (
        <>
          <p className="eyebrow accent-ink">Recommendations</p>
          <h2 id="testimonials" className="h-section mt-3 mb-10">What colleagues say.</h2>
        </>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name}>
            <figure className="card flex h-full flex-col">
              <blockquote className="text-[17px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-6 text-sm">
                <span className="font-semibold">{t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer" className="link-hover">{t.name}</a> : t.name}</span>
                <span className="muted block">{t.title}, {t.company}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
