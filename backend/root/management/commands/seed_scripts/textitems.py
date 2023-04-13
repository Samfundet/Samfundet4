from samfundet.models.general import TextItem


def seed():
    text_items = [
        {
            'key': 'welcome_message',
            'text_nb': 'Velkommen til Studentersamfundet i Trondhjem!',
            'text_en': 'Welcome to the Student Society in Trondheim!',
        },
        {
            'key': 'upcoming_events',
            'text_nb': 'Sjekk ut våre kommende arrangementer og konsertene vi har planlagt!',
            'text_en': 'Check out our upcoming events and concerts we have planned!',
        },
        {
            'key': 'join_us',
            'text_nb': 'Bli medlem av Studentersamfundet og nyt godt av medlemsfordelene!',
            'text_en': 'Join the Student Society and enjoy the benefits of membership!',
        },
        {
            'key': 'volunteer',
            'text_nb': 'Vil du bli frivillig? Bli med i vårt fantastiske team og bidra til studentkulturen i Trondheim!',
            'text_en': 'Want to volunteer? Join our amazing team and contribute to the student culture in Trondheim!',
        },
        {
            'key': 'about_us',
            'text_nb': 'Studentersamfundet i Trondhjem er et kulturelt senter for studenter og en viktig del av studentlivet i Trondheim.',
            'text_en': 'The Student Society in Trondheim is a cultural center for students and an essential part of student life in Trondheim.',
        },
        {
            'key': 'contact_us',
            'text_nb': 'Har du spørsmål eller ønsker å komme i kontakt med oss? Ikke nøl med å ta kontakt!',
            'text_en': 'Do you have any questions or want to get in touch with us? Don\'t hesitate to contact us!',
        },
    ]

    TextItem.objects.all().delete()
    yield 0, 'Deleted old textitems'

    for item in text_items:
        text_item, created = TextItem.objects.get_or_create(key=item['key'], text_nb=item['text_nb'], text_en=item['text_en'])
        if created:
            yield (100 * (text_items.index(item) + 1) // len(text_items), f'Created {len(TextItem.objects.all())} textitems')
