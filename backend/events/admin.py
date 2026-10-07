from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "event_date",
        "event_time",
        "event_format",
        "is_published",
        "updated_at",
    )

    list_filter = (
        "category",
        "event_format",
        "is_published",
    )

    search_fields = (
        "title",
        "short_summary",
        "full_details",
        "venue",
        "host_name",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    ordering = (
        "display_order",
        "event_date",
        "event_time",
    )