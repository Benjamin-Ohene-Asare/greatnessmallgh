from django.contrib import admin

from .models import (
    FAQ,
    FAQCategory,
)


# ============================================================
# FAQ CATEGORY ADMIN
# ============================================================

@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "display_order",
        "is_active",
        "updated_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "display_order",
        "name",
    )


# ============================================================
# FAQ ADMIN
# ============================================================

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = (
        "question",
        "category",
        "is_featured",
        "is_published",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "category",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "question",
        "answer",
    )

    ordering = (
        "display_order",
        "question",
    )