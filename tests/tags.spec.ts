import { expect, test } from "@playwright/test";

test.describe("Post tags", () => {
  test("tag page lists only Posts with that tag", async ({ page }) => {
    await page.goto("/blog/tags/tooling/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Posts tagged #tooling",
    );
    await expect(
      page.getByRole("link", { name: "Hello, world" }),
    ).toBeVisible();
  });

  test("tag page excludes Posts without the tag", async ({ page }) => {
    await page.goto("/blog/tags/web/");

    await expect(
      page.getByRole("link", { name: "Hello, world" }),
    ).toBeVisible();
    await expect(page.getByText("Unpublished draft")).toHaveCount(0);
  });

  test("tags used only by drafts have no page", async ({ request }) => {
    const response = await request.get("/blog/tags/security/");
    expect(response.status()).toBe(404);
  });

  test("Post page links its tags to their pages", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    await page.getByRole("link", { name: "#tooling" }).click();
    await expect(page).toHaveURL(/\/blog\/tags\/tooling\/$/);
  });

  test("index filters tags as the reader types", async ({ page }) => {
    await page.goto("/blog/tags/");
    const tags = page.getByRole("list", { name: "Tags" });

    await expect(tags.getByRole("link")).toHaveCount(2);
    await page.getByLabel("Filter tags").fill("too");
    await expect(tags.getByRole("link")).toHaveText(["#tooling (2)"]);
    await page.getByLabel("Filter tags").fill("nope");
    await expect(tags.getByRole("link")).toHaveCount(0);
  });
});

test.describe("Project tags", () => {
  test("tag page lists only Projects with that tag", async ({ page }) => {
    await page.goto("/projects/tags/devops/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Projects tagged #devops",
    );
    await expect(
      page.getByRole("link", { name: "Ongoing project" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sample project" }),
    ).toHaveCount(0);
  });

  test("index filters tags and stays independent of Post tags", async ({
    page,
  }) => {
    await page.goto("/projects/tags/");
    const tags = page.getByRole("list", { name: "Tags" });

    await expect(tags.getByRole("link")).toHaveCount(3);
    await page.getByLabel("Filter tags").fill("end");
    await expect(tags.getByRole("link")).toHaveText(["#backend (1)"]);
  });
});
