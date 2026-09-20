const draftPages = [
  { label: "About", href: "/about/" },
  { label: "How I work", href: "/how-i-work/" },
] as const;

export const navigation = [
  { label: "Home", href: "/" },
  ...(import.meta.env.DEV ? draftPages : []),
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
];
