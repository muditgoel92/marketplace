from django.contrib import admin
from .models import Vendor, Category, Product, ProductMetadata, Review, DemoRequest


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'rating', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['rating', 'created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'pricing_model', 'rating', 'created_at']
    search_fields = ['name', 'vendor__name', 'category__name']
    list_filter = ['category', 'pricing_model', 'demo_available', 'created_at']
    readonly_fields = ['rating', 'review_count']


@admin.register(ProductMetadata)
class ProductMetadataAdmin(admin.ModelAdmin):
    list_display = ['product', 'key', 'value']
    search_fields = ['product__name', 'key', 'value']
    list_filter = ['key']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'author', 'rating', 'verified', 'created_at']
    search_fields = ['product__name', 'author', 'company']
    list_filter = ['rating', 'verified', 'created_at']
    readonly_fields = ['created_at']


@admin.register(DemoRequest)
class DemoRequestAdmin(admin.ModelAdmin):
    list_display = ['product', 'email', 'status', 'created_at']
    search_fields = ['product__name', 'email', 'first_name', 'last_name']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
