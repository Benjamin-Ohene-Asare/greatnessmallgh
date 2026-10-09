from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class RecoveryPhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
    )


class PasswordResetRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
    )


class PasswordResetConfirmSerializer(serializers.Serializer):
    phone = serializers.CharField(
        max_length=20,
        trim_whitespace=True,
    )

    code = serializers.CharField(
        min_length=6,
        max_length=6,
        trim_whitespace=True,
    )

    new_password = serializers.CharField(
    write_only=True,
    min_length=8,
    trim_whitespace=False,
)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "Verification code must contain only numbers."
            )

        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value
    
    
    

class AdminChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )

    def validate_new_password(self, value):
        validate_password(value)
        return value   