import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import {
  postTags,
  projectSkillTags,
  projectTechTags,
  tagKeys,
} from "./data/tags";
import { folderIdFromEntry } from "./lib/folder-id";

const contentDir = process.env.CONTENT_DIR ?? "./src/content";

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: `${contentDir}/posts`,
    generateId: ({ entry }) => folderIdFromEntry("Post", entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.enum(tagKeys(postTags))).min(1),
      cover: z.object({ image: image(), alt: z.string().min(1) }).optional(),
      aiAssisted: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: `${contentDir}/projects`,
    generateId: ({ entry }) => folderIdFromEntry("Project", entry),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        client: z.string().min(1),
        employer: z.string().min(1).optional(),
        role: z.string().min(1),
        startedAt: z.string().regex(YEAR_MONTH),
        endedAt: z.string().regex(YEAR_MONTH).optional(),
        techTags: z.array(z.enum(tagKeys(projectTechTags))).min(1),
        skillTags: z.array(z.enum(tagKeys(projectSkillTags))).min(1),
        logo: z.object({ image: image(), alt: z.string().min(1) }),
        isFeatured: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      .refine(({ startedAt, endedAt }) => !endedAt || endedAt >= startedAt, {
        message: "endedAt must not be before startedAt",
        path: ["endedAt"],
      }),
});

export const collections = { posts, projects };
