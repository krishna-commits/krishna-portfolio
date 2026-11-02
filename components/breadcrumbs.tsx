import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, graph } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(trail))} />
      <nav aria-label="Breadcrumb" className="eyebrow mb-8">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="muted">/</span>}
              {i === trail.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path} className="muted link-hover">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
