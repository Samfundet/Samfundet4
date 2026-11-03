from __future__ import annotations

import pytest

from django.db import connection
from django.test.utils import CaptureQueriesContext

from samfundet.markdown import plain_text, render_image_directives
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


class TestPlainText:
    def test_passes_through_empty_values(self):
        assert plain_text(None) == ''
        assert plain_text('') == ''
        assert plain_text('   \n  ') == ''

    def test_returns_short_text_unchanged(self):
        assert plain_text('Short text') == 'Short text'

    def test_drops_image_directives(self):
        assert plain_text('Before\n\n::image{#42 alt="Edgar"}\n\nAfter') == 'Before After'

    def test_replaces_links_with_their_text(self):
        assert plain_text('See [the site](https://example.com) now') == 'See the site now'

    def test_replaces_images_with_their_alt_text(self):
        assert plain_text('![Minion](https://example.com/minion.png "The Minion")') == 'Minion'

    def test_strips_headings_lists_quotes_and_emphasis(self):
        text = '# Title\n\n- one\n- **two**\n\n> quote\n\n---'

        assert plain_text(text) == 'Title one two quote'

    def test_strips_fenced_code_and_table_pipes(self):
        text = 'Intro\n\n```\ncode()\n```\n\n| a | b |\n| --- | --- |\n| 1 | 2 |'

        assert plain_text(text) == 'Intro a b 1 2'

    def test_collapses_whitespace_into_a_single_line(self):
        assert plain_text('a\n\n\nb\t\tc') == 'a b c'

    def test_truncates_at_a_word_boundary(self):
        result = plain_text('word ' * 100)

        assert result.endswith('…')
        assert len(result) <= 161
        assert result[:-1] == ' '.join(['word'] * 32)
