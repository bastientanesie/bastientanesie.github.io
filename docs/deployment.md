# Deployment

The site is built and deployed by `.github/workflows/ci.yaml`: one job per `make` target (`check`, `lint`, `format-check`, `build`, `test`, `links`, `lighthouse`, `audit`), then a `deploy` job that publishes the `dist/` artifact to GitHub Pages. `links` and `lighthouse` block the deploy; `audit` is informational (`continue-on-error`). `deploy` only runs on pushes to the repository's default branch.

## GitHub settings

- **Settings → Pages → Source**: `GitHub Actions`.
- **Settings → Pages → Custom domain**: `bastien.tanesie.fr` (no `CNAME` file needed with the Actions source). Enforce HTTPS once the certificate is issued.
- **Settings → General → Pull Requests**: allow squash merging only, default the commit message to the pull request title and description, and delete head branches after merge.

## DNS

`tanesie.fr` is registered at OVH, whose nameservers point to Cloudflare, so DNS records are managed on Cloudflare, not at the registrar. Add a `CNAME` record `bastien` pointing to `bastientanesie.github.io`, with the proxy **disabled** (grey cloud, "DNS only"). If proxied, GitHub cannot validate the domain or issue the HTTPS certificate. `bastientanesie.github.io` then redirects to the custom domain automatically, because this repository is the user site (`bastientanesie/bastientanesie.github.io`). Once the record is in place, `dig bastien.tanesie.fr CNAME` should return `bastientanesie.github.io`, and Settings → Pages shows the DNS check as successful.

## Workflow conventions

- Actions are pinned by commit SHA (version in a trailing comment).
- Workflow permissions default to none; each job declares the minimum it needs.
- Every job has a `timeout-minutes` (10, 15 for Lighthouse) so a hung job fails instead of running for the default six hours.
- The npm cache is a directory (`NPM_CACHE_DIR`, `/tmp/npm-cache` in CI) mounted into the container at `/npm-cache` and restored with `actions/cache`.

## Quality guardrails

- `make links` checks internal links and anchors in `dist/`. It blocks CI.
- `make lighthouse` runs Lighthouse CI (mobile, 3 runs, median) on the home page, a Post, a Project and a tag index, against the budgets in `lighthouserc.json`: performance ≥ 0.95, accessibility, best practices and SEO = 1, LCP ≤ 2 s, CLS ≤ 0.05, TBT ≤ 100 ms, JS ≤ 50 kB, CSS ≤ 30 kB. `dist/` is served by `serve`, which gzips responses like GitHub Pages does, so the JS and CSS budgets apply to compressed transfer sizes (measured: JS ≈ 24 kB, CSS ≈ 5 kB). It blocks CI.
- `make audit` (`npm audit`) is informational.
- `.github/workflows/external-links.yaml` checks external links every Monday (`make links-external`) and opens an issue when one is broken.
- `.github/dependabot.yml` opens weekly grouped updates for npm, Docker and GitHub Actions. There is no automerge: CI gates each PR.

## Default branch

The former site is archived on the `legacy` branch, which is not served. The `deploy` job only fires on the repository's default branch (`main`), and `push` runs are limited to it. Pull requests run every job except `deploy`.

## Content Security Policy

GitHub Pages cannot set custom HTTP headers, so the CSP is delivered as a `<meta http-equiv="content-security-policy">` tag, generated at build time by Astro (`security.csp` in `astro.config.mjs`). Inline scripts and styles are allowed by SHA-256 hash, never by `'unsafe-inline'` for scripts or `<style>` elements. Alpine runs from `@alpinejs/csp`, so no `'unsafe-eval'` is needed. `tests/csp.spec.ts` checks every page for the policy and for violations.

Known limits of the `<meta>` delivery on Pages:

- `frame-ancestors`, `report-uri` and `sandbox` are ignored in a `<meta>` tag, so clickjacking protection and violation reporting are unavailable.
- The policy applies only once the parser reaches the tag; it protects nothing before it in `<head>`, and it does not cover non-HTML responses (RSS, `humans.txt`, images).
- Other security headers (`X-Content-Type-Options`, `Referrer-Policy`, HSTS beyond what Pages sets) cannot be configured.
- Any new inline script or style must go through Astro so that its hash is added to the policy at build time.
- Shiki writes `style` attributes on code blocks, which hashes cannot cover, so `style-src-attr 'unsafe-inline'` is allowed. Style attributes cannot run script; `script-src` stays hash-only.
