from typing import Any

from django.dispatch import receiver
from django.db.models.signals import post_save, m2m_changed

from guardian.shortcuts import assign_perm, remove_perm

from samfundet.permissions import SAMFUNDET_CHANGE_EVENT, SAMFUNDET_DELETE_EVENT

from .models import UserPreference, Profile, User, Event, Gang


@receiver(post_save, sender=User)
def create_user_preference(sender: User, instance: User, created: bool, **kwargs: Any) -> None:
    """Ensures user_preference is created whenever a user is created."""
    if created:
        UserPreference.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def create_profile(sender: User, instance: User, created: bool, **kwargs: Any) -> None:
    """Ensures profile is created whenever a user is created."""
    if created:
        Profile.objects.get_or_create(user=instance)


@receiver(m2m_changed, sender=Event.editors.through)
def update_editor_permissions(
    sender: User,
    instance: Event,
    action: str,
    reverse: bool,
    model: Gang,
    pk_set: set[int],
    **kwargs: dict,
) -> None:
    if action in ['post_add', 'post_remove', 'post_clear']:
        current_editors: set[Gang] = set(instance.editors.all())

        # In the case of a removal or clear, the related objects have already been removed by the time the
        # signal handler is called, so we can calculate the set of removed objects by subtracting the current
        # set of related objects from the set of all related object primary keys.
        if action in ['post_remove', 'post_clear']:
            removed_gangs: set[Gang] = set(model.objects.filter(pk__in=pk_set)) - current_editors
            for gang in removed_gangs:
                if gang.event_admin_group:
                    remove_perm(perm=SAMFUNDET_CHANGE_EVENT, user_or_group=gang.event_admin_group, obj=instance)
                    remove_perm(perm=SAMFUNDET_DELETE_EVENT, user_or_group=gang.event_admin_group, obj=instance)
                if gang.gang_leader_group:
                    remove_perm(perm=SAMFUNDET_CHANGE_EVENT, user_or_group=gang.gang_leader_group, obj=instance)
                    remove_perm(perm=SAMFUNDET_DELETE_EVENT, user_or_group=gang.gang_leader_group, obj=instance)

        # In the case of an add, the related objects have already been added by the time the signal handler is called.
        if action == 'post_add':
            for gang in current_editors:
                if gang.event_admin_group:
                    assign_perm(perm=SAMFUNDET_CHANGE_EVENT, user_or_group=gang.event_admin_group, obj=instance)
                    assign_perm(perm=SAMFUNDET_DELETE_EVENT, user_or_group=gang.event_admin_group, obj=instance)
                if gang.gang_leader_group:
                    assign_perm(perm=SAMFUNDET_CHANGE_EVENT, user_or_group=gang.gang_leader_group, obj=instance)
                    assign_perm(perm=SAMFUNDET_DELETE_EVENT, user_or_group=gang.gang_leader_group, obj=instance)
