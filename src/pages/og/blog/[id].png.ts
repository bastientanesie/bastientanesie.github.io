import type { APIRoute, GetStaticPaths } from "astro";
import { renderOgImage } from "../../../lib/og-image";
import { getPublishedPosts, type Post } from "../../../lib/posts";
import { SITE_NAME } from "../../../lib/seo";

export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props }) => {
  const image = await renderOgImage({
    title: props.post.data.title,
    eyebrow: "Blog",
    siteName: SITE_NAME,
  });
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};
