from __future__ import annotations

from django.db import models
from django.utils.translation import gettext as _


class RecruitmentPriorityChoices(models.IntegerChoices):
    NOT_SET = 0, _('Not Set')
    RESERVE = 1, _('Reserve')
    WANTED = 2, _('Wanted')
    NOT_WANTED = 3, _('Not Wanted')


class RecruitmentStatusChoices(models.IntegerChoices):
    NOT_SET = 0, _('Not Set')
    CALLED_AND_ACCEPTED = 1, _('Called and Accepted')
    CALLED_AND_REJECTED = 2, _('Called and Rejected')
    AUTOMATIC_REJECTION = 3, _('Automatic Rejection')


class EventStatus(models.TextChoices):
    """
    Status for a given event. Deleted status
    is used to hide event without actually deleting it
    so that it can be restored if something wrong happens
    """

    ACTIVE = 'active', _('Aktiv')
    ARCHIVED = 'archived', _('Arkivert')
    CANCELED = 'cancelled', _('Avlyst')
    DELETED = 'deleted', _('Slettet')


class EventTicketType(models.TextChoices):
    """
    Handles event ticket type.
        Included/Free - simple info shown on event
        Billig - event connected to billig payment system
        Registration - connect event to registration model (påmelding)
        Custom - connect event to custom payment list (only used to show in frontend)
    """

    INCLUDED = 'included', _('Included with entrance')
    FREE = 'free', _('Free')
    BILLIG = 'billig', _('Paid')
    REGISTRATION = 'registration', _('Free with registration')
    CUSTOM = 'custom', _('Custom')


class EventAgeRestriction(models.TextChoices):
    NO_RESTRICTION = 'none', _('Ingen aldersgrense')
    AGE_18 = 'eighteen', _('18 år')
    AGE_20 = 'twenty', _('20 år')
    MIXED = 'mixed', _('18 år (student), 20 år (ikke-student)')


class EventCategory(models.TextChoices):
    """Used for sorting, filtering and organizing stuff in frontend"""

    SAMFUNDET_MEETING = 'samfundsmote', _('Samfundsmøte')
    CONCERT = 'concert', _('Konsert')
    DEBATE = 'debate', _('Debatt')
    QUIZ = 'quiz', _('Quiz')
    LECTURE = 'lecture', _('Kurs')
    OTHER = 'other', _('Annet')


class UserPreferenceTheme(models.TextChoices):
    """Same as in frontend"""

    LIGHT = 'theme-light'
    DARK = 'theme-dark'


class ReservationOccasion(models.TextChoices):
    DRINK = 'DRINK', _('Drikke')
    FOOD = 'FOOD', _('Mat')


class SaksdokumentCategory(models.TextChoices):
    FS_REFERAT = 'FS_REFERAT', _('FS-Referat')
    STYRET = 'STYRET', _('Styret')
    RADET = 'RADET', _('Rådet')
    ARSBERETNINGER = 'ARSBERETNINGER', _('Årsberetninger, regnskap og budsjettkunngjøringer')


class RecruitmentApplicantStates(models.IntegerChoices):
    # Mainly a descriptor
    # The lower, except 0, the least more likely to get this applicant
    # 0 not set
    # 1 reserve
    # 2 wanted
    NOT_SET = 0, _('Unprocessed by all above on priority')
    TOP_RESERVED = 1, _('Highest priority, and reserve')
    TOP_WANTED = 2, _('Highest priority, and wanted')
    LESS_RESERVE = 3, _('Another position has this on reserve, with higher priority')
    LESS_RESERVE_RESERVED = 4, _('Another position has this on reserve, with higher priority, but you have reserved')
    LESS_RESERVE_WANTED = 5, _('Another position has this on reserve, with higher priority, but you have them as wanted')
    LESS_WANT = 6, _('Another position has this on reserve, with higher priority')
    LESS_WANT_RESERVED = 7, _('Another position has this on wanted, with higher priority, but you have reserved')
    LESS_WANT_WANTED = 8, _('Another position has this on wanted, with higher priority, but you have them as wanted')
    NOT_WANTED = 10, _('Other position has priority')
