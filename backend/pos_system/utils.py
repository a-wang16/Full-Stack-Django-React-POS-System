from twilio.rest import Client
from django.conf import settings
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