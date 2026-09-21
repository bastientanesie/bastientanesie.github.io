export HOST_UID := $(shell id -u)
export HOST_GID := $(shell id -g)

COMPOSE := docker compose
NODE := $(COMPOSE) run --rm node
PLAYWRIGHT := $(COMPOSE) run --rm playwright
TEST_CONTENT_DIR := ./tests/fixtures/content
INSTALL_STAMP := .make/installed
PLAYWRIGHT_INSTALL_STAMP := .make/installed-playwright

.DEFAULT_GOAL := help
.PHONY: help install dev build test test-unit links links-external lighthouse audit check lint format format-check icons clean

help: ## List available targets
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

install: $(INSTALL_STAMP) ## Install dependencies in the named volume

$(INSTALL_STAMP): package.json package-lock.json
	@mkdir -p $(dir $@) node_modules
	$(COMPOSE) run --rm --user root node chown $(HOST_UID):$(HOST_GID) /app/node_modules /npm-cache
	$(NODE) npm ci
	@touch $@

dev: install ## Serve the site locally on http://localhost:4321
	$(COMPOSE) run --rm --service-ports node npm run dev

build: install ## Regenerate the default Open Graph image, then build the static site into dist/
	$(NODE) npm run og:default
	$(NODE) npm run build

$(PLAYWRIGHT_INSTALL_STAMP): package.json package-lock.json
	@mkdir -p $(dir $@)
	$(COMPOSE) run --rm --user root playwright chown $(HOST_UID):$(HOST_GID) /app/node_modules /npm-cache
	$(PLAYWRIGHT) npm ci
	@touch $@

test: install $(PLAYWRIGHT_INSTALL_STAMP) ## Build with the test fixtures, serve it and run Playwright + axe
	$(NODE) npm run og:default
	$(COMPOSE) run --rm -e CONTENT_DIR=$(TEST_CONTENT_DIR) node npm run build
	$(PLAYWRIGHT) npx playwright test

test-unit: install ## Run the Vitest unit tests
	$(NODE) npm run test:unit

links: build ## Verify internal links and anchors in the built site
	$(NODE) node scripts/check-links.ts

links-external: build ## Verify external links in the built site (informational)
	$(NODE) node scripts/check-links.ts --external

lighthouse: build $(PLAYWRIGHT_INSTALL_STAMP) ## Run Lighthouse CI against the budgets in lighthouserc.json
	$(PLAYWRIGHT) sh -c 'CHROME_PATH=$$(node -p "require(\"@playwright/test\").chromium.executablePath()") npx lhci autorun'

audit: install ## Report known vulnerabilities in dependencies (informational)
	$(NODE) npm audit

check: install ## Type-check the project with astro check
	$(NODE) npm run check

lint: install ## Lint with ESLint (no warnings allowed)
	$(NODE) npm run lint

format: install ## Format the code with Prettier
	$(NODE) npm run format

format-check: install ## Verify formatting with Prettier
	$(NODE) npm run format:check

icons: install ## Regenerate the committed PNG icons from public/favicon.svg
	$(NODE) npm run icons

clean: ## Remove containers, volumes and build output
	$(COMPOSE) down --volumes --remove-orphans
	rm -rf dist .astro .make node_modules
