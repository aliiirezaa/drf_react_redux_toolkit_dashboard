from django.core.mail import send_mail
from django.conf import settings


def send_email_message(subject, message, recipient_list):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[recipient_list])