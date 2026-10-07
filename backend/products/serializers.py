import json
import re
from urllib.parse import urlparse

from django.db import transaction
from rest_framework import serializers

from .models import (
    Category,
    Product,
    ProductBenefit,
    ProductIngredient,
)


# Keep admin-entered text clean before storing it.
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


def validate_youtube_url(
    value,
):
    if not value:
        return ""

    value = value.strip()

    try:
        parsed = urlparse(value)
    except ValueError:
        raise serializers.ValidationError(
            "Enter a valid YouTube URL."
        )

    hostname = (
        parsed.hostname or ""
    ).lower()

    if hostname.startswith(
        "www."
    ):
        hostname = hostname[4:]

    allowed_hosts = {
        "youtube.com",
        "m.youtube.com",
        "youtu.be",
    }

    if (
        parsed.scheme
        not in {"http", "https"}
        or hostname
        not in allowed_hosts
    ):
        raise serializers.ValidationError(
            "Only valid YouTube links are allowed."
        )

    return value


def validate_image_upload(
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
            "The image must not exceed 5 MB."
        )

    return image


class CategorySerializer(
    serializers.ModelSerializer
):
    product_count = serializers.IntegerField(
        source="products.count",
        read_only=True,
    )

    class Meta:
        model = Category

        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "display_order",
            "product_count",
        ]

        read_only_fields = [
            "id",
            "slug",
            "product_count",
        ]

    def validate_name(
        self,
        value,
    ):
        value = clean_single_line(
            value,
            100,
        )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Enter a valid category name."
            )

        queryset = Category.objects.filter(
            name__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "A category with this name already exists."
            )

        return value

    def validate_description(
        self,
        value,
    ):
        return clean_long_text(
            value,
            250,
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
class ProductBenefitSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = ProductBenefit

        fields = [
            "id",
            "text",
            "display_order",
        ]

        read_only_fields = [
            "id",
        ]

    def validate_text(
        self,
        value,
    ):
        value = clean_single_line(
            value,
            250,
        )

        if not value:
            raise serializers.ValidationError(
                "Benefit text cannot be empty."
            )

        return value


class ProductIngredientSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = ProductIngredient

        fields = [
            "id",
            "name",
            "display_order",
        ]

        read_only_fields = [
            "id",
        ]

    def validate_name(
        self,
        value,
    ):
        value = clean_single_line(
            value,
            250,
        )

        if not value:
            raise serializers.ValidationError(
                "Ingredient name cannot be empty."
            )

        return value


class ProductListSerializer(
    serializers.ModelSerializer
):
    category = CategorySerializer(
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "category",
            "short_description",
            "tagline",
            "main_image",
            "is_published",
            "display_order",
            "updated_at",
        ]


class ProductDetailSerializer(
    serializers.ModelSerializer
):
    category = CategorySerializer(
        read_only=True
    )

    benefits = ProductBenefitSerializer(
        many=True,
        read_only=True,
    )

    ingredients = ProductIngredientSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "category",
            "short_description",
            "tagline",
            "description",
            "main_image",
            "promotional_image",
            "youtube_url",
            "extra_information",
            "benefits",
            "ingredients",
            "is_published",
            "display_order",
            "created_at",
            "updated_at",
        ]


