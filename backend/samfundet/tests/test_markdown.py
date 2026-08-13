from __future__ import annotations

import pytest

from django.db import connection
from django.test.utils import CaptureQueriesContext

from samfundet.markdown import render_image_directives
from samfundet.models.general import Image


class TestRenderImageDirectives:
    def test_leaves_text_without_directives_alone(self):
        text = '# Heading\n\nSome text with an ![old style](/uploads/foo.png) image.'

        assert render_image_directives(text) == [text]

    def test_passes_through_empty_values(self):
        assert render_image_directives(None, '') == [None, '']

    def test_uses_the_image_title_as_alt_text(self, fixture_image: Image):
        [rendered] = render_image_directives(f'::image{{id={fixture_image.id}}}')

        assert rendered == f'![{fixture_image.title}]({fixture_image.urls["large"]})'

    def test_an_explicit_alt_attribute_wins_over_the_title(self, fixture_image: Image):
        [rendered] = render_image_directives(f'::image{{id={fixture_image.id} alt="Edgar"}}')

        assert rendered == f'![Edgar]({fixture_image.urls["large"]})'

    @pytest.mark.parametrize(
        'directive',
        [
            '::image{{id={id}}}',
            '::image{{id="{id}"}}',
            "::image{{id='{id}'}}",
            '::image{{alt="Bar" id={id}}}',
            '  ::image{{id={id}}}',
            '::image{{#{id}}}',
            '::image{{#{id} alt="Bar"}}',
        ],
    )
    def test_accepts_quoting_attribute_order_and_indentation_variants(self, fixture_image: Image, directive: str):
        [rendered] = render_image_directives(directive.format(id=fixture_image.id))

        assert rendered.startswith('![')
        assert fixture_image.urls['large'] in rendered

    def test_keeps_surrounding_content_intact(self, fixture_image: Image):
        [rendered] = render_image_directives(f'Before\n\n::image{{id={fixture_image.id}}}\n\nAfter')

        assert rendered == f'Before\n\n![{fixture_image.title}]({fixture_image.urls["large"]})\n\nAfter'

    def test_drops_directives_pointing_at_a_nonexistent_image(self):
        [rendered] = render_image_directives('Before\n\n::image{id=123456}\n\nAfter')

        assert rendered == 'Before\n\nAfter'

    def test_drops_directives_without_a_usable_id(self):
        [rendered] = render_image_directives('::image{alt="No id"}\n::image{id=abc}\n')

        assert rendered == ''

    def test_a_hash_inside_alt_text_is_not_read_as_the_id_shorthand(self, fixture_image: Image):
        [rendered] = render_image_directives(f'::image{{id={fixture_image.id} alt="#hashtag"}}')

        assert rendered == f'![#hashtag]({fixture_image.urls["large"]})'

    def test_escapes_brackets_in_alt_text(self, fixture_image: Image):
        [rendered] = render_image_directives(f'::image{{id={fixture_image.id} alt="a [b] c"}}')

        assert rendered == f'![a \\[b\\] c]({fixture_image.urls["large"]})'

    def test_renders_every_occurrence_across_all_texts(self, fixture_image: Image):
        rendered = render_image_directives(
            f'::image{{id={fixture_image.id}}}\n\n::image{{id={fixture_image.id}}}',
            f'::image{{id={fixture_image.id}}}',
        )

        assert sum(text.count('![') for text in rendered) == 3

    def test_all_texts_cost_a_single_query(self, fixture_image: Image):
        with CaptureQueriesContext(connection) as queries:
            render_image_directives(f'::image{{id={fixture_image.id}}}', f'::image{{id={fixture_image.id}}}')

        assert len(queries) == 1

    def test_text_without_directives_costs_no_queries(self):
        with CaptureQueriesContext(connection) as queries:
            render_image_directives('Just text', None)

        assert len(queries) == 0
