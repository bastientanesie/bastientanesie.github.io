import { writeFile } from "node:fs/promises";
import { renderOgImage } from "../src/lib/og-image.ts";

const image = await renderOgImage({
  title: "Software engineering, accessible and fast",
  eyebrow: "Personal site",
  siteName: "Bastien Tanésie",
});
await writeFile("src/assets/og-default.png", image);
