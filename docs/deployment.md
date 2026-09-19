# Deployment

The site is built and deployed by `.github/workflows/ci.yaml`: one job per `make` target (`check`, `lint`, `format-check`, `build`), then a `deploy` job that publishes the `dist/` artifact to GitHub Pages. `deploy` only runs on pushes to the repository's default branch.

## GitHub settings

- **Settings → Pages → Source**: `GitHub Actions`.
- **Settings → Pages → Custom domain**: `bastien.tanesie.fr` (no `CNAME` file needed with the Actions source). Enforce HTTPS once the certificate is issued.

## DNS

DNS for `tanesie.fr` is managed on Cloudflare. Add a `CNAME` record `bastien` pointing to `bastientanesie.github.io`, with the proxy **disabled** (grey cloud, "DNS only"). If proxied, GitHub cannot validate the domain or issue the HTTPS certificate. `bastientanesie.github.io` then redirects to the custom domain automatically.

## Workflow conventions

- Actions are pinned by commit SHA (version in a trailing comment).
- Workflow permissions default to none; each job declares the minimum it needs.
- The npm cache is a directory (`NPM_CACHE_DIR`, `/tmp/npm-cache` in CI) mounted into the container at `/npm-cache` and restored with `actions/cache`.

## Default branch

The `deploy` job only fires on the repository's default branch, and `push` runs are limited to `astro` and `main`. Until `astro` is promoted to `main` and set as default (after `master` is renamed to `legacy`), nothing is deployed.
