import type { APIRoute, GetStaticPaths } from "astro";
import { ogImageResponse } from "../../../lib/og-image";
import { getPublishedPosts, type Post } from "../../../lib/posts";
import { SITE_NAME } from "../../../lib/seo";

export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = ({ props }) =>
  ogImageResponse({
    title: props.post.data.title,
    eyebrow: "Post",
    siteName: SITE_NAME,
  });
