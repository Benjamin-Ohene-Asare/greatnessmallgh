from django.urls import path

from .views import (
    AdminFAQCategoryDetailView,
    AdminFAQCategoryListCreateView,
    AdminFAQDetailView,
    AdminFAQListCreateView,
)


app_name = "admin_faqs"


urlpatterns = [
    # FAQ list and create
    path(
        "",
        AdminFAQListCreateView.as_view(),
        name="faq-list-create",
    ),

    # FAQ detail
    path(
        "<int:pk>/",
        AdminFAQDetailView.as_view(),
        name="faq-detail",
    ),

    # FAQ category list and create
    path(
        "categories/",
        AdminFAQCategoryListCreateView.as_view(),
        name="category-list-create",
    ),

    # FAQ category detail
    path(
        "categories/<int:pk>/",
        AdminFAQCategoryDetailView.as_view(),
        name="category-detail",
    ),
]