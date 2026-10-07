from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models

def validate_testimonial_file_size(file):
    max_size = 50 * 1024 * 1024

    if file.size > max_size:
        raise ValidationError(
            "The uploaded testimonial file must not exceed 50 MB."
        )


class Testimonial(models.Model):
    class TestimonialType(models.TextChoices):
        VIDEO = "video", "Video"
        IMAGE = "image", "Image"
        AUDIO = "audio", "Audio"

    customer_name = models.CharField(
        max_length=150,
    )

    customer_title = models.CharField(
        max_length=150,
        blank=True,
    )

    testimonial_type = models.CharField(
        max_length=20,
        choices=TestimonialType.choices,
    )

    message = models.TextField(
        blank=True,
    )

    video_file = models.FileField(
        upload_to="testimonials/videos/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "mp4",
                    "webm",
                    "mov",
                ]
            ),
            validate_testimonial_file_size,
        ],
    )

    video_url = models.URLField(
        blank=True,
    )

    image = models.ImageField(
        upload_to="testimonials/images/",
        blank=True,
        null=True,
    )

    audio_file = models.FileField(
        upload_to="testimonials/audio/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "mp3",
                    "wav",
                    "m4a",
                    "ogg",
                ]
            ),
            validate_testimonial_file_size,
        ],
    )

    thumbnail = models.ImageField(
        upload_to="testimonials/thumbnails/",
        blank=True,
        null=True,
    )

    is_featured = models.BooleanField(
        default=False,
    )

    is_published = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "display_order",
            "-created_at",
        ]

    def __str__(self):
        return self.customer_name