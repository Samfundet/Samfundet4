from __future__ import annotations

from typing import TYPE_CHECKING, Any

from django.db import models
from django.core.exceptions import ValidationError

from root.utils.mixins import CustomBaseModel, FullCleanSaveMixin

from samfundet.fields import LowerCaseSlugField
from samfundet.infopages.querysets import InformationPageQuerySet

if TYPE_CHECKING:
    from samfundet.models import Gang, GangSection, Organization

ONLY_ONE_OWNER_ERROR = 'Information page must be owned by either a gang or a section, not both'
NO_OWNER_ERROR = 'Information page must have an owner, either a gang or a gang section'


class InformationPage(CustomBaseModel):
    objects = InformationPageQuerySet.as_manager()

    slug_field = LowerCaseSlugField(
        max_length=64,
        blank=True,
        null=False,
        unique=True,
        help_text='Identifies the object and is used in the URL. Always lowercase.',
    )

    gang = models.ForeignKey(
        to='samfundet.Gang', on_delete=models.CASCADE, help_text='Owner of the information page', related_name='owned_info_pages', blank=True, null=True
    )

    section = models.ForeignKey(
        to='samfundet.GangSection',
        on_delete=models.CASCADE,
        help_text='Owner of the information page',
        related_name='owned_info_pages',
        blank=True,
        null=True,
    )

    visible = models.BooleanField(default=True, help_text='If the information page is publicly viewable')

    # Denormalized pointer to the newest revision, so reads are one select_related instead of a
    # per-row subquery. Field is updated by samfundet/infopages/services.py
    current_revision = models.ForeignKey(
        to='samfundet.InformationPageRevision',
        on_delete=models.SET_NULL,
        related_name='+',
        blank=True,
        null=True,
        editable=False,
    )

    def clean(self) -> None:
        super().clean()

        if self.gang_id and self.section_id:
            raise ValidationError({'gang': ONLY_ONE_OWNER_ERROR, 'section': ONLY_ONE_OWNER_ERROR})
        if not (self.gang_id or self.section_id):
            raise ValidationError({'gang': NO_OWNER_ERROR, 'section': NO_OWNER_ERROR})

    def owner_gang(self) -> Gang | None:
        """
        The gang a page belongs to, whether owned directly or through one of the gang's sections.

        Requires `section__gang` to be selected, or this hits the database for a section-owned
        page. See `InformationPageQuerySet.with_owner`.
        """
        return self.gang or (self.section.gang if self.section_id else None)

    # the `resolve_*` functions are from role system, see docs/technical/rolesystem.md

    def resolve_org(self, *, return_id: bool = False) -> Organization | int | None:
        gang = self.owner_gang()
        if gang is None:
            return None
        return gang.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int | None:
        gang = self.owner_gang()
        if return_id:
            return gang.id if gang else None
        return gang

    def resolve_section(self, *, return_id: bool = False) -> GangSection | int | None:
        if return_id:
            # noinspection PyTypeChecker,PyUnresolvedReferences
            return self.section_id
        return self.section

    class Meta:
        verbose_name = 'InformationPage'
        verbose_name_plural = 'InformationPages'

        # This constraint ensures that ONLY gang or section is set, not both
        constraints = [
            models.CheckConstraint(
                condition=(models.Q(gang__isnull=False, section__isnull=True) | models.Q(gang__isnull=True, section__isnull=False)),
                name='informationpage_exactly_one_owner',
                violation_error_message=ONLY_ONE_OWNER_ERROR,
            ),
        ]

    def __str__(self) -> str:
        return f'{self.slug_field}'


class InformationPageRevision(FullCleanSaveMixin):
    """
    One version of an information page's content.

    Deliberately not a CustomBaseModel, since it contains its own `version`, as well as `updated_at/by` which does
    not fit this model.
    """

    CONTENT_FIELDS = ('title_nb', 'title_en', 'text_nb', 'text_en')

    page = models.ForeignKey(to=InformationPage, on_delete=models.CASCADE, related_name='revisions', blank=False, null=False)
    version = models.PositiveIntegerField(help_text='Revision number, starts at 1 and increments for every content edit')

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (norsk)')
    text_nb = models.TextField(blank=True, null=True, verbose_name='Tekst (norsk)')

    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Tittel (engelsk)')
    text_en = models.TextField(blank=True, null=True, verbose_name='Tekst (engelsk)')

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(to='samfundet.User', on_delete=models.SET_NULL, related_name='+', blank=True, null=True)

    class Meta:
        verbose_name = 'InformationPageRevision'
        verbose_name_plural = 'InformationPageRevisions'
        ordering = ['-version']
        constraints = [
            models.UniqueConstraint(fields=['page', 'version'], name='unique_information_page_revision_version'),
        ]

    def save(self, *args: Any, **kwargs: Any) -> None:
        if self.pk is not None:
            raise ValueError('InformationPageRevision is append-only. Write a new revision instead of changing an existing one.')
        super().save(*args, **kwargs)

    def content(self) -> dict[str, str | None]:
        return {field: getattr(self, field) for field in self.CONTENT_FIELDS}

    def __str__(self) -> str:
        return f'{self.page.slug_field} v{self.version}'
