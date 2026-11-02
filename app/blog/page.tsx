import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { socials } from "@/lib/data";
import { formatDate, getPosts } from "@/lib/posts";
import { getAllWriting, shortDate } from "@/lib/writing";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Writing",
  description:
    "Technical writing by Krishna Neupane on DevSecOps, cloud security, Kubernetes, GitOps, infrastructure as code, and platform engineering.",
  path: "/blog",
});
export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, all] = await Promise.all([getPosts(), getAllWriting()]);
  const elsewhere = all.filter((w) => w.external);

  return (
    <>
      <Breadcrumbs items={[{ name: "Writing", path: "/blog" }]} />
      <PageHeader
        eyebrow="Writing"
        title="Notes from the pipeline."
        intro="Practical writing on DevSecOps, cloud security, Kubernetes, and platform engineering, drawn from running production systems."
      />

      {posts.length > 0 && (
        <section aria-labelledby="articles" className="mb-20">
          <h2 id="articles" className="eyebrow accent-ink mb-2">Articles</h2>
          <ul className="divide-y rule border-y">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group grid gap-2 py-8 sm:grid-cols-[140px_1fr]">
                  <time className="eyebrow muted num pt-1.5" dateTime={post.date}>{formatDate(post.date)}</time>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-balance group-hover:underline group-hover:underline-offset-4 sm:text-2xl">
                      {post.title}
                      {!post.published && <span className="tag ml-3 align-middle">Draft</span>}
                    </h3>
                    <p className="muted mt-2 max-w-2xl">{post.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {post.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                      <span className="eyebrow muted ml-1">{post.readingMinutes} min read</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="elsewhere">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="elsewhere" className="eyebrow accent-ink">Elsewhere</h2>
          <p className="muted flex gap-4 text-sm">
            <a href={socials.devto} target="_blank" rel="me noopener noreferrer" className="link-hover">DEV ↗</a>
            <a href={socials.medium} target="_blank" rel="me noopener noreferrer" className="link-hover">Medium ↗</a>
          </p>
        </div>
        {elsewhere.length === 0 ? (
          <div className="card mt-4 text-sm">Couldn&apos;t load external posts right now.</div>
        ) : (
          <ul className="divide-y rule border-y">
            {elsewhere.map((post) => (
              <li key={post.href}>
                <a href={post.href} target="_blank" rel="noopener noreferrer" className="group grid gap-2 py-6 sm:grid-cols-[140px_1fr]">
                  <span className="flex items-center gap-2 pt-1 sm:flex-col sm:items-start sm:gap-1">
                    <time className="eyebrow muted num" dateTime={post.isoDate}>{shortDate(post.isoDate)}</time>
                    <span className="tag">{post.source}</span>
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{post.title} ↗</h3>
                    {post.excerpt && <p className="muted mt-1 line-clamp-2 text-sm">{post.excerpt}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
