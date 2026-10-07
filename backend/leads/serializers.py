import re

from rest_framework import serializers

from .models import (
    OptInCampaign,
    OptInSubmission,
)


# ============================================================
# PHONE NORMALIZATION
#
# Converts different versions of the same Ghana phone number
# into one consistent value for duplicate detection.
#
# Example:
# 0241234567
# +233241234567
#
# Both become:
# 233241234567
# ============================================================

def normalize_phone(value):
    digits = re.sub(
        r"\D",
        "",
        value or "",
    )

    if (
        len(digits) == 10
        and digits.startswith("0")
    ):
        digits = (
            "233" + digits[1:]
        )

    return digits


# ============================================================
# EMAIL NORMALIZATION
#
# Email is optional.
# When supplied, lowercase it so the same address cannot be
# stored twice simply because of capital letters.
# ============================================================

def normalize_email(value):
    value = (
        value or ""
    ).strip().lower()

    return value or None


# ============================================================
# OPT-IN CAMPAIGN
#
# Used by the public Opt-In page and the admin campaign editor.
# ============================================================

class OptInCampaignSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = OptInCampaign

        fields = [
            "id",
            "label",
            "headline",
            "supporting_text",
            "resource_title",
            "resource_description",
            "resource_image",
            "resource_file",
            "button_text",
            "privacy_note",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


# ============================================================
# PUBLIC OPT-IN SUBMISSION
#
# This serializer:
#
# 1. Cleans the visitor's data.
# 2. Normalizes phone/email.
# 3. Checks whether the visitor already exists.
# 4. Reuses the existing contact instead of creating duplicates.
# 5. Still allows returning visitors to access the current
#    downloadable resource.
# ============================================================

class OptInSubmissionCreateSerializer(
    serializers.ModelSerializer
):
    already_exists = serializers.BooleanField(
        read_only=True,
    )

    class Meta:
        model = OptInSubmission

        fields = [
            "id",
            "campaign",
            "full_name",
            "phone",
            "email",
            "already_exists",
        ]

        read_only_fields = [
            "id",
            "already_exists",
        ]


    # --------------------------------------------------------
    # NAME VALIDATION
    #
    # Remove control characters and angle brackets while
    # preserving normal human names and spaces.
    # --------------------------------------------------------

    def validate_full_name(
        self,
        value,
    ):
        value = re.sub(
            r"[\x00-\x1F\x7F<>]",
            "",
            value,
        )

        value = re.sub(
            r"\s+",
            " ",
            value,
        ).strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Enter a valid name."
            )

        if len(value) > 150:
            raise serializers.ValidationError(
                "Name is too long."
            )

        return value


    # --------------------------------------------------------
    # PHONE VALIDATION
    #
    # The original phone remains available for display,
    # while normalized_phone is used as the real duplicate
    # detection value.
    # --------------------------------------------------------

    def validate_phone(
        self,
        value,
    ):
        value = (
            value or ""
        ).strip()

        if not re.fullmatch(
            r"[0-9+\s()\-]+",
            value,
        ):
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        normalized = normalize_phone(
            value
        )

        if (
            len(normalized) < 9
            or len(normalized) > 15
        ):
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        return value


    # --------------------------------------------------------
    # EMAIL VALIDATION
    #
    # Email remains optional.
    # DRF's EmailField still performs normal email validation.
    # --------------------------------------------------------

    def validate_email(
        self,
        value,
    ):
        if not value:
            return ""

        return (
            value
            .strip()
            .lower()
        )


    # --------------------------------------------------------
    # CREATE OR REUSE CONTACT
    #
    # Phone is the primary visitor identity.
    #
    # Email is also checked when supplied.
    #
    # Existing visitors are updated and reused rather than
    # inserted as duplicate contacts.
    # --------------------------------------------------------

    def create(
        self,
        validated_data,
    ):
        phone = validated_data[
            "phone"
        ]

        email = validated_data.get(
            "email",
            "",
        )

        normalized_phone = (
            normalize_phone(
                phone
            )
        )

        normalized_email = (
            normalize_email(
                email
            )
        )


        # Find an existing visitor by phone.

        phone_match = (
            OptInSubmission.objects
            .filter(
                normalized_phone=
                    normalized_phone
            )
            .first()
        )


        # Find an existing visitor by email only when
        # an email address was actually supplied.

        email_match = None

        if normalized_email:
            email_match = (
                OptInSubmission.objects
                .filter(
                    normalized_email=
                        normalized_email
                )
                .first()
            )


        # Prevent two different existing contacts from being
        # silently merged.
        #
        # Example:
        # submitted phone belongs to Person A,
        # submitted email belongs to Person B.

        if (
            phone_match
            and email_match
            and phone_match.pk
            != email_match.pk
        ):
            raise serializers.ValidationError(
                {
                    "detail": (
                        "The phone number and email "
                        "belong to different existing records."
                    )
                }
            )


        existing = (
            phone_match
            or email_match
        )


        # ----------------------------------------------------
        # RETURNING VISITOR
        #
        # Do not create another contact.
        # Update useful current information instead.
        # ----------------------------------------------------

        if existing:
            existing.full_name = (
                validated_data[
                    "full_name"
                ]
            )

            existing.phone = phone

            existing.normalized_phone = (
                normalized_phone
            )

            if email:
                existing.email = email

                existing.normalized_email = (
                    normalized_email
                )

            existing.campaign = (
                validated_data.get(
                    "campaign"
                )
            )

            existing.save()

            existing.already_exists = True

            return existing


        # ----------------------------------------------------
        # NEW VISITOR
        #
        # No matching phone or email was found, so create one
        # new contact.
        # ----------------------------------------------------

        submission = (
            OptInSubmission.objects
            .create(
                **validated_data,

                normalized_phone=
                    normalized_phone,

                normalized_email=
                    normalized_email,
            )
        )

        submission.already_exists = False

        return submission


# ============================================================
# ADMIN SUBMISSIONS
#
# Used by the Greatness Mall admin/dashboard to display and
# update saved contacts.
# ============================================================

class OptInSubmissionAdminSerializer(
    serializers.ModelSerializer
):
    campaign_title = serializers.CharField(
        source="campaign.resource_title",
        read_only=True,
    )

    status_label = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = OptInSubmission

        fields = [
            "id",
            "campaign",
            "campaign_title",
            "full_name",
            "phone",
            "email",
            "status",
            "status_label",
            "submitted_at",
            "last_accessed_at",
        ]

        read_only_fields = [
            "id",
            "campaign",
            "campaign_title",
            "full_name",
            "phone",
            "email",
            "submitted_at",
            "last_accessed_at",
        ]