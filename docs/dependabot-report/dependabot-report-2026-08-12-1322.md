## Dependabot Resolution Report — 2026-08-12 13:37 UTC

Processed 1 PR (numeric filter: `2216`) plus a coordinated Storybook monorepo upgrade performed on the same branch. No PRs were merged — review below and approve/smoke-test manually.

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

### Passing PRs — Ready for Manual Smoke Test

#### #2216 — Storybook monorepo 8.6.x→10.5.7 (major, frontend)
**Pipeline:** PASS (biome ✓, tsc ✓, stylelint ✓)
**Branch:** up to date with master, upgrade commit pushed (c3b83fee..5c400275)
**Bump type:** Major (8.6 → 10.5)
**Risk:** Low — dev-only tooling, zero production code imports; full suite (lint/type/build/boot) verified locally in Docker.

**Background:** The PR originally bumped only `@storybook/addon-links` 8.6.7→10.4.6. A standalone addon bump broke Storybook (addon-links 10.x requires `storybook@^10.4.6`; core was 8.6.18, `storybook/manager-api` unresolved — `yarn build-storybook` and the dev server both failed). Instead of reverting, the full monorepo was upgraded in a coordinated change.

**Changes made (5 files):**
- `frontend/package.json` — bumped `storybook`, `@storybook/addon-links`, `@storybook/react`, `@storybook/react-vite` to `^10.5.7`; **removed** `@storybook/addon-actions`, `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/test` (functionality moved into `storybook` core in v9 — packages are discontinued: essentials/interactions end at 8.6.x, actions at 9.0.x); removed obsolete `NODE_OPTIONS=--openssl-legacy-provider` from `storybook`/`build-storybook` scripts (Node 21 no longer needs it)
- `frontend/yarn.lock` — lockfile resolved for v10
- `frontend/.storybook/main.ts` — addons reduced to `['@storybook/addon-links']` (essentials/interactions/actions are core now)
- `frontend/src/Components/InputField/InputField.stories.tsx`, `frontend/src/Components/TextAreaField/TextAreaField.stories.tsx` — `action` import moved from `@storybook/addon-actions` to `storybook/actions` (+ import order fixed by biome)

**Pipeline results (Docker, merged branch `dependabot/npm_and_yarn/frontend/storybook/addon-links-10.4.6`):**
- `yarn verify`: PASS — biome (772 files, no fixes), tsc (no errors), stylelint (no errors)
- `yarn build-storybook`: PASS — "Storybook build completed successfully" (was broken before the upgrade)
- `yarn storybook-dev`: PASS — dev server boots, HTTP 200, `index.json` indexes **145 stories** across the 70 story files

**Code impact (dev-only):**
- All 70 `.stories.tsx` files import `Meta`/`StoryObj` from `@storybook/react` — unchanged, compatible with v10
- Only 2 stories touched (`storybook/actions` import)
- Zero production runtime imports of storybook packages

**Changelog:** https://github.com/storybookjs/storybook/blob/next/MIGRATION.md (8.x→9.0.0, 9.x→10.0.0 sections)

**Compatibility preconditions verified:** Node 21.7.3 (≥20.19 required), TypeScript 6.0.3 + `moduleResolution: "bundler"` (supports `types` condition), Vite 6.4.3 (v4 dropped in v9), ESM `main.ts`.

## Smoke test: storybook 10.5.7

**Touched files:** frontend/package.json, frontend/.storybook/main.ts, 2 story files, yarn.lock

**Manual checks:**
1. Boot locally: `yarn storybook` → http://localhost:6006 loads and shows the sidebar
2. Spot-check 5–10 stories across feature areas (Button, Modal, Dropdown, EventCard, SamfForm) — verify component renders, controls/actions panels work, no console errors
3. Verify the two `action`-using stories (InputField → OnChange, TextAreaField → OnChange) — click the field, confirm the action appears in the Actions panel
4. Locale switcher (English/Norwegian global) still works via the toolbar
5. Theme switcher (light/dark/split view) still works
6. `yarn build-storybook` completes; inspect `storybook-static/` output
7. Interactions addon: check any story's Interactions tab renders play-function results

**Pre-existing warning (not caused by this change):** yarn reports a peer mismatch — i18next expects `typescript@^5.0.0`, project pins `typescript@^6.0.3`. Unchanged from master. Pipeline passes.

### Superseded PRs — Closed
None.

### Action for User
1. Run the local smoke test above (storybook dev server on 6006)
2. If green, approve with: `gh pr review 2216 --approve`
3. GitHub CI is re-running on the pushed upgrade commit — confirm the 3 verify jobs pass before/after approving
4. Merge decision is yours — nothing was merged automatically