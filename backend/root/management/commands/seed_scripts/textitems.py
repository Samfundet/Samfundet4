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
            'text_en': 'Do you have any questions or want to get in touch with us? Don"t hesitate to contact us!',
        },
        {
         'key': 'festivals',
            'text_nb': 'Annenhvert år arrangeres Norges største kulturfestival UKA og verdens største internasjonale tematiske studentfestival under Studentersamfundets paraply.',
            'text_en': 'Every other year, Norway\'s largest cultural festival UKA and the world\'s largest international thematic student festival are organized under Studentersamfundet\'s umbrella.',
        },
        {
            'key': 'volunteering',
            'text_nb': 'Det meste av arbeid på Studentersamfundet i Trondhjem gjøres gjennom dugnad av studenter. Arbeidet er organisert i enheter som kalles gjenger. Potensielle nye medlemmer må søke den aktuelle gjengen om opptak, og gjengen vurderer hver enkelt søker. Med sine omtrent 1700 frivillige utgjør det indre miljøet i Studentersamfundet en betydelig del av det organiserte fritidstilbudet til studenter i Trondheim.',
            'text_en': 'Most of the work at Samfundet is done on a voluntary basis by students. The work is organized into units called groups. Prospective new members must apply to the appropriate group for admission and the group reviews each applicant. With around 1700 volunteers, the internal environment of Samfundet constitutes a significant part of organized leisure activities for students in Trondheim.',
        },
         {
            'key': 'the_society_meeting',
            'text_nb': 'Samfundsmøtet er Studentersamfundets høyeste organ. Her velges leder samt medlemmer til Finansstyret og Rådet. Lederen velger ut sitt eget styre, som utformer den politiske profilen og representer medlemmene og foreningen Samfundet. Finansstyret administrerer forretningsdriften. Rådet kontrollerer at all virksomhet i Samfundet foregår i henhold til norske og interne lover. Samfundet har en daglig leder, økonomiansvarlig, husøkonom, vaktmester og renholdspersonell som er ansatte.',
            'text_en': 'The Society Meeting is our highest organ. We elect the leader here, as well as members of the Finance Board and the Council. The leader, elected politically, chooses his or her own Board, which forms the House\'s political profile and represents all of Samfundet\'s members. The Finance Board manages the business. The Council ensures that all activities at Samfundet take place according to Norwegian and internal laws. Samfundet has a general manager, financial manager, house-economist, caretaker and cleaning staff who are employees.',
        },
         {
            'key': 'about_samfundet',
            'text_nb': 'Studentersamfundet i Trondhjem er en organisasjon for studenter i Trondheim som eies og drives av sine rundt 16 100 medlemmer. Formålsparagrafen vår sier at ”Studentersamfundet skal være det naturlige samlingsstedet for studenter i Trondhjem”. Vårt røde runde huser konserter, ulike kulturarrangementer, utallige barer, en kafé og en restaurant. Mest sagnomsust er Samfundsmøtene, viet til debatt om politikk og aktuelle spørsmål, eller til underholdning og moro. Samfundet har også tre av Trondheims beste konsertscener.',
            'text_en': 'Samfundet is an organization for students in Trondheim that is owned and run by its approximately 16100 members. Our mission statement is Samfundet will be the natural meeting place for students in Trondheim. In our red, round building we regularly host concerts and various cultural events, and have countless bars, a café and a restaurant. The Society Meetings are perhaps our most famous events. These meetings serve as a place for debating politics and current events, and but also for entertainment and fun. Samfundet also has three of Trondheim\'s best music venues.',
        },


    ]

    TextItem.objects.all().delete()
    yield 0, 'Deleted old textitems'

    for i, item in enumerate(text_items):
        text_item, created = TextItem.objects.get_or_create(key=item['key'], text_nb=item['text_nb'], text_en=item['text_en'])
        if created:
            yield (100 * (i + 1) // len(text_items), f'Created {len(TextItem.objects.all())} textitems')
