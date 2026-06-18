#!/usr/bin/env node
/**
 * Smoke-test key routes — run while dev server is up.
 * Usage: node scripts/smoke-routes.mjs [baseUrl]
 */
const base = process.argv[2] || "http://localhost:3001"

const routes = [
	"/",
	"/home",
	"/projects",
	"/blog",
	"/research-core",
	"/research-core/05-learning-and-roadmaps/introduction",
	"/research-core/05-learning-and-roadmaps/devops-learning-hub/Chapter-1/devops-foundation-roadmap",
	"/research-core/01-security-engineering/devsecops/introduction",
	"/mantras",
	"/contact",
	"/codecanvas",
	"/privacy",
	"/research-core/04-collaboration-governance/engineering-governance/Chapter-1/jira-confluence-governance",
	"/this-page-does-not-exist",
]

const expect404 = new Set(["/this-page-does-not-exist"])

let failed = 0
for (const route of routes) {
	try {
		const res = await fetch(`${base}${route}`, { redirect: "follow" })
		const want404 = expect404.has(route)
		const ok = want404 ? res.status === 404 : res.status >= 200 && res.status < 400
		const mark = ok ? "OK" : "FAIL"
		if (!ok) failed++
		console.log(`${mark} ${res.status} ${route}`)
	} catch (err) {
		failed++
		console.log(`FAIL --- ${route} (${err.message})`)
	}
}

process.exit(failed > 0 ? 1 : 0)
