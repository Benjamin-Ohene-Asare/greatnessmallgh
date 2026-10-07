from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        "customer_name",
        "testimonial_type",
        "is_featured",
        "is_published",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "testimonial_type",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "customer_name",
        "customer_title",
        "message",
    )

    list_editable = (
        "is_featured",
        "is_published",
        "display_order",
    )