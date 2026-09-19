import { expect, test } from "@playwright/test";

test.describe("credits", () => {
  test("lists Credits grouped by category", async ({ page }) => {
    await page.goto("/credits/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Credits");
    await expect(
      page.getByRole("heading", { level: 2, name: "Frameworks and libraries" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Astro" })).toHaveAttribute(
      "href",
      "https://astro.build/",
    );
  });

  test("is reachable from the footer", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Credits" })
      .click();

    await expect(page).toHaveURL("/credits/");
  });
});
