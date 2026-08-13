from __future__ import annotations

from samfundet.models import User, UserPreference


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
