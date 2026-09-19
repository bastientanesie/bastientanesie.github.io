import { profiles } from "../data/site";

export const SITE_NAME = "Bastien Tanésie";

export type JsonLdNode = Record<string, unknown>;

export type PageType = "WebPage" | "CollectionPage" | "ProfilePage";

interface GraphOptions {
  site: URL;
  url: URL;
  title: string;
  description: string;
  pageType?: PageType | undefined;
  nodes?: JsonLdNode[] | undefined;
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
