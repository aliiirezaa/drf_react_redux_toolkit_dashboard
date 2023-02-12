from django.contrib import admin
from .models import OtpRequest, User

# Register your models here.





admin.site.register(User)
admin.site.register(OtpRequest)

