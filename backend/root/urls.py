from __future__ import annotations

from django.conf import settings
from django.urls import path, include, re_path
from django.contrib import admin
from django.views.static import serve as serve_static

# Serve the React bundle for unknown paths with a correct HTTP 404 status
# https://docs.djangoproject.com/en/5.2/ref/urls/#handler404
handler404 = 'samfundet.routing.views.react_404_view'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('rest_framework/', include('rest_framework.urls')),
    # Backend API routes, prefixed to avoid colliding with frontend routes
    path('api/', include('samfundet.urls')),
    # User-uploaded media. Served explicitly (not via the static() helper, which
    # requires DEBUG=True) since there is no separate media server.
    re_path(rf'^{settings.MEDIA_URL.lstrip("/")}(?P<path>.*)$', serve_static, {'document_root': settings.MEDIA_ROOT}),
    # React frontend routes, including the catch-all. Must be defined last.
    path('', include('samfundet.routing.urls')),
]

# Static files ('/assets/') are served by WhiteNoise (middleware, all environments).
