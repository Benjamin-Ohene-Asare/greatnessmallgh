import re

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from .models import CustomerProfile


User = get_user_model()


class CustomerLoginBackend(ModelBackend):
    def authenticate(
        self,
        request,
        username=None,
        password=None,
        **kwargs,
    ):
        identifier = (
            kwargs.get("identifier")
            or kwargs.get("email")
            or username
        )

        if not identifier or not password:
            return None

        identifier = identifier.strip()

        try:
            if "@" in identifier:
                user = User.objects.get(
                    email__iexact=identifier.lower(),
                )

            else:
                phone = re.sub(
                    r"[\s\-\(\)]",
                    "",
                    identifier,
                )

                if phone.startswith("00"):
                    phone = f"+{phone[2:]}"

                elif phone.startswith("0") and len(phone) == 10:
                    phone = f"+233{phone[1:]}"

                elif phone.startswith("233"):
                    phone = f"+{phone}"

                profile = CustomerProfile.objects.select_related(
                    "user"
                ).get(
                    phone_number=phone,
                )

                user = profile.user

        except (
            User.DoesNotExist,
            User.MultipleObjectsReturned,
            CustomerProfile.DoesNotExist,
            CustomerProfile.MultipleObjectsReturned,
        ):
            # Perform password hashing work even when
            # the account does not exist.
            User().set_password(password)
            return None

        if (
            user.check_password(password)
            and self.user_can_authenticate(user)
        ):
            return user

        return None