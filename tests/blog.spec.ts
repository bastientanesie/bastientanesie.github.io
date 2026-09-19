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
      page.locator("pre.astro-code span[style*='--shiki-light']").first(),
    ).toBeVisible();
  });

  test("reading time ignores code blocks", async ({ page }) => {
    await page.goto("/blog/code-heavy/");

    await expect(page.getByText("1 min read")).toBeVisible();
  });

  test("heading anchors are visible without hover on touch viewports", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/blog/hello-world/");

    await expect(
      page.locator("h2#first-section .heading-anchor"),
    ).toBeVisible();
    await expect(page.locator("h2#first-section .heading-anchor")).toHaveCSS(
      "opacity",
      "1",
    );
  });

  for (const [colorScheme, background] of [
    ["light", "rgb(255, 255, 255)"],
    ["dark", "rgb(36, 41, 46)"],
  ] as const) {
    test(`code block follows the ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/blog/hello-world/");

      await expect(page.locator("pre.astro-code")).toHaveCSS(
        "background-color",
        background,
      );
    });
  }

  test("code block follows the theme chosen with the switcher", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/blog/hello-world/");
    await page.getByLabel("Dark").check({ force: true });

    await expect(page.locator("pre.astro-code")).toHaveCSS(
      "background-color",
      "rgb(36, 41, 46)",
    );
  });
});

test.describe("responsive images", () => {
  test("Post cover is served in 480/720/1080 widths", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    const sources = page.locator("article picture source");
    const srcsets = await sources.evaluateAll((els) =>
      els.map((el) => el.getAttribute("srcset") ?? ""),
    );
    expect(srcsets.length).toBeGreaterThan(0);
    for (const srcset of srcsets) {
      expect(srcset).toMatch(/480w.*720w.*1080w/s);
    }
  });

  test("Post without cover has no visual", async ({ page }) => {
    await page.goto("/blog/code-heavy/");

    await expect(page.locator("article img")).toHaveCount(0);
  });
});
