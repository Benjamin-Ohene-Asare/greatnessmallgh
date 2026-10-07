import re
from urllib.parse import urlparse

from rest_framework import serializers

from .models import Event


def clean_single_line(
    value,
    max_length=None,
):
    if value is None:
        return ""

    value = str(value)

    value = re.sub(
        r"[\x00-\x1F\x7F<>]",
        "",
        value,
    )

    value = re.sub(
        r"\s+",
        " ",
        value,
    ).strip()

    if max_length:
        value = value[:max_length]

    return value


def clean_long_text(
    value,
    max_length=None,
):
    if value is None:
        return ""

    value = str(value)

    value = re.sub(
        r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F<>]",
        "",
        value,
    ).strip()

    if max_length:
        value = value[:max_length]

    return value


def validate_event_flyer(
    image,
):
    if not image:
        return image

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    content_type = getattr(
        image,
        "content_type",
        None,
    )

    if (
        content_type
        and content_type
        not in allowed_types
    ):
        raise serializers.ValidationError(
            "Only JPG, PNG and WEBP images are allowed."
        )

    max_size = (
        5 * 1024 * 1024
    )

    if image.size > max_size:
        raise serializers.ValidationError(
            "The event flyer must not exceed 5 MB."
        )

    return image


def validate_meeting_url(
    value,
):
    if not value:
        return ""

    value = value.strip()

    try:
        parsed = urlparse(
            value
        )
    except ValueError:
        raise serializers.ValidationError(
            "Enter a valid meeting URL."
        )

    if (
        parsed.scheme
        not in {
            "http",
            "https",
        }
    ):
        raise serializers.ValidationError(
            "Meeting links must use HTTP or HTTPS."
        )

    hostname = (
        parsed.hostname
        or ""
    ).lower()

    if not hostname:
        raise serializers.ValidationError(
            "Enter a valid meeting URL."
        )

    allowed_hosts = {
        "meet.google.com",
        "zoom.us",
        "teams.microsoft.com",
    }

    is_allowed = (
        hostname
        in allowed_hosts
        or hostname.endswith(
            ".zoom.us"
        )
    )

    if not is_allowed:
        raise serializers.ValidationError(
            "Use an approved Google Meet, Zoom or Microsoft Teams link."
        )

    return value


class EventListSerializer(
    serializers.ModelSerializer
):
    category_label = serializers.CharField(
        source="get_category_display",
        read_only=True,
    )

    format_label = serializers.CharField(
        source="get_event_format_display",
        read_only=True,
    )

    class Meta:
        model = Event

        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_label",
            "short_summary",
            "flyer",
            "event_date",
            "event_time",
            "venue",
            "event_format",
            "format_label",
            "host_name",
            "is_published",
            "display_order",
            "updated_at",
        ]


class EventDetailSerializer(
    serializers.ModelSerializer
):
    category_label = serializers.CharField(
        source="get_category_display",
        read_only=True,
    )

    format_label = serializers.CharField(
        source="get_event_format_display",
        read_only=True,
    )

    class Meta:
        model = Event

        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_label",
            "short_summary",
            "full_details",
            "flyer",
            "event_date",
            "event_time",
            "venue",
            "event_format",
            "format_label",
            "host_name",
            "meeting_platform",
            "meeting_link",
            "meeting_code",
            "is_published",
            "display_order",
            "created_at",
            "updated_at",
        ]


class EventWriteSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Event

        fields = [
            "id",
            "title",
            "slug",
            "category",
            "short_summary",
            "full_details",
            "flyer",
            "event_date",
            "event_time",
            "venue",
            "event_format",
            "host_name",
            "meeting_platform",
            "meeting_link",
            "meeting_code",
            "is_published",
            "display_order",
        ]

        read_only_fields = [
            "id",
            "slug",
        ]


    def validate_title(
        self,
        value,
    ):
        value = clean_single_line(
            value,
            180,
        )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Enter a valid event title."
            )

        return value


    def validate_short_summary(
        self,
        value,
    ):
        value = clean_long_text(
            value,
            260,
        )

        if len(value) < 5:
            raise serializers.ValidationError(
                "Enter a valid short event summary."
            )

        return value


    def validate_full_details(
        self,
        value,
    ):
        return clean_long_text(
            value,
            10000,
        )


    def validate_venue(
        self,
        value,
    ):
        return clean_single_line(
            value,
            250,
        )


    def validate_host_name(
        self,
        value,
    ):
        return clean_single_line(
            value,
            180,
        )


    def validate_meeting_platform(
        self,
        value,
    ):
        return clean_single_line(
            value,
            100,
        )


    def validate_meeting_code(
        self,
        value,
    ):
        return clean_single_line(
            value,
            120,
        )


    def validate_meeting_link(
        self,
        value,
    ):
        return validate_meeting_url(
            value
        )


    def validate_flyer(
        self,
        value,
    ):
        return validate_event_flyer(
            value
        )


    def validate_display_order(
        self,
        value,
    ):
        if value < 0:
            raise serializers.ValidationError(
                "Display order cannot be negative."
            )

        return value


    def validate(
        self,
        attrs,
    ):
        event_format = attrs.get(
            "event_format",
            getattr(
                self.instance,
                "event_format",
                Event.EventFormat.BOTH,
            ),
        )

        venue = attrs.get(
            "venue",
            getattr(
                self.instance,
                "venue",
                "",
            ),
        )

        meeting_platform = attrs.get(
            "meeting_platform",
            getattr(
                self.instance,
                "meeting_platform",
                "",
            ),
        )

        meeting_link = attrs.get(
            "meeting_link",
            getattr(
                self.instance,
                "meeting_link",
                "",
            ),
        )


        if (
            event_format
            != Event.EventFormat.ONLINE
            and not venue
        ):
            raise serializers.ValidationError(
                {
                    "venue":
                        "Enter the event venue."
                }
            )


        if (
            event_format
            in {
                Event.EventFormat.ONLINE,
                Event.EventFormat.BOTH,
            }
            and not meeting_platform
            and not meeting_link
        ):
            raise serializers.ValidationError(
                {
                    "meeting_link":
                        "Add the online meeting platform or meeting link."
                }
            )


        return attrs