from twilio.rest import Client
from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse
import phonenumbers


def send_sms(to, message):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    response = client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=to
    )
    return response.sid



def normalize_phone_number(raw_phone):
    try:
        phone_number = phonenumbers.parse(raw_phone, 'US')
        if not phonenumbers.is_valid_number(phone_number):
            return None
        return phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        return None

    
def get_and_validate_dates(request):
    start = request.query_params.get('start_date')
    end = request.query_params.get('end_date')

    if not start or not end:
        return None, None, JsonResponse({"error": "Both 'start_date' and 'end_date' query parameters are required."}, status=400)

    try:
        start = timezone.datetime.strptime(start, "%Y-%m-%d").strftime("%m/%d/%Y")
        end = timezone.datetime.strptime(end, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        return None, None, JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    return start, end, None