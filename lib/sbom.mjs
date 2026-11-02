// CycloneDX 1.5 SBOM built from package-lock.json, with no dependencies.
// Deterministic by design (no timestamps, sorted components, serial derived from the lockfile hash), so the
// SBOM that CI attests is byte-identical to the one served at /sbom.json. That is what makes it verifiable.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function uuidFrom(hex) {
  const h = hex.slice(0, 32).split("");
  h[12] = "5"; // version nibble
  h[16] = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16); // variant
  const s = h.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
}

function sriToHash(integrity) {
  // "sha512-<base64>" → { alg: "SHA-512", content: "<hex>" }
  const m = /^(sha\d+)-(.+)$/.exec(integrity ?? "");
  if (!m) return null;
  const alg = { sha1: "SHA-1", sha256: "SHA-256", sha384: "SHA-384", sha512: "SHA-512" }[m[1]];
  return alg ? { alg, content: Buffer.from(m[2], "base64").toString("hex") } : null;
}

/** Returns the SBOM as a JSON string (with trailing newline) for the project at `root`. */
export function buildSbom(root = process.cwd()) {
  const lockRaw = fs.readFileSync(path.join(root, "package-lock.json"), "utf8");
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const lock = JSON.parse(lockRaw);
  const lockHash = createHash("sha256").update(lockRaw).digest("hex");

  const components = Object.entries(lock.packages ?? {})
    .filter(([key, p]) => key.startsWith("node_modules/") && p.version && !p.link)
    .map(([key, p]) => {
      const name = key.slice(key.lastIndexOf("node_modules/") + "node_modules/".length);
      const purl = `pkg:npm/${name.startsWith("@") ? `%40${name.slice(1)}` : name}@${p.version}`;
      const hash = sriToHash(p.integrity);
      return {
        type: "library",
        "bom-ref": purl,
        name,
        version: p.version,
        purl,
        scope: p.dev ? "excluded" : "required",
        ...(p.license ? { licenses: [{ license: { id: p.license } }] } : {}),
        ...(hash ? { hashes: [hash] } : {}),
      };
    })
    // De-duplicate nested copies of the same name@version, then sort for determinism.
    .filter((c, i, all) => all.findIndex((x) => x.purl === c.purl) === i)
    .sort((a, b) => a.purl.localeCompare(b.purl));

  const bom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${uuidFrom(lockHash)}`,
    version: 1,
    metadata: {
      component: { type: "application", "bom-ref": "krishnaneupane.com", name: pkg.name, version: pkg.version },
      properties: [{ name: "lockfile:sha256", value: lockHash }],
    },
    components,
  };
  return `${JSON.stringify(bom, null, 2)}\n`;
}

export function sbomStats(json) {
  const bom = JSON.parse(json);
  const prod = bom.components.filter((c) => c.scope === "required").length;
  return {
    total: bom.components.length,
    production: prod,
    sha256: createHash("sha256").update(json).digest("hex"),
    lockfileSha256: bom.metadata.properties[0].value,
  };
}
