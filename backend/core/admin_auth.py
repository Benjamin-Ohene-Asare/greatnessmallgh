from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)
from rest_framework.response import Response
from rest_framework.views import APIView


@method_decorator(
    ensure_csrf_cookie,
    name="dispatch",
)
class AdminCSRFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "csrfToken":
                    get_token(request),
            }
        )


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = (
            request.data
            .get("username", "")
            .strip()
        )

        password = (
            request.data
            .get("password", "")
        )

        if not username or not password:
            return Response(
                {
                    "detail":
                        "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request=request,
            username=username,
            password=password,
        )

        if (
            user is None
            or not user.is_active
            or not user.is_staff
        ):
            return Response(
                {
                    "detail":
                        "Invalid admin credentials."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        login(
            request,
            user,
        )

        return Response(
            {
                "id": user.id,
                "username":
                    user.get_username(),
                "is_staff":
                    user.is_staff,
                "is_superuser":
                    user.is_superuser,
            }
        )


class AdminSessionView(APIView):
    permission_classes = [
        IsAdminUser,
    ]

    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "username":
                    user.get_username(),
                "is_staff":
                    user.is_staff,
                "is_superuser":
                    user.is_superuser,
            }
        )


class AdminLogoutView(APIView):
    permission_classes = [
        IsAdminUser,
    ]

    def post(self, request):
        logout(request)

        return Response(
            {
                "detail":
                    "Signed out successfully."
            }
        )