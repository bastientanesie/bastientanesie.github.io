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
    await expect(page.getByText("Lead developer")).toBeVisible();
    await expect(page.getByText("2023-03 – 2024-06")).toBeVisible();
    await expect(page.getByText("#web")).toBeVisible();
    await expect(page.getByRole("img", { name: "Sample logo" })).toBeVisible();
  });

  test("ongoing Project shows an open-ended period", async ({ page }) => {
    await page.goto("/projects/ongoing-project/");

    await expect(page.getByText("2025-01 – present")).toBeVisible();
  });
});
