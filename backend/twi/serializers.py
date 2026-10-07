from rest_framework import serializers

from .models import TwiContent


class TwiContentSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = TwiContent

        fields = (
            "id",
            "title",
            "short_description",
            "content_type",
            "video_url",
            "audio_file",
            "image",
            "is_featured",
            "display_order",
        )


class TwiContentWriteSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = TwiContent

        fields = (
            "id",
            "title",
            "short_description",
            "content_type",
            "video_url",
            "audio_file",
            "image",
            "is_featured",
            "is_published",
            "display_order",
        )

    def validate(self, attrs):
        instance = self.instance

        content_type = attrs.get(
            "content_type",
            getattr(
                instance,
                "content_type",
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

        audio_file = attrs.get(
            "audio_file",
            getattr(
                instance,
                "audio_file",
                None,
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

        if (
            content_type ==
            TwiContent.ContentType.VIDEO
            and not video_url
        ):
            raise serializers.ValidationError(
                {
                    "video_url":
                        "A video URL is required."
                }
            )

        if (
            content_type ==
            TwiContent.ContentType.AUDIO
            and not audio_file
        ):
            raise serializers.ValidationError(
                {
                    "audio_file":
                        "An audio file is required."
                }
            )

        if (
            content_type ==
            TwiContent.ContentType.IMAGE
            and not image
        ):
            raise serializers.ValidationError(
                {
                    "image":
                        "An image is required."
                }
            )

        return attrs