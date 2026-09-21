#!/usr/bin/env bash
set -euo pipefail

command=$(jq -r '.tool_input.command // ""')

forbidden='npm|npx|node|pnpm|yarn|bun|bunx|playwright|vitest|astro|eslint|prettier|tsc'
pattern="(^|[;&|(]|&&|\|\|)[[:space:]]*([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]]+)*(${forbidden})([[:space:]]|$)"

if [[ "$command" =~ $pattern ]]; then
  cat >&2 <<MESSAGE
Commande refusée : les outils Node (npm, npx, node, pnpm, yarn, bun, playwright, vitest, etc.) ne doivent pas tourner sur l'hôte.
Utilise les cibles make (elles exécutent tout dans Docker) : make install, dev, build, test, test-unit, check, lint, format, format-check, links, lighthouse, audit.
Lance "make help" pour la liste complète.
MESSAGE
  exit 2
fi
