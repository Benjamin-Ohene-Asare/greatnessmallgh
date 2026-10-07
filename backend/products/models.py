from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
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
            "name",
        ]

        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                self.name
            )

        super().save(
            *args,
            **kwargs
        )

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )

    name = models.CharField(
        max_length=150,
    )

    slug = models.SlugField(
        max_length=180,
        unique=True,
        blank=True,
    )

    short_description = models.CharField(
        max_length=220,
    )

    tagline = models.CharField(
        max_length=180,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    main_image = models.ImageField(
        upload_to="products/main/",
        blank=True,
        null=True,
    )

    promotional_image = models.ImageField(
        upload_to="products/promotional/",
        blank=True,
        null=True,
    )

    youtube_url = models.URLField(
        blank=True,
    )

    extra_information = models.TextField(
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
            "-created_at",
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(
                self.name
            )

            slug = base_slug
            counter = 2

            while Product.objects.filter(
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
        return self.name


class ProductBenefit(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="benefits",
    )

    text = models.CharField(
        max_length=250,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        ordering = [
            "display_order",
            "id",
        ]

    def __str__(self):
        return (
            f"{self.product.name}: "
            f"{self.text}"
        )


class ProductIngredient(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="ingredients",
    )

    name = models.CharField(
        max_length=200,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        ordering = [
            "display_order",
            "id",
        ]

    def __str__(self):
        return (
            f"{self.product.name}: "
            f"{self.name}"
        )