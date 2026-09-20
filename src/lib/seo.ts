import { profiles, SITE_NAME } from "../data/site";
import type { Post } from "./posts";
import type { Project } from "./projects";

export { SITE_NAME } from "../data/site";

export const SITEMAP_PATH = "/sitemap-index.xml";

export function textResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export type JsonLdNode = Record<string, unknown>;

export type PageType = "WebPage" | "CollectionPage" | "ProfilePage";

export interface SeoProps {
  title: string;
  description: string;
  noindex?: boolean;
  pageType?: PageType | undefined;
  nodes?: JsonLdNode[] | undefined;
  image?: string | undefined;
  ogType?: "website" | "article";
}

interface GraphOptions {
  site: URL;
  url: URL;
  title: string;
  description: string;
  pageType?: PageType | undefined;
  nodes?: JsonLdNode[] | undefined;
}

export function documentTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}

export function buildJsonLdGraph({
  site,
  url,
  title,
  description,
  pageType = "WebPage",
  nodes = [],
}: GraphOptions): JsonLdNode {
  const personId = absoluteUrl("/#person", site);
  const websiteId = absoluteUrl("/#website", site);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_NAME,
        url: site.href,
        sameAs: profiles.map(({ href }) => href),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.href,
        name: SITE_NAME,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": pageType,
        "@id": `${url.href}#webpage`,
        url: url.href,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        ...(pageType === "ProfilePage" && { mainEntity: { "@id": personId } }),
      },
      ...nodes,
    ],
  };
}

export function serializeJsonLd(graph: JsonLdNode): string {
  return JSON.stringify(graph).replaceAll("<", "\\u003c");
}

export function resolveSite({
  site,
  url,
}: {
  site?: URL | undefined;
  url: URL;
}): URL {
  return site ?? new URL(url.origin);
}

export function buildPostNode(post: Post, site: URL): JsonLdNode {
  const { title, description, tags, publishedAt, updatedAt } = post.data;
  const url = absoluteUrl(`/blog/${post.id}/`, site);
  const personId = absoluteUrl("/#person", site);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    headline: title,
    description,
    datePublished: publishedAt.toISOString(),
    dateModified: (updatedAt ?? publishedAt).toISOString(),
    keywords: tags,
    inLanguage: "en",
    author: { "@id": personId },
    publisher: { "@id": personId },
  };
}

export function buildProjectNode(project: Project, site: URL): JsonLdNode {
  const { title, description, tags, startedAt } = project.data;
  const url = absoluteUrl(`/projects/${project.id}/`, site);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    name: title,
    description,
    dateCreated: startedAt,
    keywords: tags,
    inLanguage: "en",
    creator: { "@id": absoluteUrl("/#person", site) },
  };
}
