export interface Credit {
  name: string;
  href: string;
  description: string;
}

export interface CreditCategory {
  id: string;
  title: string;
  credits: readonly Credit[];
}

export const creditCategories: readonly CreditCategory[] = [
  {
    id: "special-thanks",
    title: "Special Thanks",
    credits: [
      {
        name: "Thibault Picard",
        href: "https://github.com/Geelik",
        description: "For his overall support and friendship",
      },
      {
        name: "Clément Thénard",
        href: "https://clement.thenard.fr",
        description: "For his UI/UX consulting and his sense of humour",
      },
    ],
  },
  {
    id: "frameworks-and-libraries",
    title: "Frameworks and libraries",
    credits: [
      {
        name: "Astro",
        href: "https://astro.build/",
        description: "Static site framework",
      },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com/",
        description: "Utility-first CSS framework",
      },
      {
        name: "TypeScript",
        href: "https://www.typescriptlang.org",
        description: "Typed JavaScript",
      },
      {
        name: "Alpine.js",
        href: "https://alpinejs.dev/",
        description: "Lightweight reactive behaviour",
      },
      {
        name: "Shiki",
        href: "https://shiki.style/",
        description: "Syntax highlighting",
      },
      {
        name: "Satori",
        href: "https://github.com/vercel/satori",
        description: "Open Graph image rendering",
      },
      {
        name: "Sharp",
        href: "https://sharp.pixelplumbing.com/",
        description: "Image processing",
      },
    ],
  },
  {
    id: "typefaces",
    title: "Typefaces",
    credits: [
      {
        name: "Inter",
        href: "https://rsms.me/inter/",
        description: "Typeface of the Open Graph images",
      },
      {
        name: "Fontsource",
        href: "https://fontsource.org/",
        description: "Self-hosted font packages",
      },
    ],
  },
  {
    id: "tooling",
    title: "Tooling",
    credits: [
      {
        name: "PhpStorm",
        href: "https://www.jetbrains.com/phpstorm/",
        description: "JetBrains IDE",
      },
      {
        name: "VSCode",
        href: "https://code.visualstudio.com/",
        description: "Code editor",
      },
      {
        name: "GitKraken",
        href: "https://www.gitkraken.com/",
        description: "Git client",
      },
      {
        name: "Claude Code",
        href: "https://claude.ai/code",
        description: "AI coding agent",
      },
    ],
  },
  {
    id: "workflow",
    title: "Workflow",
    credits: [
      {
        name: "Matt Pocock's skills",
        href: "https://github.com/mattpocock/skills",
        description:
          "Agent skills used to specify, implement and review the site",
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    credits: [
      {
        name: "GitHub Pages",
        href: "https://pages.github.com/",
        description: "Hosting",
      },
    ],
  },
];
