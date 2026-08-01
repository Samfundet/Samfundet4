from __future__ import annotations

import random

from django.utils.text import slugify

from root.utils.samfundet_random import words

from samfundet.models import Gang, User, GangSection
from samfundet.infopages.models import InformationPage
from samfundet.infopages.services import create_information_page, update_information_page

COUNT = 10

# Some pages get edited a few times, so the history endpoints have something to show.
MAX_EXTRA_REVISIONS = 3

SECTION_OWNED_SHARE = 1 / 3


def seed():
    InformationPage.objects.all().delete()
    yield 0, 'Deleted old information pages'

    gangs = list(Gang.objects.all())
    if not gangs:
        yield 100, 'No gangs exist to own information pages, skipping'
        return

    sections = list(GangSection.objects.all())
    editor = User.objects.filter(is_superuser=True).first()

    used_slug_fields = {}
    revisions = 0

    for i in range(COUNT):
        title_nb, title_en = words(2, include_english=True)
        slug_field = slugify(title_nb)

        # Make sure slug field is unique
        if slug_field in used_slug_fields:
            used_slug_fields[slug_field] += 1
            title_nb = f'{title_nb} ({used_slug_fields[slug_field]})'
            title_en = f'{title_en} ({used_slug_fields[slug_field]})'
            slug_field = f'{slug_field}-{used_slug_fields[slug_field]}'
        else:
            used_slug_fields[slug_field] = 1

        section = random.choice(sections) if sections and random.random() < SECTION_OWNED_SHARE else None

        page = create_information_page(
            slug_field=slug_field,
            gang=None if section else random.choice(gangs),
            section=section,
            visible=bool(random.getrandbits(1)),
            content={'title_nb': title_nb, 'title_en': title_en, 'text_nb': MARKDOWN, 'text_en': MARKDOWN},
            user=editor,
        )
        revisions += 1

        for extra in range(random.randint(0, MAX_EXTRA_REVISIONS)):
            version = extra + 2
            update_information_page(
                page=page,
                slug_field=page.slug_field,
                gang=page.gang,
                section=page.section,
                visible=page.visible,
                content={
                    'title_nb': f'{title_nb} (v{version})',
                    'title_en': f'{title_en} (v{version})',
                    'text_nb': MARKDOWN,
                    'text_en': MARKDOWN,
                },
                user=editor,
            )
            revisions += 1

        yield int(i / COUNT * 100), 'Creating information pages'

    # Done!
    yield 100, f'Created {InformationPage.objects.count()} information pages with {revisions} revisions'


MARKDOWN = """
# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

---

***

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

*This is italic text*

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

* Create a list by starting a line with `-` or `*`
* Sub-lists are made by indenting 2 spaces:
  * Marker character change forces new list start:
    * Ac tristique libero volutpat at
    * Facilisis in pretium nisl aliquet
    * Nulla volutpat aliquam velit
* Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

## Code

Inline `code`

Block code "fences"

```
Sample text here...
```

Syntax highlighting

```js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)

## Images

Can use normal markdown image syntax:

![Minion](https://octodex.github.com/images/minion.png "The Minion")

Can ALSO use Samf's image system, by using this directive and referencing image ID

::image{#1}
"""
