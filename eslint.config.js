import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  astro.configs.recommended,
  {
    languageOptions: {
      parserOptions: { project: true },
    },
  },
  {
    // Astro template expressions are not typed by the parser, so `.map()` in markup reads as `error`.
    files: ["**/*.astro"],
    rules: { "@typescript-eslint/no-unsafe-return": "off" },
  },
  { linterOptions: { reportUnusedDisableDirectives: "error" } },
);
