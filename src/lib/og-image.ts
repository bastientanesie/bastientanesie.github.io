import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import satori from "satori";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const FONT_DIRECTORY = resolve("node_modules/@fontsource/inter/files");

const TEXT_COLOR = "#ffffff";
const SURFACE_COLOR = "#0f1115";
const MUTED = "#9aa3b2";

interface OgImageContent {
  title: string;
  eyebrow: string;
  siteName: string;
}

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(resolve(FONT_DIRECTORY, "inter-latin-400-normal.woff")),
    readFile(resolve(FONT_DIRECTORY, "inter-latin-700-normal.woff")),
  ]);
  return [
    {
      name: "Inter",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

export async function renderOgImage({
  title,
  eyebrow,
  siteName,
}: OgImageContent): Promise<Buffer> {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          backgroundColor: SURFACE_COLOR,
          color: TEXT_COLOR,
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: 32, color: MUTED },
              children: eyebrow,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 72, fontWeight: 700, lineHeight: 1.15 },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 32, fontWeight: 700 },
              children: siteName,
            },
          },
        ],
      },
    },
    { width: OG_WIDTH, height: OG_HEIGHT, fonts: await loadFonts() },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export function ogImagePath(kind: "blog" | "projects", id: string): string {
  return `/og/${kind}/${id}.png`;
}

export async function ogImageResponse(
  content: OgImageContent,
): Promise<Response> {
  const image = await renderOgImage(content);
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
}
