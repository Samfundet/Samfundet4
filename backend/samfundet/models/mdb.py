from __future__ import annotations

from django.db import models, connections


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


def sett_lim_utvidet_medlemsinfo(email: str, password: str) -> int | None:
    """
    Calls the sett_lim_utvidet_medlemsinfo database function.

    This function checks if the email and password are valid. If they are,
    a flag is set in the `member` table allowing the user to appear in the
    MedlemsInfo database view, and the function returns the member's ID.
    """

    with connections['mdb'].cursor() as cursor:
        cursor.execute('SELECT * FROM sett_lim_utvidet_medlemsinfo(%s, %s)', (email, password))
        row = cursor.fetchone()
        if row:
            return row[0]
    return None
