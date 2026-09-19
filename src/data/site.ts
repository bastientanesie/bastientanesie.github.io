export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "How I work", href: "/how-i-work/" },
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
] as const;

export const profiles = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bastientanesie/" },
  { label: "Bluesky", href: "https://bsky.app/profile/bastien.tanesie.fr" },
  { label: "GitHub", href: "https://github.com/bastientanesie" },
] as const;

export const licenses = [
  {
    label: "Code: MIT",
    href: "https://opensource.org/license/mit",
  },
  {
    label: "Content: CC BY-NC 4.0",
    href: "https://creativecommons.org/licenses/by-nc/4.0/",
  },
] as const;

export const themeColors = { light: "#ffffff", dark: "#0f1115" } as const;
