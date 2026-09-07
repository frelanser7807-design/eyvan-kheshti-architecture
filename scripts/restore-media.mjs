import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "media-parts", "manifest.json");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

for (const file of manifest.files) {
  const outputPath = join(root, file.path);
  let validExistingFile = false;

  try {
    const info = await stat(outputPath);
    if (info.size === file.size) {
      validExistingFile = sha256(await readFile(outputPath)) === file.sha256;
    }
  } catch {
    validExistingFile = false;
  }

  if (validExistingFile) continue;

  const chunks = [];
  for (const part of file.parts) {
    const bytes = await readFile(join(root, part.path));
    if (bytes.length !== part.size || sha256(bytes) !== part.sha256) {
      throw new Error(`Media part failed verification: ${part.path}`);
    }
    chunks.push(bytes);
  }

  const restored = Buffer.concat(chunks);
  if (restored.length !== file.size || sha256(restored) !== file.sha256) {
    throw new Error(`Restored media failed verification: ${file.path}`);
  }

  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.restoring`;
  await writeFile(temporaryPath, restored);
  await rm(outputPath, { force: true });
  await rename(temporaryPath, outputPath);
}

console.log(`Verified or restored ${manifest.files.length} large media files.`);
