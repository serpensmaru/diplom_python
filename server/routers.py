from rest_framework import routers

from accounts.viewsets import UserViewSet
from storage.viewsets import FileViewSet


router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'files', FileViewSet, basename='files')
