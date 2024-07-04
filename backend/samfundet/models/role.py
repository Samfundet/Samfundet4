from __future__ import annotations

from django.db import models
from django.conf import settings

from root.utils.mixins import CustomBaseModel


class Role(models.Model):
    name = models.CharField(max_length=255)
    permissions = models.ManyToManyField('auth.Permission')

    def __str__(self) -> str:
        return self.name


class UserRoleBase(CustomBaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class UserOrgRole(UserRoleBase):
    obj = models.ForeignKey('samfundet.Organization', on_delete=models.CASCADE)


class UserGangRole(UserRoleBase):
    obj = models.ForeignKey('samfundet.Gang', on_delete=models.CASCADE)


class UserGangSectionRole(UserRoleBase):
    obj = models.ForeignKey('samfundet.GangSection', on_delete=models.CASCADE)
