from django.urls import path

from .views import (
    CartItemCreateView,
    CartItemDetailView,
    CartView,
    CheckoutView,
    OrderListView,
    OrderWhatsAppStartedView,
)


urlpatterns = [
    path(
        "cart/",
        CartView.as_view(),
        name="cart",
    ),
    path(
        "cart/items/",
        CartItemCreateView.as_view(),
        name="cart-item-create",
    ),
    path(
        "cart/items/<int:item_id>/",
        CartItemDetailView.as_view(),
        name="cart-item-detail",
    ),
    path(
        "checkout/",
        CheckoutView.as_view(),
        name="checkout",
    ),
    path(
        "orders/",
        OrderListView.as_view(),
        name="order-list",
    ),
    path(
        "orders/<str:reference>/whatsapp-started/",
        OrderWhatsAppStartedView.as_view(),
        name="order-whatsapp-started",
    ),
]
