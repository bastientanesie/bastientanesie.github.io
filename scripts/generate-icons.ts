import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { ICONS } from "../src/data/icons.ts";

const source = await readFile("public/favicon.svg");

for (const { file, size } of ICONS) {
  const png = await sharp(source, { density: (72 * size) / 512 })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(`public/${file}`, png);
}
