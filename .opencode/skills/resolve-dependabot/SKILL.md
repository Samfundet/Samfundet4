---
name: resolve-dependabot
description: Resolve dependabot pull requests by running docker pipeline, analyzing production code impact, and generating per-dependency smoke-test guides. No auto-merge — the user makes the final call.
---

## Purpose

Resolve dependabot PRs systematically. For every PR:
1. Check out the branch
2. Run the full pipeline in Docker
3. Analyze which production code uses the dependency
4. Detect superseded PRs (same package, two PRs open)
5. Generate a per-dependency smoke-test guide
6. Produce an aggregated report

**Never auto-merge.** The user does the final smoke test and merge.

## Prerequisites

- `gh` CLI authenticated with write access to the repo — run `gh auth status` then `gh api repos/Samfundet/Samfundet4 --jq .full_name` to confirm (must NOT return 403)
- Docker running (`docker info`)
- Root `.env` exists — if missing, create it from `.env.example` before starting Docker. This provides PYTHONPATH and compose variable interpolation.
- `backend/.docker.env` and `frontend/.env.docker` must also exist

## Filtering PRs

User can request: `all`, `frontend`, `backend`, or specific PR numbers.
The command passes `$ARGUMENTS` — parse it:

- `all` or empty → all open dependabot PRs
- `frontend` → filter to label `frontend`
- `backend` → filter to label `backend`
- numeric → specific PR numbers (space separated)

List PRs:
```bash
gh pr list --app dependabot --limit 100 --json number,title,headRefName,baseRefName,labels,createdAt --jq '.[] | {number, title, headRefName, labels: [.labels[].name]}'
```

Parse each title with regex `Bump (?<package>.+) from (?<from>.+) to (?<to>.+) in /(?<ecosystem>.+)`.

Classify the bump type by comparing semantic versions:
- **patch**: Z changes (1.2.3 → 1.2.5)
- **minor**: Y changes (1.2.3 → 1.3.0); also 0.x bumps where X changes (0.15 → 0.16)
- **major**: X changes (1.2.3 → 2.0.0)
- **unknown**: can't parse version

## Detection: Superseded PRs

Before processing, detect same-package conflicts. Group PRs by package name. If two PRs bump the same package, the one targeting the **lower** version is superseded.

Close superseded PRs:
```bash
gh pr close <SUPERSEDED_NUMBER> --comment "Superseded by #<NEWER_NUMBER>"
```

If the newer PR also hasn't been processed yet, it gets processed as normal.

## Per-PR Workflow

For each PR (skipping superseded ones):

### 1. Fetch PR details
```bash
gh pr view <NUMBER> --json number,title,headRefName,body,statusCheckRollup,mergeable,reviews,labels
```

### 2. Check GitHub CI status
Parse `statusCheckRollup`. The three CI jobs are: `Verify backend`, `Verify docker`, `Verify frontend`.

If CI already **failed** on GitHub, skip the local docker run and flag as "CI FAILED" in the report.
If CI is **pending**, note it but still run local docker.
If CI **passed**, proceed normally.

### 3. Check out the branch
```bash
gh pr checkout <NUMBER>
```

### 4. Run pipeline in Docker

**Always tear down first** to ensure a clean state:
```bash
docker compose --env-file .env.example down
```

Then bring up the services for the target ecosystem.

**If the PR targets /frontend (label `frontend`):**
```bash
docker compose --env-file .env.example build frontend
docker compose --env-file .env.example up frontend -d
```
Wait for the container to be healthy, then run:
```bash
docker compose --env-file .env.example exec frontend yarn verify
```
This runs: biome check + tsc check + stylelint check.

**If the PR targets /backend (label `backend`):**
```bash
docker compose --env-file .env.example build backend
docker compose --env-file .env.example up backend sm4_dev_database billig_dev_database mdb_dev -d
```
Wait for databases to be healthy, then:
```bash
docker compose --env-file .env.example exec backend uv run ./run-pipeline.sh
```
This runs: ruff format check + migration verification + pytest + mypy.

Capture all output. Record PASS/FAIL per step.

### 5. Analyze production code impact

Search for imports and usages of the bumped package in production source code.

**For frontend packages:**
```bash
rg -n "<package-name>" frontend/src/ --type ts --type tsx --no-ignore
```
Also check for re-exported or wrapped usage.

**For backend packages:**
```bash
rg -n "from <module>|import <module>" backend/samfundet/ --type py --no-ignore
```

Map every match to: `file:line`.
Record the count of touched files.

**For transitive dependencies** (packages that are not in `package.json` dependencies but appear in `yarn.lock`):
Find which direct dependency pulled it in:
```bash
grep -B 10 "\"<package>@npm:" frontend/yarn.lock | grep -E "^\".+@npm:" | head -1
```
Include this parent → child mapping in the report.

### 6. Classify risk

| Bump type | Production code usage | Risk |
|-----------|----------------------|------|
| Dev-only dep (not imported in src/) | None | None |
| Patch | Any | Low |
| Minor | Any | Medium |
| Major | Any | High |
| Any | 0 files touched | Low |

Dev-only dependencies (ruff, mypy, stylelint, biome, knip, typescript, cypress, vite, autoprefixer, postcss-scss, sass, tsx) get rated **None** — they don't ship to production — but the pipeline still confirms compatibility.

### 7. Generate smoke-test guide

For each dependency, produce a targeted Markdown checklist. The checklist is specific to what the dependency does and which files it touches.

