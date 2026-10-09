import hashlib
import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone


class AdminRecoverySettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recovery_settings",
    )

    phone = models.CharField(
        max_length=20,
        unique=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.phone}"


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_reset_codes",
    )

    code_hash = models.CharField(
        max_length=64,
    )

    expires_at = models.DateTimeField()

    used = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def set_code(self, code):
        self.code_hash = hashlib.sha256(
            code.encode()
        ).hexdigest()

    def check_code(self, code):
        return secrets.compare_digest(
            self.code_hash,
            hashlib.sha256(
                code.encode()
            ).hexdigest(),
        )

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"Password reset for {self.user.username}"