import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

const filesToCopy = [
  "index.html",
  "styles.css",
  "script.js",
  ".nojekyll",
  "README.md"
];

for (const file of filesToCopy) {
  await fs.copyFile(path.join(root, file), path.join(dist, file));
}

await fs.cp(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
await fs.cp(path.join(root, "data"), path.join(dist, "data"), { recursive: true });
