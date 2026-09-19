import { getCollection, type CollectionEntry } from "astro:content";

const WORDS_PER_MINUTE = 200;
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  for (const { id } of posts) {
    if (!KEBAB_CASE.test(id)) {
      throw new Error(`Post folder "${id}" must be kebab-case`);
    }
  }
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function readingTimeMinutes(body: string | undefined): number {
  const words = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
