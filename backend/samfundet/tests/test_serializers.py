from __future__ import annotations

import pytest

from samfundet.serializers import RecruitmentPositionSerializer
from samfundet.models.general import User
from samfundet.models.recruitment import RecruitmentPosition, RecruitmentPositionTag


@pytest.mark.django_db
class TestRecruitmentPositionSerializer:
    @pytest.fixture
    def setup_users(self, db):
        user1 = User.objects.create(username="testuser1")
        user2 = User.objects.create(username="testuser2")
        return user1, user2

    @pytest.fixture
    def setup_tags(self, db):
        tag1 = RecruitmentPositionTag.objects.create(name="tag1")
        tag2 = RecruitmentPositionTag.objects.create(name="tag2")
        return tag1, tag2

    @pytest.fixture
    def setup_recruitment_position(self, db):
        return RecruitmentPosition.objects.create(
            name_nb="Test Position NB",
            name_en="Test Position EN",
            short_description_nb="Short description NB",
            short_description_en="Short description EN",
            long_description_nb="Long description NB",
            long_description_en="Long description EN",
            is_funksjonaer_position=False,
            default_admission_letter_nb="Admission letter NB",
            default_admission_letter_en="Admission letter EN",
        )

    def test_update_tags(self, setup_tags, setup_recruitment_position):
        tag1, tag2 = setup_tags
        recruitment_position = setup_recruitment_position
        serializer = RecruitmentPositionSerializer()
        tags_data = ["tag1", "tag2"]
        serializer.is_valid()
        print(serializer.validated_data)
        serializer._update_tags(
            recruitment_position=recruitment_position, tag_objects=tags_data
        )

        assert recruitment_position.tags.count() == 2
        assert recruitment_position.tags.filter(name="tag1").exists()
        assert recruitment_position.tags.filter(name="tag2").exists()
