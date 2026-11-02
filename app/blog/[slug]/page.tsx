import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/data";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMeta({ title: post.title, description: post.description, path: `/blog/${slug}`, type: "article", noindex: !post.published });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/posts/${slug}.mdx`);
  const others = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 2);
  const url = `${site.url}/blog/${slug}`;

  return (
    <article>
      <JsonLd
        data={graph({
          "@type": "TechArticle",
          "@id": `${url}#article`,
          headline: post.title,
          description: post.description,
          url,
          mainEntityOfPage: url,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          keywords: post.tags.join(", "),
          inLanguage: "en",
          author: { "@id": PERSON_ID },
          publisher: { "@id": PERSON_ID },
        })}
      />
      <Breadcrumbs items={[{ name: "Writing", path: "/blog" }, { name: post.title, path: `/blog/${slug}` }]} />

      <header className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          {!post.published && <span className="tag border-[var(--accent)] accent-ink">Draft — not public</span>}
        </div>
        <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
        <p className="lede mt-5">{post.description}</p>
        <p className="muted mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link href="/about" className="font-medium text-[var(--fg)] link-hover">{site.name}</Link>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </p>
      </header>

      <div className="prose-article mx-auto mt-12 max-w-3xl border-t pt-10 rule">
        <Content />
      </div>

      <footer className="mx-auto mt-16 max-w-3xl space-y-10">
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{site.name}</p>
            <p className="muted text-sm">Senior DevSecOps Engineer & Applied Security Researcher. I design, secure, and operate cloud-native platforms.</p>
          </div>
          <Link href="/contact" className="btn-outline shrink-0">Get in touch</Link>
        </div>
        {others.length > 0 && (
          <nav aria-label="More articles">
            <p className="eyebrow accent-ink mb-4">Keep reading</p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card spotlight block h-full">
                    <p className="font-semibold leading-snug">{p.title}</p>
                    <p className="muted mt-2 text-sm">{p.readingMinutes} min read</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </footer>
    </article>
  );
}
