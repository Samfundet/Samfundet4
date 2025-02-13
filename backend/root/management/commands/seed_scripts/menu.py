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
    ('Middag', 'Dinner'): [
        ('Pølse', 'Sausage'),
        ('Burger', 'Burger'),
        ('Suppe', 'Soup'),
    ],
    ('Drikke', 'Drinks'): [
        ('Brus', 'Soda'),
        ('Øl', 'Beer'),
        ('Vin', 'Wine'),
        ('White Russian', 'White Russian'),
    ],
    ('Dessert', 'Dessert'): [
        ('Vaniljeis', 'Vanilla Icecream'),
        ('Belgisk Vaffel', 'Belgian Waffle'),
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
        for _, it_name in enumerate(menu_template[cat_name]):
            base_price = random.randint(15, 150)
            item = MenuItem.objects.create(
                name_nb=it_name[0],
                name_en=it_name[1],
                description_nb=words(10),
                description_en=words(10),
                food_category=category,
                price=base_price,
                price_member=int(base_price * 0.8),
            )
            item.food_preferences.add(*random.sample(prefs, random.randint(0, 3)))
            menu_items.append(item)

        # Estimate seeding progress (80% to create items + 10% from earlier)
        progress = 10 + (i / len(menu_template.keys())) * 80
        yield progress, 'Creating menu items'

    # Create menu
    menu = Menu.objects.create(
        name_nb='Frø-meny',
        name_en='Seed menu',
        description_nb=words(10),
        description_en=words(10),
    )
    menu.menu_items.add(*menu_items)

    yield 100, f'Created {Menu.objects.all().count()} menu with {MenuItem.objects.all().count()} items'
