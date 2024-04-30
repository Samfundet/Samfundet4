from __future__ import annotations

from rest_framework.test import APITestCase

from django.db import models
from django.urls import reverse
from django.db.models import Model
from django.test.client import Client

from root.utils import routes

from samfundet.models.general import (
    Role,
    User,
)


class TestHasPerm(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='test_user')
        self.role = Role.objects.create(name='test_role')
        self.child_role = Role.objects.create(name='test_child_role')

    def test_has_perm(
        self,
    ):
        assert self.user.has_perm(self.role) is False
        self.user.role.add(self.role)
        assert self.user.has_perm(self.role) is True
        self.user.role.remove(self.role)
        assert self.user.has_perm(self.role) is False
