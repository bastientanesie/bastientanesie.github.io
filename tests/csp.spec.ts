import { expect, test } from "@playwright/test";

const paths = [
  "/",
  "/about/",
  "/blog/",
  "/blog/hello-world/",
  "/blog/tags/",
  "/blog/tags/web/",
  "/projects/",
  "/projects/sample-project/",
  "/credits/",
  "/404.html",
];

test.describe("content security policy", () => {
  for (const path of paths) {
    test(`${path} has a strict CSP and no violation`, async ({ page }) => {
      const violations: string[] = [];
      page.on("console", (message) => {
        if (message.text().includes("Content Security Policy")) {
          violations.push(message.text());
        }
      });

      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const policy = await page
        .locator('meta[http-equiv="content-security-policy"]')
        .getAttribute("content");
      expect(policy).toContain("script-src 'self' 'sha256-");
      expect(
        policy?.replace("style-src-attr 'unsafe-inline'", ""),
      ).not.toContain("unsafe-inline");
      expect(policy).not.toContain("unsafe-eval");
      expect(violations).toEqual([]);
    });
  }

  test("tag filter still works under the CSP", async ({ page }) => {
    await page.goto("/blog/tags/");
    await expect(page.locator("[x-data]").first()).toBeVisible();
  });
});
