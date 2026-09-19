# blog

## Icons

`public/favicon.svg` is the single source of the site icons: a neutral monogram that is a placeholder meant to be replaced (tracked in #14). Edit it, then run `make icons` to regenerate the committed PNGs (`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`). The web manifest is served by `src/pages/manifest.webmanifest.ts`; there is no service worker.
