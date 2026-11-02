const API = "https://dev.to/api/articles?username=krishh11&per_page=30";

export type DevtoPost = {
  title: string;
  url: string;
  isoDate: string;
  description: string;
  tags: string[];
  readingMinutes: number;
};

type ApiArticle = {
  title: string;
  url: string;
  published_at: string;
  description: string;
  tag_list: string[];
  reading_time_minutes: number;
};

export async function getDevtoPosts(): Promise<DevtoPost[]> {
  try {
    const res = await fetch(API, {
      headers: { accept: "application/vnd.forem.api-v1+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiArticle[];
    return data.map((a) => ({
      title: a.title,
      url: a.url,
      isoDate: a.published_at,
      description: a.description,
      tags: a.tag_list ?? [],
      readingMinutes: a.reading_time_minutes,
    }));
  } catch {
    return [];
  }
}
