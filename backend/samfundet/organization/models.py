from __future__ import annotations

from django.db import models

from root.utils.mixins import CustomBaseModel


class Organization(CustomBaseModel):
    """Object for mapping out the orgs with different gangs, eg. Samfundet, UKA, ISFiT"""

    name = models.CharField(max_length=32, blank=False, null=False, unique=True)

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        return self.name


class GangType(CustomBaseModel):
    """Type of gang. eg. 'arrangerende', 'kunstnerisk' etc."""

    title_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Norsk')
    title_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Gruppetype Engelsk')

    organization = models.ForeignKey(
        to=Organization,
        related_name='gangtypes',
        verbose_name='Organisasjon',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = 'GangType'
        verbose_name_plural = 'GangTypes'

    def __str__(self) -> str:
        return f'{self.title_nb}'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.organization_id
        return self.organization


class Gang(CustomBaseModel):
    name_nb = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, null=True, verbose_name='Navn Engelsk')
    abbreviation = models.CharField(max_length=8, blank=True, null=True, verbose_name='Forkortelse')
    webpage = models.URLField(verbose_name='Nettside', blank=True, null=True)

    organization = models.ForeignKey(
        to=Organization,
        related_name='gangs',
        verbose_name='Organisasjon',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    logo = models.ImageField(upload_to='ganglogos/', blank=True, null=True, verbose_name='Logo')
    gang_type = models.ForeignKey(to=GangType, related_name='gangs', verbose_name='Gruppetype', blank=True, null=True, on_delete=models.SET_NULL)
    info_page = models.ForeignKey(to='samfundet.InformationPage', verbose_name='Infoside', related_name='+', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = 'Gang'
        verbose_name_plural = 'Gangs'

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.organization_id
        return self.organization

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        ret = self.name_nb
        if self.gang_type:
            ret = f'{self.gang_type} - {ret}'
        if self.organization:
            ret = f'{self.organization.name} - {ret}'
        return ret


class GangSection(CustomBaseModel):
    name_nb = models.CharField(max_length=64, blank=True, verbose_name='Navn Norsk')
    name_en = models.CharField(max_length=64, blank=True, verbose_name='Navn Engelsk')
    logo = models.ImageField(upload_to='sectionlogos/', blank=True, null=True, verbose_name='Logo')
    gang = models.ForeignKey(Gang, blank=False, null=False, related_name='gang', on_delete=models.PROTECT, verbose_name='Gjeng')

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.gang.resolve_org(return_id=return_id)

    def resolve_gang(self, *, return_id: bool = False) -> Gang | int:
        if return_id:
            # noinspection PyTypeChecker
            return self.gang_id
        return self.gang

    def resolve_section(self, *, return_id: bool = False) -> GangSection | int:
        if return_id:
            return self.id
        return self

    def __str__(self) -> str:
        return f'{self.gang.name_nb} - {self.name_nb}'
