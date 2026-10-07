from django.db import models


class OptInCampaign(models.Model):
    label = models.CharField(
        max_length=100,
        blank=True,
    )

    headline = models.CharField(
        max_length=220,
    )

    supporting_text = models.TextField(
        blank=True,
    )

    resource_title = models.CharField(
        max_length=180,
    )

    resource_description = models.TextField(
        blank=True,
    )

    resource_image = models.ImageField(
        upload_to="optin/images/",
        blank=True,
        null=True,
    )

    resource_file = models.FileField(
        upload_to="optin/resources/",
        blank=True,
        null=True,
    )

    button_text = models.CharField(
        max_length=100,
        default="Unlock Free Resource",
    )

    privacy_note = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.headline


class OptInSubmission(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"

    campaign = models.ForeignKey(
        OptInCampaign,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="submissions",
    )

    full_name = models.CharField(
        max_length=150,
    )

    phone = models.CharField(
        max_length=30,
    )

    # Normalized version is used for duplicate detection.
    # Example:
    # 0241234567 and +233241234567 become the same identity.
    normalized_phone = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
    )

    email = models.EmailField(
        blank=True,
    )

    # Email is optional, so NULL is used when none is supplied.
    # When an email exists, its normalized form must be unique.
    normalized_email = models.EmailField(
        blank=True,
        null=True,
        unique=True,
        db_index=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True,
    )

    last_accessed_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "-submitted_at",
        ]

    def __str__(self):
        return (
            f"{self.full_name} - "
            f"{self.normalized_phone}"
        )