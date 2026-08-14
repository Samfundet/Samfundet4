## Dependabot Resolution Report — 2026-08-13

### Summary
| Status | Count |
|--------|-------|
| Pipeline PASS — ready for smoke test | 1 |
| Pipeline FAIL — needs investigation | 0 |
| CI already FAILED — skipped local run | 0 |
| Superseded — closed | 0 |
| Skipped (merge conflict) | 0 |

### Passing PRs — Ready for Manual Smoke Test
#### #2231 — pillow 12.2.0→12.3.0 (minor, backend)
**Pipeline:** PASS (ruff ✓, migrations ✓, pytest ✓ — 285 passed/23 skipped, mypy ✓)
**Branch:** [dependabot/uv/backend/pillow-12.3.0](https://github.com/Samfundet/Samfundet4/pull/2231) — up to date with master (merged, pushed, CI re-running on merged state)
**Risk:** Medium
**Transitive via:** (direct dependency — `pillow==12.*` in `backend/pyproject.toml`)
**Code impact:** 3 files (2 production, 1 test)

**Files touched:**
- Image model: `backend/samfundet/models/general.py` (17-18, 180-183, 202-230, 232-271, 273-283)
- Image validation: `backend/samfundet/serializers.py` (9-10, 136-149)
- Tests: `backend/samfundet/tests/test_image.py` (8, 35, 59, 91, 105, 130, 136, 139, 144)

**What pillow powers here:**
- Upload-time format validation (`PilImage.open` + `verify()`, rejects non-images as "Invalid image")
- EXIF/GPS metadata stripping and orientation baking (`ImageOps.exif_transpose`) — privacy-sensitive
- JPEG re-encoding with inherited compression (`JpegImagePlugin`, `qtables`, `get_sampling`)
- WebP variant generation (center-crop + `thumbnail` with `Resampling.LANCZOS`)

**Release notes:** https://pillow.readthedocs.io/en/stable/releasenotes/12.3.0.html — mostly security fixes and C-level performance improvements (incl. `resample`, used by thumbnail). No removals affect the used APIs. Icon/patch-level API surface (`scaled_down`, `max_length`) is unused.

**Manual checks:**
1. Upload a JPEG with EXIF orientation (e.g. phone photo) to an image-enabled form (venue, event, gang) — verify it renders correctly oriented
2. Upload a large image (e.g. 2000×1500px) — verify WebP variants generate and images render without errors
3. Upload a non-image file (e.g. a .txt renamed to .png) — verify `Invalid image` error is returned
4. Upload a PNG with transparency (palette mode) — verify it converts to WebP correctly and displays with alpha
5. Upload an animated GIF — verify variants are skipped and the original is served (no crash)
6. In admin, open an existing image's detail page — verify variants/URLs still resolve
7. Verify metadata stripping: upload a photo with GPS EXIF — confirm no EXIF retained in stored files (covered by `test_image.py` EXIF tests but worth one manual check)

### Action for User
1. Review the smoke-test guide above
2. Manually verify the checked-out PR behaviors on the [branch](https://github.com/Samfundet/Samfundet4/pull/2231)
3. Approve passing PRs with: `gh pr review 2231 --approve`

**Note:** Commit `0cd142ea` was pushed to the PR branch (merge of latest master) — CI is re-running on that merged state; pilll 12.3.0 itself is unchanged from dependabot's commit.