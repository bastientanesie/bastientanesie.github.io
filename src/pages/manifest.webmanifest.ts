import type { APIRoute } from "astro";
import { ICONS } from "../data/icons";
import { SITE_NAME, themeColors } from "../data/site";

export const GET: APIRoute = () => {
  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/",
    display: "browser",
    background_color: themeColors.dark,
    theme_color: themeColors.dark,
    icons: ICONS.filter(({ inManifest }) => inManifest).map(
      ({ file, size }) => ({
        src: `/${file}`,
        sizes: `${String(size)}x${String(size)}`,
        type: "image/png",
      }),
    ),
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
