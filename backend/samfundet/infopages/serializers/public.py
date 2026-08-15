from __future__ import annotations

from rest_framework import serializers

from samfundet.markdown import render_image_directives
from samfundet.infopages.models import InformationPage


class PublicInformationPageSerializer(serializers.ModelSerializer):
    # Fetch content from the latest revision
    title_nb = serializers.CharField(source='current_revision.title_nb', read_only=True, allow_null=True)
    title_en = serializers.CharField(source='current_revision.title_en', read_only=True, allow_null=True)

    # Uses the serializers to replace image directives with plain markdown, so image IDs aren't exposed publicly.
    text_nb = serializers.SerializerMethodField(read_only=True)
    text_en = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = InformationPage
        fields = ['slug_field', 'title_nb', 'title_en', 'text_nb', 'text_en']

    def get_text_nb(self, page: InformationPage) -> str | None:
        return self._rendered_text(page)[0]

    def get_text_en(self, page: InformationPage) -> str | None:
        return self._rendered_text(page)[1]

    def _rendered_text(self, page: InformationPage) -> list[str | None]:
        cache: dict[int, list[str | None]] = self.context.setdefault('rendered_text', {})
        if page.pk not in cache:
            revision = page.current_revision
            cache[page.pk] = render_image_directives(
                revision.text_nb if revision else None,
                revision.text_en if revision else None,
            )
        return cache[page.pk]
