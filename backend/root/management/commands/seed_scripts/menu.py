
import random

from samfundet.models import Menu, MenuItem, FoodCategory, FoodPreference


preferences = [
    ("Vegetar", "Vegetarian"),
    ("Uten alkohol", "Non-alkoholic"),
    ("Uten ananas", "Without pineapple"),
]

menu = {
    ('Middag', 'Dinner'): [
        ('Pølse', 'Sausage'), 
        ('Burger', 'Burger'), 
        ('Suppe', 'Soup')
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

    # Create food preferences
    prefs = [
        FoodPreference.objects.create(
            name_no=p_name[0],
            name_no=p_name[1],
        )
        for p_name in preferences
    ]
    yield 10, "Created food preferences"
    
    # Create menu categories
    menu_items = []
    for i, cat_name in enumerate(menu):
        category = FoodCategory.objects.create(
            name_no=cat_name[0],
            name_en=cat_name[1],
            order=i
        )

        # Menu items
        for j, it_name in enumerate(menu[category]):
            item = MenuItem.objects.create(
                name_no=it_name[0],
                name_en=it_name[1],
                food_category=category,
                food_preferences=random.sample(
                    prefs, random.randint(0, 3)
                ),
                menu=menu,
                order=j
            )
            menu_items.append(item)

        yield 10 + (i/len(menu.keys())) * 80, f"Created menu items for '{cat_name[0]}'"

    # Create menu
    menu = Menu.objects.create(
        name_no="Frø-meny",
        name_en="Seed menu",
        menu_items=menu_items
    )


    yield 100, "Created menu"
