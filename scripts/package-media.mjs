import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const partsRoot = join(root, "media-parts");
const manifestPath = join(partsRoot, "manifest.json");
const chunkSize = 500_000;
const threshold = 520_000;

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root })
  .toString("utf8")
  .split("\0")
  .filter(Boolean)
  .filter((path) => !path.startsWith("media-parts/"));

let previousMediaPaths = [];
try {
  const previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
  previousMediaPaths = previousManifest.files.map((file) => file.path);
} catch {
  previousMediaPaths = [];
}

const sourcePaths = [...new Set([...tracked, ...previousMediaPaths])];

await rm(partsRoot, { recursive: true, force: true });
const files = [];

for (const path of sourcePaths) {
  const bytes = await readFile(join(root, path));
  if (bytes.length <= threshold) continue;

  const parts = [];
  for (let offset = 0, index = 0; offset < bytes.length; offset += chunkSize, index += 1) {
    const part = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
    const partPath = `media-parts/${path}.part${String(index).padStart(3, "0")}`;
    const absolutePartPath = join(root, partPath);
    await mkdir(dirname(absolutePartPath), { recursive: true });
    await writeFile(absolutePartPath, part);
    parts.push({ path: partPath, size: part.length, sha256: sha256(part) });
  }

  files.push({ path, size: bytes.length, sha256: sha256(bytes), parts });
}

await mkdir(partsRoot, { recursive: true });
await writeFile(
  join(partsRoot, "manifest.json"),
  `${JSON.stringify({ version: 1, chunkSize, files }, null, 2)}\n`,
  "utf8",
);

console.log(`Packed ${files.length} large media files into ${files.reduce((sum, file) => sum + file.parts.length, 0)} lossless parts.`);
