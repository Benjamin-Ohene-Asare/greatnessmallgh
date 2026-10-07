from django.urls import path

from .views import (
    PublicCategoryListView,
    PublicProductDetailView,
    PublicProductListView,
    AdminCategoryDetailView,
    AdminCategoryListCreateView,
    AdminProductDetailView,
    AdminProductListCreateView,
)


app_name = "products"


urlpatterns = [
    # Admin categories
    path(
        "admin/categories/",
        AdminCategoryListCreateView.as_view(),
        name="admin-category-list-create",
    ),

    path(
        "admin/categories/<int:pk>/",
        AdminCategoryDetailView.as_view(),
        name="admin-category-detail",
    ),

    # Admin products
    path(
        "admin/",
        AdminProductListCreateView.as_view(),
        name="admin-product-list-create",
    ),

    path(
        "admin/<int:pk>/",
        AdminProductDetailView.as_view(),
        name="admin-product-detail",
    ),

    # Public categories
    path(
        "categories/",
        PublicCategoryListView.as_view(),
        name="public-category-list",
    ),

    # Public products
    path(
        "",
        PublicProductListView.as_view(),
        name="public-product-list",
    ),

    # Keep slug route last
    path(
        "<slug:slug>/",
        PublicProductDetailView.as_view(),
        name="public-product-detail",
    ),
]