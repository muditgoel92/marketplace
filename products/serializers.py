from rest_framework import serializers
from .models import Vendor, Category, Product, ProductMetadata, Review, DemoRequest, Service, ServiceMetadata, ServiceReview, ServiceInquiry


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'name', 'description', 'website', 'email', 'phone',
            'logo', 'founded_year', 'employees', 'locations', 'rating',
            'created_at', 'updated_at'
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon']


class ProductMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMetadata
        fields = ['id', 'key', 'value']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'vendor', 'author', 'company', 'rating',
            'title', 'content', 'verified', 'created_at'
        ]
        read_only_fields = ['created_at']


class DemoRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoRequest
        fields = [
            'id', 'product', 'first_name', 'last_name', 'email', 'phone',
            'company', 'message', 'status', 'preferred_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    metadata = ProductMetadataSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'name', 'description', 'short_description',
            'category', 'features', 'pricing_model', 'pricing_description',
            'image', 'demo_available', 'documentation_url', 'rating',
            'review_count', 'created_at', 'updated_at', 'metadata', 'reviews'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['vendor'] = VendorSerializer(instance.vendor).data
        data['category'] = CategorySerializer(instance.category).data if instance.category else None
        return data


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product listings"""
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_id = serializers.IntegerField(source='vendor.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'vendor_id', 'vendor_name', 'name', 'short_description', 'category_id', 'category_name',
            'pricing_model', 'image', 'rating', 'review_count', 'demo_available'
        ]


# Service Serializers
class ServiceMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMetadata
        fields = ['id', 'key', 'value']


class ServiceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceReview
        fields = [
            'id', 'service', 'vendor', 'author', 'company', 'rating',
            'title', 'content', 'verified', 'created_at'
        ]
        read_only_fields = ['created_at']


class ServiceInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceInquiry
        fields = [
            'id', 'service', 'first_name', 'last_name', 'email', 'phone',
            'company', 'project_description', 'budget_range', 'timeline', 'status',
            'preferred_contact_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    metadata = ServiceMetadataSerializer(many=True, read_only=True)
    reviews = ServiceReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'vendor', 'name', 'description', 'short_description',
            'category', 'service_type', 'deliverables', 'pricing_model', 'pricing_description',
            'image', 'consultation_available', 'case_studies_url', 'rating',
            'review_count', 'created_at', 'updated_at', 'metadata', 'reviews'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['vendor'] = VendorSerializer(instance.vendor).data
        data['category'] = CategorySerializer(instance.category).data if instance.category else None
        return data


class ServiceListSerializer(serializers.ModelSerializer):
    """Simplified serializer for service listings"""
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_id = serializers.IntegerField(source='vendor.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'vendor_id', 'vendor_name', 'name', 'short_description', 'category_id', 'category_name',
            'service_type', 'pricing_model', 'image', 'rating', 'review_count', 'consultation_available'
        ]
