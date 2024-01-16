# imports
import notifications.urls

from django.urls import path, include
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
# End: imports -----------------------------------------------------------------

urlpatterns = [
    path('admin/', admin.site.urls),
    path('rest_framework/', include('rest_framework.urls')),
    path('notifications/', include(notifications.urls, namespace='notifications')),
    path('', include('samfundet.urls')),  # Put last.
    path('', include('sulten.urls')),  # Put last.
]

# Setup static access and media upload.
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
