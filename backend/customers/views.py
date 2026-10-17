import logging
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
    CustomerProfileUpdateSerializer,
    CustomerRegistrationSerializer,
    GoogleLoginSerializer,
)


User = get_user_model()
logger = logging.getLogger(__name__)


# =========================================================
# HELPERS
# =========================================================

def customer_data(user, profile):
    return {
        "id": user.id,
        "full_name": profile.full_name,
        "email": user.email,
        "phone_number": profile.phone_number,
        "profile_complete": profile.is_profile_complete,
    }


def google_auth_error(reason=None):
    """
    Return a generic error to the customer while logging
    a safe diagnostic reason on the server.

    Never log the Google credential/token itself.
    """

    if reason:
        logger.warning(
            "Google authentication rejected: %s",
            reason,
        )

    return Response(
        {
            "detail": "Unable to authenticate with Google.",
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


# =========================================================
# CUSTOMER CSRF
# =========================================================

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


# =========================================================
# CUSTOMER REGISTRATION
# =========================================================

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


# =========================================================
# CUSTOMER PASSWORD LOGIN
# =========================================================

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
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(
            request,
            user,
            backend="customers.backends.CustomerLoginBackend",
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


# =========================================================
# GOOGLE LOGIN
# =========================================================

@method_decorator(csrf_protect, name="dispatch")
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        # ---------------------------------
        # GOOGLE CONFIGURATION
        # ---------------------------------

        if not settings.GOOGLE_CLIENT_ID:
            logger.error(
                "Google authentication unavailable: "
                "GOOGLE_CLIENT_ID is not configured."
            )

            return Response(
                {
                    "detail": "Google authentication is unavailable.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # ---------------------------------
        # VALIDATE REQUEST
        # ---------------------------------

        serializer = GoogleLoginSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        credential = serializer.validated_data[
            "credential"
        ]

        # ---------------------------------
        # VERIFY GOOGLE TOKEN
        # ---------------------------------

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except (
            ValueError,
            GoogleAuthError,
        ) as error:
            logger.warning(
                "Google token verification failed. "
                "error_type=%s error=%s",
                type(error).__name__,
                str(error),
            )

            return google_auth_error(
                "token_verification_failed"
            )

        # ---------------------------------
        # GOOGLE ACCOUNT INFORMATION
        # ---------------------------------

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

        # ---------------------------------
        # VALIDATE GOOGLE CLAIMS
        # ---------------------------------

        if (
            not google_sub
            or not email
            or email_verified is not True
        ):
            logger.warning(
                "Google claims validation failed. "
                "has_sub=%s has_email=%s "
                "email_verified=%r",
                bool(google_sub),
                bool(email),
                email_verified,
            )

            return google_auth_error(
                "invalid_google_claims"
            )

        # ---------------------------------
        # 1. RETURNING LINKED GOOGLE USER
        # ---------------------------------

        linked_profile = (
            CustomerProfile.objects
            .select_for_update()
            .select_related("user")
            .filter(
                google_sub=google_sub
            )
            .first()
        )

        if linked_profile:
            user = linked_profile.user

            if not user.is_active:
                return google_auth_error(
                    "linked_user_inactive"
                )

            if (
                request.user.is_authenticated
                and request.user.pk != user.pk
            ):
                logger.warning(
                    "Google login rejected because "
                    "the active session belongs to "
                    "another customer."
                )

                return Response(
                    {
                        "detail":
                            "This Google account belongs "
                            "to another customer."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            login(
                request,
                user,
                backend="customers.backends.CustomerLoginBackend",
            )

            logger.info(
                "Google login successful for returning linked customer."
            )

            return Response(
                {
                    "message":
                        "Signed in with Google successfully.",
                    "customer": customer_data(
                        user,
                        linked_profile,
                    ),
                    "profile_completion_required":
                        not linked_profile.is_profile_complete,
                },
                status=status.HTTP_200_OK,
            )

        # ---------------------------------
        # 2. CHECK MATCHING EMAIL ACCOUNT
        # ---------------------------------

        matching_users = User.objects.filter(
            email__iexact=email
        )

        if matching_users.count() > 1:
            return google_auth_error(
                "multiple_users_with_matching_email"
            )

        existing_user = matching_users.first()

        if existing_user:
            try:
                profile = (
                    CustomerProfile.objects
                    .select_for_update()
                    .get(
                        user=existing_user
                    )
                )

            except CustomerProfile.DoesNotExist:
                return google_auth_error(
                    "matching_user_missing_profile"
                )

            # ---------------------------------
            # GOOGLE ACCOUNT CONFLICT
            # ---------------------------------

            if (
                profile.google_sub
                and profile.google_sub != google_sub
            ):
                return google_auth_error(
                    "google_sub_mismatch"
                )

            # ---------------------------------
            # EXISTING PASSWORD ACCOUNT
            # ---------------------------------

            if (
                not request.user.is_authenticated
                or request.user.pk != existing_user.pk
            ):
                logger.warning(
                    "Google account linking requires "
                    "existing password customer to "
                    "authenticate first."
                )

                return Response(
                    {
                        "detail":
                            "An account with this email already exists. "
                            "Sign in with your email/phone and password "
                            "first, then connect Google."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            # ---------------------------------
            # LINK GOOGLE ACCOUNT
            # ---------------------------------

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

            logger.info(
                "Google account linked to existing customer."
            )

        # ---------------------------------
        # 3. BRAND-NEW GOOGLE CUSTOMER
        # ---------------------------------

        else:
            if request.user.is_authenticated:
                logger.warning(
                    "Google signup rejected because "
                    "another customer session is active."
                )

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

            logger.info(
                "New Google customer created."
            )

        # ---------------------------------
        # 4. FINAL ACCOUNT CHECK
        # ---------------------------------

        if not user.is_active:
            return google_auth_error(
                "final_user_inactive"
            )

        # ---------------------------------
        # 5. LOGIN CUSTOMER
        # ---------------------------------

        login(
            request,
            user,
            backend="customers.backends.CustomerLoginBackend",
        )

        logger.info(
            "Google login successful."
        )

        return Response(
            {
                "message":
                    "Signed in with Google successfully.",
                "customer": customer_data(
                    user,
                    profile,
                ),
                "profile_completion_required":
                    not profile.is_profile_complete,
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# CURRENT CUSTOMER
# =========================================================

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
                    "detail":
                        "Customer account not available."
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


# =========================================================
# CUSTOMER PROFILE
# =========================================================

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
                    "detail":
                        "Customer account not available."
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
                "message":
                    "Profile updated successfully.",
                "customer": customer_data(
                    request.user,
                    profile,
                ),
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# CUSTOMER LOGOUT
# =========================================================

@method_decorator(csrf_protect, name="dispatch")
class CustomerLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)

        return Response(
            {
                "message":
                    "Signed out successfully.",
            },
            status=status.HTTP_200_OK,
        )