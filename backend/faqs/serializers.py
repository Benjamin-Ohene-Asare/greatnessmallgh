from rest_framework import serializers

from .models import (
    FAQ,
    FAQCategory,
)


# ============================================================
# PUBLIC CATEGORY SERIALIZER
#
# Used by the FAQ page to build category filters.
# ============================================================

class FAQCategorySerializer(
    serializers.ModelSerializer
):
    faq_count = serializers.IntegerField(
        read_only=True,
    )

    class Meta:
        model = FAQCategory

        fields = [
            "id",
            "name",
            "display_order",
            "faq_count",
        ]


# ============================================================
# FAQ SERIALIZER
#
# Returns the category as a nested object so React can display
# both the category name and category id without extra requests.
# ============================================================

class FAQSerializer(
    serializers.ModelSerializer
):
    category = FAQCategorySerializer(
        read_only=True,
    )

    class Meta:
        model = FAQ

        fields = [
            "id",
            "category",
            "question",
            "answer",
            "is_featured",
            "is_published",
            "display_order",
            "created_at",
            "updated_at",
        ]


# ============================================================
# ADMIN FAQ WRITE SERIALIZER
#
# Admin sends category_id instead of a nested category object.
# ============================================================

class FAQWriteSerializer(
    serializers.ModelSerializer
):
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=FAQCategory.objects.all(),
        write_only=True,
    )

    class Meta:
        model = FAQ

        fields = [
            "id",
            "category_id",
            "question",
            "answer",
            "is_featured",
            "is_published",
            "display_order",
        ]

        read_only_fields = [
            "id",
        ]


# ============================================================
# ADMIN CATEGORY SERIALIZER
# ============================================================

class FAQCategoryWriteSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = FAQCategory

        fields = [
            "id",
            "name",
            "display_order",
            "is_active",
        ]

        read_only_fields = [
            "id",
        ]