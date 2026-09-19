import { expect, test } from "@playwright/test";

test.describe("blog", () => {
  test("lists published Posts and excludes drafts", async ({ page }) => {
    await page.goto("/blog/");

    await expect(
      page.getByRole("link", { name: "Hello, world" }),
    ).toHaveAttribute("href", "/blog/hello-world/");
    await expect(page.getByText("Unpublished draft")).toHaveCount(0);
  });

  test("draft Post has no page", async ({ request }) => {
    const response = await request.get("/blog/unpublished-draft/");
    expect(response.status()).toBe(404);
  });

  test("Post page shows reading time and AI badge", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hello, world",
    );
    await expect(page.getByText("1 min read")).toBeVisible();
    await expect(page.getByText("AI-assisted")).toBeVisible();
  });

  test("table of contents links to headings", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveCount(3);
    await toc.getByRole("link", { name: "Second section" }).click();
    await expect(page).toHaveURL(/#second-section$/);
  });

  test("headings have anchor links", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    await expect(
      page.locator("h2#first-section").getByRole("link", {
        name: "Link to this section",
      }),
    ).toHaveAttribute("href", "#first-section");
  });

  test("code blocks are syntax highlighted", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    await expect(page.locator("pre.astro-code")).toBeVisible();
    await expect(
      page.locator("pre.astro-code span[style*='color']").first(),
    ).toBeVisible();
  });
});
