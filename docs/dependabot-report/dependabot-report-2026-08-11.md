# Dependabot Resolution Report — 2026-08-11

## Summary

| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 1 |
| Skipped (merge conflict) | 0 |

## Superseded PRs — Closed

- **#2214** Bump postcss 8.5.14→8.5.16 — already closed by user, superseded by #2255 (postcss 8.5.23)

## Passing PRs — Ready for Manual Smoke Test

### #2255 — postcss 8.5.14→8.5.23 (patch, frontend)

**Pipeline:** PASS (biome ✓, tsc ✓, stylelint ✓)
**CI on GitHub:** All Verify checks passed
**Risk:** Low (patch bump, build-time tooling only — not imported in production source)
**Code impact:** 0 files in `frontend/src/`; config-only usage at `frontend/vite.config.ts:22` (css.postcss plugin block); bump touches only `frontend/package.json` + `frontend/yarn.lock`
**Direct dependency:** yes (not transitive)

#### Smoke test: postcss 8.5.14 → 8.5.23

**Changelog:** https://github.com/postcss/postcss/releases

**Touched files (1):**
- Config: `frontend/vite.config.ts:22` (postcss block with autoprefixer)

**Manual checks:**
1. Run `yarn build` — verify the production CSS bundle builds without postcss errors
2. Load the app (`docker compose exec frontend yarn start:docker` or `yarn dev`) — verify styles render correctly on a page using SCSS (e.g. the front page or an event page)
3. Inspect the browser console for postcss-related warnings
4. Spot-check that autoprefixer vendor prefixes are still applied in the built CSS (`dist/assets/*.css`)
5. Confirm `yarn verify` still passes locally (biome, tsc, stylelint)

## Action for User

1. Review the smoke-test guide for #2255 above
2. Manually verify the checked-out branch behavior (branch: `dependabot/npm_and_yarn/frontend/postcss-8.5.23`)
3. Approve when ready: `gh pr review 2255 --approve`
