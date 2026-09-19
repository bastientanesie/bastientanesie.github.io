import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const colorScheme of ["light", "dark"] as const) {
  test(`home page has no detectable accessibility violations (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");

    const { violations } = await new AxeBuilder({ page })
      .withTags(wcagTags)
      .analyze();

    expect(violations).toEqual([]);
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`open mobile menu has no detectable accessibility violations (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();

    const { violations } = await new AxeBuilder({ page })
      .withTags(wcagTags)
      .analyze();

    expect(violations).toEqual([]);
  });
}
