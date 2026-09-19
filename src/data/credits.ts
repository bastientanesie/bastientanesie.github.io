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
