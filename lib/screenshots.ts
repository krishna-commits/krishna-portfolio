import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public/projects");
const EXTS = ["webp", "png", "jpg"];

/** Path of a project's screenshot in public/projects/<slug>.{webp,png,jpg}, if one exists (checked at build time). */
export function projectScreenshot(slug: string): string | null {
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(DIR, `${slug}.${ext}`))) return `/projects/${slug}.${ext}`;
  }
  return null;
}
