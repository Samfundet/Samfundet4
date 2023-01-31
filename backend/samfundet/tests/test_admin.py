from guardian.shortcuts import assign_perm
from rest_framework.status import is_success, is_redirect, HTTP_403_FORBIDDEN

from django.urls import reverse
from django.test.client import Client

from samfundet.models import User

from root.utils import routes, permissions

ROUTES_TO_SUCCEED_ON_GET_REQUEST_WITH_SUPERUSER = [
    routes.admin__index,
    routes.admin__samfundet_user_add,
    routes.admin__samfundet_user_changelist,
    routes.admin__admin_logentry_add,
    routes.admin__admin_logentry_changelist,
    routes.admin__auth_group_add,
    routes.admin__auth_group_changelist,
    routes.admin__auth_permission_add,
    routes.admin__auth_permission_changelist,
    routes.admin__contenttypes_contenttype_add,
    routes.admin__contenttypes_contenttype_changelist,
    routes.admin__guardian_groupobjectpermission_add,
    routes.admin__guardian_groupobjectpermission_changelist,
    routes.admin__guardian_userobjectpermission_add,
    routes.admin__guardian_userobjectpermission_changelist,
    routes.admin__samfundet_event_add,
    routes.admin__samfundet_event_changelist,
    routes.admin__samfundet_eventgroup_add,
    routes.admin__samfundet_eventgroup_changelist,
    routes.admin__samfundet_gang_add,
    routes.admin__samfundet_gang_changelist,
    routes.admin__samfundet_gangtype_add,
    routes.admin__samfundet_gangtype_changelist,
    routes.admin__samfundet_informationpage_add,
    routes.admin__samfundet_informationpage_changelist,
    routes.admin__samfundet_profile_add,
    routes.admin__samfundet_profile_changelist,
    routes.admin__samfundet_userpreference_add,
    routes.admin__samfundet_userpreference_changelist,
    routes.admin__samfundet_venue_add,
    routes.admin__samfundet_venue_changelist,
    routes.admin__samfundet_table_add,
    routes.admin__samfundet_table_changelist,
    routes.admin__samfundet_booking_add,
    routes.admin__samfundet_booking_changelist,
    routes.admin__sessions_session_add,
    routes.admin__sessions_session_changelist,
]


def test_admin_routes(fixture_django_client: Client, fixture_superuser: User):
    """Test if a set of routes simply works."""
    fixture_django_client.force_login(user=fixture_superuser)
    for route in ROUTES_TO_SUCCEED_ON_GET_REQUEST_WITH_SUPERUSER:
        url = reverse(route)
        response = fixture_django_client.get(path=url)
        assert is_success(code=response.status_code)


def test_normal_user_cannot_access_admin_panel(fixture_django_client: Client, fixture_user: User):
    fixture_django_client.force_login(user=fixture_user)

    url = reverse(routes.admin__index)
    response = fixture_django_client.get(path=url)

    # Should be redirected to login.
    assert is_redirect(code=response.status_code)


def test_staff_permission_admin_panel(fixture_django_client: Client, fixture_staff: User):
    fixture_django_client.force_login(user=fixture_staff)

    # Should be able to see admin panel.
    url = reverse(routes.admin__index)
    response = fixture_django_client.get(path=url)
    assert is_success(code=response.status_code)

    # Should not be able to see any model information.
    url = reverse(routes.admin__samfundet_user_changelist)
    response = fixture_django_client.get(path=url)
    assert response.status_code == HTTP_403_FORBIDDEN

    # Should not be able to add any model.
    url = reverse(routes.admin__samfundet_user_add)
    response = fixture_django_client.get(path=url)
    assert response.status_code == HTTP_403_FORBIDDEN

    assign_perm(user_or_group=fixture_staff, perm=permissions.SAMFUNDET_VIEW_USER)

    # Should now be able to see any model information.
    url = reverse(routes.admin__samfundet_user_changelist)
    response = fixture_django_client.get(path=url)
    assert is_success(code=response.status_code)

    # Should still not be able to add any model.
    url = reverse(routes.admin__samfundet_user_add)
    response = fixture_django_client.get(path=url)
    assert response.status_code == HTTP_403_FORBIDDEN


def test_staff_object_permission_admin_panel(fixture_django_client: Client, fixture_staff: User):
    fixture_django_client.force_login(user=fixture_staff)

    some_user = User.objects.create_user(username='some_user')
    other_user = User.objects.create_user(username='other_user')

    url_some_user = reverse(routes.admin__samfundet_user_change, args=[some_user.id])
    url_other_user = reverse(routes.admin__samfundet_user_change, args=[other_user.id])

    # Should not be able to change some_user or other_user.
    response = fixture_django_client.get(path=url_some_user)
    assert response.status_code == HTTP_403_FORBIDDEN
    response = fixture_django_client.get(path=url_other_user)
    assert response.status_code == HTTP_403_FORBIDDEN

    # Give permission to change some_user.
    assign_perm(user_or_group=fixture_staff, perm=permissions.SAMFUNDET_CHANGE_USER, obj=some_user)

    # Should now be able to change some_user but not other_user.
    response = fixture_django_client.get(path=url_some_user)
    assert is_success(code=response.status_code)
    response = fixture_django_client.get(path=url_other_user)
    assert not is_success(response.status_code)
