import alpinejs from "@astrojs/alpinejs";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";
import { headingAnchors } from "./src/plugins/heading-anchors";

export default defineConfig({
  site: "https://bastien.tanesie.fr",
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
    processor: satteri({
      hastPlugins: [satteriHeadingIdsPlugin(), headingAnchors],
    }),
  },
  integrations: [alpinejs({ entrypoint: "/src/alpine" }), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // @astrojs/alpinejs imports "alpinejs" itself; this swaps in the CSP-safe build.
      alias: { alpinejs: "@alpinejs/csp" },
    },
  },
});
