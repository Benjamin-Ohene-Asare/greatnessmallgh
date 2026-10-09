import os

import requests


BMS_SMS_URL = os.getenv(
    "BMS_AFRICA_SMS_URL",
    "https://api.mnotify.com/api/sms/quick",
)
BMS_API_KEY = os.getenv("BMS_AFRICA_API_KEY", "")
BMS_SENDER_ID = os.getenv("BMS_AFRICA_SENDER_ID", "")


class SMSServiceError(Exception):
    pass


def send_sms(recipients, message):
    if not BMS_API_KEY:
        raise SMSServiceError("BMS Africa API key is not configured.")

    if not BMS_SENDER_ID:
        raise SMSServiceError("BMS Africa sender ID is not configured.")

    if isinstance(recipients, str):
        recipients = [recipients]

    recipients = [
        str(phone).strip()
        for phone in recipients
        if str(phone).strip()
    ]

    message = str(message).strip()

    if not recipients:
        raise SMSServiceError("No recipients were provided.")

    if not message:
        raise SMSServiceError("SMS message is required.")

    payload = {
        "recipient": recipients,
        "sender": BMS_SENDER_ID,
        "message": message,
        "is_schedule": False,
    }

    try:
        response = requests.post(
            BMS_SMS_URL,
            params={"key": BMS_API_KEY},
            json=payload,
            timeout=20,
        )
    except requests.RequestException as exc:
        raise SMSServiceError(
            "Could not connect to BMS Africa."
        ) from exc

    try:
        data = response.json()
    except ValueError:
        data = {}

    if not response.ok:
        raise SMSServiceError(
            data.get("message")
            or "BMS Africa rejected the SMS request."
        )

    return data