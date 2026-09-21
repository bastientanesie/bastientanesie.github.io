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
  { path: "/blog/", type: "CollectionPage" },
  { path: "/blog/tags/web/", type: "CollectionPage" },
  { path: "/projects/", type: "CollectionPage" },
  { path: "/blog/tags/", type: "CollectionPage" },
  { path: "/projects/tags/", type: "CollectionPage" },
  { path: "/blog/hello-world/", type: "WebPage" },
  { path: "/projects/sample-project/", type: "WebPage" },
];

test.describe("page titles", () => {
  test("suffix the site name on inner pages only in <title>", async ({
    page,
  }) => {
    await page.goto("/projects/sample-project/");

    await expect(page).toHaveTitle("Sample project | Bastien Tanésie");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Sample project",
    );
  });

  test("home leads with the site name and is not suffixed", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(
      "Bastien Tanésie — Laravel & PHP Web Developer",
    );
  });
});

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

test.describe("Open Graph images", () => {
  const cases = [
    { path: "/blog/hello-world/", image: "/og/blog/hello-world.png" },
    {
      path: "/projects/sample-project/",
      image: "/og/projects/sample-project.png",
    },
  ];

  for (const { path, image } of cases) {
    test(`${path} references its own generated image`, async ({
      page,
      request,
    }) => {
      await page.goto(path);

      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `https://bastien.tanesie.fr${image}`,
      );
      await expect(
        page.locator('meta[property="og:image:width"]'),
      ).toHaveAttribute("content", "1200");
      await expect(
        page.locator('meta[property="og:image:height"]'),
      ).toHaveAttribute("content", "630");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      const response = await request.get(image);
      expect(response.headers()["content-type"]).toBe("image/png");
    });
  }

  test("a Post is an article and other pages are websites", async ({
    page,
  }) => {
    await page.goto("/blog/hello-world/");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );

    await page.goto("/legal/");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
  });

  test("other pages reference the default image", async ({ page, request }) => {
    await page.goto("/legal/");

    const content = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(content).toMatch(
      /^https:\/\/bastien\.tanesie\.fr\/_astro\/.+\.png$/,
    );
    const path = new URL(content ?? "").pathname;
    const response = await request.get(path);
    expect(response.headers()["content-type"]).toBe("image/png");
  });
});
