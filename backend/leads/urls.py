from django.urls import path

from .views import (
    AdminOptInCampaignView,
    AdminOptInSubmissionDetailView,
    AdminOptInSubmissionListView,
    PublicOptInCampaignView,
    PublicOptInSubmissionCreateView,
    PublicResourceDownloadView,
)


app_name = "leads"


urlpatterns = [
    # Admin
    path(
        "admin/optin/",
        AdminOptInCampaignView.as_view(),
        name="admin-optin",
    ),

    path(
        "admin/submissions/",
        AdminOptInSubmissionListView.as_view(),
        name="admin-submissions",
    ),

    path(
        "admin/submissions/<int:pk>/",
        AdminOptInSubmissionDetailView.as_view(),
        name="admin-submission-detail",
    ),

    # Public
    path(
        "optin/",
        PublicOptInCampaignView.as_view(),
        name="public-optin",
    ),

    path(
        "submit/",
        PublicOptInSubmissionCreateView.as_view(),
        name="public-submit",
    ),
    path(
    "resource/<int:pk>/download/",
    PublicResourceDownloadView.as_view(),
    name="public-resource-download",
),
]