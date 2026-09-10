[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Development tools

Tooling that runs on your machine as part of the normal dev workflow, separate from the CI pipeline
(see [Pipelines](./technical/pipeline.md) for the checks CI itself runs).

## Git hooks (lefthook)

[`lefthook.yml`](../lefthook.yml) runs `ruff`, `biome` and `stylelint` on staged files before each
commit, auto-fixing what it can (CI still runs the check-only versions of the same tools as the
actual gate).

It's opt-in — nothing runs until you register the hook for your own clone:

- **Backend-only**: `uv run lefthook install` (or the `uv-run-lefthook-install` alias).
- **Frontend**: `yarn hooks:install` (from `frontend/`).

`install.sh` also offers to do this for you during setup.

Installed it and want to change your mind?

- **Skip a single commit**: `git commit --no-verify`.
- **Turn off one job (or all of them) without touching the shared config**: copy
  [`lefthook-local.yml.example`](../lefthook-local.yml.example) to `lefthook-local.yml` (already
  gitignored) and set `pre-commit: skip: true`, or disable just one job. lefthook merges this file
  over `lefthook.yml` automatically.
- **Remove the git hook entirely**: `uv run lefthook uninstall`.
