from __future__ import annotations

import pytest

from samfundet.models.role import Role, UserGangRole, UserGangSectionRole
from samfundet.models.general import User
from samfundet.organization.models import Gang, GangSection, Organization
from samfundet.organization.selectors import WebMember, web_members


@pytest.fixture
def web_tree() -> tuple[Organization, Gang, GangSection, Role]:
    organization = Organization.objects.create(name='Samfundet')
    gang = Gang.objects.create(
        name_nb='Markedsføringsgjengen',
        name_en='Markedsføringsgjengen',
        abbreviation='MG',
        organization=organization,
    )
    section = GangSection.objects.create(name_nb='Web', name_en='Web', gang=gang)
    role = Role.objects.create(name='gang_member')
    return organization, gang, section, role


def _make_user(username: str, email: str, *, active: bool = True) -> User:
    return User.objects.create_user(username=username, email=email, password='test123', is_active=active)


def test_web_members_returns_section_members(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, _, section, role = web_tree
    user = _make_user('webdev', 'webdev@samfundet.no')
    UserGangSectionRole.objects.create(user=user, role=role, obj=section)

    members = web_members()

    assert members == [WebMember(username='webdev', email='webdev@samfundet.no')]


def test_web_members_includes_gang_level_roles(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, gang, _, role = web_tree
    user = _make_user('mgleader', 'mgleader@samfundet.no')
    UserGangRole.objects.create(user=user, role=role, obj=gang)

    members = web_members()

    assert [m.username for m in members] == ['mgleader']


def test_web_members_excludes_other_sections(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, gang, _, role = web_tree
    layout = GangSection.objects.create(name_nb='Layout', name_en='Layout', gang=gang)
    user = _make_user('layoutdev', 'layoutdev@samfundet.no')
    UserGangSectionRole.objects.create(user=user, role=role, obj=layout)

    assert web_members() == []


def test_web_members_excludes_other_gangs(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    organization, _, _, role = web_tree
    other_gang = Gang.objects.create(name_nb='Fotogjengen', name_en='Fotogjengen', abbreviation='FG', organization=organization)
    user = _make_user('fotograf', 'fotograf@samfundet.no')
    UserGangRole.objects.create(user=user, role=role, obj=other_gang)

    assert web_members() == []


def test_web_members_excludes_other_organizations(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, _, _, role = web_tree
    uka = Organization.objects.create(name='UKA')
    uka_gang = Gang.objects.create(name_nb='Markedsføringsgjengen', name_en='Markedsføringsgjengen', abbreviation='MG', organization=uka)
    uka_section = GangSection.objects.create(name_nb='Web', name_en='Web', gang=uka_gang)
    user = _make_user('ukaweb', 'ukaweb@example.com')
    UserGangSectionRole.objects.create(user=user, role=role, obj=uka_section)

    assert web_members() == []


def test_web_members_excludes_inactive_users(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, _, section, role = web_tree
    user = _make_user('retired', 'retired@samfundet.no', active=False)
    UserGangSectionRole.objects.create(user=user, role=role, obj=section)

    assert web_members() == []


def test_web_members_dedupes_section_and_gang_roles(web_tree: tuple[Organization, Gang, GangSection, Role]) -> None:
    _, gang, section, role = web_tree
    user = _make_user('webdev', 'webdev@samfundet.no')
    UserGangSectionRole.objects.create(user=user, role=role, obj=section)
    UserGangRole.objects.create(user=user, role=role, obj=gang)

    members = web_members()

    assert members == [WebMember(username='webdev', email='webdev@samfundet.no')]
