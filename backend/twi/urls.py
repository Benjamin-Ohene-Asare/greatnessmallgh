from django.urls import path

from .views import (
    AdminTwiContentDetailView,
    AdminTwiContentListCreateView,
    PublicTwiContentListView,
)


app_name = "twi"


urlpatterns = [
    # Public Twi content
    path(
        "",
        PublicTwiContentListView.as_view(),
        name="twi-content-list",
    ),

    # Admin Twi content
    path(
        "admin/",
        AdminTwiContentListCreateView.as_view(),
        name="admin-twi-content-list-create",
    ),

    # Admin Twi content detail
    path(
        "admin/<int:pk>/",
        AdminTwiContentDetailView.as_view(),
        name="admin-twi-content-detail",
    ),
]