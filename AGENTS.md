# AGENTS.md

Instructions for AI coding agents working in this repository. This file
documents facts about the **Samfundet4** codebase and how it's worked with —
tooling, workflows, conventions. It does not document any individual
contributor's personal preferences; if something is one person's habit
rather than a repo convention, it does not belong here.

## Tech stack

Samfundet4 is a Django + React monorepo (`backend/`, `frontend/`) served
together — see `docs/technical/django_serving_react.md`.

**Backend** (`backend/`):
- Python 3.11, Django 5.2, Django REST Framework.
- Dependency/env management: `uv` — use the aliases in `backend/aliases.sh`
  (e.g. `uv-run-ruff-check`) rather than calling `uv run ...` directly.
- Lint/format: `ruff`. Types: `mypy`. Tests: `pytest`.
- Three Postgres databases, routed via `backend/root/db_router.py`:
  - default — main app models.
  - `billig` — the Billig payment/ticketing system; see
    `docs/technical/backend/billig.md`.
  - `mdb` — member info (`MedlemsInfo`).

**Frontend** (`frontend/`):
- React 18 + TypeScript, built with Vite.
- Package manager: Yarn Berry (pinned via `packageManager` in
  `package.json`) — don't use npm or pnpm.
- Lint/format: Biome. CSS/SCSS lint: Stylelint. Types: `tsc`.
- Forms/validation: `react-hook-form` + `zod`.
- Data fetching/state: TanStack Query — see
  `docs/technical/frontend/data-fetching.md`.
- i18n: `i18next`.
- Component workshop: Storybook.
- E2E tests: Cypress — see `docs/technical/frontend/cypress.md`. Not
  currently run in CI (see Continuous integration).

**Local dev**: `docker-compose.yml` orchestrates the backend, frontend,
storybook, and the three Postgres databases together.

See `docs/technical/frontend/components.md` and
`docs/technical/frontend/forms.md` for frontend conventions beyond the
stack itself.

## DevOps platforms

This repo's work is split across two platforms:

- **GitHub** (`Samfundet/Samfundet4`) — source hosting, pull requests, code
  review, CI, and releases. Use the `gh` CLI for repo/PR/remote operations
  (`gh pr create`, `gh pr view`, `gh issue view`, `gh repo view`, etc.)
  rather than raw `git` pushes to remotes or manual API calls.
- **Linear** — issue and work-item tracking. Feature work, bugs, and tasks
  are tracked as Linear issues, not GitHub Issues. Branch names generated
  from Linear (e.g. `erikhoff00/web-140-...`) reference their Linear issue
  ID (`WEB-140`) — use that ID to look up the originating issue for context
  on a branch's intent when it isn't obvious from the diff alone.

When a task involves "the issue", "the ticket", or "the work item", it
refers to Linear, not the GitHub Issues tab. When it involves "the PR" or
"the review", that's GitHub.

## Continuous integration

CI (`.github/workflows/verify.yml`) enforces these checks on every PR.
The following are cheap enough to run after every change and should be
run proactively while working, not just left to CI:

- `uv-run-ruff-check` — backend lint (see `backend/aliases.sh`)
- `uv-run-ruff-format-check` — backend format check
- `yarn biome:check` — frontend lint + format check
- `yarn stylelint:check` — frontend CSS/SCSS lint

## Maintaining this file

- Scope: only add facts that are true of the codebase or its workflows for
  anyone working in it — architecture, conventions, required tooling,
  build/test/deploy steps, platform integrations. Do not add personal
  editor setups, individual workflow preferences, or anything scoped to one
  contributor.
- Verify before writing: confirm a claim against the actual repo (config
  files, scripts, CI workflows) rather than from memory or assumption. A
  wrong instruction here is worse than no instruction.
- Keep it current: when a change in the same PR makes an existing entry
  stale or wrong, update or remove that entry as part of the change — don't
  leave AGENTS.md to drift from the code it describes.
- Keep entries concise and imperative ("Use X for Y") over narrative.
  Prefer linking to a canonical source (a script, a config file, a doc in
  `docs/`) over duplicating detail that will need to be kept in sync in two
  places.
