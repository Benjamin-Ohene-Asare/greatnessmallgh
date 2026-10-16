from django.contrib import admin

from .models import Cart, CartItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False

    fields = [
        "product",
        "product_name",
        "quantity",
        "created_at",
    ]

    readonly_fields = [
        "product",
        "product_name",
        "quantity",
        "created_at",
    ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "reference",
        "full_name",
        "phone_number",
        "location",
        "status",
        "total_quantity_display",
        "created_at",
    ]

    list_filter = [
        "status",
        "created_at",
    ]

    search_fields = [
        "reference",
        "full_name",
        "phone_number",
        "location",
        "user__email",
    ]

    ordering = [
        "-created_at",
    ]

    list_select_related = [
        "user",
    ]

    readonly_fields = [
        "reference",
        "user",
        "full_name",
        "phone_number",
        "location",
        "whatsapp_started_at",
        "created_at",
        "updated_at",
    ]

    fields = [
        "reference",
        "user",
        "full_name",
        "phone_number",
        "location",
        "status",
        "whatsapp_started_at",
        "created_at",
        "updated_at",
    ]

    inlines = [
        OrderItemInline,
    ]

    @admin.display(
        description="Total Qty"
    )
    def total_quantity_display(
        self,
        obj,
    ):
        return sum(
            item.quantity
            for item in obj.items.all()
        )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("user")
            .prefetch_related("items")
        )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "order",
        "product_name",
        "quantity",
        "created_at",
    ]

    list_filter = [
        "created_at",
    ]

    search_fields = [
        "order__reference",
        "product_name",
    ]

    readonly_fields = [
        "order",
        "product",
        "product_name",
        "quantity",
        "created_at",
    ]


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

    fields = [
        "product",
        "quantity",
        "created_at",
        "updated_at",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "updated_at",
    ]

    search_fields = [
        "user__email",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    inlines = [
        CartItemInline,
    ]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "cart",
        "product",
        "quantity",
        "updated_at",
    ]

    search_fields = [
        "cart__user__email",
        "product__name",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]
