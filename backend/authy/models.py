from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from datetime import timedelta
import random 
import string
import uuid
from .send_otp import send_otp
# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, phone, email, password, **extra_fields):
        if phone is None:
            raise ValueError("this field was required")
        if email is None:
            raise ValueError("this field was required")

        user = self.model(
            email = self.normalize_email(email),
            phone = phone,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user 
    
    def create_superuser(self, phone, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(phone, email, password, **extra_fields)  
    



class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=128)
    email = models.EmailField()      
    first_name = models.CharField(max_length=128, null=True, blank=True)
    last_name = models.CharField(max_length=128, null=True, blank=True)
    image = models.ImageField(upload_to='user', null=True, blank=True, default='user/avatar.png')
    phone = models.CharField(max_length=128, unique=True)
    is_active = models.BooleanField(default=True, blank=True)
    is_superuser = models.BooleanField(default=False, blank=True)
    is_employee = models.BooleanField(default=False, blank=True)
    updated = models.DateTimeField(auto_now_add=True)
    created = models.DateTimeField(auto_now=True)
    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ("email", )

    class Meta:
        ordering = ['-created']
        verbose_name = "کاربر"
        verbose_name_plural = "ماژول کاربران"
    
    @property 
    def is_staff(self):
        return self.is_active
  


def generate_otp():
    return "".join([random.choice(string.digits) for _ in range(4)])

class OtpRequestQuerySet(models.QuerySet):
    def is_valid(self, receiver, request, code):
        return self.filter(
            receiver=receiver,
            request_id=request,
            code=code,
            created__lt = timezone.now(),
            created__gt = timezone.now()-timedelta(minutes=2)                                       
        ).exists()

class OtpRequestManager(models.Manager):

    def get_queryset(self):
        return OtpRequestQuerySet(self.model, self._db)
    
    def is_valid(self, receiver, request, code):
        return self.get_queryset().is_valid(receiver, request, code)

    def generate(self, receiver):
        otp = self.model(receiver=receiver)
        otp.save(using=self._db)
        print(f"\n code:{otp.code} \n")
        # send_otp(otp.receiver.phone, otp.code)
        return otp 

class OtpRequest(models.Model):
    request_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    receiver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    code = models.CharField(max_length=4, default=generate_otp)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    objects = OtpRequestManager()

    class Meta:
        verbose_name = "کد احراز هویت"
        verbose_name_plural = "ماژول کد احراز هویت"