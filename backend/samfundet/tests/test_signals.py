from guardian.shortcuts import get_perms
from django.contrib.auth.models import Group

from samfundet.models import Event, Gang, Profile, User, UserPreference
from samfundet.permissions import SAMFUNDET_CHANGE_EVENT, SAMFUNDET_DELETE_EVENT


class TestUserSignals:

    def test_create_user_preference(self):
        ### Arrange ###
        user = User.objects.create_user(
            username='user',
            email='user@test.com',
            password='test_password',
        )

        ### Act ###
        user_preference_exists = UserPreference.objects.filter(user=user).exists()

        ### Assert ###
        assert user_preference_exists

        ### Cleanup ###
        user.delete()

    def test_create_profile(self):
        ### Arrange ###
        user = User.objects.create_user(
            username='user',
            email='user@test.com',
            password='test_password',
        )

        ### Act ###
        profile_exists = Profile.objects.filter(user=user).exists()

        ### Assert ###
        assert profile_exists

        ### Cleanup ###
        user.delete()


class TestEditorPermissions:

    def test_update_editor_permissions_add(
        self,
        fixture_event: Event,
        fixture_group: Group,
        fixture_gang: Gang,
    ):
        ### Arrange ###
        # Event, Gang and User creation can be handled by setup fixture.

        ### Act ###
        fixture_gang.event_admin = fixture_group
        fixture_gang.save()
        fixture_event.editors.add(fixture_gang)
        fixture_event.save()
        user_perms = get_perms(fixture_gang.event_admin, fixture_event)

        ### Assert ###
        assert 'change_event' in user_perms
        assert 'delete_event' in user_perms

    def test_update_editor_permissions_remove(
        self,
        fixture_event: Event,
        fixture_group: Group,
        fixture_gang: Gang,
    ):
        ### Arrange ###

        ### Act ###
        fixture_gang.event_admin = fixture_group
        fixture_gang.save()
        fixture_event.editors.remove(fixture_gang)
        user_perms = get_perms(fixture_gang.event_admin, fixture_event)

        ### Assert ###
        assert 'change_event' not in user_perms
        assert 'delete_event' not in user_perms
