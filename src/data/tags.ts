export const postTags = [
  "accessibility",
  "architecture",
  "performance",
  "security",
  "tooling",
  "web",
] as const;

export type PostTag = (typeof postTags)[number];
