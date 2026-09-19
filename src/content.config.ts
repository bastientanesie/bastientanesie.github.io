import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { postTags } from "./data/tags";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function postIdFromEntry(entry: string): string {
  const id = entry.split("/")[0] ?? entry;
  if (!KEBAB_CASE.test(id)) {
    throw new Error(`Post folder "${id}" must be kebab-case`);
  }
  return id;
}

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => postIdFromEntry(entry),
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

export const collections = { posts };
