from django.urls import path

from .admin_auth import (
    AdminCSRFView,
    AdminLoginView,
    AdminLogoutView,
    AdminSessionView,
)
from .views import HealthCheckView


app_name = "core"


urlpatterns = [
    # Health check
    path(
        "health/",
        HealthCheckView.as_view(),
        name="health",
    ),

    # Admin authentication
    path(
        "admin/csrf/",
        AdminCSRFView.as_view(),
        name="admin-csrf",
    ),

    path(
        "admin/login/",
        AdminLoginView.as_view(),
        name="admin-login",
    ),

    path(
        "admin/session/",
        AdminSessionView.as_view(),
        name="admin-session",
    ),

    path(
        "admin/logout/",
        AdminLogoutView.as_view(),
        name="admin-logout",
    ),
]