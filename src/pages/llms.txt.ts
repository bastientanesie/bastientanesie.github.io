import type { APIRoute } from "astro";
import { navigation } from "../data/site";
import { getPublishedPosts } from "../lib/posts";
import { getPublishedProjects } from "../lib/projects";
import { SITE_NAME, SITEMAP_PATH, textResponse } from "../lib/seo";

export const GET: APIRoute = async ({ site }) => {
  const link = (label: string, path: string, description?: string) =>
    `- [${label}](${new URL(path, site).href})${description ? `: ${description}` : ""}`;

  const pages = navigation
    .filter(({ href }) => href !== "/")
    .map(({ label, href }) => link(label, href));
  const projects = (await getPublishedProjects()).map(({ id, data }) =>
    link(data.title, `/projects/${id}/`, data.description),
  );
  const posts = (await getPublishedPosts()).map(({ id, data }) =>
    link(data.title, `/blog/${id}/`, data.description),
  );

  const body = `# ${SITE_NAME}

> Personal site of ${SITE_NAME}: a technical showcase made of a blog and a portfolio of past projects. English only.

## Pages

${pages.join("\n")}

## Projects

${projects.join("\n")}

## Posts

${posts.join("\n")}

## Optional

${link("RSS feed", "/rss.xml")}
${link("Sitemap", SITEMAP_PATH)}
`;
  return textResponse(body);
};
