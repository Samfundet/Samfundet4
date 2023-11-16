from django.db import models


class RecruitmentPriorityChoices(models.IntegerChoices):
    NOT_SET = 0, 'Not Set'
    NOT_WANTED = 1, 'Not Wanted'
    WANTED = 2, 'Wanted'
    RESERVE = 3, 'Reserve'


class RecruitmentStatusChoices(models.IntegerChoices):
    NOT_SET = 0, 'Not Set'
    CALLED_AND_ACCEPTED = 1, 'Called and Accepted'
    CALLED_AND_REJECTED = 2, 'Called and Rejected'
    AUTOMATIC_REJECTION = 3, 'Automatic Rejection'
