from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VendorViewSet, CategoryViewSet, ProductViewSet,
    ProductMetadataViewSet, ReviewViewSet, DemoRequestViewSet
)

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'metadata', ProductMetadataViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'demo-requests', DemoRequestViewSet)

app_name = 'products'

urlpatterns = [
    path('', include(router.urls)),
]
