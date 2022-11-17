from django.db import models

# Create your models here.


class GangType(models.Model):
    title = models.CharField(max_length=64, blank=False, null=False, verbose_name='Gruppetype')

    class Meta:
        verbose_name = 'Gruppetype'
        verbose_name_plural = 'Gruppetyper'

    def __str__(self):
        return self.title


class Gang(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False, verbose_name='Navn')
    abbreviation = models.CharField(max_length=64, blank=False, null=False, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside')

    group_type = models.ForeignKey(to=GangType, verbose_name='Gruppetype', null=True, on_delete=models.SET_NULL)

    # TODO ADD Information Page

    class Meta:
        verbose_name = 'Gjeng'
        verbose_name_plural = 'Gjenger'

    def __str__(self):
        return f'{self.group_type} {self.name}'
