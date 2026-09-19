import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://bastien.tanesie.fr",
  integrations: [alpinejs({ entrypoint: "/src/alpine" })],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // @astrojs/alpinejs imports "alpinejs" itself; this swaps in the CSP-safe build.
      alias: { alpinejs: "@alpinejs/csp" },
    },
  },
});
