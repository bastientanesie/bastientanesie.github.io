import { writeFile } from "node:fs/promises";
import { SITE_NAME } from "../src/data/site.ts";
import { renderOgImage } from "../src/lib/og-image.ts";

const image = await renderOgImage({
  title: "Software engineering, accessible and fast",
  eyebrow: "Personal site",
  siteName: SITE_NAME,
});
await writeFile("src/assets/og-default.png", image);
