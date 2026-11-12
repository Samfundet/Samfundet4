from __future__ import annotations

from samfundet.routing.metadata import Metadata, MetadataItem, inject_metadata, build_metadata_html

INDEX_HTML = '<!doctype html><html><head><title>Samfundet</title></head><body><div id="root"></div></body></html>'


class TestBuildMetadataHtml:
    def test_output_is_stable(self) -> None:
        """Pins the exact tag order and formatting, so a refactor cannot silently change the served head."""
        metadata = Metadata(
            title='Tittel',
            description='Beskrivelse',
            canonical_url='https://samfundet.no/',
            items=[MetadataItem('name', 'og:custom', 'Lorem ipsum')],
        )

        assert build_metadata_html(metadata) == (
            '<meta name="description" content="Beskrivelse">\n'
            '<link rel="canonical" href="https://samfundet.no/">\n'
            '<meta property="og:title" content="Tittel">\n'
            '<meta name="twitter:title" content="Tittel">\n'
            '<meta property="og:description" content="Beskrivelse">\n'
            '<meta name="og:custom" content="Lorem ipsum">'
        )

    def test_escapes_every_value(self) -> None:
        metadata = Metadata(
            title='A & B <x> "q"',
            description='d & e',
            canonical_url='https://x/?a=1&b=2',
            items=[MetadataItem('name', 'og:custom', 'v & w')],
        )

        html = build_metadata_html(metadata)

        assert 'content="A &amp; B &lt;x&gt; &quot;q&quot;"' in html
        assert 'content="d &amp; e"' in html
        assert 'href="https://x/?a=1&amp;b=2"' in html
        assert 'content="v &amp; w"' in html
        assert '<x>' not in html


class TestInjectMetadata:
    def test_replaces_an_existing_title(self) -> None:
        result = inject_metadata(INDEX_HTML, Metadata(title='Ny'))

        assert result.count('<title>') == 1
        assert '<title>Ny</title>' in result
        assert '<title>Samfundet</title>' not in result

    def test_inserts_a_title_when_the_document_has_none(self) -> None:
        html = '<html><head></head><body></body></html>'

        result = inject_metadata(html, Metadata(title='Ny'))

        assert '<title>Ny</title>' in result
        assert result.index('<title>Ny</title>') < result.index('</head>')

    def test_tags_land_before_the_head_closes(self) -> None:
        result = inject_metadata(INDEX_HTML, Metadata(title='Ny', description='Beskrivelse'))

        assert result.index('<meta name="description"') < result.index('</head>')
        assert result.index('<title>Ny</title>') < result.index('</head>')

    def test_a_document_without_a_head_close_is_returned_unchanged(self) -> None:
        """Injection anchors on </head>; without it there is nothing to inject into. Documents current behaviour."""
        html = '<html><body>no head close</body></html>'

        assert inject_metadata(html, Metadata(title='Ny', description='Beskrivelse')) == html
