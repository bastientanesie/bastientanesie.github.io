import { expect, test } from "@playwright/test";

test.describe("theme", () => {
  test("follows the system preference without JavaScript", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(15, 17, 21)",
    );
    await expect(page.getByRole("group", { name: "Theme" })).toBeHidden();
    await context.close();
  });

  test("switcher applies and persists the chosen theme without flash", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await page.getByLabel("Dark").check({ force: true });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("meta[data-scheme=light]")).toHaveAttribute(
      "content",
      "#0f1115",
    );

    await page.reload({ waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByLabel("Dark")).toBeChecked();

    await page.getByLabel("System").check({ force: true });
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    await expect(page.locator("meta[data-scheme=light]")).toHaveAttribute(
      "content",
      "#ffffff",
    );
  });
});

test.describe("navigation", () => {
  test("desktop shows the nav and hides the menu button", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link"),
    ).toHaveCount(5);
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
  });

  test("mobile menu opens as a popover and closes with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/");

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(menu.getByRole("link")).toHaveCount(5);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("footer lists profiles and licenses", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    for (const name of ["LinkedIn", "Bluesky", "GitHub"]) {
      await expect(footer.getByRole("link", { name })).toBeVisible();
    }
    await expect(footer.getByRole("link", { name: /MIT/ })).toBeVisible();
    await expect(footer.getByRole("link", { name: /CC BY-NC/ })).toBeVisible();
  });
});

test.describe("layout", () => {
  test("caps content width at 2560px", async ({ page }) => {
    await page.setViewportSize({ width: 3200, height: 1000 });
    await page.goto("/");

    const box = await page.locator("main").boundingBox();
    expect(box?.width).toBeLessThanOrEqual(2560);
  });

  test("focus outline is visible and thick", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const outlineWidth = await page
      .locator(":focus")
      .evaluate((element) => getComputedStyle(element).outlineWidth);
    expect(outlineWidth).toBe("3px");
  });

  test("print hides chrome and uses black on white", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.emulateMedia({ media: "print", colorScheme: "dark" });

    await expect(page.getByRole("banner")).toBeHidden();
    await expect(page.getByRole("contentinfo")).toBeHidden();
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
  });
});
