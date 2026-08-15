import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDirectory = path.resolve("public");
const imageDirectories = ["projects", "images"];
const sourceExtensions = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff"]);

async function walk(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await walk(entryPath)));
      else files.push(entryPath);
    }
    return files;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

const files = (
  await Promise.all(
    imageDirectories.map((directory) =>
      walk(path.join(publicDirectory, directory)),
    ),
  )
).flat();
const sources = files.filter((file) =>
  sourceExtensions.has(path.extname(file).toLowerCase()),
);

for (const source of sources) {
  const extension = path.extname(source);
  const base = source.slice(0, -extension.length);
  const image = sharp(source);
  await Promise.all([
    image.clone().avif({ quality: 50, effort: 4 }).toFile(`${base}.avif`),
    image.clone().webp({ quality: 78, effort: 4 }).toFile(`${base}.webp`),
  ]);
  console.log(`Optimized ${path.relative(publicDirectory, source)}`);
}

console.log(
  `Generated ${sources.length * 2} modern image files from ${sources.length} source image${sources.length === 1 ? "" : "s"}.`,
);
