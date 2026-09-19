import type { APIRoute, GetStaticPaths } from "astro";
import { ogImageResponse } from "../../../lib/og-image";
import { getPublishedProjects, type Project } from "../../../lib/projects";
import { SITE_NAME } from "../../../lib/seo";

export const getStaticPaths = (async () => {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ project: Project }> = ({ props }) =>
  ogImageResponse({
    title: props.project.data.title,
    eyebrow: "Project",
    siteName: SITE_NAME,
  });
