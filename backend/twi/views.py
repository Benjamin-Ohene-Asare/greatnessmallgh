from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)

from .models import TwiContent
from .serializers import (
    TwiContentSerializer,
    TwiContentWriteSerializer,
)


class PublicTwiContentListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        TwiContentSerializer
    )

    def get_queryset(self):
        queryset = (
            TwiContent.objects
            .filter(
                is_published=True,
            )
            .order_by(
                "display_order",
                "-created_at",
            )
        )

        content_type = (
            self.request
            .query_params
            .get("type")
        )

        featured = (
            self.request
            .query_params
            .get("featured")
        )

        if content_type in {
            "video",
            "audio",
            "image",
        }:
            queryset = queryset.filter(
                content_type=content_type,
            )

        if featured == "true":
            queryset = queryset.filter(
                is_featured=True,
            )

        return queryset


class AdminTwiContentListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        TwiContent.objects
        .all()
    )

    serializer_class = (
        TwiContentWriteSerializer
    )


class AdminTwiContentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        TwiContent.objects.all()
    )

    serializer_class = (
        TwiContentWriteSerializer
    )