# Contributing

Issues and pull requests are welcome. The site content and the source code are written in English.

## Setup

Docker with Compose and `make` are the only requirements. Run `make dev` to start, and `make check lint format-check test` before opening a pull request: CI runs the same targets.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `refactor:`, `chore:`. No tooling enforces it.

## Pull requests

- Keep them short and target `main`.
- Give the pull request a Conventional Commit title. Only squash merge is used, so the title becomes the commit message.
- Reference the issue it resolves with `Closes #N` in the description.
- Keep the `Co-Authored-By` trailer when an agent contributed.
- CI must be green: it is the safety net.

## Content

A Post or a Project is a folder in `src/content/` whose name (kebab-case) is its `id`. Schemas are validated at build time. Credit any third-party visual, tool or library in `src/data/credits.ts`.

## Working method

The way issues are specified, implemented and reviewed is described in [docs/workflow.md](docs/workflow.md).

## License

By contributing, you agree that your code is licensed under [MIT](LICENSE) and your content under [CC BY-NC 4.0](LICENSE-CONTENT).
