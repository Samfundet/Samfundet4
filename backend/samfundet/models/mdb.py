from __future__ import annotations

from django.db import models, connections
from django.utils import timezone
from samfundet.models.general import User


class MedlemsInfo(models.Model):
    medlem_id = models.PositiveIntegerField(null=False, blank=False, primary_key=True)
    fornavn = models.CharField(null=True, blank=True)
    etternavn = models.CharField(null=True, blank=True)
    fodselsdato = models.DateField(null=True, blank=True)
    telefon = models.CharField(null=True, blank=True)
    mail = models.CharField(null=True, blank=True)
    skole = models.CharField(null=True, blank=True)
    studie = models.CharField(null=True, blank=True)
    brukernavn = models.CharField(max_length=14, null=False, blank=False)

    class Meta:
        managed = False
        verbose_name = 'MedlemsInfo'
        db_table = 'lim_medlemsinfo'

    def __str__(self) -> str:
        return self.medlem_id


def sett_lim_utvidet_medlemsinfo(member_login: str, password: str) -> int | None:
    """
    Calls the sett_lim_utvidet_medlemsinfo database function.

    This function checks if the email/member_id and password are valid. If they
    are, a flag is set in the `member` table allowing the user to appear in the
    MedlemsInfo database view, and the function returns the member's ID.
    """

    with connections['mdb'].cursor() as cursor:
        cursor.execute('SELECT * FROM sett_lim_utvidet_medlemsinfo(%s, %s)', (member_login, password))
        row = cursor.fetchone()
        if row:
            return row[0]
    return None 

def sync_medlemsinfo(user: User):
    minute_threshold = 5 #How often to update the medlemsinfo from mdb (in minutes)
    if user.mdb_medlem_id is None:
        return None
    if (user.mdb_last_updated is not None and (timezone.now() - user.mdb_last_updated).total_seconds() < minute_threshold * 60):
        return None

    with connections['mdb'].cursor() as cursor:
        cursor.execute('SELECT brukernavn, fornavn, etternavn, telefon, mail FROM lim_medlemsinfo WHERE medlem_id = %s', (user.mdb_medlem_id,))
        row = cursor.fetchone()

        if not row:
            return None

        user.mdb_last_updated = timezone.now()
        user.username = row[0]
        user.first_name = row[1]
        user.last_name = row[2]
        user.phone_number = row[3]
        user.email = row[4]
        user.save()
        

