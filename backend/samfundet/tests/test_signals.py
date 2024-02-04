from __future__ import annotations

from guardian.shortcuts import get_perms

from django.contrib.auth.models import Group

from samfundet.models import Gang, User, Event, Profile, UserPreference


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

        ### Act ###
        fixture_gang.event_admin_group = fixture_group
        fixture_gang.save()
        fixture_event.editors.add(fixture_gang)
        fixture_event.save()
        editor_perms = get_perms(fixture_gang.event_admin_group, fixture_event)

        ### Assert ###
        assert 'change_event' in editor_perms
        assert 'delete_event' in editor_perms

    def test_update_editor_permissions_remove(
        self,
        fixture_event: Event,
        fixture_group: Group,
        fixture_gang: Gang,
    ):
        ### Arrange ###

        ### Act ###
        fixture_gang.event_admin_group = fixture_group
        fixture_gang.save()
        fixture_event.editors.remove(fixture_gang)
        editor_perms = get_perms(fixture_gang.event_admin_group, fixture_event)

        ### Assert ###
        assert 'change_event' not in editor_perms
        assert 'delete_event' not in editor_perms

    def test_group_leader_permissions_add(
        self,
        fixture_event: Event,
        fixture_group: Group,
        fixture_gang: Gang,
    ):
        ### Arrange ###

        ### Act ###
        fixture_gang.gang_leader_group = fixture_group
        fixture_gang.save()
        fixture_event.editors.add(fixture_gang)
        fixture_event.save()
        editor_perms = get_perms(fixture_gang.gang_leader_group, fixture_event)

        ### Assert ###
        assert 'change_event' in editor_perms
        assert 'delete_event' in editor_perms

    def test_group_leader_permissions_remove(
        self,
        fixture_event: Event,
        fixture_group: Group,
        fixture_gang: Gang,
    ):
        ### Arrange ###

        ### Act ###
        fixture_gang.gang_leader_group = fixture_group
        fixture_gang.save()
        fixture_event.editors.remove(fixture_gang)
        editor_perms = get_perms(fixture_gang.gang_leader_group, fixture_event)

        ### Assert ###
        assert 'change_event' not in editor_perms
        assert 'delete_event' not in editor_perms
