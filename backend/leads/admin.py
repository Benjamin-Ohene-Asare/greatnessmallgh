from django.contrib import admin

from .models import (
    OptInCampaign,
    OptInSubmission,
)


@admin.register(OptInCampaign)
class OptInCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "headline",
        "resource_title",
        "is_active",
        "updated_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "headline",
        "resource_title",
    )


@admin.register(OptInSubmission)
class OptInSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "phone",
        "email",
        "status",
        "submitted_at",
    )

    list_filter = (
        "status",
        "submitted_at",
    )

    search_fields = (
        "full_name",
        "phone",
        "email",
    )

    readonly_fields = (
        "submitted_at",
    )