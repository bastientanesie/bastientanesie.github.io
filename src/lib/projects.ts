import { getCollection, type CollectionEntry } from "astro:content";
import type { ProjectTag } from "../data/tags";

export type Project = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) =>
    b.data.startedAt.localeCompare(a.data.startedAt),
  );
}

export function projectTagsOf({ data }: Project): ProjectTag[] {
  return [...data.techTags, ...data.skillTags];
}
