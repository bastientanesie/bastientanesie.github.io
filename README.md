# Bastien Tanésie's personal site

A technical showcase made of a blog and a portfolio of past projects: <https://bastien.tanesie.fr>. Built with Astro and Tailwind, statically generated, deployed to GitHub Pages, no tracking.

## Requirements

Docker with Compose, and `make`. Nothing else is installed on the host.

## Commands

Run `make help` for the full list. The main targets:

| Target                    | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `make dev`                | Serve the site on <http://localhost:4321>                |
| `make check`, `make lint` | Type-check and lint                                      |
| `make format`             | Format with Prettier (`make format-check` only verifies) |
| `make build`              | Build the static site into `dist/`                       |
| `make test`               | Run Playwright and axe against the build                 |
| `make links`              | Verify internal links                                    |
| `make lighthouse`         | Check the Lighthouse budgets                             |
| `make icons`              | Regenerate the PNG icons from `public/favicon.svg`       |

CI runs the same `make` targets. See [docs/deployment.md](docs/deployment.md) for deployment, the CSP and the guardrails.

## Icons

`public/favicon.svg` is the single source of the site icons: a neutral monogram that is a placeholder meant to be replaced (tracked in #14). Edit it, then run `make icons` to regenerate the committed PNGs (`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`). The web manifest is served by `src/pages/manifest.webmanifest.ts`; there is no service worker.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The code is under the [MIT license](LICENSE). The content is under [CC BY-NC 4.0](LICENSE-CONTENT). Third-party agent skills keep their own license (see [`.agents/NOTICE.md`](.agents/NOTICE.md)).
