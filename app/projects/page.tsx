import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-grid";
import { projects, site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Projects",
  description:
    "Engineering projects by Krishna Neupane: DevOps World, Domain Search, Tech Cheatsheet, Cron Job Generator, and a public Grafana dashboard for DevSecOps and platform engineers.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={graph({
          "@type": "CollectionPage",
          "@id": `${site.url}/projects#page`,
          url: `${site.url}/projects`,
          name: "Projects by Krishna Neupane",
          author: { "@id": PERSON_ID },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/projects/${p.slug}`,
              name: p.title,
            })),
          },
        })}
      />
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }]} />
      <PageHeader
        eyebrow="Projects"
        title="Tools built for engineers who ship."
        intro="Free, live tools for DevOps, platform, and security engineers, covering incident runbooks, domain security analysis, and everyday references."
      />
      <ProjectGrid projects={projects} />
    </>
  );
}
