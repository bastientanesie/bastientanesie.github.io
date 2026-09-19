import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const pages = [
  { name: "home page", path: "/" },
  { name: "blog list", path: "/blog/" },
  { name: "Post page", path: "/blog/hello-world/" },
  { name: "projects list", path: "/projects/" },
  { name: "Project page", path: "/projects/sample-project/" },
  { name: "credits page", path: "/credits/" },
];

for (const { name, path } of pages) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${name} has no detectable accessibility violations (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);

      const { violations } = await new AxeBuilder({ page })
        .withTags(wcagTags)
        .analyze();

      expect(violations).toEqual([]);
    });
  }
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
