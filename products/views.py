from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Vendor, Category, Product, ProductMetadata, Review, DemoRequest
from .serializers import (
    VendorSerializer, CategorySerializer, ProductSerializer,
    ProductListSerializer, ProductMetadataSerializer, ReviewSerializer,
    DemoRequestSerializer
)


class VendorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Vendor management.
    Supports list, create, retrieve, update, delete.
    Filterable by name and includes search functionality.
    """
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'description', 'locations']


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category management.
    Supports list, create, retrieve, update, delete.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product management.
    Supports list, create, retrieve, update, delete.
    Filterable by vendor, category, pricing model.
    Searchable by name, description, features.
    """
    queryset = Product.objects.select_related('vendor', 'category').prefetch_related('metadata', 'reviews')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['vendor', 'category', 'pricing_model', 'demo_available']
    search_fields = ['name', 'description', 'short_description', 'features']
    ordering_fields = ['rating', 'created_at', 'review_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Use simplified serializer for list view"""
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer


class ProductMetadataViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product Metadata management.
    Supports list, create, retrieve, update, delete.
    Filterable by product and key.
    """
    queryset = ProductMetadata.objects.all()
    serializer_class = ProductMetadataSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['product', 'key']
    search_fields = ['key', 'value']


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Review management.
    Supports list, create, retrieve, update, delete.
    Filterable by product, vendor, and rating.
    """
    queryset = Review.objects.select_related('product', 'vendor')
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product', 'vendor', 'rating', 'verified']
    search_fields = ['author', 'company', 'title', 'content']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']


class DemoRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Demo Request management.
    Supports list, create, retrieve, update, delete.
    Filterable by product and status.
    """
    queryset = DemoRequest.objects.select_related('product')
    serializer_class = DemoRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product', 'status']
    search_fields = ['first_name', 'last_name', 'email', 'company']
    ordering_fields = ['created_at', 'preferred_date']
    ordering = ['-created_at']

