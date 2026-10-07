from django.contrib import admin

from .models import (
    Category,
    Product,
    ProductBenefit,
    ProductIngredient,
)


class ProductBenefitInline(
    admin.TabularInline
):
    model = ProductBenefit
    extra = 1


class ProductIngredientInline(
    admin.TabularInline
):
    model = ProductIngredient
    extra = 1


@admin.register(Category)
class CategoryAdmin(
    admin.ModelAdmin
):
    list_display = (
        "name",
        "slug",
        "is_active",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    ordering = (
        "display_order",
        "name",
    )


@admin.register(Product)
class ProductAdmin(
    admin.ModelAdmin
):
    list_display = (
        "name",
        "category",
        "is_published",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "is_published",
        "category",
    )

    search_fields = (
        "name",
        "short_description",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    ordering = (
        "display_order",
        "-created_at",
    )

    inlines = [
        ProductBenefitInline,
        ProductIngredientInline,
    ]