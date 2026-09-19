import { expect, test, type Page } from "@playwright/test";

async function readJsonLdGraph(page: Page) {
  const json = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const parsed = JSON.parse(json ?? "") as {
    "@graph": { "@type": string }[];
  };
  return parsed["@graph"];
}

const pages = [
  { path: "/", type: "WebPage" },
  { path: "/about/", type: "ProfilePage" },
  { path: "/blog/", type: "CollectionPage" },
  { path: "/blog/tags/web/", type: "CollectionPage" },
  { path: "/projects/", type: "CollectionPage" },
  { path: "/blog/tags/", type: "CollectionPage" },
  { path: "/projects/tags/", type: "CollectionPage" },
  { path: "/blog/hello-world/", type: "WebPage" },
  { path: "/projects/sample-project/", type: "WebPage" },
];

test.describe("page metadata", () => {
  for (const { path, type } of pages) {
    test(`${path} has title, description, canonical and a JSON-LD graph`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(/.+/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.+/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://bastien.tanesie.fr${path}`,
      );
      const types = (await readJsonLdGraph(page)).map((node) => node["@type"]);
      expect(types).toEqual(
        expect.arrayContaining(["Person", "WebSite", type]),
      );
    });
  }

  test("a Post adds a BlogPosting node", async ({ page }) => {
    await page.goto("/blog/hello-world/");

    const types = (await readJsonLdGraph(page)).map((node) => node["@type"]);
    expect(types).toContain("BlogPosting");
  });

  test("a Project adds a CreativeWork node", async ({ page }) => {
    await page.goto("/projects/sample-project/");

    const types = (await readJsonLdGraph(page)).map((node) => node["@type"]);
    expect(types).toContain("CreativeWork");
  });

  test("the 404 page is noindex without JSON-LD or canonical", async ({
    page,
  }) => {
    await page.goto("/404.html");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test("pages advertise the RSS feed", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator('link[rel="alternate"][type="application/rss+xml"]'),
    ).toHaveAttribute("href", "/rss.xml");
  });
});

test.describe("generated files", () => {
  test("robots.txt allows crawling and points to the sitemap", async ({
    request,
  }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toContain("User-agent: *");
    expect(body).toContain(
      "Sitemap: https://bastien.tanesie.fr/sitemap-index.xml",
    );
  });

  test("sitemap lists published pages only", async ({ request }) => {
    const index = await (await request.get("/sitemap-index.xml")).text();
    expect(index).toContain("sitemap-0.xml");

    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    expect(sitemap).toContain("https://bastien.tanesie.fr/blog/hello-world/");
    expect(sitemap).not.toContain("unpublished-draft");
    expect(sitemap).not.toContain("unpublished-project");
    expect(sitemap).not.toContain("/404");
  });

  test("llms.txt describes the site and lists published content", async ({
    request,
  }) => {
    const body = await (await request.get("/llms.txt")).text();

    expect(body).toMatch(/^# Bastien Tanésie/);
    expect(body).toContain("https://bastien.tanesie.fr/blog/hello-world/");
    expect(body).toContain(
      "https://bastien.tanesie.fr/projects/sample-project/",
    );
    expect(body).not.toContain("unpublished");
  });

  test("humans.txt credits the author", async ({ request }) => {
    const body = await (await request.get("/humans.txt")).text();

    expect(body).toContain("Author: Bastien Tanésie");
  });

  test("RSS feed carries summaries of published Posts", async ({ request }) => {
    const response = await request.get("/rss.xml");
    const body = await response.text();

    expect(response.headers()["content-type"]).toContain("xml");
    expect(body).toContain("<title>Hello, world</title>");
    expect(body).toContain(
      "<description>A sample Post that exercises the Post pipeline.</description>",
    );
    expect(body).not.toContain("unpublished-draft");
    expect(body).not.toContain("content:encoded");
  });
});
