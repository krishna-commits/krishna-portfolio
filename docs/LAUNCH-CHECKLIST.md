# Launch checklist

Work top to bottom. Each step says where to click and what "done" looks like.

## 1. Build locally

```sh
npm install
npm run lint && npm run typecheck && npm run build
npm start            # production build at http://localhost:3000
```

Click through `/`, `/about`, `/projects/devops-world`, `/blog`, `/hire`, `/status`, `/colophon`, `/now`, `/uses`, `/contact` on desktop and on a phone-width window (DevTools → device toolbar).

Make sure `public/krishna-neupane.jpg` exists (your photo, square, at least 600×600).

## 2. Push and deploy

```sh
git add .
git commit -m "Rebuild krishnaneupane.com"
git push origin master
```

In **Vercel**:

1. Project → Settings → Git: connect `krishna-commits/krishna-portfolio`; production branch `master`.
2. Settings → Environment Variables:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | from resend.com → API Keys (needed for the contact form) |
   | `CONTACT_FROM_EMAIL` | `Krishna Neupane <hello@krishnaneupane.com>` after verifying the domain in Resend |
   | `GITHUB_TOKEN` | optional: a fine-grained token with no scopes, to raise the GitHub API limit |
   | `GOOGLE_SITE_VERIFICATION` | from step 4 (only if you use the meta-tag method) |
   | `BING_SITE_VERIFICATION` | from step 4 (only if you use the meta-tag method) |

3. Settings → Domains: `krishnaneupane.com` is primary; `www.krishnaneupane.com` redirects to it.
4. Analytics tab → enable **Web Analytics**. Speed Insights tab → enable **Speed Insights**.
5. Settings → Security / Firewall: confirm no bot-protection rule blocks GPTBot, ClaudeBot, PerplexityBot, or Bingbot.

## 3. Verify the live site

| Tool | URL | Target |
|---|---|---|
| Security headers | https://securityheaders.com/?q=krishnaneupane.com | Grade **A** (CSP present; `unsafe-inline` keeps it from A+, see `lib/security-headers.mjs`) |
| Mozilla Observatory | https://developer.mozilla.org/en-US/observatory/analyze?host=krishnaneupane.com | B+ or better |
| Rich Results | https://search.google.com/test/rich-results?url=https://krishnaneupane.com/about | Person, ProfilePage, FAQ, Breadcrumb detected with no errors |
| Schema validator | https://validator.schema.org/#url=https://krishnaneupane.com | No errors |
| PageSpeed (mobile) | https://pagespeed.web.dev/analysis?url=https://krishnaneupane.com | Performance ≥ 90, others ≥ 95 |
| HSTS preload | https://hstspreload.org/?domain=krishnaneupane.com | Eligible → submit |
| Social preview | https://www.opengraph.xyz/url/https%3A%2F%2Fkrishnaneupane.com | Card shows name, title, image |

Also open `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/feed.xml`, and `/.well-known/security.txt` in the browser.

## 4. Search engines

**Google Search Console** (https://search.google.com/search-console)
1. Add property → **Domain** → `krishnaneupane.com`.
2. Verify with the DNS TXT record it gives you (add it at your DNS provider). Alternatively choose "URL prefix → HTML tag" and put the `content` value in `GOOGLE_SITE_VERIFICATION`.
3. Sitemaps → submit `https://krishnaneupane.com/sitemap.xml`.
4. URL Inspection → request indexing for `/`, `/about`, `/projects`, `/hire`.

**Bing Webmaster Tools** (https://www.bing.com/webmasters)
1. Sign in → **Import from Google Search Console** (fastest), or add the site and verify with DNS or the meta tag (`BING_SITE_VERIFICATION`).
2. Sitemaps → submit `https://krishnaneupane.com/sitemap.xml`.
3. Bing powers ChatGPT search and Copilot results, so don't skip it.

## 5. GitHub

1. Repo → Settings → Branches: protect `master` (require PR + passing checks: `Lint, type-check, build`, `CodeQL`).
2. Settings → Code security: enable Dependabot alerts, secret scanning, and push protection.
3. Create the profile README repo (see `docs/PROFILE-COPY.md`).

## 6. Monthly

- Update `/now` (`app/now/page.tsx`).
- Publish one article (`content/posts`, `published: true`).
- Check Search Console → Performance for "Krishna Neupane" and topic queries.
- Ask ChatGPT, Perplexity, and Claude "Who is Krishna Neupane?" and note what they say.
