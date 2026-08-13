# Dependabot Resolution Report — 2026-08-12

## Summary

| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

## Passing PRs — Ready for Manual Smoke Test

### #2215 — web-vitals 4.2.4→5.3.0 (major, frontend)

**Pipeline:** PASS (biome ✓, tsc ✓, stylelint ✓)
**CI on GitHub:** All Verify checks passed
**Branch:** merged latest `master` (ae7af694..b5736d78) into PR branch, pushed as `92010b66` — CI re-running on merged state
**Risk:** High (major 4.x → 5.x, production usage) — practically contained: only one module imports it, and the v5.0 breaking changes do not affect the API surface the app uses
**Code impact:** 1 file in `frontend/src/`
**Direct dependency:** yes (not transitive), `frontend/package.json:69` (`"web-vitals": "^5.3.0"`)

#### Smoke test: web-vitals 4.2.4 → 5.3.0

**Changelog:** https://github.com/GoogleChrome/web-vitals/blob/main/CHANGELOG.md
**Upgrade guide (v5.0 breaking changes):** https://github.com/GoogleChrome/web-vitals/blob/main/docs/upgrading-to-v5.md

**Key v5 changes relevant to this repo:**
- v5.0.0 **removed the deprecated `onFID()`** — the app already uses `onINP()`, so no change needed
- v5.0.0 raised browser support to Baseline Widely available (older browser versions may stop reporting metrics — no app code change)
- v5.2.0/v5.3.0 are API-compatible fixes and internal cleanups (LoAF handling, config-object sharing fix, removed internal `getFirstHiddenTimePolyfill`)

**Touched files (2):**
- Helper: `frontend/src/reportWebVitals.ts:1` (type import `MetricType`), `:5` (dynamic import of `onCLS`, `onINP`, `onFCP`, `onLCP`, `onTTFB`)
- Entry point: `frontend/src/index.tsx:15`, `:65` (`reportWebVitals()` — called with no callback, so metrics are only computed, not logged; `console.log` line is commented out at `index.tsx:63`)

**Manual checks:**
1. Open the app and load a page (e.g. home page) — verify no runtime errors in the browser console from web-vitals
2. Since the callback is disabled, verify the app boots normally and `reportWebVitals()` at `index.tsx:65` doesn't throw (temporarily enable `reportWebVitals(console.log)` at `index.tsx:63` and reload to confirm all 5 metrics are reported: CLS, INP, FCP, LCP, TTFB)
3. Interact with the page (click buttons, scroll) and confirm INP reporting works — v5.3.0 changed `interactionTarget` handling for INP
4. Load the page in a private window / bfcache-restore path (navigate away and back) — confirm no stale listener errors, since v5.1+ changed visibility-change handling
5. Run `yarn build` — confirm the production bundle builds and web-vitals is bundled correctly (it's a dynamic import in `reportWebVitals.ts`)
6. Confirm `yarn verify` still passes locally (biome, tsc, stylelint)
7. No need to change code: `onFID` was already replaced by `onINP` before this bump

## Action for User

1. Review the smoke-test guide for #2215 above
2. Manually verify the checked-out branch behavior (branch: `dependabot/npm_and_yarn/frontend/web-vitals-5.3.0`)
3. Approve when ready: `gh pr review 2215 --approve`