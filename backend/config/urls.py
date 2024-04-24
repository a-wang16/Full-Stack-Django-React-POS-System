from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/social/token/', include('rest_framework_social_oauth2.urls')),

    path('accounts/', include('allauth.urls')),
    path('api/', include('pos_system.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
