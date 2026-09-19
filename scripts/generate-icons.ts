import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { ICONS } from "../src/data/icons.ts";

const PUBLIC_DIR = "public";
const SVG_DEFAULT_DENSITY = 72;

const source = await readFile(`${PUBLIC_DIR}/favicon.svg`);
const { width: sourceSize } = await sharp(source).metadata();

for (const { file, size } of ICONS) {
  const png = await sharp(source, {
    density: (SVG_DEFAULT_DENSITY * size) / sourceSize,
  })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(`${PUBLIC_DIR}/${file}`, png);
}
