const FEED_URL = "https://medium.com/feed/@neupane.krishna33";

export type MediumPost = {
  title: string;
  link: string;
  date: string;
  isoDate: string;
  excerpt: string;
  categories: string[];
};

function decode(s: string) {
  return s
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(([, item]) => {
      const content = tag(item, "content:encoded");
      const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const published = new Date(tag(item, "pubDate"));
      return {
        title: tag(item, "title"),
        link: tag(item, "link").split("?")[0],
        date: published.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        isoDate: published.toISOString(),
        excerpt: text.length > 200 ? `${text.slice(0, 200)}…` : text,
        categories: Array.from(item.matchAll(/<category>([\s\S]*?)<\/category>/g)).map(([, c]) => decode(c)),
      };
    });
  } catch {
    return [];
  }
}
