from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

from .routers import router
from storage.views import redirect_to_file
from accounts.views import login_view, signup_view, logout_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('s/<str:hash>/', redirect_to_file, name='redirect_to_file'),
    
    path('login/', login_view, name='login'),
    path('register/', signup_view, name='register'),
    path('logout/', logout_view, name='logout'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
