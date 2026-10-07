from django.urls import path

from .views import (
    AdminEventDetailView,
    AdminEventListCreateView,
    PublicEventDetailView,
    PublicEventListView,
)


app_name = "events"


urlpatterns = [
    # Admin dashboard
    path(
        "admin/",
        AdminEventListCreateView.as_view(),
        name="admin-event-list-create",
    ),

    path(
        "admin/<int:pk>/",
        AdminEventDetailView.as_view(),
        name="admin-event-detail",
    ),

    # Public
    path(
        "",
        PublicEventListView.as_view(),
        name="public-event-list",
    ),

    path(
        "<slug:slug>/",
        PublicEventDetailView.as_view(),
        name="public-event-detail",
    ),
]