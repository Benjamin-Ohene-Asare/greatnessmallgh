from rest_framework import serializers


class SMSBroadcastSerializer(serializers.Serializer):
    message = serializers.CharField(
        max_length=600,
        trim_whitespace=True,
    )

    def validate_message(self, value):
        message = value.strip()

        if not message:
            raise serializers.ValidationError(
                "SMS message cannot be empty."
            )

        return message