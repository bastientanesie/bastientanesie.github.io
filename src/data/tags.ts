export const postTags = {
  accessibility: "Accessibility",
  architecture: "Architecture",
  performance: "Performance",
  security: "Security",
  tooling: "Tooling",
  web: "Web",
  laravel: "Laravel",
  php: "PHP",
  ansible: "Ansible",
  devops: "DevOps",
  automation: "Automation",
} as const;

export type PostTag = keyof typeof postTags;

export const projectTechTags = {
  web: "Web",
  php: "PHP",
  mysql: "MySQL",
  jquery: "jQuery",
  "zend-framework-2": "Zend Framework 2",
  "hexagonal-architecture": "Hexagonal architecture",
} as const;

export type ProjectTechTag = keyof typeof projectTechTags;

export const projectSkillTags = {
  api: "API",
  architecture: "Architecture",
  backend: "Backend",
  devops: "DevOps",
  frontend: "Frontend",
  seo: "SEO",
  startup: "Startup",
} as const;

export type ProjectSkillTag = keyof typeof projectSkillTags;

export const projectTags: Record<ProjectTag, string> = {
  ...projectTechTags,
  ...projectSkillTags,
};

export type ProjectTag = ProjectTechTag | ProjectSkillTag;

export function tagKeys<Tag extends string>(
  tags: Record<Tag, string>,
): [Tag, ...Tag[]] {
  return Object.keys(tags) as [Tag, ...Tag[]];
}
