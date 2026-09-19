export HOST_UID := $(shell id -u)
export HOST_GID := $(shell id -g)

COMPOSE := docker compose
NODE := $(COMPOSE) run --rm node
PLAYWRIGHT := $(COMPOSE) run --rm playwright
INSTALL_STAMP := .make/installed
PLAYWRIGHT_INSTALL_STAMP := .make/installed-playwright

.DEFAULT_GOAL := help
.PHONY: help install dev build test check lint format format-check clean

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

test: build $(PLAYWRIGHT_INSTALL_STAMP) ## Serve the build and run Playwright + axe
	$(PLAYWRIGHT) npx playwright test

check: install ## Type-check the project with astro check
	$(NODE) npm run check

lint: install ## Lint with ESLint (no warnings allowed)
	$(NODE) npm run lint

format: install ## Format the code with Prettier
	$(NODE) npm run format

format-check: install ## Verify formatting with Prettier
	$(NODE) npm run format:check

clean: ## Remove containers, volumes and build output
	$(COMPOSE) down --volumes --remove-orphans
	rm -rf dist .astro .make node_modules
