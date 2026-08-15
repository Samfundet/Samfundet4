## Dependabot Resolution Report — 2026-08-13

Filter: `#2247` (numeric → PR #2247 only)

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 0 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 1 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

### CI-Failed PRs — Needs Investigation

#### #2247 — ruff 0.15.18→0.16.2 (minor, backend, dev-only)

**Failure:** GitHub CI job "Verify backend" FAILED at the `Run ruff` step (run [31747181093](https://github.com/Samfundet/Samfundet4/actions/runs/31747181093)) — `Found 92 errors.` All 92 are `too-many-positional-arguments` (`PLR0917`). Ruff 0.16 promoted `PLR0917` out of preview to stable; because `backend/pyproject.toml:43` selects all `PL` (pylint) rules and `preview = true` is set (line 35), the rule now fires across the codebase.

**Bump type:** minor (0.15 → 0.16, 0.x rule: X changes)
**Risk:** None — ruff is a dev-only linter, never imported into production code
**Branch:** `dependabot/uv/backend/ruff-0.16.0` (note: branch name still says `0.16.0`, though the PR targets `0.16.2` — cosmetic only)
**Code impact:** 92 violations across 26 production/management files. The existing per-file-ignores for `PLR0917` only cover `test_*.py`, `signals.py`, `conftest.py` (`backend/pyproject.toml:99-101`), so the new violations are all outside those.

Violation breakdown (largest first):
- `samfundet/views.py` — 23
- `root/custom_classes/permission_classes.py` — 9
- `root/management/commands/seed_scripts/users_with_roles.py` — 8
- `samfundet/models/general.py` — 7
- `samfundet/serializers.py` — 5
- `root/management/commands/seed_scripts/recruitment_occupied_time.py` — 4
- `root/custom_classes/admin_classes.py` — 4
- `samfundet/utils.py` — 3
- `samfundet/infopages/serializers/admin.py` — 3
- `samfundet/infopages/admin.py` — 3
- `root/management/commands/seed_scripts/applicant_users.py` — 3
- `samfundet/view/general_views.py` — 2
- `root/management/commands/seed_scripts/roles.py` — 2
- `root/management/commands/seed_scripts/recruitment_position.py` — 2
- 12 more files with 1 violation each (incl. `samfundet/admin.py`, `samfundet/markdown.py`, `samfundet/backend.py`, `samfundet/routing/views.py`, `root/db_router.py`, …)

**Recommendation (user chose Option A):**
- Option A (minimal): add `"PLR0917"` to the global `ignore` list in `backend/pyproject.toml:82-95`, next to the existing `PLR0913`/`PLR0912`/`PLR0911` ignores. One-line change; consistent with how the project already handles the other `PLR09xx` complexity rules.
- Option B (code quality): fix the 92 call sites (e.g. make the offending parameters keyword-only with `*`, or pass them as a single config object). Assessed as a substantial refactor (92 signatures across 28 files, incl. Django URL-route call sites) — rejected.

Since ruff is dev-only, there is **no production runtime impact** either way — only the lint gate blocks the merge.

**UPDATE — Option A applied:** `"PLR0917"` added to the `ignore` list (commit `a0ba0c90`, pushed to `dependabot/uv/backend/ruff-0.16.0`). Local verification with ruff 0.16.2: `ruff check .` → All checks passed!; `ruff format --check .` → 152 files already formatted. GitHub CI re-run pending.

```
## Smoke test: ruff 0.15.18 → 0.16.2 (after lint fix)

**Changelog:** https://github.com/astral-sh/ruff/blob/main/CHANGELOG.md

**Config:** backend/pyproject.toml [tool.ruff] & [tool.ruff.lint] (preview = true, select all "PL")
**Production imports:** none — ruff ships only to the dev/test environment, no runtime impact.

**Manual checks:**
1. (If option A) Add "PLR0917" to ignore in backend/pyproject.toml, or (if option B) apply the keyword-only refactors and re-run the linter
2. Run `docker compose --env-file .env.example exec backend uv run ruff check .` — expect 0 errors
3. Run `docker compose --env-file .env.example exec backend uv run ruff format --check .` — expect "would reformat: 0 files"
4. Confirm the remainder of the pipeline still passes locally: `uv run ./run-pipeline.sh` (migrations, pytest, mypy)
5. Confirm the "Verify backend" and "Verify docker" GitHub checks are green on the final branch state before merging
```

### Action for User
1. Wait for GitHub CI (`Verify backend`/`Verify docker`) to finish on the fixed branch `a0ba0c90` — ruff step should now pass
2. Run the smoke-test guide checks above
3. When CI is green, approve with: `gh pr review 2247 --approve`, then merge manually