export const postTags = [
  "accessibility",
  "architecture",
  "performance",
  "security",
  "tooling",
  "web",
] as const;

export type PostTag = (typeof postTags)[number];

export const projectTags = ["backend", "devops", "frontend", "web"] as const;

export type ProjectTag = (typeof projectTags)[number];
