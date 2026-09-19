import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPublishedPosts } from "../lib/posts";
import { SITE_NAME } from "../lib/seo";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE_NAME} — Blog`,
    description: `Posts by ${SITE_NAME}.`,
    site: new URL("/", site).href,
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.publishedAt,
      link: `/blog/${id}/`,
      categories: data.tags,
    })),
  });
};
