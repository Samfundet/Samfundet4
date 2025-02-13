from __future__ import annotations

from typing import Any

from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save

from .models import User, Profile, UserPreference
from .models.recruitment import Recruitment, RecruitmentStatistics, RecruitmentApplication
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


@receiver(post_save, sender=Recruitment)
def create_recruitment_statistics(sender: Recruitment, instance: Recruitment, *, created: bool, **kwargs: Any) -> None:
    """Ensures stats are created when an recruitment is created"""
    if created:
        RecruitmentStatistics.objects.get_or_create(recruitment=instance)


@receiver(post_save, sender=RecruitmentApplication)
def application_created(sender: RecruitmentApplication, instance: RecruitmentApplication, *, created: bool, **kwargs: Any) -> None:
    if created:
        instance.recruitment.update_stats()


@receiver(post_save, sender=RecruitmentApplication)
def application_interview_set(sender: RecruitmentApplication, instance: RecruitmentApplication, *, created: bool, **kwargs: Any) -> None:
    """
    Checks if an application gets an interview set, and if it is in a shared group
    Will then set all applications for same interview group which has no interview by saving
    Saving is done to affect then other possibly changed fields
    """
    if not created:
        interview_group = instance.recruitment_position.shared_interview_group
        interview = instance.interview
        if interview and interview_group:
            for application in RecruitmentApplication.objects.filter(user=instance.user, recruitment_position__in=interview_group.positions.all()):
                if application.interview is None:
                    application.save()


@receiver(pre_save, sender=RecruitmentApplication)
def application_applicant_rejected_or_accepted(sender: RecruitmentApplication, instance: RecruitmentApplication, **kwargs: Any) -> None:  # noqa C901
    """Whenever an applicant is contacted, set all other applications to automatic rejection"""

    obj = RecruitmentApplication.objects.filter(pk=instance.pk).first()
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
            for other_application in RecruitmentApplication.objects.filter(
                recruitment=obj.recruitment, user=obj.user, recruiter_status=RecruitmentStatusChoices.NOT_SET
            ).exclude(id=obj.id):
                other_application.recruiter_status = RecruitmentStatusChoices.AUTOMATIC_REJECTION
                other_application.save()

        # Check if status is reverted from called, this will set all all AUTOMATIC_REJECTION back
        elif obj.recruiter_status in [
            RecruitmentStatusChoices.CALLED_AND_ACCEPTED,
            RecruitmentStatusChoices.CALLED_AND_REJECTED,
        ]:
            # Set all others to Automatic rejection
            for other_application in RecruitmentApplication.objects.filter(
                recruitment=obj.recruitment, user=obj.user, recruiter_status=RecruitmentStatusChoices.AUTOMATIC_REJECTION
            ).exclude(id=obj.id):
                other_application.recruiter_status = RecruitmentStatusChoices.NOT_SET
                other_application.save()
