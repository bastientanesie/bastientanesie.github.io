import type { APIRoute } from "astro";
import { SITEMAP_PATH, textResponse } from "../lib/seo";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(SITEMAP_PATH, site).href;
  return textResponse(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
};
