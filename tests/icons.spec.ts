import { expect, test } from "@playwright/test";
import { SITE_NAME } from "../src/data/site";

const icons = [
  { path: "/apple-touch-icon.png", size: 180 },
  { path: "/icon-192.png", size: 192 },
  { path: "/icon-512.png", size: 512 },
];

test.describe("icons", () => {
  for (const { path, size } of icons) {
    test(`${path} is a ${String(size)}px square PNG`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      const png = await response.body();
      expect(png.readUInt32BE(16)).toBe(size);
      expect(png.readUInt32BE(20)).toBe(size);
    });
  }

  test("pages link the favicon, touch icon and manifest", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      "href",
      "/favicon.svg",
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      "href",
      "/apple-touch-icon.png",
    );
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    );
  });

  test("the manifest is minimal and lists the PNG icons", async ({
    request,
  }) => {
    const response = await request.get("/manifest.webmanifest");
    const manifest = (await response.json()) as {
      name: string;
      icons: { src: string; sizes: string; type: string }[];
    };

    expect(manifest.name).toBe(SITE_NAME);
    expect(manifest.icons).toEqual([
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ]);
  });

  test("no service worker is registered", async ({ page }) => {
    await page.goto("/");

    const registrations = await page.evaluate(
      async () => (await navigator.serviceWorker.getRegistrations()).length,
    );
    expect(registrations).toBe(0);
  });
});
