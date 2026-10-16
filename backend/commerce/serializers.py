from rest_framework import serializers

from products.models import Product

from .models import Cart, CartItem, Order, OrderItem


class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "main_image",
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "created_at",
            "updated_at",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True,
    )
    total_items = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
            "total_items",
            "total_quantity",
            "created_at",
            "updated_at",
        ]

    def get_total_items(self, obj):
        return len(obj.items.all())

    def get_total_quantity(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source="product",
        queryset=Product.objects.filter(
            is_published=True
        ),
    )
    quantity = serializers.IntegerField(
        min_value=1,
        default=1,
    )


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(
        min_value=1,
    )


class OrderItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_slug",
            "quantity",
            "created_at",
        ]

    def get_product_slug(self, obj):
        if not obj.product:
            return None

        return obj.product.slug


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )
    total_items = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "reference",
            "full_name",
            "phone_number",
            "location",
            "status",
            "whatsapp_started_at",
            "items",
            "total_items",
            "total_quantity",
            "created_at",
            "updated_at",
        ]

    def get_total_items(self, obj):
        return len(obj.items.all())

    def get_total_quantity(self, obj):
        return sum(
            item.quantity
            for item in obj.items.all()
        )


class CheckoutSerializer(serializers.Serializer):
    # Kept optional temporarily for compatibility with the current frontend.
    # The backend will take the real customer name from the signed-in account.
    full_name = serializers.CharField(
        max_length=150,
        trim_whitespace=True,
        required=False,
        allow_blank=True,
    )

    # Used only when the signed-in customer profile has no phone number.
    phone_number = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
        required=False,
        allow_blank=True,
    )

    location = serializers.CharField(
        max_length=255,
        trim_whitespace=True,
    )

    def validate_phone_number(self, value):
        value = value.strip()

        if value and len(value) < 7:
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        return value

    def validate_location(self, value):
        value = " ".join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError(
                "Enter your delivery location."
            )

        return value
