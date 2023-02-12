from django.db.models.signals import post_save 
from django.dispatch import receiver 
from .models import OtpRequest 
from django.utils import timezone 
from datetime import timedelta

# It checks to delete those models whose time has expired

@receiver(post_save, sender=OtpRequest)
def checkout_times_expired(instance, created, *args, **kwargs):
    if created:
        queries = OtpRequest.objects.filter(created__lt=timezone.now()-timedelta(minutes=2))
        if queries:
            for query in queries:
                query.delete()