from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)

from .models import Testimonial
from .serializers import (
    TestimonialSerializer,
    TestimonialWriteSerializer,
)


class PublicTestimonialListView(
    generics.ListAPIView
):
    permission_classes = [
        AllowAny,
    ]

    serializer_class = (
        TestimonialSerializer
    )

    def get_queryset(self):
        queryset = (
            Testimonial.objects
            .filter(
                is_published=True,
            )
            .order_by(
                "display_order",
                "-created_at",
            )
        )

        testimonial_type = (
            self.request
            .query_params
            .get("type")
        )

        featured = (
            self.request
            .query_params
            .get("featured")
        )

        if testimonial_type in {
            "video",
            "image",
            "audio",
        }:
            queryset = queryset.filter(
                testimonial_type=testimonial_type,
            )

        if featured == "true":
            queryset = queryset.filter(
                is_featured=True,
            )

        return queryset


class AdminTestimonialListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        Testimonial.objects
        .all()
        .order_by(
            "display_order",
            "-created_at",
        )
    )

    serializer_class = (
        TestimonialWriteSerializer
    )


class AdminTestimonialDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAdminUser,
    ]

    queryset = (
        Testimonial.objects.all()
    )

    serializer_class = (
        TestimonialWriteSerializer
    )