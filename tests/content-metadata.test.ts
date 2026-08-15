import { readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

type Frontmatter = Record<string, unknown>;

const contentRoot = resolve(process.cwd(), "src/content");

const readCollection = (collection: "projects" | "insights") =>
  readdirSync(join(contentRoot, collection))
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const source = readFileSync(join(contentRoot, collection, file), "utf8");
      const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      if (!match) throw new Error(`${collection}/${file} has no frontmatter`);

      return {
        id: basename(file, ".md"),
        metadata: parseFrontmatter(match[1]),
        body: match[2].trim(),
      };
    });

const parseFrontmatter = (source: string): Frontmatter =>
  Object.fromEntries(
    source.split("\n").map((line) => {
      const separator = line.indexOf(":");
      if (separator < 1) throw new Error(`Invalid frontmatter line: ${line}`);

      const key = line.slice(0, separator).trim();
      const rawValue = line.slice(separator + 1).trim();

      if (rawValue === "true" || rawValue === "false") {
        return [key, rawValue === "true"];
      }

      if (rawValue.startsWith("[") || rawValue.startsWith('"')) {
        return [key, JSON.parse(rawValue)];
      }

      return [key, rawValue.replace(/^"|"$/g, "")];
    }),
  );

const nonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

describe("project content metadata", () => {
  const projects = readCollection("projects");

  it("has unique IDs and complete required metadata", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(
      projects.length,
    );

    for (const project of projects) {
      expect(nonEmptyString(project.metadata.title)).toBe(true);
      expect(nonEmptyString(project.metadata.client)).toBe(true);
      expect(nonEmptyString(project.metadata.category)).toBe(true);
      expect(nonEmptyString(project.metadata.summary)).toBe(true);
      expect(Array.isArray(project.metadata.tags)).toBe(true);
      expect(project.metadata.tags).toSatisfy(
        (tags) =>
          Array.isArray(tags) &&
          tags.length > 0 &&
          tags.every((tag) => nonEmptyString(tag)),
      );
      expect(
        project.metadata.featured === undefined ||
          typeof project.metadata.featured === "boolean",
      ).toBe(true);
      expect(
        project.metadata.accent === undefined ||
          nonEmptyString(project.metadata.accent),
      ).toBe(true);
      expect(
        project.metadata.year === undefined ||
          /^\d{4}$/.test(String(project.metadata.year)),
      ).toBe(true);
      expect(project.body.length).toBeGreaterThan(0);
    }
  });
});

describe("insight content metadata", () => {
  const insights = readCollection("insights");

  it("has unique IDs and complete required metadata", () => {
    expect(new Set(insights.map((insight) => insight.id)).size).toBe(
      insights.length,
    );

    for (const insight of insights) {
      expect(nonEmptyString(insight.metadata.title)).toBe(true);
      expect(nonEmptyString(insight.metadata.description)).toBe(true);
      expect(nonEmptyString(insight.metadata.category)).toBe(true);
      expect(typeof insight.metadata.published).toBe("string");
      expect(String(insight.metadata.published)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(String(insight.metadata.published)))).toBe(
        false,
      );
      expect(insight.body.length).toBeGreaterThan(0);
    }
  });
});
