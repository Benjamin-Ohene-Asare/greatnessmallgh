from django.db.models import Count, Q

from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)

from .models import (
    FAQ,
    FAQCategory,
)

from .serializers import (
    FAQCategorySerializer,
    FAQCategoryWriteSerializer,
    FAQSerializer,
    FAQWriteSerializer,
)


# ============================================================
# PUBLIC FAQ CATEGORIES
#
# Returns active categories that contain at least one
# published FAQ.
# ============================================================

class PublicFAQCategoryListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        FAQCategorySerializer
    )

    def get_queryset(self):
        return (
            FAQCategory.objects
            .filter(
                is_active=True,
                faqs__is_published=True,
            )
            .annotate(
                faq_count=Count(
                    "faqs",
                    filter=Q(
                        faqs__is_published=True
                    ),
                    distinct=True,
                )
            )
            .distinct()
            .order_by(
                "display_order",
                "name",
            )
        )


# ============================================================
# PUBLIC FAQ LIST
#
# Supports:
# ?category=1
# ?search=delivery
# ?featured=true
#
# This lets both the homepage and full FAQ page use the same
# endpoint without duplicating backend logic.
# ============================================================

class PublicFAQListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        FAQSerializer
    )

    def get_queryset(self):
        queryset = (
            FAQ.objects
            .select_related(
                "category"
            )
            .filter(
                is_published=True,
                category__is_active=True,
            )
            .order_by(
                "display_order",
                "question",
            )
        )

        category = (
            self.request
            .query_params
            .get("category")
        )

        search = (
            self.request
            .query_params
            .get("search")
        )

        featured = (
            self.request
            .query_params
            .get("featured")
        )

        if category:
            queryset = queryset.filter(
                category_id=category
            )

        if search:
            queryset = queryset.filter(
                Q(
                    question__icontains=
                        search
                )
                |
                Q(
                    answer__icontains=
                        search
                )
            )

        if (
            featured
            and featured.lower()
            == "true"
        ):
            queryset = queryset.filter(
                is_featured=True
            )

        return queryset


# ============================================================
# ADMIN FAQ LIST + CREATE
# ============================================================

class AdminFAQListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    def get_queryset(self):
        return (
            FAQ.objects
            .select_related(
                "category"
            )
            .all()
            .order_by(
                "display_order",
                "question",
            )
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return FAQSerializer

        return FAQWriteSerializer


# ============================================================
# ADMIN FAQ DETAIL
# ============================================================

class AdminFAQDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        FAQ.objects
        .select_related(
            "category"
        )
        .all()
    )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return FAQSerializer

        return FAQWriteSerializer


# ============================================================
# ADMIN FAQ CATEGORY LIST + CREATE
# ============================================================

class AdminFAQCategoryListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        FAQCategory.objects
        .all()
        .order_by(
            "display_order",
            "name",
        )
    )

    serializer_class = (
        FAQCategoryWriteSerializer
    )


# ============================================================
# ADMIN FAQ CATEGORY DETAIL
# ============================================================

class AdminFAQCategoryDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        FAQCategory.objects
        .all()
    )

    serializer_class = (
        FAQCategoryWriteSerializer
    )