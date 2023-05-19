from django.utils import timezone
from samfundet.models import User, Profile, UserPreference, Event, Gang, Image
from guardian.shortcuts import get_perms
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import Group

import pytest
from io import BytesIO

from PIL import Image as PilImage


class TestUserSignals:

    @pytest.mark.django_db
    def test_create_user_preference(self, fixture_user: User):
        ### Arrange ###
        # user fixture creation can be handled by pytest fixture in conftest.py

        ### Act ###
        user_preference_exists = UserPreference.objects.filter(user=fixture_user).exists()

        ### Assert ###
        assert user_preference_exists

    @pytest.mark.django_db
    def test_create_profile(self, fixture_user: User):
        ### Arrange ###
        # user fixture creation can be handled by pytest fixture in conftest.py

        ### Act ###
        profile_exists = Profile.objects.filter(user=fixture_user).exists()

        ### Assert ###
        assert profile_exists


class TestEditorPermissions:

    @pytest.fixture
    def setup(self, fixture_user: User):
        self.user = fixture_user

        image_file = PilImage.new('RGBA', size=(50, 50), color=(256, 0, 0))
        file = BytesIO()
        image_file.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        image = Image.objects.create(title='Test Image', image=SimpleUploadedFile(file.name, file.read()))
        self.gang = Gang.objects.create(name_nb='testgang')
        self.group = Group.objects.create(name='testgroup')
        self.gang.event_admin = self.group
        self.event = Event.objects.create(
            title_nb='Test Event',
            title_en='Test Event',
            description_long_nb='Test',
            description_long_en='Test',
            description_short_nb='Test',
            description_short_en='Test',
            location='Test',
            host='Test',
            capacity=50,
            start_dt=timezone.now(),
            duration=60,
            publish_dt=timezone.now(),
            age_restriction=18,
            category='Test',
            image=image,
        )
        self.event.editors.set(self.group)
        self.gang.save()

    @pytest.mark.django_db
    def test_update_editor_permissions_add(self, setup: None):
        ### Arrange ###
        # Event, Gang and User creation can be handled by setup fixture.

        ### Act ###
        self.event.editors.add(self.gang)
        user_perms = get_perms(self.gang.event_admin, self.event)

        ### Assert ###
        assert 'change_event' in user_perms
        assert 'delete_event' in user_perms

    @pytest.mark.django_db
    def test_update_editor_permissions_remove(self, setup: None):
        ### Arrange ###
        self.event.editors.add(self.gang)

        ### Act ###
        self.event.editors.remove(self.gang)
        user_perms = get_perms(self.gang.event_admin, self.event)

        ### Assert ###
        assert 'change_event' not in user_perms
        assert 'delete_event' not in user_perms
