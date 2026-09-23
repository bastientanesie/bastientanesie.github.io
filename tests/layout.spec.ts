import { expect, test } from "@playwright/test";

const parseRgb = (color: string): number[] =>
  (color.match(/\d+/g) ?? []).slice(0, 3).map(Number);

const luminance = (color: string): number => {
  const [red = 0, green = 0, blue = 0] = parseRgb(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: string, second: string): number => {
  const [lighter = 0, darker = 0] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const toHex = (color: string): string =>
  `#${parseRgb(color)
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;

test.describe("theme", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`theme-color meta matches the page background (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");

      const background = await page
        .locator("body")
        .evaluate((body) => getComputedStyle(body).backgroundColor);
      await expect(
        page.locator(`meta[data-scheme=${colorScheme}]`),
      ).toHaveAttribute("content", toHex(background));
    });
  }

  test("stored choice is applied before first paint", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });
    await page.goto("/", { waitUntil: "commit" });

    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(15, 17, 21)",
    );
  });

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

    await page.getByRole("radio", { name: "Dark" }).check({ force: true });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    for (const scheme of ["light", "dark"]) {
      await expect(page.locator(`meta[data-scheme=${scheme}]`)).toHaveAttribute(
        "content",
        "#0f1115",
      );
    }

    await page.reload({ waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();

    await page.getByRole("radio", { name: "System" }).check({ force: true });
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
    ).toHaveCount(4);
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
    await expect(menu.getByRole("link")).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("theme switcher lives in the menu below the xs breakpoint", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");

    const theme = page.getByRole("group", { name: "Theme" });
    await expect(theme).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(theme).toBeVisible();

    await page.getByRole("radio", { name: "Dark" }).check({ force: true });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme switcher stays in the header from the xs breakpoint", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 432, height: 700 });
    await page.goto("/");

    await expect(page.getByRole("group", { name: "Theme" })).toBeVisible();
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
  for (const width of [2560, 3200]) {
    test(`caps content width at 2560px on a ${String(width)}px viewport`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");

      const containers = page.locator(".page-container");
      await expect(containers).toHaveCount(4);
      for (const container of await containers.all()) {
        const box = await container.boundingBox();
        expect(box?.width).toBeLessThanOrEqual(2560);
      }
    });
  }

  test("focus outline is visible and thick", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const outlineWidth = await page
      .locator(":focus")
      .evaluate((element) => getComputedStyle(element).outlineWidth);
    expect(outlineWidth).toBe("3px");
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`focus outline keeps a 3:1 contrast on the surface (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");
      await page.keyboard.press("Tab");

      const [focus, surface] = await page.evaluate(() => {
        const focused = getComputedStyle(
          document.querySelector(":focus") ?? document.body,
        );
        return [
          focused.outlineColor,
          getComputedStyle(document.body).backgroundColor,
        ];
      });
      expect(contrastRatio(focus, surface)).toBeGreaterThanOrEqual(3);
    });
  }

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
