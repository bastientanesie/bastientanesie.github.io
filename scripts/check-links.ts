import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const DIST_DIR = "dist";
const SITE_ORIGIN = "https://bastien.tanesie.fr";
const EXTERNAL_TIMEOUT_MS = 15_000;
const EXTERNAL_CONCURRENCY = 8;
const REFERENCE_PATTERN =
  /<(?:a|img|script|link)\b[^>]*?\s(?:href|src)="([^"]*)"/g;
const ID_PATTERN = /\sid="([^"]*)"/g;
const IGNORED_SCHEMES = /^(?:mailto|tel|data|javascript):/;

interface Reference {
  page: string;
  target: string;
}

async function listHtmlPages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

function pagePath(file: string): string {
  const path = file.slice(DIST_DIR.length).replace(/index\.html$/, "");
  return path.replace(/\.html$/, "");
}

async function fileExists(path: string): Promise<boolean> {
  return stat(path).then(
    (info) => info.isFile(),
    () => false,
  );
}

async function resolveFile(pathname: string): Promise<string | undefined> {
  const decoded = decodeURIComponent(pathname);
  const candidates = decoded.endsWith("/")
    ? [join(DIST_DIR, decoded, "index.html")]
    : [
        join(DIST_DIR, decoded),
        join(DIST_DIR, `${decoded}.html`),
        join(DIST_DIR, decoded, "index.html"),
      ];
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }
  return undefined;
}

async function collectIds(file: string): Promise<Set<string>> {
  const html = await readFile(file, "utf8");
  return new Set([...html.matchAll(ID_PATTERN)].map((match) => match[1] ?? ""));
}

async function checkInternal(references: Reference[]): Promise<string[]> {
  const idsByFile = new Map<string, Set<string>>();
  const errors: string[] = [];
  for (const { page, target } of references) {
    const url = new URL(target, `${SITE_ORIGIN}${page}`);
    const file = await resolveFile(url.pathname);
    if (!file) {
      errors.push(`${page}: broken link ${target}`);
      continue;
    }
    if (!url.hash || !file.endsWith(".html")) continue;
    const ids = idsByFile.get(file) ?? (await collectIds(file));
    idsByFile.set(file, ids);
    if (!ids.has(decodeURIComponent(url.hash.slice(1)))) {
      errors.push(`${page}: missing anchor ${target}`);
    }
  }
  return errors;
}

async function checkExternalUrl(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    });
    return response.ok ? undefined : `${url}: HTTP ${String(response.status)}`;
  } catch (error) {
    return `${url}: ${error instanceof Error ? error.message : "request failed"}`;
  }
}

async function checkExternal(urls: string[]): Promise<string[]> {
  const queue = [...urls];
  const errors: string[] = [];
  const workers = Array.from({ length: EXTERNAL_CONCURRENCY }, async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const error = await checkExternalUrl(url);
      if (error) errors.push(error);
    }
  });
  await Promise.all(workers);
  return errors;
}

async function main(): Promise<void> {
  const external = process.argv.includes("--external");
  const internalReferences: Reference[] = [];
  const externalUrls = new Set<string>();

  for (const file of await listHtmlPages(DIST_DIR)) {
    const html = await readFile(file, "utf8");
    const page = pagePath(file);
    for (const match of html.matchAll(REFERENCE_PATTERN)) {
      const target = match[1] ?? "";
      if (!target || IGNORED_SCHEMES.test(target)) continue;
      const url = new URL(target, `${SITE_ORIGIN}${page}`);
      if (url.origin === SITE_ORIGIN) {
        internalReferences.push({ page, target });
      } else {
        externalUrls.add(url.href);
      }
    }
  }

  const errors = external
    ? await checkExternal([...externalUrls].sort())
    : await checkInternal(internalReferences);

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  const count = external ? externalUrls.size : internalReferences.length;
  console.log(
    `${String(count)} ${external ? "external" : "internal"} links OK`,
  );
}

await main();
