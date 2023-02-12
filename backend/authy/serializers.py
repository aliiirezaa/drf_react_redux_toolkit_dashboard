from rest_framework import serializers
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode 
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError 
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .send_email import send_email_message 
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth import get_user_model
from .models import OtpRequest

User = get_user_model()


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField( allow_null=False)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =  ('username','email','first_name','last_name','phone','image' )
        extra_kwargs = {
            'username':{'write_only':False, 'required':False},
            'email':{'write_only':False, 'required':False},
            'phone':{'write_only':False, 'required':False},

        }
    
    def to_representation(self, instance):
        represntation =  super().to_representation(instance)
        roles = []
        if instance.is_superuser:
            roles.append("admin")
        if instance.is_employee:
            roles.append("employee")
        represntation['roles'] = roles 
        return represntation
    
    def update(self,instance, validated_data):
        admin = self.context['admin'] or None 
        employee = self.context['employee'] or None 

        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.image = validated_data.get("image", instance.image)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.is_superuser = True if admin == 'true' else False
        instance.is_employee = True if employee == 'true' else False
        instance.save()
        return instance

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model=User 
        fields = ('email','phone','image', 'password' , 'username')     
    
    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if user.exists():
            raise serializers.ValidationError('کاربری با این مشخصات ثبت نام کرده است')
        return value
    
    def validate_phone(self, value):
        user = User.objects.filter(phone=value)
        if user.exists():
            raise serializers.ValidationError('کاربری با این مشخصات ثبت نام کرده است')
        return value
    
    def create(self, validated_data):
      
        phone = validated_data.get('phone')
        email = validated_data.get('email')
        password = validated_data.get('password')
        validated_data.pop('phone')
        validated_data.pop('email')
        validated_data.pop('password')
        user = User.objects.create_user(phone, email, password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11, write_only=True)
    password = serializers.CharField(style={'input_type':'password'}, write_only=True)
   
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField( style={'input_type':"password"}, write_only=True)
    re_password = serializers.CharField(style={'input_type':"password"}, write_only=True)
    admin = serializers.BooleanField(source='is_superuser', required=False)
    employee = serializers.BooleanField(source='is_employee', required=False)

    class Meta:
        model=User
        fields = ('username','email','first_name','last_name','phone','admin', 'employee', 'password', 're_password' )

    def validate(self, data):
        if data['re_password'] !=  data['password']:
            raise serializers.ValidationError('گذرواژها با هم مطابقت ندارند')
        
        return data 
    
    def validate_phone(self, value):
        user = User.objects.filter(phone=value)
        if user:
           raise serializers.ValidationError('کاربری با این مشخصات ثبت نام کرده است')
        
        return value
    
    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if user:
          raise serializers.ValidationError('کاربری با این مشخصات ثبت نام کرده است')
        
        return value
    
    def create(self, vlidated_data):
        phone = vlidated_data['phone']
        email = vlidated_data['email']
        password = vlidated_data['password']
        vlidated_data.pop('phone')
        vlidated_data.pop('email')
        vlidated_data.pop('password')
        vlidated_data.pop('re_password')
        user = User.objects.create_user( phone, email, password, **vlidated_data)
        return user

class OtpRequestResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=OtpRequest 
        fields=('request_id',)

class VerifyOtpRequestResponse(serializers.Serializer):
    request_id = serializers.CharField(max_length=128, allow_null=False)
    code = serializers.CharField(max_length=4, allow_null=False)
    receiver = serializers.CharField(max_length=11, allow_null=False)

class ObtainOtpRequest(serializers.Serializer):
    user_info = ProfileSerializer()
    access = serializers.CharField(max_length=128, allow_null=False)
    refresh = serializers.CharField(max_length=128, allow_null=False)

class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(style={'imput_type':'password'}, required=True, write_only=True)
    re_password = serializers.CharField(style={'imput_type':'password'}, required=True, write_only=True)

    def validate(self, data):
        password = data['password']
        re_password = data['re_password']
        user = self.context['user']
        if re_password != password:
            raise serializers.ValidationError('گذرواژها با هم مطابقت ندارند')
        
        if user:
            user.set_password(password)
            user.save()
        
        return data
    
class PasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=225)

    def validate(self, data):
        users = User.objects.filter(email=data['email'])
        if users.exists():
            user = users.first()
            uid = urlsafe_base64_encode(force_bytes(user.phone))
            token = PasswordResetTokenGenerator().make_token(user)
            link = f'http://localhost:5173/user/reset/{uid}/{token}/'
            subject = 'ریست کرد گذرواژه' 
            message = f'برای ریست کردن گذرواژتان وارد لینک زیر بشید {link}'      
            send_email_message(subject, message, user.email)
            return data 
        
        raise serializers.ValidationError('کاربری یافت نشد')

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(style={'imput_type':'password'}, required=True, write_only=True)
    re_password = serializers.CharField(style={'imput_type':'password'}, required=True, write_only=True)

    def validate(self, data):
        try :
            password = data['password']
            re_password = data['re_password']
            uid = self.context['uid']
            token = self.context['token']
            phone = smart_str(urlsafe_base64_decode(uid))
            if re_password != password:
                raise serializers.ValidationError('گذرواژها با هم مطابقت ندارند')
            
            users = User.objects.filter(phone=phone)
            if users.exists():
                user = users.first()
                if not PasswordResetTokenGenerator().check_token(user, token):
                    raise serializers.ValidationError('توکن موردنظر اشتباه یا منتقی شده است')
                
                user.set_password(password)
                user.save()
                return data 
            
            raise serializers.ValidationError('کاربری یافت نشد')  
        
        except DjangoUnicodeDecodeError:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError('توکن موردنظر اشتباه یا منتقی شده است')