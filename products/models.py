from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

# Vendor Model
class Vendor(models.Model):
    """Represents a vendor/company listing products on the marketplace"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    website = models.URLField(blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    logo = models.ImageField(upload_to='vendor_logos/', blank=True, null=True)
    founded_year = models.IntegerField(blank=True, null=True)
    employees = models.CharField(max_length=100, blank=True, null=True)  # e.g., "50-249"
    locations = models.TextField(blank=True, null=True)  # comma-separated
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)  # Vendor account

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


# Category Model (predefined themes)
class Category(models.Model):
    """Represents predefined product categories/themes like Risk, Compliance, Trading, etc."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)  # For icon reference

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


# Product Model
class Product(models.Model):
    """Represents a financial product listed on the marketplace"""
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    short_description = models.CharField(max_length=500)  # For listing preview
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    features = models.TextField()  # comma-separated or bullet points
    pricing_model = models.CharField(
        max_length=50,
        choices=[
            ('subscription', 'Subscription'),
            ('one_time', 'One-Time License'),
            ('usage_based', 'Usage-Based'),
            ('custom', 'Custom Pricing'),
        ]
    )
    pricing_description = models.TextField(blank=True)  # Detailed pricing info
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    demo_available = models.BooleanField(default=True)
    documentation_url = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    review_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
        unique_together = ('vendor', 'name')


# Product Metadata Model (for tagging and search)
class ProductMetadata(models.Model):
    """Metadata tags for products to enhance search and filtering"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='metadata')
    key = models.CharField(max_length=100)  # e.g., "compliance_type", "industry", "feature"
    value = models.CharField(max_length=255)  # e.g., "AML", "Banking", "Real-time Monitoring"

    def __str__(self):
        return f"{self.product.name} - {self.key}: {self.value}"

    class Meta:
        unique_together = ('product', 'key', 'value')


# Review Model
class Review(models.Model):
    """User reviews and ratings for products"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='reviews', blank=True, null=True)
    author = models.CharField(max_length=255)  # Anonymous or named reviewer
    company = models.CharField(max_length=255, blank=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200)
    content = models.TextField()
    verified = models.BooleanField(default=False)  # Verified purchase
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating}/5 by {self.author}"

    class Meta:
        ordering = ['-created_at']


# Demo Request Model
class DemoRequest(models.Model):
    """Tracks demo arrangement requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='demo_requests')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    preferred_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Demo Request - {self.product.name} ({self.email})"

    class Meta:
        ordering = ['-created_at']
