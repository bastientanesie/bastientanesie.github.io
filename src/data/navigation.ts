const draftPages = [{ label: "About", href: "/about/" }] as const;

export const navigation = [
  { label: "Home", href: "/" },
  ...(import.meta.env.DEV ? draftPages : []),
  { label: "How I work", href: "/how-i-work/" },
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
];
