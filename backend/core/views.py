from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import timedelta
import secrets
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from sms.services import SMSServiceError, send_sms

from .models import (
    AdminRecoverySettings,
    PasswordResetOTP,
)

from .serializers import (
    RecoveryPhoneSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    AdminChangePasswordSerializer,
)

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "status": "ok",
                "message": "Greatness Mall backend is running.",
            }
        )
        
        
        


User = get_user_model()


class AdminRecoveryPhoneView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        recovery = (
            AdminRecoverySettings.objects
            .filter(user=request.user)
            .first()
        )

        return Response({
            "phone": recovery.phone if recovery else "",
        })

    def post(self, request):
        serializer = RecoveryPhoneSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        recovery, _ = (
            AdminRecoverySettings.objects
            .update_or_create(
                user=request.user,
                defaults={
                    "phone": serializer.validated_data[
                        "phone"
                    ]
                },
            )
        )

        return Response({
            "detail": "Recovery phone number saved.",
            "phone": recovery.phone,
        })        
        
        

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        phone = serializer.validated_data[
            "phone"
        ]

        recovery = (
            AdminRecoverySettings.objects
            .select_related("user")
            .filter(phone=phone)
            .first()
        )

        if not recovery:
            return Response({
                "detail": (
                    "If this phone number is registered, "
                    "a verification code will be sent."
                )
            })

        recent_code = (
            PasswordResetOTP.objects
            .filter(
                user=recovery.user,
                created_at__gte=(
                    timezone.now()
                    - timedelta(minutes=1)
                ),
            )
            .exists()
        )

        if recent_code:
            return Response(
                {
                    "detail": (
                        "Please wait before requesting "
                        "another verification code."
                    )
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        PasswordResetOTP.objects.filter(
            user=recovery.user,
            used=False,
        ).update(
            used=True
        )

        code = f"{secrets.randbelow(1000000):06d}"

        otp = PasswordResetOTP(
            user=recovery.user,
            expires_at=(
                timezone.now()
                + timedelta(minutes=10)
            ),
        )

        otp.set_code(code)
        otp.save()

        message = (
            f"Your Greatness Mall password reset "
            f"code is {code}. It expires in 10 minutes. "
            f"Do not share this code."
        )

        try:
            send_sms(
                recovery.phone,
                message,
            )

        except SMSServiceError:
            otp.used = True
            otp.save(
                update_fields=["used"]
            )

            return Response(
                {
                    "detail": (
                        "Unable to send verification code."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            "detail": (
                "If this phone number is registered, "
                "a verification code will be sent."
            )
        })        
        
        

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        phone = serializer.validated_data[
            "phone"
        ]

        code = serializer.validated_data[
            "code"
        ]

        new_password = serializer.validated_data[
            "new_password"
        ]

        recovery = (
            AdminRecoverySettings.objects
            .select_related("user")
            .filter(phone=phone)
            .first()
        )

        if not recovery:
            return Response(
                {
                    "detail": (
                        "Invalid or expired verification code."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = (
            PasswordResetOTP.objects
            .filter(
                user=recovery.user,
                used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if (
            not otp
            or otp.is_expired
            or not otp.check_code(code)
        ):
            return Response(
                {
                    "detail": (
                        "Invalid or expired verification code."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = recovery.user

        user.set_password(
            new_password
        )

        user.save(
            update_fields=["password"]
        )

        otp.used = True
        otp.save(
            update_fields=["used"]
        )

        PasswordResetOTP.objects.filter(
            user=user,
            used=False,
        ).update(
            used=True
        )

        return Response({
            "detail": (
                "Password reset successfully. "
                "You can now sign in with your new password."
            )
        })  
        
        
        

class AdminChangePasswordView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AdminChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        current_password = serializer.validated_data[
            "current_password"
        ]

        new_password = serializer.validated_data[
            "new_password"
        ]

        if not user.check_password(
            current_password
        ):
            return Response(
                {
                    "current_password": [
                        "Your current password is incorrect."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.check_password(
            new_password
        ):
            return Response(
                {
                    "new_password": [
                        "Your new password must be different from your current password."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(
            new_password
        )

        user.save(
            update_fields=["password"]
        )

        logout(request)

        return Response({
            "detail": (
                "Password changed successfully. "
                "Please sign in again."
            )
        })              