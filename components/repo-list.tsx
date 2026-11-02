import { socials } from "@/lib/data";
import { getRepos, timeAgo } from "@/lib/github";

/** Live open-source activity from the GitHub API (revalidated hourly). Renders nothing if the API is unavailable. */
export async function RepoList({ limit = 6 }: { limit?: number }) {
  const repos = await getRepos(limit);
  if (repos.length === 0) return null;

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {repos.map((r) => (
          <li key={r.name}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="card spotlight group flex h-full flex-col p-5">
              <span className="flex items-start justify-between gap-3">
                <span className="font-mono text-sm font-semibold break-all group-hover:underline group-hover:underline-offset-4">{r.name}</span>
                {r.stars > 0 && <span className="muted num shrink-0 font-mono text-xs">★ {r.stars}</span>}
              </span>
              {r.description && <span className="muted mt-2 line-clamp-2 text-sm">{r.description}</span>}
              <span className="muted mt-auto flex items-center gap-3 pt-4 font-mono text-[11px]">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
                    {r.language}
                  </span>
                )}
                <span>pushed {timeAgo(r.pushedAt)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a href={socials.github} target="_blank" rel="me noopener noreferrer" className="muted mt-4 inline-block text-sm link-hover">
        All repositories on GitHub ↗
      </a>
    </div>
  );
}
