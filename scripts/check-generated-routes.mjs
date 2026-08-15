import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");

const serviceSlugs = (
  await import(join(root, "src/data/services.ts"))
).services.map((service) => service.slug);

const contentSlugs = (collection) =>
  readdirSync(join(root, "src/content", collection))
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));

const expectedRoutes = [
  "/services/",
  ...serviceSlugs.map((slug) => `/services/${slug}/`),
  "/projects/",
  ...contentSlugs("projects").map((slug) => `/projects/${slug}/`),
  "/insights/",
  ...contentSlugs("insights").map((slug) => `/insights/${slug}/`),
];

if (new Set(expectedRoutes).size !== expectedRoutes.length) {
  console.error("Generated route check failed: duplicate expected routes.");
  process.exit(1);
}

if (!existsSync(dist)) {
  console.error("Generated route check failed: dist/ does not exist.");
  process.exit(1);
}

const missingRoutes = expectedRoutes.filter((route) => {
  const file = join(dist, route, "index.html");
  return !existsSync(file) || statSync(file).size === 0;
});

if (missingRoutes.length > 0) {
  console.error("Generated route check failed. Missing routes:");
  for (const route of missingRoutes) console.error(`- ${route}`);
  process.exit(1);
}

const generatedHtml = expectedRoutes.map((route) =>
  readFileSync(join(dist, route, "index.html"), "utf8"),
);

if (generatedHtml.some((html) => !html.includes("<html"))) {
  console.error(
    "Generated route check failed: one or more pages are not HTML documents.",
  );
  process.exit(1);
}

console.log(`Generated route check passed: ${expectedRoutes.length} routes.`);
