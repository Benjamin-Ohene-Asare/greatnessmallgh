from django.urls import path

from .views import (
    PublicFAQCategoryListView,
    PublicFAQListView,
)


app_name = "public_faqs"


urlpatterns = [
    # Public FAQ list
    path(
        "",
        PublicFAQListView.as_view(),
        name="faq-list",
    ),

    # Public FAQ categories
    path(
        "categories/",
        PublicFAQCategoryListView.as_view(),
        name="faq-categories",
    ),
]