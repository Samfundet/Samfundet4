from __future__ import annotations

from typing import TYPE_CHECKING

from guardian.shortcuts import get_objects_for_user

from django.db import models

from root.utils.permissions import SAMFUNDET_VIEW_INFORMATIONPAGE

if TYPE_CHECKING:
    from samfundet.models import User


class InformationPageQuerySet(models.QuerySet):
    def with_owner(self) -> InformationPageQuerySet:
        """
        Everything the admin serializers reach, so listing sticks to one query.

        The gang and its organization are nested, and both are serialized by CustomBaseSerializer,
        which stringifies created_by/updated_by. That is why their audit fields are pulled in too.
        """
        return self.select_related(
            'created_by',
            'updated_by',
            'current_revision',
            'gang__created_by',
            'gang__updated_by',
            'gang__organization__created_by',
            'gang__organization__updated_by',
            'section__created_by',
            'section__updated_by',
            'section__gang__created_by',
            'section__gang__updated_by',
            'section__gang__organization__created_by',
            'section__gang__organization__updated_by',
        )

    def visible(self) -> InformationPageQuerySet:
        return self.filter(visible=True)

    def administered_by(self, user: User) -> InformationPageQuerySet:
        """Pages the user may view, through a model level permission, object-level permission, an org/gang/section role"""
        # Imported here, not at module level because models.general imports this module to attach the
        # manager, and samfundet.roles imports the models
        from samfundet.roles import get_owner_permission_map  # noqa: PLC0415

        if not user.is_authenticated:
            return self.none()
        if user.has_perm(SAMFUNDET_VIEW_INFORMATIONPAGE):
            return self

        capabilities = get_owner_permission_map(user=user, permissions=[SAMFUNDET_VIEW_INFORMATIONPAGE])

        # Permissions granted on a single page sit outside the role hierarchy, so they cannot be
        # resolved through the owner and have to be unioned in separately. accept_global_perms
        # is off since the model level permission is already handled above.
        directly_permitted = get_objects_for_user(user, SAMFUNDET_VIEW_INFORMATIONPAGE, klass=self.model, accept_global_perms=False)

        return self.filter(
            models.Q(gang_id__in=capabilities.gangs)
            | models.Q(section_id__in=capabilities.sections)
            | models.Q(section__gang_id__in=capabilities.gangs)
            | models.Q(pk__in=directly_permitted.values('pk'))
        )
