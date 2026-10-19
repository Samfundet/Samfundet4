from __future__ import annotations

from pathlib import Path

from django_admin_logs_viewer.views.logs_view import logs_view as package_logs_view

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import permission_required
from django.contrib.admin.views.decorators import staff_member_required

VIEW_LOGS_PERMISSION = 'samfundet.view_logs'


@staff_member_required
@permission_required(VIEW_LOGS_PERMISSION, raise_exception=True)
def admin_logs_view(request: HttpRequest) -> HttpResponse:
    requested_path = request.GET.get('path')
    if request.GET.get('download') and (not requested_path or Path(requested_path).is_dir()):
        return HttpResponseBadRequest('Bulk and directory log downloads are disabled.')

    return package_logs_view(request)
