import type { APIRoute } from "astro";
import { profiles } from "../data/site";
import { SITE_NAME } from "../lib/seo";

export const GET: APIRoute = () => {
  const contacts = profiles
    .map(({ label, href }) => `${label}: ${href}`)
    .join("\n");
  const body = `/* TEAM */
Author: ${SITE_NAME}
${contacts}

/* SITE */
Language: English
Standards: HTML5, CSS3
Components: Astro, Tailwind CSS, Alpine.js
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
