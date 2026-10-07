from django.contrib import admin

from .models import TwiContent


@admin.register(TwiContent)
class TwiContentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "content_type",
        "is_featured",
        "is_published",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "content_type",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "title",
        "short_description",
    )

    list_editable = (
        "is_featured",
        "is_published",
        "display_order",
    )