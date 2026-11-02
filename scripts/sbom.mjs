// Writes the site's SBOM to stdout. CI attests this file; the site serves the identical bytes at /sbom.json.
// Usage: node scripts/sbom.mjs > sbom.json
import { buildSbom } from "../lib/sbom.mjs";

process.stdout.write(buildSbom());
