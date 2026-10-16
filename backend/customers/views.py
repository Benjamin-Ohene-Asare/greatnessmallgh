import uuid

from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.db import transaction
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomerProfile
from .serializers import (
    CustomerLoginSerializer,
    CustomerRegistrationSerializer,
    GoogleLoginSerializer,
    CustomerProfileUpdateSerializer,
)


User = get_user_model()


def customer_data(user, profile):
    return {
        "id": user.id,
        "full_name": profile.full_name,
        "email": user.email,
        "phone_number": profile.phone_number,
        "profile_complete": profile.is_profile_complete,
    }


def google_auth_error():
    return Response(
        {
            "detail": "Unable to authenticate with Google."
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CustomerCsrfView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "csrfToken": get_token(request),
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_protect, name="dispatch")
class CustomerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerRegistrationSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.save()
        profile = user.customer_profile

        login(
            request,
            user,
            backend="customers.backends.CustomerLoginBackend",
        )

        return Response(
            {
                "message": "Account created successfully.",
                "customer": customer_data(
                    user,
                    profile,
                ),
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_protect, name="dispatch")
class CustomerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerLoginSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.validated_data["user"]

        try:
            profile = CustomerProfile.objects.get(
                user=user,
            )

        except CustomerProfile.DoesNotExist:
            return Response(
                {
                    "non_field_errors": [
                        "Invalid email/phone number or password."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(
            request,
            user,
        )

        return Response(
            {
                "message": "Signed in successfully.",
                "customer": customer_data(
                    user,
                    profile,
                ),
            },
            status=status.HTTP_200_OK,
        )



@method_decorator(csrf_protect, name="dispatch")
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {"detail": "Google authentication is unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credential = serializer.validated_data["credential"]

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except (ValueError, GoogleAuthError):
            return google_auth_error()

        google_sub = str(
            google_user.get("sub", "")
        ).strip()

        email = str(
            google_user.get("email", "")
        ).strip().lower()

        full_name = str(
            google_user.get("name", "")
        ).strip()

        email_verified = google_user.get(
            "email_verified"
        )

        if (
            not google_sub
            or not email
            or email_verified is not True
        ):
            return google_auth_error()

        # ---------------------------------
        # 1. Returning linked Google user
        # ---------------------------------

        linked_profile = (
            CustomerProfile.objects
            .select_for_update()
            .select_related("user")
            .filter(google_sub=google_sub)
            .first()
        )

        if linked_profile:
            user = linked_profile.user

            if not user.is_active:
                return google_auth_error()

            if (
                request.user.is_authenticated
                and request.user.pk != user.pk
            ):
                return Response(
                    {
                        "detail":
                            "This Google account belongs to another customer."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            login(
                request,
                user,
                backend="customers.backends.CustomerLoginBackend",
            )

            return Response(
                {
                    "message":
                        "Signed in with Google successfully.",
                    "customer":
                        customer_data(
                            user,
                            linked_profile,
                        ),
                    "profile_completion_required":
                        not linked_profile.is_profile_complete,
                },
                status=status.HTTP_200_OK,
            )

        # ---------------------------------
        # 2. Check matching email account
        # ---------------------------------

        matching_users = User.objects.filter(
            email__iexact=email
        )

        if matching_users.count() > 1:
            return google_auth_error()

        existing_user = matching_users.first()

        if existing_user:
            try:
                profile = (
                    CustomerProfile.objects
                    .select_for_update()
                    .get(user=existing_user)
                )
            except CustomerProfile.DoesNotExist:
                return google_auth_error()

            if (
                profile.google_sub
                and profile.google_sub != google_sub
            ):
                return google_auth_error()

            # Existing password account:
            # customer must already be authenticated
            # before Google can be linked.
            if (
                not request.user.is_authenticated
                or request.user.pk != existing_user.pk
            ):
                return Response(
                    {
                        "detail":
                            "An account with this email already exists. "
                            "Sign in with your email/phone and password "
                            "first, then connect Google."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            profile.google_sub = google_sub

            if not profile.full_name and full_name:
                profile.full_name = full_name

            profile.save(
                update_fields=[
                    "google_sub",
                    "full_name",
                    "updated_at",
                ]
            )

            user = existing_user

        # ---------------------------------
        # 3. Brand-new Google customer
        # ---------------------------------

        else:
            if request.user.is_authenticated:
                return Response(
                    {
                        "detail":
                            "Sign out before creating a different "
                            "Google customer account."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            user = User.objects.create_user(
                username=uuid.uuid4().hex,
                email=email,
                password=None,
            )

            profile = CustomerProfile.objects.create(
                user=user,
                full_name=full_name or "Customer",
                phone_number=None,
                google_sub=google_sub,
            )

        # ---------------------------------
        # 4. Final login
        # ---------------------------------

        if not user.is_active:
            return google_auth_error()

        login(
            request,
            user,
            backend="customers.backends.CustomerLoginBackend",
        )

        return Response(
            {
                "message":
                    "Signed in with Google successfully.",
                "customer":
                    customer_data(
                        user,
                        profile,
                    ),
                "profile_completion_required":
                    not profile.is_profile_complete,
            },
            status=status.HTTP_200_OK,
        )








class CurrentCustomerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = CustomerProfile.objects.get(
                user=request.user,
            )

        except CustomerProfile.DoesNotExist:
            return Response(
                {
                    "detail": "Customer account not available."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "customer": customer_data(
                    request.user,
                    profile,
                ),
            },
            status=status.HTTP_200_OK,
        )



@method_decorator(csrf_protect, name="dispatch")
class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            profile = CustomerProfile.objects.get(
                user=request.user,
            )
        except CustomerProfile.DoesNotExist:
            return Response(
                {
                    "detail": "Customer account not available."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CustomerProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True,
            context={
                "profile": profile,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        profile = serializer.save()

        return Response(
            {
                "message": "Profile updated successfully.",
                "customer": customer_data(
                    request.user,
                    profile,
                ),
            },
            status=status.HTTP_200_OK,
        )



@method_decorator(csrf_protect, name="dispatch")
class CustomerLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(
            request,
        )

        return Response(
            {
                "message": "Signed out successfully.",
            },
            status=status.HTTP_200_OK,
        )