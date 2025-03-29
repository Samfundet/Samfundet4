from __future__ import annotations

import random

from root.utils.samfundet_random import words

from samfundet.models.general import Menu, MenuItem, FoodCategory, FoodPreference

preferences = [
    ('Vegetar', 'Vegetarian'),
    ('Uten alkohol', 'Non-alcoholic'),
    ('Uten ananas', 'Without pineapple'),
]

menu_template = {
    ('Småretter', 'Starters'): [
        ('Lychebrød', 'Lyche bread', 'Serveres med en skål aioli på siden.', 'Served with a bowl of aioli on the side.'),
        ('Husets suppe', 'Soup of the house', 'Dagens ferske suppe laget fra bunnen av våre kokker.', "Today's fresh soup made from scratch by our chefs."),
    ],
    ('Burgere', 'Burgers'): [
        (
            'Lycheburger',
            'Lyche burger',
            "Okse og n'duja kjøtt, servert med løkkompott, bacon, tomater, aioli, cheddar, salat og potet på siden.",
            "Beef and n'duja meat, served with onion compote, bacon, tomatoes, aioli, cheddar, lettuce and potatoes on the side.",
        ),
        (
            'Spicyburger',
            'Spicy burger',
            'Saftig burger med jalapeños, chipotle-aioli og sprø løk.',
            'Juicy burger with jalapeños, chipotle aioli and crispy onions.',
        ),
        (
            'Søtpotetburger',
            'Sweet potato burger',
            'Vegetarburger med søtpotet, servert med frisk salat og hummus.',
            'Vegetarian burger with sweet potato, served with fresh salad and hummus.',
        ),
    ],
    ('Hovedretter', 'Main courses'): [
        (
            'Marrokansk curry',
            'Moroccan curry',
            'Smaksrik curry med kikerter, grønnsaker og krydder. Serveres med ris.',
            'Flavorful curry with chickpeas, vegetables and spices. Served with rice.',
        ),
        (
            'Blåskjell',
            'Mussels',
            'Dampede blåskjell i hvitvinssaus med friske urter og aioli.',
            'Steamed mussels in white wine sauce with fresh herbs and aioli.',
        ),
    ],
    ('Dessert', 'Dessert'): [
        ('Ostekake', 'Cheesecake', 'Kremet ostekake med bjørnebærcoulis og friske bær.', 'Creamy cheesecake with blackberry coulis and fresh berries.'),
        ('Husets is', 'Ice cream of the house', 'Hjemmelaget is med sesongbasert smak.', 'Homemade ice cream with seasonal flavor.'),
    ],
    ('Mineralvann', 'Mineral water'): [
        ('7UP', '7UP', 'Frisk sitronbrus', 'Fresh lemon-lime soda'),
        ('Eplemost', 'Apple Juice', 'Naturlig eplemost', 'Natural apple juice'),
        ('Pepsi', 'Pepsi', 'Classic cola', 'Classic cola'),
        ('Pepsi Max', 'Pepsi Max', 'Sukkerfri cola', 'Sugar-free cola'),
        ('Solo', 'Solo', 'Norsk appelsinbrus', 'Norwegian orange soda'),
        ('1664 Blanc - Uten alkohol', '1664 Blanc - Non alcoholic', 'Alkoholfri hveteøl med sitrussmak', 'Non-alcoholic wheat beer with citrus flavor'),
        ('Brooklyn Special Effects', 'Brooklyn Special Effects', 'Alkoholfri lager', 'Non-alcoholic lager'),
        ('Munkholm', 'Munkholm', 'Klassisk alkoholfri øl', 'Classic non-alcoholic beer'),
    ],
    ('Øl', 'Beer'): [
        ('Dahls pils', 'Dahls pilsner', 'Klassisk trøndersk pilsner', 'Classic pilsner from Trondheim'),
        ('1664 Blanc - Med alkohol', '1664 Blanc - With alcohol', 'Fransk hveteøl med hint av sitrus', 'French wheat beer with hints of citrus'),
        ('7 Fjell Fløien IPA', '7 Fjell Fløien IPA', 'Fruktig IPA med god bitterhet', 'Fruity IPA with good bitterness'),
        ('Carlsberg', 'Carlsberg', 'Dansk pilsner', 'Danish pilsner'),
        ('Ringnes Lite', 'Ringnes Lite', 'Lettøl med redusert kaloriinnhold', 'Light beer with reduced calorie content'),
    ],
    ('Cider og rusbrus', 'Cider and Alcopops'): [
        ('Somersby Pære', 'Somersby Pear', 'Søt pærecider', 'Sweet pear cider'),
        ('Somersby Sparkling Rosé', 'Somersby Sparkling Rosé', 'Cider med smak av rosé', 'Cider with rosé flavor'),
        ('Crabbies Ginger Beer', 'Crabbies Ginger Beer', 'Sterk ingefærøl med kick', 'Strong ginger beer with a kick'),
    ],
    ('Hvitvin', 'White Wine'): [
        ('Aroa Laia', 'Aroa Laia', 'Økologisk hvitvin med friske sitrusnoter', 'Organic white wine with fresh citrus notes'),
        ('Enrique Mendoza Chardonnay Joven', 'Enrique Mendoza Chardonnay Joven', 'Elegant chardonnay med hint av eik', 'Elegant chardonnay with hints of oak'),
        ('Hacienda Lopez Haro Blanco', 'Hacienda Lopez Haro Blanco', 'Fruktig og frisk hvitvin fra Rioja', 'Fruity and fresh white wine from Rioja'),
    ],
    ('Rødvin', 'Red Wine'): [
        (
            'Dom. Graveirette Ju De Via',
            'Dom. Graveirette Ju De Via',
            'Økologisk rødvin med mørke bær og krydder',
            'Organic red wine with dark berries and spices',
        ),
        (
            'Finca Valpiedra Cantos Crianza',
            'Finca Valpiedra Cantos Crianza',
            'Balansert rødvin med modne kirsebær og vanilje',
            'Balanced red wine with ripe cherries and vanilla',
        ),
        (
            'Hacienda Lopez de Haro Graciano',
            'Hacienda Lopez de Haro Graciano',
            'Kompleks rødvin med røde bær og urter',
            'Complex red wine with red berries and herbs',
        ),
    ],
}


