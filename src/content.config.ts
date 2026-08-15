import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    accent: z.string().default("blue"),
    tags: z.array(z.string()),
    year: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.date(),
    category: z.string(),
  }),
});

export const collections = { projects, insights };
