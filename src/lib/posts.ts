import { getCollection, type CollectionEntry } from "astro:content";
import type { PostTag } from "../data/tags";

const WORDS_PER_MINUTE = 200;
const CODE_FENCE = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function readingTimeMinutes(post: Post): number {
  const prose = (post.body ?? "").replace(CODE_FENCE, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function postTagsOf({ data }: Post): PostTag[] {
  return data.tags;
}
