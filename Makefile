export HOST_UID := $(shell id -u)
export HOST_GID := $(shell id -g)

COMPOSE := docker compose
NODE := $(COMPOSE) run --rm node

.DEFAULT_GOAL := help
.PHONY: help setup install dev build clean

help: ## List available targets
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

setup:
	@mkdir -p node_modules
	@$(COMPOSE) run --rm --user root node chown $(HOST_UID):$(HOST_GID) /app/node_modules

install: setup ## Install dependencies in the named volume
	$(NODE) npm install

dev: install ## Serve the site locally on http://localhost:4321
	$(COMPOSE) run --rm --service-ports node npm run dev

build: install ## Build the static site into dist/
	$(NODE) npm run build

clean: ## Remove containers, volumes and build output
	$(COMPOSE) down --volumes --remove-orphans
	rm -rf dist .astro
