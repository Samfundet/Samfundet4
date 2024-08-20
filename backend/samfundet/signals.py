from __future__ import annotations

from typing import Any

from guardian.shortcuts import assign_perm, remove_perm

from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save, m2m_changed

from samfundet.permissions import SAMFUNDET_CHANGE_EVENT, SAMFUNDET_DELETE_EVENT

from .models import Gang, User, Event, Profile, UserPreference
from .models.recruitment import Recruitment, RecruitmentAdmission, RecruitmentStatistics
from .models.model_choices import RecruitmentStatusChoices


@receiver(post_save, sender=User)
def create_user_preference(sender: User, instance: User, *, created: bool, **kwargs: Any) -> None:
    """Ensures user_preference is created whenever a user is created."""
    if created:
        UserPreference.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def create_profile(sender: User, instance: User, *, created: bool, **kwargs: Any) -> None:
    """Ensures profile is created whenever a user is created."""
    if created:
        Profile.objects.get_or_create(user=instance)


@receiver(m2m_changed, sender=Event.editors.through)
def update_editor_permissions(  # noqa: C901
    sender: User,
    instance: Event,
    action: str,
    model: Gang,
    pk_set: set[int],
    *,
    reverse: bool,
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


@receiver(post_save, sender=Recruitment)
def create_recruitment_statistics(sender: Recruitment, instance: Recruitment, *, created: bool, **kwargs: Any) -> None:
    """Ensures stats are created when an recruitment is created"""
    if created:
        RecruitmentStatistics.objects.get_or_create(recruitment=instance)

@receiver(post_save, sender=RecruitmentAdmission)
def admission_created(sender: RecruitmentAdmission, instance: RecruitmentAdmission, *, created: bool, **kwargs: Any) -> None:
    if created:
        instance.recruitment.update_stats()


@receiver(pre_save, sender=RecruitmentAdmission)
def admission_applicant_rejected_or_accepted(sender: RecruitmentAdmission, instance: RecruitmentAdmission, **kwargs: Any) -> None:  # noqa C901
    """Whenever an applicant is contacted, set all other admissions to automatic rejection"""

    obj = RecruitmentAdmission.objects.filter(pk=instance.pk).first()
    if not obj:
        return
    # Check if Status is set to called
    if obj.recruiter_status != instance.recruiter_status:
        # Check if Status is changed to called, then set all unset to AUTOMATIC_REJECTION
        if instance.recruiter_status in [
            RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            RecruitmentStatusChoices.CALLED_AND_REJECTED,
        ]:
            # Set all others to Automatic rejection
            for other_admission in RecruitmentAdmission.objects.filter(
                recruitment=obj.recruitment, user=obj.user, recruiter_status=RecruitmentStatusChoices.NOT_SET
            ).exclude(id=obj.id):
                other_admission.recruiter_status = RecruitmentStatusChoices.AUTOMATIC_REJECTION
                other_admission.save()

        # Check if status is reverted from called, this will set all all AUTOMATIC_REJECTION back
        elif obj.recruiter_status in [
            RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            RecruitmentStatusChoices.CALLED_AND_REJECTED,
        ]:
            # Set all others to Automatic rejection
            for other_admission in RecruitmentAdmission.objects.filter(
                recruitment=obj.recruitment, user=obj.user, recruiter_status=RecruitmentStatusChoices.AUTOMATIC_REJECTION
            ).exclude(id=obj.id):
                other_admission.recruiter_status = RecruitmentStatusChoices.NOT_SET
                other_admission.save()
