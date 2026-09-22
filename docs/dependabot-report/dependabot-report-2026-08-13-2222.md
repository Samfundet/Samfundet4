## Dependabot Resolution Report — 2026-08-13

Filter: `all` → all open dependabot PRs (1 found)

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

### Passing PRs — Ready for Manual Smoke Test

#### #2253 — django 5.2.15→5.2.16 (patch, backend)

**Pipeline:** PASS (ruff ✓, migrations ✓, pytest ✓, mypy ✓)
- ruff: all files already formatted
- migrations: no changes detected; no pending migrations
- pytest: 285 passed, 23 skipped (308 collected) — includes admin, views, info pages, recruitment, roles, email, image, markdown, billig tests
- mypy: Success, no issues found in 165 source files

**Bump type:** patch (5.2.15 → 5.2.16)
**Risk:** Low — patch release; Django is the core web framework so it touches production heavily, but a patch bump carries minimal breaking-change risk
**Branch:** `dependabot/uv/backend/django-5.2.16` — merged latest `origin/master` (merge commit `d84ff288`), force-pushed so GitHub CI re-runs on the merged state
**CI (before local run):** Verify backend / Verify docker / Verify frontend all SUCCESS on the pre-merge head; push of merged state triggers a re-run
**Security release:** fixes CVE-2026-53878 (newlines accepted in DOM), CVE-2026-53877 (heap buffer over-read), CVE-2026-48588 (caching of responses that set cookies), plus CVE-2026-6873 / CVE-2026-7666 / CVE-2026-8404 / CVE-2026-35193 referenced in the changelog
**Code impact:** 65 files in `backend/samfundet/` import django

```
## Smoke test: django 5.2.15 → 5.2.16

**Changelog:** https://docs.djangoproject.com/en/5.2/releases/5.2.16/
**Compare:** https://github.com/django/django/compare/5.2.15...5.2.16

**Touched files (65):**
- Admin: samfundet/admin.py, samfundet/infopages/admin.py
- Models: samfundet/models/event.py, general.py, billig.py, mdb.py, recruitment.py, role.py, model_choices.py; samfundet/infopages/models.py, querysets.py
- Views: samfundet/views.py, samfundet/view/{event,general,recruitment,sulten,user}_views.py, samfundet/infopages/views/{admin,public}.py, samfundet/routing/views.py
- Serializers: samfundet/serializers.py, samfundet/serializer/mdb_serializers.py
- Urls/routing: samfundet/urls.py, samfundet/routing/{urls,metadata}.py, samfundet/infopages/urls.py
- Fields/validators/utils/support: samfundet/fields.py, validators.py, utils.py, backend.py, signals.py, apps.py
- Home: samfundet/homepage/homepage.py
- Migrations: samfundet/migrations/0001–0016
- Tests: samfundet/tests/* (11 files), samfundet/models/tests/* (2 files), samfundet/conftest.py

**Manual checks:**
1. Load the admin panel at http://localhost:8000/admin/ — verify all model lists render and edits save (incl. info pages admin)
2. Visit public pages rendering model data: events list, info pages, recruitment positions, sulten/mdb views
3. Submit any form with URL or HTML-ish content (e.g. a Venue via admin, info page content) — verify validation and escaped/sanitized output (5.2.16 hardens HTML/DOM and URL handling)
4. Confirm authenticated responses that set cookies are served with proper cache-control (CVE-2026-48588 area) — e.g. login flow must not serve set-cookie responses from cache
5. Check the browser console/HTML source for any malformed markup on pages rendering user/Markdown content
6. Run a management command: `docker compose --env-file .env.example exec backend python manage.py check`
7. Confirm the re-run "Verify backend" / "Verify docker" GitHub checks are green on the merged branch
```

### Action for User
1. Review the smoke-test guide above
2. Manually verify the checked-out PR behaviors on the [branch](https://github.com/Samfundet/Samfundet4/tree/dependabot/uv/backend/django-5.2.16)
3. Approve the passing PR with: `gh pr review 2253 --approve`
4. This is a security release — merging promptly is recommended
