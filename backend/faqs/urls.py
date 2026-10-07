from django.urls import path

from .views import (
    AdminFAQCategoryDetailView,
    AdminFAQCategoryListCreateView,
    AdminFAQDetailView,
    AdminFAQListCreateView,
    PublicFAQCategoryListView,
    PublicFAQListView,
)


app_name = "faqs"


urlpatterns = [
    # Admin routes come first so they can never be mistaken
    # for public routes.

    path(
        "admin/categories/",
        AdminFAQCategoryListCreateView.as_view(),
        name="admin-category-list-create",
    ),

    path(
        "admin/categories/<int:pk>/",
        AdminFAQCategoryDetailView.as_view(),
        name="admin-category-detail",
    ),

    path(
        "admin/",
        AdminFAQListCreateView.as_view(),
        name="admin-faq-list-create",
    ),

    path(
        "admin/<int:pk>/",
        AdminFAQDetailView.as_view(),
        name="admin-faq-detail",
    ),


    # Public FAQ endpoints.

    path(
        "categories/",
        PublicFAQCategoryListView.as_view(),
        name="public-category-list",
    ),

    path(
        "",
        PublicFAQListView.as_view(),
        name="public-faq-list",
    ),
]