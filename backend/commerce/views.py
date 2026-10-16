import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from customers.models import CustomerProfile

from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    CartSerializer,
    CheckoutSerializer,
    OrderSerializer,
    UpdateCartItemSerializer,
)


def get_customer_cart(user):
    cart, _ = Cart.objects.get_or_create(
        user=user
    )
    return cart


def generate_order_reference():
    return (
        "GM-" +
        uuid.uuid4().hex[:8].upper()
    )


class CartView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        cart = get_customer_cart(
            request.user
        )

        cart = (
            Cart.objects
            .prefetch_related(
                "items__product"
            )
            .get(pk=cart.pk)
        )

        serializer = CartSerializer(
            cart
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CartItemCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        serializer = (
            AddCartItemSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        product = (
            serializer.validated_data[
                "product"
            ]
        )

        quantity = (
            serializer.validated_data[
                "quantity"
            ]
        )

        with transaction.atomic():
            cart = get_customer_cart(
                request.user
            )

            cart = (
                Cart.objects
                .select_for_update()
                .get(pk=cart.pk)
            )

            item = (
                CartItem.objects
                .select_for_update()
                .filter(
                    cart=cart,
                    product=product,
                )
                .first()
            )

            if item:
                item.quantity += quantity

                item.save(
                    update_fields=[
                        "quantity",
                        "updated_at",
                    ]
                )

                response_status = (
                    status.HTTP_200_OK
                )
            else:
                item = (
                    CartItem.objects
                    .create(
                        cart=cart,
                        product=product,
                        quantity=quantity,
                    )
                )

                response_status = (
                    status.HTTP_201_CREATED
                )

        return Response(
            CartItemSerializer(
                item
            ).data,
            status=response_status,
        )


class CartItemDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def patch(
        self,
        request,
        item_id,
    ):
        serializer = (
            UpdateCartItemSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        quantity = (
            serializer.validated_data[
                "quantity"
            ]
        )

        with transaction.atomic():
            item = get_object_or_404(
                CartItem.objects
                .select_for_update()
                .select_related(
                    "product",
                    "cart",
                ),
                pk=item_id,
                cart__user=request.user,
            )

            item.quantity = quantity

            item.save(
                update_fields=[
                    "quantity",
                    "updated_at",
                ]
            )

        return Response(
            CartItemSerializer(
                item
            ).data,
            status=status.HTTP_200_OK,
        )

    def delete(
        self,
        request,
        item_id,
    ):
        with transaction.atomic():
            item = get_object_or_404(
                CartItem.objects
                .select_for_update(),
                pk=item_id,
                cart__user=request.user,
            )

            item.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class CheckoutView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        serializer = CheckoutSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        with transaction.atomic():
            profile = (
                CustomerProfile.objects
                .select_for_update()
                .filter(
                    user=request.user
                )
                .first()
            )

            if not profile:
                return Response(
                    {
                        "detail": (
                            "Customer account "
                            "profile is not available."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            full_name = (
                profile.full_name or ""
            ).strip()

            if not full_name:
                return Response(
                    {
                        "detail": (
                            "Please complete your "
                            "account name before "
                            "placing an order."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            phone_number = (
                profile.phone_number
                or serializer.validated_data.get(
                    "phone_number",
                    "",
                )
                or ""
            ).strip()

            if not phone_number:
                return Response(
                    {
                        "detail": (
                            "Your account does not "
                            "have a phone number. "
                            "Please enter one for "
                            "this order."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart = (
                Cart.objects
                .select_for_update()
                .filter(
                    user=request.user
                )
                .first()
            )

            if not cart:
                return Response(
                    {
                        "detail": (
                            "Your cart is empty."
                        )
                    },
                    status=(
                        status.HTTP_400_BAD_REQUEST
                    ),
                )

            cart_items = list(
                CartItem.objects
                .select_related("product")
                .filter(cart=cart)
                .order_by("id")
            )

            if not cart_items:
                return Response(
                    {
                        "detail": (
                            "Your cart is empty."
                        )
                    },
                    status=(
                        status.HTTP_400_BAD_REQUEST
                    ),
                )

            unavailable_items = [
                item.product.name
                for item in cart_items
                if not item.product.is_published
            ]

            if unavailable_items:
                return Response(
                    {
                        "detail": (
                            "One or more products "
                            "in your cart are no "
                            "longer available."
                        ),
                        "products": (
                            unavailable_items
                        ),
                    },
                    status=(
                        status.HTTP_400_BAD_REQUEST
                    ),
                )

            order = Order.objects.create(
                user=request.user,
                reference=(
                    generate_order_reference()
                ),
                full_name=full_name,
                phone_number=phone_number,
                location=(
                    serializer.validated_data[
                        "location"
                    ]
                ),
            )

            OrderItem.objects.bulk_create(
                [
                    OrderItem(
                        order=order,
                        product=item.product,
                        product_name=(
                            item.product.name
                        ),
                        quantity=item.quantity,
                    )
                    for item in cart_items
                ]
            )

            CartItem.objects.filter(
                cart=cart
            ).delete()

        saved_order = (
            Order.objects
            .prefetch_related(
                "items__product"
            )
            .get(pk=order.pk)
        )

        return Response(
            OrderSerializer(
                saved_order
            ).data,
            status=status.HTTP_201_CREATED,
        )


class OrderListView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        orders = (
            Order.objects
            .filter(
                user=request.user
            )
            .prefetch_related(
                "items__product"
            )
        )

        return Response(
            OrderSerializer(
                orders,
                many=True,
            ).data,
            status=status.HTTP_200_OK,
        )


class OrderWhatsAppStartedView(
    APIView
):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(
        self,
        request,
        reference,
    ):
        with transaction.atomic():
            order = get_object_or_404(
                Order.objects
                .select_for_update(),
                reference=reference,
                user=request.user,
            )

            if (
                order.status
                == "pending_whatsapp"
            ):
                order.status = (
                    "whatsapp_started"
                )

                order.whatsapp_started_at = (
                    timezone.now()
                )

                order.save(
                    update_fields=[
                        "status",
                        "whatsapp_started_at",
                        "updated_at",
                    ]
                )

        order = (
            Order.objects
            .prefetch_related(
                "items__product"
            )
            .get(pk=order.pk)
        )

        return Response(
            OrderSerializer(
                order
            ).data,
            status=status.HTTP_200_OK,
        )
