import re
import uuid

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from rest_framework import serializers

from .models import CustomerProfile


User = get_user_model()


def normalize_phone_number(value):
    """
    Normalizes phone numbers into international format.

    Examples:
    0241234567     -> +233241234567
    233241234567   -> +233241234567
    +233241234567  -> +233241234567
    00233241234567 -> +233241234567
    """
    phone = re.sub(
        r"[\s\-()]",
        "",
        str(value).strip(),
    )

    if phone.startswith("00"):
        phone = f"+{phone[2:]}"
    elif phone.startswith("0") and len(phone) == 10:
        phone = f"+233{phone[1:]}"
    elif phone.startswith("233"):
        phone = f"+{phone}"

    # IMPORTANT:
    # Validation and return must happen for every accepted input format,
    # not only numbers that originally started with "233".
    if not re.fullmatch(
        r"\+[1-9][0-9]{8,14}",
        phone,
    ):
        raise serializers.ValidationError(
            "Enter a valid phone number."
        )

    return phone


class CustomerRegistrationSerializer(serializers.Serializer):
    full_name = serializers.CharField(
        max_length=150,
        trim_whitespace=True,
    )

    email = serializers.EmailField(
        max_length=254,
    )

    phone_number = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
    )

    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    confirm_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate_full_name(self, value):
        value = " ".join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError(
                "Please enter your full name."
            )

        return value

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email

    def validate_phone_number(self, value):
        phone = normalize_phone_number(value)

        if CustomerProfile.objects.filter(
            phone_number=phone
        ).exists():
            raise serializers.ValidationError(
                "An account with this phone number already exists."
            )

        return phone

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get(
            "confirm_password"
        )

        if password != confirm_password:
            raise serializers.ValidationError(
                {
                    "confirm_password": (
                        "The passwords do not match."
                    ),
                }
            )

        validation_user = User(
            username=uuid.uuid4().hex,
            email=attrs.get("email", ""),
        )

        try:
            validate_password(
                password,
                user=validation_user,
            )
        except DjangoValidationError as error:
            raise serializers.ValidationError(
                {
                    "password": list(
                        error.messages
                    ),
                }
            ) from error

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data[
            "full_name"
        ]
        email = validated_data[
            "email"
        ]
        phone_number = validated_data[
            "phone_number"
        ]
        password = validated_data[
            "password"
        ]

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(
                {
                    "email": (
                        "An account with this email already exists."
                    ),
                }
            )

        if CustomerProfile.objects.filter(
            phone_number=phone_number
        ).exists():
            raise serializers.ValidationError(
                {
                    "phone_number": (
                        "An account with this phone number already exists."
                    ),
                }
            )

        try:
            user = User.objects.create_user(
                username=uuid.uuid4().hex,
                email=email,
                password=password,
            )

            CustomerProfile.objects.create(
                user=user,
                full_name=full_name,
                phone_number=phone_number,
            )

        except IntegrityError as error:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "An account with these details already exists."
                    ),
                }
            ) from error

        return user


class CustomerLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(
        max_length=254,
        trim_whitespace=True,
    )

    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        identifier = attrs.get(
            "identifier",
            "",
        ).strip()

        password = attrs.get(
            "password",
            "",
        )

        user = authenticate(
            request=self.context.get(
                "request"
            ),
            identifier=identifier,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email/phone number or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is disabled."
            )

        attrs["user"] = user
        return attrs


class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField(
        trim_whitespace=True,
    )


class CustomerProfileUpdateSerializer(serializers.Serializer):
    full_name = serializers.CharField(
        max_length=150,
        trim_whitespace=True,
        required=False,
    )

    phone_number = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
        required=False,
        allow_blank=True,
    )

    def validate_full_name(self, value):
        value = " ".join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError(
                "Please enter your full name."
            )

        return value

    def validate_phone_number(self, value):
        profile = self.context[
            "profile"
        ]

        if not value.strip():
            return None

        phone = normalize_phone_number(
            value
        )

        duplicate = (
            CustomerProfile.objects
            .filter(
                phone_number=phone,
            )
            .exclude(
                pk=profile.pk,
            )
            .exists()
        )

        if duplicate:
            raise serializers.ValidationError(
                "An account with this phone number already exists."
            )

        return phone

    def update(
        self,
        instance,
        validated_data,
    ):
        update_fields = []

        if "full_name" in validated_data:
            instance.full_name = (
                validated_data[
                    "full_name"
                ]
            )
            update_fields.append(
                "full_name"
            )

        if "phone_number" in validated_data:
            instance.phone_number = (
                validated_data[
                    "phone_number"
                ]
            )
            update_fields.append(
                "phone_number"
            )

        if update_fields:
            update_fields.append(
                "updated_at"
            )

            instance.save(
                update_fields=update_fields
            )

        return instance
