export HOST_UID := $(shell id -u)
export HOST_GID := $(shell id -g)

COMPOSE := docker compose
NODE := $(COMPOSE) run --rm node
INSTALL_STAMP := .make/installed

.DEFAULT_GOAL := help
.PHONY: help install dev build check lint format clean

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

build: install ## Build the static site into dist/
	$(NODE) npm run build

check: install ## Type-check the project with astro check
	$(NODE) npm run check

lint: install ## Lint with ESLint (no warnings allowed)
	$(NODE) npm run lint

format: install ## Format the code with Prettier
	$(NODE) npm run format

clean: ## Remove containers, volumes and build output
	$(COMPOSE) down --volumes --remove-orphans
	rm -rf dist .astro .make node_modules
