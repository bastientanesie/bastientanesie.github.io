import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { postTags, projectTags } from "./data/tags";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function folderIdFromEntry(kind: string, entry: string): string {
  const id = entry.split("/")[0] ?? entry;
  if (!KEBAB_CASE.test(id)) {
    throw new Error(`${kind} folder "${id}" must be kebab-case`);
  }
  return id;
}

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => folderIdFromEntry("Post", entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.enum(postTags)).min(1),
      cover: z.object({ image: image(), alt: z.string().min(1) }).optional(),
      aiAssisted: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => folderIdFromEntry("Project", entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      role: z.string().min(1),
      startedAt: z.string().regex(YEAR_MONTH),
      endedAt: z.string().regex(YEAR_MONTH).optional(),
      tags: z.array(z.enum(projectTags)).min(1),
      logo: z.object({ image: image(), alt: z.string().min(1) }),
      isFeatured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts, projects };
