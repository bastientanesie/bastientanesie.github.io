import { expect, test, type APIRequestContext } from "@playwright/test";

const CSP_VIOLATION_MESSAGE = "Content Security Policy";
const ALLOWED_UNSAFE_INLINE = "style-src-attr 'unsafe-inline'";

async function readSitemapPaths(request: APIRequestContext) {
  const response = await request.get("/sitemap-0.xml");
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1] ?? "",
  );
  return [...urls.map((url) => new URL(url).pathname), "/404.html"];
}

test.describe("content security policy", () => {
  test("every page has a strict CSP and no violation", async ({
    page,
    request,
  }) => {
    const paths = await readSitemapPaths(request);
    expect(paths.length).toBeGreaterThan(10);

    const violations: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes(CSP_VIOLATION_MESSAGE)) {
        violations.push(`${page.url()}: ${message.text()}`);
      }
    });

    for (const path of paths) {
      await page.goto(path);
      await page.waitForLoadState("load");

      const policy = await page
        .locator('meta[http-equiv="content-security-policy"]')
        .getAttribute("content");
      expect(policy, `${path} has a CSP`).not.toBeNull();
      expect(policy).toContain("script-src 'self' 'sha256-");
      expect(policy?.replace(ALLOWED_UNSAFE_INLINE, "")).not.toContain(
        "unsafe-inline",
      );
      expect(policy).not.toContain("unsafe-eval");
    }

    expect(violations).toEqual([]);
  });

  test("Alpine tag filter runs under the CSP", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes(CSP_VIOLATION_MESSAGE)) {
        violations.push(message.text());
      }
    });

    await page.goto("/blog/tags/");
    const filter = page.getByLabel("Filter tags");
    await expect(filter).toBeVisible();

    const tags = page.getByRole("list", { name: "Tags" }).getByRole("listitem");
    await expect(tags.first()).toBeVisible();
    await filter.fill("no-such-tag");
    await expect(tags.first()).toBeHidden();

    expect(violations).toEqual([]);
  });
});
