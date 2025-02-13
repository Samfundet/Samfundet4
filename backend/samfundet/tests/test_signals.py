from __future__ import annotations

from samfundet.models import User, Profile, UserPreference


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
