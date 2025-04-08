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
    REJECTION = 3, _('Rejection')
    AUTOMATIC_REJECTION = 4, _('Automatic Rejection')


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
    NOT_SET = 0, _('Unprocessed, action needed.')
    TOP_PRI_RESERVED_HERE = 1, _('Applicants top priority, but set as reserve here.')
    TOP_PRI_WANTED_HERE = 2, _('Applicants top priority and wanted here.')
    RESERVED_ELSEWHERE_UNPROCESSED_HERE = 3, _('Reserve for another position, unprocessed here. Action needed.')
    RESERVED_ELSEWHERE_RESERVED_HERE = 4, _('Reserve for another position and reserve here.')
    RESERVED_ELSEWHERE_WANTED_HERE = 5, _('Reserve for another position, and wanted here.')
    WANTED_ELSEWHERE_UNPROCESSED_HERE = 6, _('Wanted for another position, and unprocessed here. Action needed.')
    WANTED_ELSEWHERE_RESERVE_HERE = 7, _('Wanted for another position, and reserve here.')
    WANTED_ELSEWHERE_WANTED_HERE = 8, _('Wanted for another position and wanted here.')
    NOT_WANTED = 10, _('The applicant is not wanted for this position.')


class OrganizationNames(models.TextChoices):
    SAMFUNDET = 'SAMFUNDET', _('Samfundet')
    UKA = 'UKA', _('Uka')
    ISFIT = 'ISFIT', _('ISFiT')
