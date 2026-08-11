from __future__ import annotations

from typing import TYPE_CHECKING

from django.db import transaction
from django.db.models import Max

from samfundet.infopages.models import InformationPage, InformationPageRevision

if TYPE_CHECKING:
    from samfundet.models import Gang, User, GangSection

Content = dict[str, str | None]


def create_information_page(
    *, slug_field: str, gang: Gang | None, section: GangSection | None, visible: bool, content: Content, user: User | None
) -> InformationPage:
    """Creates a page, along with its first revision. Exactly one of gang/section must be set."""
    with transaction.atomic():
        page = InformationPage(slug_field=slug_field, gang=gang, section=section, visible=visible)
        page.save()
        _write_revision(page=page, content=content, user=user)
    return page


def update_information_page(
    *, page: InformationPage, slug_field: str, gang: Gang | None, section: GangSection | None, visible: bool, content: Content, user: User | None
) -> InformationPage:
    """
    Applies an edit to a page.

    If the content (title or text) differs, a new revision will be created. Editing the owner or
    visibility will not create a new revision.
    """
    with transaction.atomic():
        page = InformationPage.objects.select_for_update().get(pk=page.pk)

        page.slug_field = slug_field  # type: ignore[assignment] # django-stubs does not narrow our custom slug field
        page.gang = gang
        page.section = section
        page.visible = visible
        page.save()

        if _content_changed(page=page, content=content):
            _write_revision(page=page, content=content, user=user)

    return page


def _content_changed(*, page: InformationPage, content: Content) -> bool:
    current = page.current_revision
    if current is None:
        return True
    return current.content() != {field: content.get(field) for field in InformationPageRevision.CONTENT_FIELDS}


def _write_revision(*, page: InformationPage, content: Content, user: User | None) -> InformationPageRevision:
    next_version = (page.revisions.aggregate(highest=Max('version'))['highest'] or 0) + 1

    revision = InformationPageRevision(page=page, version=next_version, created_by=user, **content)
    revision.save()

    # Written with an UPDATE rather than page.save(), which would bump the infopage's version a second time for a
    # single edit
    InformationPage.objects.filter(pk=page.pk).update(current_revision=revision)
    page.current_revision = revision

    return revision
