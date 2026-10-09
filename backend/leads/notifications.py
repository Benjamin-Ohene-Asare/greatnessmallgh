import logging
import os

from django.conf import settings
from django.core.mail import send_mail

from sms.services import SMSServiceError, send_sms

logger = logging.getLogger(__name__)

ADMIN_PHONE = os.getenv(
    "OPTIN_ADMIN_PHONE",
    "0541254645",
)

ADMIN_EMAIL = os.getenv(
    "OPTIN_ADMIN_EMAIL",
    "benjaminoheneasare65@gmail.com",
)


def build_optin_message(submission, returning=False):
    name = submission.full_name
    phone = submission.phone
    email = submission.email or "Not provided"

    resource = (
        submission.campaign.resource_title
        if submission.campaign
        else "Greatness Mall Resource"
    )

    if returning:
        message = (
            f"Returning visitor: {name} accessed {resource} again. "
            f"Phone: {phone}. Email: {email}."
        )

        subject = (
            f"Returning Greatness Mall Visitor - {name}"
        )

    else:
        message = (
            f"New Greatness Mall opt-in: {name} joined and "
            f"accessed {resource}. "
            f"Phone: {phone}. Email: {email}."
        )

        subject = (
            f"New Greatness Mall Opt-In - {name}"
        )

    return subject, message


def send_optin_notifications(submission):
    returning = bool(
        getattr(
            submission,
            "already_exists",
            False,
        )
    )

    subject, message = build_optin_message(
        submission,
        returning=returning,
    )

    try:
        sms_result = send_sms(
            ADMIN_PHONE,
            message,
        )

        print(
            "OPT-IN SMS RESULT:",
            sms_result,
        )

    except SMSServiceError as exc:
        print(
            "OPT-IN SMS ERROR:",
            str(exc),
        )

        logger.exception(
            "Opt-in SMS notification failed."
        )

    try:
        email_result = send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[ADMIN_EMAIL],
            fail_silently=False,
        )

        print(
            "OPT-IN EMAIL RESULT:",
            email_result,
        )

    except Exception as exc:
        print(
            "OPT-IN EMAIL ERROR:",
            str(exc),
        )

        logger.exception(
            "Opt-in email notification failed."
        )