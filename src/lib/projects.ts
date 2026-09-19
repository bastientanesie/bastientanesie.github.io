import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) =>
    b.data.startedAt.localeCompare(a.data.startedAt),
  );
}

export function formatPeriod(project: Project): string {
  const { startedAt, endedAt } = project.data;
  return `${startedAt} – ${endedAt ?? "present"}`;
}
