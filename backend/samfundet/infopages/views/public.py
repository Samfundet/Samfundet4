from __future__ import annotations

from rest_framework.mixins import RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import AllowAny

from django.db.models import QuerySet

from samfundet.infopages.models import InformationPage
from samfundet.infopages.serializers.public import PublicInformationPageSerializer


class PublicInformationPageViewSet(RetrieveModelMixin, GenericViewSet):
    """
    A single information page, as the public sees it.

    Retrieve only, on purpose. There is deliberately no public way to enumerate every info page.
    """

    permission_classes = [AllowAny]
    serializer_class = PublicInformationPageSerializer
    lookup_field = 'slug_field'

    def get_queryset(self) -> QuerySet[InformationPage]:
        # TODO: consider with_owner(), or adjusting the public serializer so that ownership is included for those with
        #  permission, in order to let us display the "edit" button to non-superusers who have edit rights to the page
        return InformationPage.objects.visible().select_related('current_revision')
