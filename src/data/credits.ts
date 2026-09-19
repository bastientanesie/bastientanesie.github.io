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