**Formula for generating the guide:**
- Derive a changelog/release URL from the package name (e.g., `https://github.com/django/django/blob/stable/5.2.x/docs/releases/5.2.16.txt`)
- List every file that imports/uses the dependency, grouped by feature area
- For each feature area, describe what the user should manually verify
- For major bumps, also search for deprecation/breaking change notes

**Example smoke-test guide (django patch bump):**
```
## Smoke test: django 5.2.15 → 5.2.16

**Changelog:** https://docs.djangoproject.com/en/5.2/releases/5.2.16/

**Touched files (47):**
- Admin: samfundet/admin.py, samfundet/home/admin.py, ...
- Models: samfundet/models/general.py, samfundet/models/event.py, ...
- Views: samfundet/views.py, samfundet/home/views.py, ...
- Forms: samfundet/forms.py, ...
- Tests: samfundet/tests/test_*.py (20 files)

**Manual checks:**
1. Load admin panel at http://localhost:8000/admin/ — verify all model lists render
2. Create/edit a Venue via admin — verify form saves without errors
3. Visit a public page that renders model data (e.g. events list)
4. Submit any form — verify CSRF + validation works
5. Run a management command: `docker compose exec backend python manage.py check`
```

**Example smoke-test guide (vite-plugin-svgr major bump):**
```
## Smoke test: vite-plugin-svgr 4.5.0 → 5.2.0

**Changelog:** https://github.com/pd4d10/vite-plugin-svgr/releases

**Touched files (12):**
- Icons: src/components/Icons.tsx:3, src/components/SvgIcon.tsx:7
- Pages: src/pages/HomePage.tsx:15, src/pages/AboutPage.tsx:8
- Components: src/components/Header.tsx:22, ...

**Manual checks:**
1. Visit every page that imports SVGs — verify all icons render without broken images
2. Check dark/light mode SVG rendering if any icons use theme colors
3. Run `yarn build` — confirm SVGs are bundled correctly in production build
4. Inspect browser console for SVG-related warnings
```

### 8. Docker teardown
```bash
docker compose --env-file .env.example down
```
Teardown after each ecosystem batch is complete. Process all backend PRs together (checkout → pipeline → analyze each in sequence), then teardown backend containers. Then do the same for frontend PRs.

### 9. Aggregate final report

After processing all PRs, write the markdown report to `docs/dependabot-report/dependabot-report-<YYYY-MM-DD>-<HHMM>.md`.

**Filename format:** Use current UTC time: `dependabot-report-2026-08-11-1430.md` (ISO date + 24-hour HHMM). Create the `docs/dependabot-report/` directory if it doesn't exist.

The report uses this structure:

```markdown
## Dependabot Resolution Report — <date>

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | X |
| Pipeline FAIL — needs investigation | X |
| CI already FAILED — skipped local run | X |
| Superseded — closed | X |
| Skipped (merge conflict) | X |

### Superseded PRs — Closed
- **#2214** Bump postcss 8.5.14→8.5.16 — closed, superseded by #2255

### Passing PRs — Ready for Manual Smoke Test
#### #2253 — django 5.2.15→5.2.16 (patch, backend)
**Pipeline:** PASS (ruff ✓, migrations ✓, pytest ✓, mypy ✓)
**Risk:** Low
**Code impact:** 47 files
<smoke test guide>

#### #2254 — nanoid 3.3.11→3.3.18 (patch, frontend)
**Pipeline:** PASS (biome ✓, tsc ✓, stylelint ✓)
**Risk:** Low
**Transitive via:** (direct dependency)
**Code impact:** 3 files
<smoke test guide>

... (repeat for each PR)

### Failed PRs — Needs Investigation
#### #XXXX — <package> <from>→<to>
**Failure:** <which step failed and error>
**Recommendation:** <suggested fix>

### Action for User
1. Review each smoke-test guide above
2. Manually verify the checked-out PR behaviors on the [branch](URL)
3. Approve passing PRs with: `gh pr review <NUMBER> --approve`
```

Omit the "Failed PRs" and "Superseded" sections if they are empty.

## Important Rules

1. **Never auto-merge.** Always leave the merge decision to the user.
2. **Tear down before starting.** Always run `docker compose down` first to ensure a clean state, then bring up the services for the current ecosystem. Process all backend PRs together (checkout each, run pipeline, analyze, then teardown backend containers). Then do the same for all frontend PRs. This avoids rebuilding Docker images for each PR.
3. **Keep checked-out branch.** Do not switch back to master until all processing is done — the final report references the branch names.
4. **Always parse the PR title.** Extract package name, from-version, to-version, and ecosystem from: `Bump <package> from <from> to <to> in /<ecosystem>`.
5. **Handle missing .env files.** If `.env` doesn't exist at project root, create it from `.env.example` before starting Docker. The `backend/.docker.env` and `frontend/.env.docker` files must also exist.
6. **Report transitives.** When a package is only in the lockfile (not in package.json/pyproject.toml), it's transitive — find and report the parent dependency.
7. **Use existing tooling.** The project's own scripts are the source of truth:
   - Backend: `docker compose exec backend uv run ./run-pipeline.sh`
   - Frontend: `docker compose exec frontend yarn verify`
8. **Write report to correct path.** Always write the final report to `docs/dependabot-report/dependabot-report-<YYYY-MM-DD>-<HHMM>.md`. Create the directory if it doesn't exist.
