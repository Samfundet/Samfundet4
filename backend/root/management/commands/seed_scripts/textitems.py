from __future__ import annotations

from samfundet.models.general import TextItem

# ruff: noqa: E501


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
            'text_en': "Every other year, Norway's largest cultural festival UKA and the world's largest international thematic student festival are organized under Studentersamfundet's umbrella.",
        },
        {
            'key': 'volunteering',
            'text_nb': 'Det meste av arbeid på Studentersamfundet i Trondhjem gjøres gjennom dugnad av studenter. Arbeidet er organisert i enheter som kalles gjenger. Potensielle nye medlemmer må søke den aktuelle gjengen om opptak, og gjengen vurderer hver enkelt søker. Med sine omtrent 1700 frivillige utgjør det indre miljøet i Studentersamfundet en betydelig del av det organiserte fritidstilbudet til studenter i Trondheim.',
            'text_en': 'Most of the work at Samfundet is done on a voluntary basis by students. The work is organized into units called gangs. Prospective new members must apply to the appropriate group for application and the group reviews each applicant. With around 1700 volunteers, the internal environment of Samfundet constitutes a significant part of organized leisure activities for students in Trondheim.',
        },
        {
            'key': 'the_society_meeting',
            'text_nb': 'Samfundsmøtet er Studentersamfundets høyeste organ. Her velges leder samt medlemmer til Finansstyret og Rådet. Lederen velger ut sitt eget styre, som utformer den politiske profilen og representer medlemmene og foreningen Samfundet. Finansstyret administrerer forretningsdriften. Rådet kontrollerer at all virksomhet i Samfundet foregår i henhold til norske og interne lover. Samfundet har en daglig leder, økonomiansvarlig, husøkonom, vaktmester og renholdspersonell som er ansatte.',
            'text_en': "The Society Meeting is our highest organ. We elect the leader here, as well as members of the Finance Board and the Council. The leader, elected politically, chooses his or her own Board, which forms the House's political profile and represents all of Samfundet's members. The Finance Board manages the business. The Council ensures that all activities at Samfundet take place according to Norwegian and internal laws. Samfundet has a general manager, financial manager, house-economist, caretaker and cleaning staff who are employees.",
        },
        {
            'key': 'about_samfundet',
            'text_nb': 'Studentersamfundet i Trondhjem er en organisasjon for studenter i Trondheim som eies og drives av sine rundt 16 100 medlemmer. Formålsparagrafen vår sier at ”Studentersamfundet skal være det naturlige samlingsstedet for studenter i Trondhjem”. Vårt røde runde huser konserter, ulike kulturarrangementer, utallige barer, en kafé og en restaurant. Mest sagnomsust er Samfundsmøtene, viet til debatt om politikk og aktuelle spørsmål, eller til underholdning og moro. Samfundet har også tre av Trondheims beste konsertscener.',
            'text_en': "Samfundet is an organization for students in Trondheim that is owned and run by its approximately 16100 members. Our mission statement is Samfundet will be the natural meeting place for students in Trondheim. In our red, round building we regularly host concerts and various cultural events, and have countless bars, a café and a restaurant. The Society Meetings are perhaps our most famous events. These meetings serve as a place for debating politics and current events, and but also for entertainment and fun. Samfundet also has three of Trondheim's best music venues.",
        },
        {
            'key': 'samf_recruitment_description',
            'text_nb': 'Studentersamfundet i Trondhjem har opptak ved starten av hvert semester. Vi ønsker at du søker til oss som frivillig! Studentersamfundet i Trondhjem er Norges største studentersamfund og vi har et tilbud andre byer bare kan drømme om.',
            'text_en': 'Studentersamfundet in Trondheim has recruitments at the start of each semester. We would like you to apply to us as a volunteer! Studentersamfundet in Trondheim is Norways largest student society and we have an offer that other cities can only dream of.',
        },
        {
            'key': 'no_recruitment_samf_header',
            'text_nb': 'Det er for tiden ingen opptak på Samfundet',
            'text_en': 'There are currently no recruitments at Samfundet',
        },
        {
            'key': 'no_recruitment_samf_next',
            'text_nb': 'Vi har opptak på starten av hvert semester og ønsker at du søker til oss som frivillig!',
            'text_en': 'We have recruitments at the start of each semester and would like you to apply to us as a volunteer!',
        },
        {
            'key': 'no_recruitment_samf_about',
            'text_nb': 'Studentersamfundet i Trondhjem er Norges største studentersamfund og vi har et tilbud andre byer bare kan drømme om.',
            'text_en': 'Studentersamfundet in Trondhjem is Norways largest student society and we have an offer that other cities can only dream of.',
        },
        {
            'key': 'isfit_recruitment_description',
            'text_nb': 'ISFIT har opptak ved starten av hvert semester. Vi ønsker at du søker til oss som frivillig! Som frivillig i ISFIT får du muligheten til å være med på å arrangere verdens største studentfestival.',
            'text_en': 'ISFIT has recruitments at the start of each semester. We would like you to apply to us as a volunteer! As a volunteer in ISFIT, you get the opportunity to help organize the worlds largest student festival.',
        },
        {
            'key': 'no_recruitment_isfit_header',
            'text_nb': 'Det er for tiden ingen opptak på Samfundet',
            'text_en': 'There are currently no recruitments at Samfundet',
        },
        {
            'key': 'no_recruitment_isfit_next',
            'text_nb': 'Vi har opptak på starten av hvert semester og ønsker at du søker til oss som frivillig!',
            'text_en': 'We have recruitments at the start of each semester and would like you to apply to us as a volunteer!',
        },
        {
            'key': 'no_recruitment_isfit_about',
            'text_nb': 'Studentersamfundet i Trondhjem er Norges største studentersamfund og vi har et tilbud andre byer bare kan drømme om.',
            'text_en': 'Studentersamfundet in Trondhjem is Norways largest student society and we have an offer that other cities can only dream of.',
        },
        {
            'key': 'uka_recruitment_description',
            'text_nb': 'UKA har opptak ved starten av hvert semester. Vi ønsker at du søker til oss som frivillig! Som frivillig i UKA får du muligheten til å være med på å arrangere Norges største kulturfestival.',
            'text_en': "UKA has recruitments at the start of each semester. We would like you to apply to us as a volunteer! As a volunteer in UKA, you get the opportunity to help organize Norway's largest cultural festival.",
        },
        {
            'key': 'no_recruitment_uka_header',
            'text_nb': 'Det er for tiden ingen opptak på Samfundet',
            'text_en': 'There are currently no recruitments at Samfundet',
        },
        {
            'key': 'no_recruitment_uka_next',
            'text_nb': 'Vi har opptak på starten av hvert semester og ønsker at du søker til oss som frivillig!',
            'text_en': 'We have recruitments at the start of each semester and would like you to apply to us as a volunteer!',
        },
        {
            'key': 'no_recruitment_uka_about',
            'text_nb': 'Studentersamfundet i Trondhjem er Norges største studentersamfund og vi har et tilbud andre byer bare kan drømme om.',
            'text_en': 'Studentersamfundet in Trondhjem is Norways largest student society and we have an offer that other cities can only dream of.',
        },
        {
            'key': 'sulten_reservation_help',
            'text_nb': 'Bord må reserveres minst en dag i forveien. Mat kan forhåndsbestilles slik at dere ikke trenger å vente når dere kommer. Merk at flertallet av personer må være medlem for å reservere og at alle må være over 20 år etter kl 20:00 i helger.',
            'text_en': 'Tables must be reserved at least one day in advance. Food can be pre-ordered so you do not have to wait when  you arrive. Note that the majority of people must be a member of the Student Society to reserve and that all must be over 20 years after 20:00 on weekends.',
        },
        {
            'key': 'sulten_reservation_contact',
            'text_nb': 'Reservasjonssystemet vårt er fortsatt under utvikling, og vi ber om forbehold om at feil kan forekomme. Klikk her for å bestille via epost: ',
            'text_en': 'Our reservation system is still under development, and reservation errors may therefore occur. Click here to order via email: ',
        },
        # Membership
        {
            'key': 'membership',
            'text_nb': 'Samfundet er en viktig del av student-tilværelsen. Du vil aldri angre på at du kjøpte ditt medlemskort!',
            'text_en': 'You will never regret buying a membership at Samfundet, simply because it is such an important part of the student life in Trondheim.',
        },
        {
            'key': 'why_member_header',
            'text_nb': 'Hvorfor bli medlem?',
            'text_en': 'Why become a member?',
        },
        {
            'key': 'why_member_text',
            'text_nb': 'Det finnes mange grunner til å bli medlem på Samfundet:',
            'text_en': 'There are many reasons to become a member at Samfundet:',
        },
        {
            'key': 'why_member_list_0',
            'text_nb': 'Gratis inngang hver dag unntatt festivaler, temafester og andre spesielle arrangementer. Rabatt på alle arrangementer; konserter, temafester osv.',
            'text_en': 'Free entrance every day except during the festivals, theme parties and other special events. You do get a discount on all events, including concerts, theme parties, etc.',
        },
        {
            'key': 'why_member_list_1',
            'text_nb': 'Medlemspriser på Fotogjengens bilder fra alle Samfundets arrangementer.',
            'text_en': "Member prices on the Photo Group's pictures from all of Samfundet's events.",
        },
        {
            'key': 'why_member_list_2',
            'text_nb': 'Stemmerett på Samfundsmøtene, og mulighet til å fremme forslag til Storsalen.',
            'text_en': 'The right to vote at Samfundet-meetings, and the opportunity to submit proposals to Storsalen.',
        },
        {
            'key': 'why_member_list_3',
            'text_nb': 'Medlemspriser på et utvalg av mat og drikke på Samfundet.',
            'text_en': 'Member prices on a variety of food and drinks at Samfundet.',
        },
        {
            'key': 'why_member_list_4',
            'text_nb': 'Medlemspriser på varer og billetter på Det Norske Studentersamfundet i Oslo, Det Akademiske Kvarter i Bergen, Studentersamfunnet i Ås, HUSET i Gjøvik og Ålesund Studentsamfunn',
            'text_en': 'Member prices on a variety of goods and tickets at Det Norske Studentersamfundet in Oslo, Det Akademiske Kvarter in Bergen, Studentersamfunnet in Ås, HUSET in Gjøvik and Ålesund Studentsamfunn',
        },
        {
            'key': 'why_member_list_5',
            'text_nb': 'Mulighet til å ta med én ikke-medlem over 18 år inn på huset mot betaling. NB! Kun via hovedinngangen.',
            'text_en': 'The possibility to bring one paying non-member above the age of 18. NB! Only through the main entrance.',
        },
        {
            'key': 'why_member_list_6',
            'text_nb': 'Rabatt på gatekjøkkenet Sesam.',
            'text_en': 'A discount at Sesam fast food.',
        },
        {
            'key': 'why_member_list_7',
            'text_nb': 'Mulighet til å bli med i en av Studentersamfundets gjenger, UKAs og ISFITs gjenger, og å stille til valg i Storsalen.',
            'text_en': "Opportunity to become a part of one of Samfundet's internal gangs, UKA's and ISFIT's gangs, and run for election at Storsalen.",
        },
        {
            'key': 'membership_prices_header',
            'text_nb': 'Priser for medlemskap',
            'text_en': 'Prices on membership',
        },
        {
            'key': 'membership_prices_0',
            'text_nb': '5 år: kr 1500,-',
            'text_en': '5 years: 1500 NOK',
        },
        {
            'key': 'membership_prices_1',
            'text_nb': '3 år: kr 1100,-',
            'text_en': '3 years: 1100 NOK',
        },
        {
            'key': 'membership_prices_2',
            'text_nb': '1 år: kr 550,-',
            'text_en': '1 year: 550 NOK',
        },
        {
            'key': 'membership_prices_3',
            'text_nb': '6 måneder: 350,- NB: Gjelder for alle på vårsemesteret, og kun utvekslingsstudenter på høstsemesteret',
            'text_en': '6 months: 350 NOK, NB: Available for everyone in the spring term, and only exchange students in the fall semester',
        },
        {
            'key': 'membership_prices_4',
            'text_nb': 'Fornyelse av medlemsskap, 1 år: 450,- (kan fornyes i luka eller på akademika)',
            'text_en': 'Renewal of membership, 1 year: 440,- (you can do this in Luka or at Akademika)',
        },
        {
            'key': 'membership_prices_5',
            'text_nb': 'NB! Medlemskap følger skoleåret og har utløpsdato i august',
            'text_en': 'NB! The membership follows the study year and expires in August.',
        },
        {
            'key': 'who_member_header',
            'text_nb': 'Hvem kan bli medlem?',
            'text_en': 'Who can become a member?',
        },
        {
            'key': 'who_member_text',
            'text_nb': 'Du kan bli medlem av Samfundet dersom du er over 18 år og:',
            'text_en': 'You can join Samfundet if you are over 18 years and:',
        },
        {
            'key': 'who_member_list_0',
            'text_nb': 'Er eller har vært student eller lærer ved en utdanningsinstitusjon i Trondheimsområdet som baserer seg på heltidsstudier, samt er tilknyttet Studentsamskipnaden. (NTNU, DMMH, Luftkrigsskolen, BI, Fotofagskolen og Trondheim Fagskole)',
            'text_en': 'Is, or have been, a student or teacher at an educational institution based on full time studies, connected to Studentsamskipnadden in Trondheim. (NTNU, DMMH, Luftkrigsskolen, BI, Fotofagskolen and Trondheim Fagskole)',
        },
        {
            'key': 'who_member_list_1',
            'text_nb': 'Er eller har vært student ved en utdanningsinstitusjon som baserer seg på heltidsstudier tilknyttet en studentsamskipnad, og som nå er bosatt i Trondheimsområdet',
            'text_en': 'Is, or have been a student at an educational institution based on full time studies, connected to Studentsamskipnadden and are now living in the Trondheim area.',
        },
        {
            'key': 'who_member_list_2',
            'text_nb': 'Er, eller har vært, studenter ved en tilsvarende utdanningsinstitusjon utenfor Norge, som nå er bosatt i Trondheimsområdet',
            'text_en': 'Is, or have been a student at an equivalent educational institution outside of Norway and are now living in the Trondheim area.',
        },
        {
            'key': 'member_benefits',
            'text_nb': 'Medlemsfordeler ved andre studenthus',
            'text_en': 'Member benefits at other student houses in Norway',
        },
        {
            'key': 'member_benefits_text',
            'text_nb': 'Har du gyldig medlemskap hos Det Norske Studentersamfund, Det Akademiske Kvarter, Studentersamfunnet i Ås, Ålesund Studentsamfunn eller er frivillig på HUSET i Gjøvik får du følgende fordeler hos oss:',
            'text_en': 'If you have a valid membership of Det Norske Studentersamfund, Det Akademiske Kvarter, Studentersamfunnet in Ås, Ålesund Studentsamfunnet or are a volunteer at HUSET in Gjøvik, you get these following benefits at Samfundet:',
        },
        {
            'key': 'member_benefits_list_0',
            'text_nb': 'Gratis inngang hver dag unntatt festivaler, temafester og andre spesielle arrangementer',
            'text_en': 'Free entry every day except for festivals, themed parties and other special events',
        },
        {
            'key': 'member_benefits_list_1',
            'text_nb': 'Rabatt på alle arrangementer; konserter, temafester osv.',
            'text_en': 'Discount on all events; concerts, themed parties, etc.',
        },
        {
            'key': 'member_benefits_list_2',
            'text_nb': 'Medlemspriser på et utvalg av mat og drikke på Samfundet',
            'text_en': 'Member prices on a variety of food and drinks at Samfundet',
        },
        {
            'key': 'member_benefits_list_3',
            'text_nb': 'Medlemspriser på Fotogjengens bilder fra alle Samfundets arrangementer',
            'text_en': "Member prices on Fotogjengen's photos from all of Samfundet's events",
        },
        {
            'key': 'buy_membership',
            'text_nb': 'Hvor kjøper jeg medlemskap?',
            'text_en': 'Where to buy a membership?',
        },
        {
            'key': 'buy_membership_text_0',
            'text_nb': 'Medlemskort selges i Luka (Samfundets resepsjon) som er lokalisert ved glassinngangen på søndre side. Åpningstider finner du ',
            'text_en': "We sell memberships at Luka (Samfundet's reception), which is by the glass entrance. You can find the opening hours",
        },
        {
            'key': 'buy_membership_text_1',
            'text_nb': 'Akademika selger også medlemskort til Samfundet. Oversikt over Akademikabutikker i Trondheim finner du ',
            'text_en': 'Akademika also sells membership cards to the Society. You can find an overview of Akademika stores in Trondheim ',
        },
        {
            'key': 'buy_membership_text_2',
            'text_nb': 'Husk å ta med legitimasjon og studentbevis ved kjøp av medlemskort! NB: Medlemskap er personlig og kan ikke selges videre eller deles med andre.',
            'text_en': 'Remember ID and student-ID when you wish to become a member! NB: Membership cards are personal and cannot be sold to others.',
        },
        {
            'key': 'register_card',
            'text_nb': 'Registrer kortet på våre nettsider',
            'text_en': 'Register the card on our website',
        },
        {
            'key': 'register_card_text',
            'text_nb': 'Det er viktig at du registrerer deg for at ingen skal kunne misbruke medlemsnummeret ditt, og for at du skal kunne få erstattet mistet kort. Dette gjør du på medlemsdatabasen vår medlem.samfundet.no. Medlemskortet er gyldig uten bilde én uke etter det er kjøpt. Etter dette må du ha limt på bilde av deg selv på kortet for at det skal være gyldig. Husk at du bare skal registrere deg første gang du får kort. Når du så senere får nytt oblat eller nytt kort skal du kun oppdatere de opplysningene du allerede har lagret, ikke registrere deg på nytt.',
            'text_en': 'It is important that you register so that nobody can abuse your membership number, and so that you can replace a lost card. You can register at out member database medlem.samfundet.no. The card is valid without a picture one week after it is purchased. After one week, you must have a photo of yourself on the card for it to be valid. Remember that you must register the first time you receive a card. When you later get a new sticker or a new card, you only need to update the information already saved, you do not need to register all over again.',
        },
        {
            'key': 'laws_and_statutes_header',
            'text_nb': 'Samfundets lover og statutter',
            'text_en': 'The laws and statutes of Samfundet',
        },
        {
            'key': 'laws_and_statutes_text',
            'text_nb': 'Du finner lovene som gjelder for deg når du er medlem på Samfundet ',
            'text_en': 'You can find the laws that apply to you when you are a member at Samfundet ',
        },
        {
            'key': 'feedback_helper_text',
            'text_nb': 'Vi ønsker å vite hva vi kan gjøre bedre og hva du syntes er bra med denne siden.',
            'text_en': 'We want to know what we can do better and what you think is good about this page.',
        },
        {
            'key': 'feedback_want_contact_text',
            'text_nb': 'Om du ønsker at vi skal kontakte deg kan du skrive eposten din her.',
            'text_en': 'If you want us to contact you, you can write your email here.',
        },
        {
            'key': 'sulten_reservation_policy',
            'text_nb': 'Jeg godtar Samfundets personværnserklæring.',
            'text_en': "I agree to Samfundet's privacy policy.",
        },
        {
            'key': 'purchase_feedback_title',
            'text_nb': 'Hvor hørte du om dette arrangementet?',
            'text_en': 'Where did you hear about this event?',
        },
        {
            'key': 'purchase_feedback_alternative_1',
            'text_nb': 'samfundet.no',
            'text_en': 'samfundet.no',
        },
        {
            'key': 'purchase_feedback_alternative_2',
            'text_nb': 'venner',
            'text_en': 'friends',
        },
        {
            'key': 'purchase_feedback_alternative_3',
            'text_nb': 'plakat',
            'text_en': 'poster',
        },
        {
            'key': 'purchase_feedback_alternative_4',
            'text_nb': 'sosiale medier',
            'text_en': 'social media',
        },
        {
            'key': 'purchase_feedback_question_1',
            'text_nb': 'andre steder:',
            'text_en': 'other places:',
        },
        {
            'key': 'purchase_feedback_question_2',
            'text_nb': 'Har du noen øvrige kommentarer til arrangementet?',
            'text_en': 'Do you have any other feedback in regards to the event?',
        },
        {
            'key': 'gangspage_text',
            'text_nb': 'Samfundet består av mer enn 20 gjenger som jobber med blandt annet lyd, lys, teater, snekring, IT, artistbooking, korsang, markedsføring, musikk og mye annet. Gjengene er organisert i følgende grupperinger:',
            'text_en': 'Samfundet consists of more than 20 gangs (gjenger) with different responsibilities, including lights, theatre, IT, booking, music, marketing and lots more!',
        },
    ]

    TextItem.objects.all().delete()
    yield 0, 'Deleted old textitems'

    for i, item in enumerate(text_items):
        _text_item, created = TextItem.objects.get_or_create(key=item['key'], text_nb=item['text_nb'], text_en=item['text_en'])
        if created:
            yield (100 * (i + 1) // len(text_items), f'Created {len(TextItem.objects.all())} textitems')
