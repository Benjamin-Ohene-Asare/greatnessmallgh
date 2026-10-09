from django.http import FileResponse
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView

from .models import OptInCampaign, OptInSubmission
from .notifications import send_optin_notifications
from .serializers import (
    OptInCampaignSerializer,
    OptInSubmissionAdminSerializer,
    OptInSubmissionCreateSerializer,
)


# ============================================================
# PUBLIC ACTIVE OPT-IN CAMPAIGN
# ============================================================

class PublicOptInCampaignView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = OptInCampaignSerializer

    def get_object(self):
        campaign = (
            OptInCampaign.objects
            .filter(is_active=True)
            .order_by("-updated_at")
            .first()
        )

        if campaign is None:
            raise NotFound("No active opt-in campaign.")

        return campaign


# ============================================================
# PUBLIC OPT-IN SUBMISSION
# ============================================================

class PublicOptInSubmissionCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = OptInSubmissionCreateSerializer

    def perform_create(self, serializer):
        campaign = (
            OptInCampaign.objects
            .filter(is_active=True)
            .order_by("-updated_at")
            .first()
        )

        submission = serializer.save(
            campaign=campaign
        )

        send_optin_notifications(
            submission
        )


# ============================================================
# ADMIN OPT-IN CAMPAIGN
# ============================================================

class AdminOptInCampaignView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = OptInCampaignSerializer

    def get_object(self):
        campaign = (
            OptInCampaign.objects
            .order_by("-updated_at")
            .first()
        )

        if campaign is None:
            campaign = OptInCampaign.objects.create(
                label="FREE RESOURCE",
                headline="Unlock Your Free Greatness Mall Resource",
                resource_title="Greatness Mall Resource",
                button_text="Unlock Free Resource",
                is_active=True,
            )

        return campaign


# ============================================================
# ADMIN SUBMISSIONS LIST
# ============================================================

class AdminOptInSubmissionListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = OptInSubmissionAdminSerializer

    def get_queryset(self):
        queryset = (
            OptInSubmission.objects
            .select_related("campaign")
            .all()
        )

        status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if status:
            queryset = queryset.filter(
                status=status
            )

        if search:
            queryset = (
                queryset.filter(full_name__icontains=search)
                | queryset.filter(phone__icontains=search)
                | queryset.filter(email__icontains=search)
            )

        return queryset


# ============================================================
# ADMIN UPDATE SUBMISSION STATUS
# ============================================================

class AdminOptInSubmissionDetailView(
    generics.RetrieveUpdateAPIView
):
    permission_classes = [IsAdminUser]
    serializer_class = OptInSubmissionAdminSerializer

    queryset = (
        OptInSubmission.objects
        .select_related("campaign")
        .all()
    )


# ============================================================
# PUBLIC RESOURCE DOWNLOAD
# ============================================================

class PublicResourceDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        campaign = get_object_or_404(
            OptInCampaign,
            pk=pk,
            is_active=True,
        )

        if not campaign.resource_file:
            raise NotFound(
                "Resource file is not available."
            )

        response = FileResponse(
            campaign.resource_file.open("rb"),
            as_attachment=True,
            filename=campaign.resource_file.name.split("/")[-1],
        )

        response["X-Content-Type-Options"] = "nosniff"

        return response