class ProductWriteSerializer(
    serializers.ModelSerializer
):
    category_id = (
        serializers.PrimaryKeyRelatedField(
            source="category",
            queryset=Category.objects.all(),
            write_only=True,
        )
    )

    benefits = ProductBenefitSerializer(
        many=True,
        required=False,
    )

    ingredients = (
        ProductIngredientSerializer(
            many=True,
            required=False,
        )
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "category_id",
            "short_description",
            "tagline",
            "description",
            "main_image",
            "promotional_image",
            "youtube_url",
            "extra_information",
            "benefits",
            "ingredients",
            "is_published",
            "display_order",
        ]

        read_only_fields = [
            "id",
            "slug",
        ]


    # Multipart FormData sends nested arrays as JSON strings.
    def to_internal_value(
        self,
        data,
    ):
        mutable_data = (
            data.copy()
            if hasattr(
                data,
                "copy",
            )
            else dict(data)
        )

        for field_name in (
            "benefits",
            "ingredients",
        ):
            raw_value = (
                mutable_data.get(
                    field_name
                )
            )

            if isinstance(
                raw_value,
                str,
            ):
                try:
                    parsed_value = (
                        json.loads(
                            raw_value
                        )
                    )
                except (
                    json.JSONDecodeError,
                    TypeError,
                ):
                    raise serializers.ValidationError(
                        {
                            field_name:
                                "Invalid list data."
                        }
                    )

                if not isinstance(
                    parsed_value,
                    list,
                ):
                    raise serializers.ValidationError(
                        {
                            field_name:
                                "This field must contain a list."
                        }
                    )

                mutable_data[
                    field_name
                ] = parsed_value

        return super().to_internal_value(
            mutable_data
        )


    def validate_name(
        self,
        value,
    ):
        value = clean_single_line(
            value,
            120,
        )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Enter a valid product name."
            )

        return value


    def validate_short_description(
        self,
        value,
    ):
        value = clean_long_text(
            value,
            180,
        )

        if len(value) < 5:
            raise serializers.ValidationError(
                "Enter a valid short description."
            )

        return value


    def validate_tagline(
        self,
        value,
    ):
        return clean_single_line(
            value,
            160,
        )


    def validate_description(
        self,
        value,
    ):
        return clean_long_text(
            value,
            10000,
        )


    def validate_extra_information(
        self,
        value,
    ):
        return clean_long_text(
            value,
            10000,
        )


    def validate_youtube_url(
        self,
        value,
    ):
        return validate_youtube_url(
            value
        )


    def validate_main_image(
        self,
        value,
    ):
        return validate_image_upload(
            value
        )


    def validate_promotional_image(
        self,
        value,
    ):
        return validate_image_upload(
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


    @transaction.atomic
    def create(
        self,
        validated_data,
    ):
        benefits_data = (
            validated_data.pop(
                "benefits",
                [],
            )
        )

        ingredients_data = (
            validated_data.pop(
                "ingredients",
                [],
            )
        )

        product = (
            Product.objects.create(
                **validated_data
            )
        )


        for index, benefit in enumerate(
            benefits_data
        ):
            ProductBenefit.objects.create(
                product=product,
                text=benefit["text"],
                display_order=benefit.get(
                    "display_order",
                    index,
                ),
            )


        for index, ingredient in enumerate(
            ingredients_data
        ):
            ProductIngredient.objects.create(
                product=product,
                name=ingredient["name"],
                display_order=ingredient.get(
                    "display_order",
                    index,
                ),
            )


        return product


    @transaction.atomic
    def update(
        self,
        instance,
        validated_data,
    ):
        benefits_data = (
            validated_data.pop(
                "benefits",
                None,
            )
        )

        ingredients_data = (
            validated_data.pop(
                "ingredients",
                None,
            )
        )


        for (
            attr,
            value,
        ) in validated_data.items():
            setattr(
                instance,
                attr,
                value,
            )


        instance.save()


        if (
            benefits_data
            is not None
        ):
            instance.benefits.all().delete()

            for index, benefit in enumerate(
                benefits_data
            ):
                ProductBenefit.objects.create(
                    product=instance,
                    text=benefit["text"],
                    display_order=benefit.get(
                        "display_order",
                        index,
                    ),
                )


        if (
            ingredients_data
            is not None
        ):
            instance.ingredients.all().delete()

            for index, ingredient in enumerate(
                ingredients_data
            ):
                ProductIngredient.objects.create(
                    product=instance,
                    name=ingredient["name"],
                    display_order=ingredient.get(
                        "display_order",
                        index,
                    ),
                )


        return instance