def seed():
    Menu.objects.all().delete()
    MenuItem.objects.all().delete()
    FoodCategory.objects.all().delete()
    FoodPreference.objects.all().delete()

    # Create food preferences
    prefs = [
        FoodPreference.objects.create(
            name_nb=p_name[0],
            name_en=p_name[1],
        )
        for p_name in preferences
    ]
    yield 10, f'Created {len(preferences)} food preferences'

    # Create menu categories
    menu_items = []
    for i, cat_name in enumerate(menu_template):
        category = FoodCategory.objects.create(
            name_nb=cat_name[0],
            name_en=cat_name[1],
            order=i,
        )

        # Menu items
        for j, item_data in enumerate(menu_template[cat_name]):
            # Extract all item data
            name_nb, name_en, desc_nb, desc_en = item_data

            base_price = random.randint(15, 150)

            # Check if item with this name already exists and make it unique if needed
            existing_count = MenuItem.objects.filter(name_nb=name_nb).count()
            item_name_nb = name_nb
            item_name_en = name_en

            if existing_count > 0:
                item_name_nb = f'{item_name_nb} {category.name_nb}'
                item_name_en = f'{item_name_en} {category.name_en}'

            item = MenuItem.objects.create(
                name_nb=item_name_nb,
                name_en=item_name_en,
                description_nb=desc_nb,
                description_en=desc_en,
                food_category=category,
                price=base_price,
                price_member=int(base_price * 0.8),
            )

            item.food_preferences.add(*random.sample(prefs, random.randint(0, min(3, len(prefs)))))
            menu_items.append(item)

        # Estimate seeding progress (80% to create items + 10% from earlier)
        progress = 10 + (i / len(menu_template.keys())) * 80
        yield progress, 'Creating menu items'

    # Create menu
    menu = Menu.objects.create(
        name_nb='Frø-meny',
        name_en='Seed menu',
        description_nb='Vår spesielle meny med et utvalg av retter og drikke.',
        description_en='Our special menu with a selection of dishes and drinks.',
    )
    menu.menu_items.add(*menu_items)
    yield 100, f'Created {Menu.objects.all().count()} menu with {MenuItem.objects.all().count()} items'
