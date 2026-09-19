import { expect, test } from "@playwright/test";

test.describe("projects", () => {
  test("lists published Projects", async ({ page }) => {
    await page.goto("/projects/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Projects",
    );
    await expect(
      page.getByRole("link", { name: "Sample project" }),
    ).toHaveAttribute("href", "/projects/sample-project/");
    await expect(page.getByText("Unpublished project")).toHaveCount(0);
  });

  test("draft Project has no page", async ({ request }) => {
    const response = await request.get("/projects/unpublished-project/");
    expect(response.status()).toBe(404);
  });

  test("Project page shows role, period, tags and logo", async ({ page }) => {
    await page.goto("/projects/sample-project/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Sample project",
    );
    const meta = page.locator("article header p");

    await expect(meta).toHaveText(/Lead developer · 2023-03\s+–\s+2024-06/);
    await expect(
      page.getByRole("list", { name: "Tags" }).getByText("#web"),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: "Sample logo" })).toBeVisible();
  });

  test("ongoing Project shows an open-ended period", async ({ page }) => {
    await page.goto("/projects/ongoing-project/");

    await expect(page.locator("article header p")).toHaveText(
      /2025-01\s+–\s+present/,
    );
  });
});
