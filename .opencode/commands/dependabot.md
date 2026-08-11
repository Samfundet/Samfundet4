---
description: Resolve dependabot pull requests — run docker pipeline, analyze production code impact, and generate per-dependency smoke-test guides
---

Load the `resolve-dependabot` skill and follow its workflow to process the dependabot PRs specified by: $ARGUMENTS

If no arguments given, default to `all`.

Parse $ARGUMENTS:
- `all` → all open dependabot PRs
- `frontend` → only PRs with the `frontend` label
- `backend` → only PRs with the `backend` label
- Numeric (e.g., `2247 2253`) → only those specific PR numbers
- Combinations (e.g., `frontend 2253`) → intersection of filters

Then execute the skill workflow:
1. List and filter dependabot PRs
2. Detect and close superseded PRs
3. Process each PR: checkout branch → docker pipeline → code impact analysis → smoke-test guide
4. Generate the aggregated markdown report and write it to `docs/dependabot-report/dependabot-report-<YYYY-MM-DD>-<HHMM>.md`

**Critical: NEVER auto-merge any PR. Only prepare the report and guides for the user to review.**
