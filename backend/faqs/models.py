from django.db import models


# ============================================================
# FAQ CATEGORY
#
# Keeps FAQ questions organised into groups such as:
# Products, Orders, Delivery, Wellness and General.
# ============================================================

class FAQCategory(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
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

    class Meta:
        ordering = [
            "display_order",
            "name",
        ]

        verbose_name = "FAQ Category"
        verbose_name_plural = "FAQ Categories"

    def __str__(self):
        return self.name


# ============================================================
# FAQ
#
# Stores each question and answer.
#
# FAQs can be:
# - published/unpublished
# - featured on the homepage
# - arranged in a custom order
# ============================================================

class FAQ(models.Model):
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.PROTECT,
        related_name="faqs",
    )

    question = models.CharField(
        max_length=250,
    )

    answer = models.TextField()

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
            "question",
        ]

    def __str__(self):
        return self.question