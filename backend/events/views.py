from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)

from .models import Event

from .serializers import (
    EventDetailSerializer,
    EventListSerializer,
    EventWriteSerializer,
)


class PublicEventListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        EventListSerializer
    )

    queryset = (
        Event.objects
        .filter(
            is_published=True
        )
        .order_by(
            "display_order",
            "event_date",
            "event_time",
        )
    )


class PublicEventDetailView(
    generics.RetrieveAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        EventDetailSerializer
    )

    lookup_field = "slug"

    queryset = Event.objects.filter(
        is_published=True
    )


class AdminEventListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    def get_queryset(self):
        return (
            Event.objects
            .all()
            .order_by(
                "display_order",
                "event_date",
                "event_time",
            )
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return EventDetailSerializer

        return EventWriteSerializer


class AdminEventDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = Event.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return EventDetailSerializer

        return EventWriteSerializer