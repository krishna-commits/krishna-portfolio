const USER = "krishna-commits";

export type Repo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  topics: string[];
};

type ApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
};

/** Public, non-fork repositories, most recently pushed first. Set GITHUB_TOKEN to raise the API rate limit. */
export async function getRepos(limit = 6): Promise<Repo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&sort=pushed&per_page=50`, {
      headers: {
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiRepo[];
    return data
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== USER.toLowerCase())
      .slice(0, limit)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        topics: r.topics ?? [],
      }));
  } catch {
    return [];
  }
}

/** Live star counts for the given repository URLs (one API call, revalidated hourly). Missing repos are omitted. */
export async function getStars(repoUrls: string[]): Promise<Record<string, number>> {
  if (repoUrls.length === 0) return {};
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&per_page=100`, {
      headers: {
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as ApiRepo[];
    const wanted = new Set(repoUrls.map((u) => u.toLowerCase()));
    return Object.fromEntries(data.filter((r) => wanted.has(r.html_url.toLowerCase())).map((r) => [r.html_url.toLowerCase(), r.stargazers_count]));
  } catch {
    return {};
  }
}

export function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
