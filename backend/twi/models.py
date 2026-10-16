from django.db import models


class TwiContent(models.Model):
    class ContentType(models.TextChoices):
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio"
        IMAGE = "image", "Image"

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.SET_NULL,
        related_name="twi_content",
        blank=True,
        null=True,
    )

    title = models.CharField(max_length=180)
    english_title = models.CharField(max_length=180, blank=True)
    short_description = models.TextField(blank=True)

    content_type = models.CharField(
        max_length=20,
        choices=ContentType.choices,
    )

    video_url = models.URLField(blank=True)

    audio_file = models.FileField(
        upload_to="twi/audio/",
        blank=True,
        null=True,
    )

    image = models.ImageField(
        upload_to="twi/images/",
        blank=True,
        null=True,
    )

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return self.title
