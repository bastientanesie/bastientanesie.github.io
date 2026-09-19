import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows latest Posts and Featured projects", async ({ page }) => {
    await page.goto("/");

    const latestPosts = page.getByRole("region", { name: "Latest posts" });
    await expect(
      latestPosts.getByRole("link", { name: "Hello, world" }),
    ).toHaveAttribute("href", "/blog/hello-world/");
    await expect(latestPosts.getByText("Unpublished draft")).toHaveCount(0);

    const featured = page.getByRole("region", { name: "Featured projects" });
    await expect(
      featured.getByRole("link", { name: "Sample project" }),
    ).toHaveAttribute("href", "/projects/sample-project/");
    await expect(featured.getByText("Ongoing project")).toHaveCount(0);
  });
});

test.describe("static pages", () => {
  const pages = [
    { path: "/about/", heading: "About" },
    { path: "/how-i-work/", heading: "How I work" },
    { path: "/legal/", heading: "Legal notice" },
  ];

  for (const { path, heading } of pages) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    });
  }

  test("legal notice covers publisher, host, tracking and logs", async ({
    page,
  }) => {
    await page.goto("/legal/");

    for (const name of ["Publisher", "Hosting", "Tracking", "Server logs"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });

  test("legal notice is reachable from the footer", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Legal notice" })
      .click();

    await expect(page).toHaveURL("/legal/");
  });
});

test.describe("404 page", () => {
  test("is clear, noindex and links back home", async ({ page }) => {
    await page.goto("/404.html");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    await expect(
      page.getByRole("link", { name: "Back to the home page" }),
    ).toHaveAttribute("href", "/");
  });
});
