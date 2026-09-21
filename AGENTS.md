## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`bastientanesie/bastientanesie.github.io`, via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the root. See `docs/agents/domain.md`.

## Commands

Never run `npm`, `npx`, `node`, `pnpm`, `yarn`, `bun`, `playwright`, `vitest`, etc. on the host: a `PreToolUse` hook blocks them. Everything goes through `make` (executed in Docker):

- `make install`, `make dev`, `make build`, `make clean`
- `make test` (Playwright + axe), `make test-unit` (Vitest)
- `make check`, `make lint`, `make format`, `make format-check`
- `make links`, `make lighthouse`, `make audit`, `make icons`

`make help` lists all targets.
