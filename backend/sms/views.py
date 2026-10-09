from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from leads.models import OptInSubmission

from .serializers import SMSBroadcastSerializer
from .services import SMSServiceError, send_sms


class AdminSMSCustomersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        count = (
            OptInSubmission.objects
            .exclude(phone="")
            .values("normalized_phone")
            .distinct()
            .count()
        )

        return Response({"customer_count": count})


class AdminSMSBroadcastView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = SMSBroadcastSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phones = list(
            OptInSubmission.objects
            .exclude(phone="")
            .values_list("normalized_phone", flat=True)
            .distinct()
        )

        phones = [phone for phone in phones if phone]

        if not phones:
            return Response(
                {"detail": "There are no customer phone numbers to send to."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            send_sms(
                phones,
                serializer.validated_data["message"],
            )
        except SMSServiceError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            "detail": "SMS sent successfully.",
            "recipients": len(phones),
        })