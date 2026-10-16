from django.urls import path

from .views import (
    CurrentCustomerView,
    CustomerCsrfView,
    CustomerLoginView,
    CustomerLogoutView,
    CustomerRegisterView,
    GoogleLoginView,
    CustomerProfileView,
)


urlpatterns = [
    path(
        "csrf/",
        CustomerCsrfView.as_view(),
        name="customer-csrf",
    ),
    path(
        "register/",
        CustomerRegisterView.as_view(),
        name="customer-register",
    ),
    path(
        "login/",
        CustomerLoginView.as_view(),
        name="customer-login",
    ),
    path(
        "google/",
        GoogleLoginView.as_view(),
        name="customer-google-login",
    ),
    path(
        "me/",
        CurrentCustomerView.as_view(),
        name="current-customer",
    ),
    path(
        "logout/",
        CustomerLogoutView.as_view(),
        name="customer-logout",
    ),
    path(
    "profile/",
    CustomerProfileView.as_view(),
    name="customer-profile",
),
]