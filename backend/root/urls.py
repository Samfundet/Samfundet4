# imports
from django.urls import path, include
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
# End: imports -----------------------------------------------------------------

urlpatterns = [
    path('admin/', admin.site.urls),
    path('arrangementer/', include('arrangementer.urls')),
]

# Setup static access and media upload
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
