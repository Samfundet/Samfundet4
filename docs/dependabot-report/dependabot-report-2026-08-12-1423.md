## Dependabot Resolution Report — 2026-08-12 14:23 UTC

Processed 1 PR (numeric filter: `2217` — vite-plugin-svgr 4.5.0 → 5.2.0). No PRs were merged — review below before approving/merging.

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 0 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 1 |

### Skipped PRs — Merge Conflict

#### #2217 — vite-plugin-svgr 4.5.0→5.2.0 (major, frontend)
**Reason:** `git merge origin/master` → **CONFLICT in `frontend/package.json`** (also GitHub reports the PR as `CONFLICTING`). Merge aborted per policy — conflicts are never resolved automatically.

**Verdict:** Local Docker pipeline **not run** (branch not mergeable). GitHub CI on the PR branch itself: all 3 jobs **passed** (Verify backend ✓, Verify docker ✓, Verify frontend ✓).

**Bump type:** Major (4.5.0 → 5.2.0)
**Risk:** Low — build-time-only plugin, no production runtime imports. Only real breaking change in 5.0.0: **dropped Vite 2 support** (project uses Vite 6.4.3 — unaffected). 5.1.0/5.2.0 are bug fixes/perf.
**Changelog:** https://github.com/pd4d10/vite-plugin-svgr/releases (v5.0.0: drop Vite 2 + vite compat tests; v5.1.0: lazy-load SVGR deps, OxcTransformOptions type fix; v5.2.0: no significant changes)

**Conflict details:** The dependabot branch is based on an older `master`. `frontend/package.json` differs from `origin/master` in 3 spots besides the intended bump:
- PR branch **removes** `@mdxeditor/editor` and `remark-directive` (master currently has both — must be kept)
- PR branch has `postcss ^8.5.10`; master has `^8.5.23` (bump occurred on master since the branch was created)
- Intended change: `vite-plugin-svgr ^4.5.0` → `^5.2.0`

`yarn.lock` auto-merged cleanly. Recommended fix: resolve `package.json` in favor of master's dependency block and apply only the vite-plugin-svgr range change.

**Code impact (production source):**
- `frontend/vite.config.ts:3` — only production-code reference: `import svgr from 'vite-plugin-svgr'`; used at `vite.config.ts:14` as `svgr()`
- 3 files reference `.svg` assets rendered through the plugin: `frontend/src/assets/index.ts:11,27-28`, `frontend/src/Components/DynamicBuildingMap/DynamicBuildingMap.tsx:97`, `frontend/src/Pages/ContributorsPage/ContributorItem.tsx:5-6`

## Smoke test: vite-plugin-svgr 4.5.0 → 5.2.0 (run after resolving the conflict)

**Touched files:** frontend/package.json, frontend/yarn.lock (vite.config.ts unchanged)

**Manual checks:**
1. `yarn verify` in Docker passes (biome + tsc + stylelint)
2. Load any page rendering SVGs (HomePage, AboutPage, Contributors page) — verify all SVG components render, no broken images
3. `frontend/src/assets/index.ts` exports (samfundetLogo, trondheim, trondheimWhite) — verify they render as React components
4. Check dark/light mode rendering of `lightAvatar`/`darkAvatar` on the Contributors page
5. DynamicBuildingMap (`DynamicBuildingMap.tsx:97`) — verify the building map SVG renders and stays interactive
6. Run `yarn build` — confirm SVGs are bundled correctly in the production build
7. Inspect browser console for SVG-related warnings

### Action for User
1. Update #2217's branch with master and resolve the `frontend/package.json` conflict (keep `@mdxeditor/editor`, `remark-directive`, `postcss ^8.5.23` from master; apply only the `vite-plugin-svgr` range change — e.g. GitHub's "Update branch" button or locally: fetch `dependabot/npm_and_yarn/frontend/vite-plugin-svgr-5.2.0`, merge `origin/master`, fix package.json, push)
2. Let GitHub CI re-run on the merged state (3 verify jobs)
3. Run the smoke test above (local branch: `dependabot/npm_and_yarn/frontend/vite-plugin-svgr-5.2.0`, currently checked out with the merge aborted/clean)
4. Approve with: `gh pr review 2217 --approve`
5. Merge decision is yours — nothing was merged automatically