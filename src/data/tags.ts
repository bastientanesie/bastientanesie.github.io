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
  "node-js": "Node.js",
  mysql: "MySQL",
  couchdb: "CouchDB",
  jquery: "jQuery",
  "vue-js": "Vue.js",
  "laravel-php": "Laravel",
  "tailwind-css": "Tailwind",
  "ember-js": "Ember.js",
  "zend-framework-1": "Zend Framework 1",
  "zend-framework-2": "Zend Framework 2",
  "zend-framework-3": "Zend Framework 3",
  "hexagonal-architecture": "Hexagonal architecture",
  "bootstrap-css": "Bootstrap CSS",
  webpack: "Webpack",
  docker: "Docker",
  "gitlab-ci": "GitLab CI",
  deployer: "Deployer",
  playwright: "Playwright",
  renovate: "Renovate",
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
  legacy: "Legacy Codebase",
  "r-d": "R&D",
  "team-lead": "Team Leading",
  "project-management": "Project Management",
  specifications: "Specifications",
  "solo-delivery": "Solo Delivery",
  "public-tender": "Public Tender",
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
