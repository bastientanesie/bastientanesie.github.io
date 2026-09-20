# Workflow

Work is driven by GitHub issues and agent skills. Issues are tracked as described in `docs/agents/issue-tracker.md`, with the labels of `docs/agents/triage-labels.md`.

## Method

1. **Specify**: an idea is stress-tested (`grill-me`, `grill-with-docs`), written as a spec issue (`to-spec`), then split into vertical tickets with their blockers (`to-tickets`).
2. **Triage**: `triage` moves an issue through the labels until it is `ready-for-agent` or `ready-for-human`.
3. **Implement**: `implement` builds a ticket on a branch, test-first where a test seam exists (`tdd`), then reviews the result (`code-review`).
4. **Merge**: a short pull request to `main`, squash merged, CI green.

Domain vocabulary lives in `CONTEXT.md` and decisions in `docs/adr/` (`domain-modeling`).

## Git

Branch from `main`, one branch per ticket. Commit and pull request conventions are in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Skills

The skills are installed from [mattpocock/skills](https://github.com/mattpocock/skills) with `npx skills` (MIT). They live in `.agents/skills/`, exposed to Claude Code through symlinks in `.claude/skills/`, and are pinned in `skills-lock.json`. Their license notice is in `.agents/NOTICE.md` and they are listed in the site's Credits.
