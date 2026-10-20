from __future__ import annotations

from django.db import models, connections

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
        return str(self.medlem_id)


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

def populate_user_from_mdb(user: User) -> bool:
    """
    Copies the member's data from MDB (lim_medlemsinfo) onto the user's mdb_* fields.

    Does not save the user. Returns False if the user isn't connected to MDB
    or the member wasn't found in the MedlemsInfo view.
    """
    if user.mdb_medlem_id is None:
        return False

    info = MedlemsInfo.objects.using('mdb').filter(medlem_id=user.mdb_medlem_id).first()
    if info is None:
        return False

    user.mdb_first_name = info.fornavn
    user.mdb_last_name = info.etternavn
    user.mdb_date_of_birth = info.fodselsdato
    user.mdb_phone_number = info.telefon
    user.mdb_email = info.mail
    user.mdb_school = info.skole
    user.mdb_study = info.studie
    user.mdb_username = info.brukernavn
    user.mdb_synced_at = timezone.now()
    return True
