from rest_framework import serializers

from .models import Testimonial


class TestimonialSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Testimonial

        fields = (
            "id",
            "customer_name",
            "customer_title",
            "testimonial_type",
            "message",
            "video_file",
            "video_url",
            "image",
            "audio_file",
            "thumbnail",
            "is_featured",
            "display_order",
        )


class TestimonialWriteSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Testimonial

        fields = (
            "id",
            "customer_name",
            "customer_title",
            "testimonial_type",
            "message",
            "video_file",
            "video_url",
            "image",
            "audio_file",
            "thumbnail",
            "is_featured",
            "is_published",
            "display_order",
        )

    def validate(self, attrs):
        instance = self.instance

        testimonial_type = attrs.get(
            "testimonial_type",
            getattr(
                instance,
                "testimonial_type",
                None,
            ),
        )

        video_file = attrs.get(
            "video_file",
            getattr(
                instance,
                "video_file",
                None,
            ),
        )

        video_url = attrs.get(
            "video_url",
            getattr(
                instance,
                "video_url",
                "",
            ),
        )

        image = attrs.get(
            "image",
            getattr(
                instance,
                "image",
                None,
            ),
        )

        audio_file = attrs.get(
            "audio_file",
            getattr(
                instance,
                "audio_file",
                None,
            ),
        )

        if (
            testimonial_type
            == Testimonial.TestimonialType.VIDEO
            and not video_file
            and not video_url
        ):
            raise serializers.ValidationError(
                {
                    "video_file":
                        "Upload a video file or provide a video URL."
                }
            )

        if (
            testimonial_type
            == Testimonial.TestimonialType.IMAGE
            and not image
        ):
            raise serializers.ValidationError(
                {
                    "image":
                        "An image is required for an image testimonial."
                }
            )

        if (
            testimonial_type
            == Testimonial.TestimonialType.AUDIO
            and not audio_file
        ):
            raise serializers.ValidationError(
                {
                    "audio_file":
                        "An audio file is required for an audio testimonial."
                }
            )

        return attrs