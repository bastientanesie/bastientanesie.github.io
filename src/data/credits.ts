export interface Credit {
  name: string;
  href: string;
  description: string;
}

export interface CreditCategory {
  title: string;
  credits: readonly Credit[];
}

export const creditCategories: readonly CreditCategory[] = [
  {
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
    ],
  },
  {
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
