from django.db import models
from django.utils.text import slugify


class Event(models.Model):
    class EventFormat(models.TextChoices):
        PHYSICAL = "physical", "Physical"
        ONLINE = "online", "Online"
        BOTH = "both", "Physical & Online"

    class EventCategory(models.TextChoices):
        TRAINING = "training", "Training"
        SEMINAR = "seminar", "Seminar"
        PRESENTATION = "presentation", "Presentation"
        MEETING = "meeting", "Meeting"
        PRODUCT_EDUCATION = (
            "product_education",
            "Product Education",
        )
        OTHER = "other", "Other"

    title = models.CharField(
        max_length=180,
    )

    slug = models.SlugField(
        max_length=200,
        unique=True,
        blank=True,
    )

    category = models.CharField(
        max_length=40,
        choices=EventCategory.choices,
        default=EventCategory.TRAINING,
    )

    short_summary = models.CharField(
        max_length=260,
    )

    full_details = models.TextField(
        blank=True,
    )

    flyer = models.ImageField(
        upload_to="events/flyers/",
        blank=True,
        null=True,
    )

    event_date = models.DateField(
        blank=True,
        null=True,
    )

    event_time = models.TimeField(
        blank=True,
        null=True,
    )

    venue = models.CharField(
        max_length=250,
        blank=True,
    )

    event_format = models.CharField(
        max_length=20,
        choices=EventFormat.choices,
        default=EventFormat.BOTH,
    )

    host_name = models.CharField(
        max_length=180,
        blank=True,
    )

    meeting_platform = models.CharField(
        max_length=100,
        blank=True,
    )

    meeting_link = models.URLField(
        blank=True,
    )

    meeting_code = models.CharField(
        max_length=120,
        blank=True,
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
            "event_date",
            "event_time",
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(
                self.title
            )

            slug = base_slug
            counter = 2

            while Event.objects.filter(
                slug=slug
            ).exclude(
                pk=self.pk
            ).exists():
                slug = (
                    f"{base_slug}-{counter}"
                )

                counter += 1

            self.slug = slug

        super().save(
            *args,
            **kwargs
        )

    def __str__(self):
        return self.title