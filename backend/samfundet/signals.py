from typing import Any

from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User

from .models import UserPreference, Profile

# pylint: disable=unused-argument, positional-arguments


@receiver(post_save, sender=User)
def create_user_preference(sender: User, instance: User, created: bool, **kwargs: Any) -> None:
    if created:
        UserPreference.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def create_profile(sender: User, instance: User, created: bool, **kwargs: Any) -> None:
    if created:
        Profile.objects.get_or_create(user=instance)
