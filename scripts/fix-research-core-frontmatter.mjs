import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(process.cwd(), "content/research-core")

function walk(dir, files = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name)
		if (statSync(p).isDirectory()) walk(p, files)
		else if (name.endsWith(".mdx")) files.push(p)
	}
	return files
}

function parseInlineList(inner) {
	const items = []
	let current = ""
	let inQuote = false
	let quote = ""

	for (let i = 0; i < inner.length; i++) {
		const c = inner[i]
		if ((c === '"' || c === "'") && !inQuote) {
			inQuote = true
			quote = c
			continue
		}
		if (c === quote && inQuote) {
			inQuote = false
			quote = ""
			continue
		}
		if (c === "," && !inQuote) {
			items.push(current.trim())
			current = ""
			continue
		}
		current += c
	}
	if (current.trim()) items.push(current.trim())

	return items.map((item) => item.replace(/^["']|["']$/g, ""))
}

function toBlockList(key, items) {
	return `${key}:\n${items.map((item) => `  - ${item}`).join("\n")}`
}

function fixFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/)
	if (!match) return content

	let fm = match[1]
	const body = content.slice(match[0].length)

	fm = fm.replace(
		/^collaborators: \[Krishna Neupane\]$/m,
		toBlockList("collaborators", ["Krishna Neupane"])
	)

	fm = fm.replace(/^keywords: \[(.+)\]$/m, (_, inner) => {
		const items = parseInlineList(inner)
		return toBlockList("keywords", items)
	})

	return `---\n${fm}\n---${body}`
}

let fixed = 0
for (const file of walk(ROOT)) {
	const raw = readFileSync(file, "utf8")
	const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
	const updated = fixFrontmatter(normalized)
	if (updated !== raw) {
		writeFileSync(file, updated, "utf8")
		fixed++
		console.log("fixed:", file.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", ""))
	}
}

console.log(`Done. Updated ${fixed} files.`)
