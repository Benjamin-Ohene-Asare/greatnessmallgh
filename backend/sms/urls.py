from django.urls import path

from .views import (
    AdminSMSBroadcastView,
    AdminSMSCustomersView,
)

app_name = "sms"

urlpatterns = [
    path(
        "admin/customers/",
        AdminSMSCustomersView.as_view(),
        name="admin-sms-customers",
    ),
    path(
        "admin/broadcast/",
        AdminSMSBroadcastView.as_view(),
        name="admin-sms-broadcast",
    ),
]