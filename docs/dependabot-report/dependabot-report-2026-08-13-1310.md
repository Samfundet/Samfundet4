# Dependabot Resolution Report — 2026-08-13

## Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

## Passing PRs — Ready for Manual Smoke Test

### #2218 — @radix-ui/react-slot 1.2.2 → 1.3.0 (minor, frontend)

**Pipeline:** PASS (biome ✓, tsc ✓, stylelint ✓)
**Branch:** merged with master and pushed (commit `d89ca18b`) — PR is now MERGEABLE; GitHub CI re-running on the merged state
**Risk:** Medium (minor bump, production usage)
**Code impact:** 1 file imports the package directly; 30 files consume the wrapping component

**Conflict resolution note:** The PR was CONFLICTING with master (package.json + yarn.lock). Per user instruction, the conflict was resolved manually: kept master's `@mdxeditor/editor`, set `"@radix-ui/react-slot": "^1.3.0"`, deleted the stale lockfile, and regenerated it with `yarn install` (yarn 4.5.0). The regenerated lockfile diff is minimal (4 lines) — `^1.3.0` resolves to **1.3.3**, the same version already in use on master transitively via other radix packages, so the resolved package tree is deduplicated (single 1.3.3 entry, no other packages changed).

**Touched files (direct usage):**
- `frontend/src/Components/Forms/Form.tsx:1` — `import { Slot } from '@radix-ui/react-slot'`; `FormControl` wraps `Slot` (lines 160–165), used with react-hook-form

**Consumers of FormControl (30 files, via re-export):**
- Forms: `frontend/src/Pages/SignUpPage/SignUpForm.tsx`, `frontend/src/Components/UserFeedback/UserFeedbackForm.tsx`, `frontend/src/Pages/LycheReservationPage/Components/FindAvailableTablesForm/FindAvailableTablesForm.tsx`, `frontend/src/Pages/LycheReservationPage/Components/ReserveTableForm/ReserveTableForm.tsx`, `frontend/src/Pages/RecruitmentApplicationFormPage/RecruitmentApplicationFormPage.tsx`, `frontend/src/Pages/ComponentPage/ExampleForm.tsx`
- Admin: `frontend/src/PagesAdmin/EventCreatorAdminPage/steps/InfoStep.tsx`, `frontend/src/PagesAdmin/EventCreatorAdminPage/steps/TextStep.tsx`, and other admin forms

**Changelog highlights (1.2.3 → 1.3.0):**
- 1.3.0: generic type arguments for `SlotProps` and `createSlot` (additive, type-level)
- 1.2.5: fixed infinite re-render loop in React 19 (new ref callback per render)
- 1.2.4: fixed interaction with lazy React components
- 1.2.3: replaced deprecated `ElementRef` with `ComponentRef`

**Manual checks:**
1. Load the app at http://localhost:3000 — verify the page renders without console errors
2. Open a page with a form using `FormControl` (e.g. `/signup`, or any admin form) — verify inputs render and focus properly (Slot merges props/refs onto the child)
3. Submit a form — verify validation errors show and controlled values bind correctly
4. In the browser console, confirm no infinite re-render warnings or React 19 ref-related warnings
5. Verify nested/interactive elements inside form controls (e.g. a button inside a textarea wrapper, dropdowns) still behave — this exercises the nested `Slottable` fix (1.2.5)
6. `tsc:check` already validates the `React.ElementRef<typeof Slot>` usage in Form.tsx:160 (deprecated but still functional)

## Action for User
1. Review the smoke-test guide above
2. Manually verify the behaviors on the branch `dependabot/npm_and_yarn/frontend/radix-ui/react-slot-1.3.0` (already checked out locally)
3. Wait for GitHub CI (`Verify backend`/`Verify docker`/`Verify frontend`) to finish on the pushed merge commit, then approve with: `gh pr review 2218 --approve`
4. The PR is mergeable — the merge decision is yours; no auto-merge was performed
