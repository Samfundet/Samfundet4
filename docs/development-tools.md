[**&larr; Back: Documentation Overview**](../README.md#documentation-overview)

# Development tools

Tooling that runs on your machine as part of the normal dev workflow, separate from the CI pipeline
(see [Pipelines](./technical/pipeline.md) for the checks CI itself runs).

## Git hooks (lefthook)

[`lefthook.yml`](../lefthook.yml) runs `ruff`, `biome` and `stylelint` on staged files before each
commit, auto-fixing what it can (CI still runs the check-only versions of the same tools as the
actual gate). It's installed automatically — backend-only via `uv sync` + `install.sh`, frontend via
`yarn install`.

Don't want it? Pick whichever fits:

- **Skip a single commit**: `git commit --no-verify`.
- **Turn it off for yourself, permanently, without touching the shared config**: copy
  [`lefthook-local.yml.example`](../lefthook-local.yml.example) to `lefthook-local.yml` (already
  gitignored) and set `pre-commit: skip: true`, or disable just one job. lefthook merges this file
  over `lefthook.yml` automatically.
- **Remove the git hook entirely**: `uv run lefthook uninstall`.
