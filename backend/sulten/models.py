from django.db import models
from root.utils.mixins import CustomBaseModel


class FoodPreference(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')

    class Meta:
        verbose_name = 'FoodPreference'
        verbose_name_plural = 'FoodPreferences'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class FoodCategory(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    class Meta:
        verbose_name = 'FoodCategory'
        verbose_name_plural = 'FoodCategories'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class MenuItem(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    price = models.PositiveSmallIntegerField(blank=True, null=True)
    price_member = models.PositiveSmallIntegerField(blank=True, null=True)

    order = models.PositiveSmallIntegerField(blank=True, null=True, unique=True)

    food_preferences = models.ManyToManyField(FoodPreference, blank=True)
    food_category = models.ForeignKey(FoodCategory, blank=True, null=True, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'MenuItem'
        verbose_name_plural = 'MenuItems'

    def __str__(self) -> str:
        return f'{self.name_nb}'


class Menu(CustomBaseModel):
    name_nb = models.CharField(max_length=64, unique=True, blank=True, null=True, verbose_name='Navn (norsk)')
    description_nb = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (norsk)')

    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn (engelsk)')
    description_en = models.TextField(blank=True, null=True, verbose_name='Beskrivelse (engelsk)')

    menu_items = models.ManyToManyField(MenuItem, blank=True)

    class Meta:
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'

    def __str__(self) -> str:
        return f'{self.name_nb}'
