# Deployment

The site is built and deployed by `.github/workflows/ci.yaml`: one job per `make` target (`check`, `lint`, `format-check`, `build`, `test`), then a `deploy` job that publishes the `dist/` artifact to GitHub Pages. `deploy` only runs on pushes to the repository's default branch.

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

The `deploy` job only fires on the repository's default branch (`main`), and `push` runs are limited to it. Pull requests run every job except `deploy`.

## Content Security Policy

GitHub Pages cannot set custom HTTP headers, so the CSP is delivered as a `<meta http-equiv="content-security-policy">` tag, generated at build time by Astro (`security.csp` in `astro.config.mjs`). Inline scripts and styles are allowed by SHA-256 hash, never by `'unsafe-inline'` for scripts or `<style>` elements. Alpine runs from `@alpinejs/csp`, so no `'unsafe-eval'` is needed. `tests/csp.spec.ts` checks every page for the policy and for violations.

Known limits of the `<meta>` delivery on Pages:

- `frame-ancestors`, `report-uri` and `sandbox` are ignored in a `<meta>` tag, so clickjacking protection and violation reporting are unavailable.
- The policy applies only once the parser reaches the tag; it protects nothing before it in `<head>`, and it does not cover non-HTML responses (RSS, `humans.txt`, images).
- Other security headers (`X-Content-Type-Options`, `Referrer-Policy`, HSTS beyond what Pages sets) cannot be configured.
- Any new inline script or style must go through Astro so that its hash is added to the policy at build time.
- Shiki writes `style` attributes on code blocks, which hashes cannot cover, so `style-src-attr 'unsafe-inline'` is allowed. Style attributes cannot run script; `script-src` stays hash-only.
