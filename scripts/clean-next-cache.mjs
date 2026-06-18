import { rmSync } from "node:fs"

const targets = process.argv.includes("--all")
	? [".next", ".contentlayer"]
	: [".next"]

for (const dir of targets) {
	try {
		rmSync(dir, { recursive: true, force: true })
		console.log(`Removed ${dir}`)
	} catch {
		// ignore
	}
}
