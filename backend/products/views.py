from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

from django.db.models.deletion import ProtectedError

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response



from .models import (
    Category,
    Product,
)

from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductWriteSerializer,
)


# ============================================================
# PUBLIC CATEGORY LIST
# ============================================================

class PublicCategoryListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = CategorySerializer

    queryset = (
        Category.objects
        .filter(is_active=True)
        .order_by(
            "display_order",
            "name",
        )
    )


# ============================================================
# PUBLIC PRODUCT LIST
# ============================================================

class PublicProductListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = (
            Product.objects
            .select_related("category")
            .filter(
                is_published=True,
                category__is_active=True,
            )
        )

        category = self.request.query_params.get(
            "category"
        )

        if category:
            queryset = queryset.filter(
                category__slug=category
            )

        return queryset.order_by(
            "display_order",
            "-created_at",
        )


# ============================================================
# PUBLIC PRODUCT DETAIL
# ============================================================

class PublicProductDetailView(
    generics.RetrieveAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = ProductDetailSerializer

    lookup_field = "slug"

    queryset = (
        Product.objects
        .select_related("category")
        .prefetch_related(
            "benefits",
            "ingredients",
        )
        .filter(
            is_published=True,
            category__is_active=True,
        )
    )


# ============================================================
# ADMIN PRODUCT LIST / CREATE
#
# Django admin authentication is used for now.
# Later we can replace or extend this for React dashboard auth.
# ============================================================

class AdminProductListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category")
            .prefetch_related(
                "benefits",
                "ingredients",
            )
            .all()
            .order_by(
                "display_order",
                "-created_at",
            )
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ProductDetailSerializer

        return ProductWriteSerializer


# ============================================================
# ADMIN PRODUCT DETAIL
# ============================================================

class AdminProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        Product.objects
        .select_related("category")
        .prefetch_related(
            "benefits",
            "ingredients",
        )
        .all()
    )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ProductDetailSerializer

        return ProductWriteSerializer


# ============================================================
# ADMIN CATEGORY LIST / CREATE
# ============================================================

class AdminCategoryListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    serializer_class = CategorySerializer

    queryset = (
        Category.objects
        .all()
        .order_by(
            "display_order",
            "name",
        )
    )


# ============================================================
# ADMIN CATEGORY DETAIL
# ============================================================

class AdminCategoryDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = CategorySerializer
    permission_classes = [
        IsAdminUser
    ]

    queryset = Category.objects.all()

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        category = (
            self.get_object()
        )

        if (
            category.products.exists()
        ):
            return Response(
                {
                    "detail":
                        "This category still contains products. Reassign those products before deleting the category."
                },
                status=status.HTTP_409_CONFLICT,
            )

        try:
            category.delete()
        except ProtectedError:
            return Response(
                {
                    "detail":
                        "This category is still being used and cannot be deleted."
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )   
    
    