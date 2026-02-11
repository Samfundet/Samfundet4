from django.db import models


class MedlemsInfo(models.Model):
    class Meta:
        managed = False
        verbose_name = 'MedlemsInfo'
        db_table = 'lim_medlemsinfo'

    medlem_id = models.PositiveIntegerField(null=False, blank=False, primary_key=True)
    fornavn = models.CharField(null=True, blank=True)
    etternavn = models.CharField(null=True, blank=True)
    fodselsdato = models.DateField(null=True, blank=True)
    telefon = models.CharField(null=True, blank=True)
    mail = models.CharField(null=True, blank=True)
    skole = models.CharField(null=True, blank=True)
    studie = models.CharField(null=True, blank=True)
    brukernavn = models.CharField(max_length=14, null=False, blank=False)

