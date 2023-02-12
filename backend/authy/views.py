from django.shortcuts import render
from rest_framework.views import APIView 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.decorators import parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import * 
from .permissions import IsSuperuserOrOwner
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import OtpRequest
# Create your views here.

User = get_user_model()


   

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):

        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            otp = OtpRequest.objects.generate(receiver=user)
            return Response(OtpRequestResponseSerializer(otp).data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

class LoginView(APIView):
    def post(self, request, *args, **kwargs) :
     
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            password = serializer.validated_data['password']
            user = self._authenticated(phone, password)
        
            if user:
                otp = OtpRequest.objects.generate(receiver=user)
                return Response(OtpRequestResponseSerializer(otp).data, status=status.HTTP_200_OK)
            
            return Response(data={"message":"کاربری با این مشخصات یافت نشد"}, status=status.HTTP_401_UNAUTHORIZED)
           
        
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _authenticated(self, phone, password):
        
        query = User.objects.filter(phone=phone)
        if query.exists():
            user = query.first()
            if user.check_password(password):
                return user 
            return None
        
        return None

class VerifyView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = VerifyOtpRequestResponse(data=request.data )
        serializer.is_valid(raise_exception=True)
        receiver = serializer.validated_data['receiver']
        request_id = serializer.validated_data['request_id']
        code = serializer.validated_data['code']
        try:
            user = User.objects.get(phone=receiver)
            otp = OtpRequest.objects.is_valid(receiver=user, request=request_id, code=code)
            if otp:
                return Response(self._handle_login(user), status=status.HTTP_200_OK)
            
            return Response(data={"کد موردنظر اشتباه یا منقضی شده است"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response( data={"message":serializer.errors} ,status=status.HTTP_400_BAD_REQUEST)


    def _handle_login(self, user):
        refresh = RefreshToken.for_user(user)
        return ObtainOtpRequest({
            'access': str(refresh.access_token),
            'refresh':str(refresh),
            'user_info':user
        }).data
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
      
        if user:

            serializer = ProfileSerializer(user)

            return Response(data=serializer.data, status=status.HTTP_200_OK)
        

        else:
            return Response(data={"message":"کاریری یافت نشد"}, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            refresh = serializer.validated_data['refresh']
            decode_payload = jwt.decode(refresh, settings.SECRET_KEY,  algorithms=['HS256'])
            user_id = decode_payload['user_id']
            if user_id:
                user = User.objects.get(id=user_id)
                new_access_token = str(RefreshToken.for_user(user).access_token )
                roles = []
                if user.is_superuser:
                    roles.append("admin")
                if user.is_employee:
                    roles.append('employee')
                data = {
                    "access":new_access_token,
                    "roles":roles
                }

            return Response( data=data, status=status.HTTP_200_OK)
        return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserCreateDetailEditeDeleteView(APIView):
   

    @permission_classes([IsSuperuserOrOwner])
    def get(self, request, *args, **kwargs):
        phone = kwargs.get('phone')
        user = self._fetch_user(phone)
        if user:
            serializer = ProfileSerializer(user)
            return Response(data = serializer.data, status=status.HTTP_200_OK)
        
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @parser_classes([MultiPartParser])
    @permission_classes([IsAuthenticated, IsAdminUser])
    def post(self, request, *args, **kwargs):
     
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(data=ProfileSerializer(user).data, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @parser_classes([FormParser])
    @permission_classes([IsAuthenticated, IsSuperuserOrOwner])
    def put(self, request, *args, **kwargs):
        phone = kwargs.get('phone')
        admin = request.data.get('admin', None)
        employee = request.data.get('employee', None)
        user = self._fetch_user(phone)
        if user:
            serializer = ProfileSerializer(user, data=request.data, context={'admin':admin, 'employee':employee})
            if serializer.is_valid():
                edite_user = serializer.save()
                return Response(data=ProfileSerializer(edite_user).data, status=status.HTTP_200_OK)
            
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"message":"user dont "}, status=status.HTTP_400_BAD_REQUEST)
    

    @permission_classes([IsAuthenticated, IsAdminUser])
    def delete(self, request, *args, **kwargs):
        phone = kwargs.get('phone')
        user = self._fetch_user(phone)
        if user:
            user.delete()
            return Response(data={"phone":phone},status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def _fetch_user(self, phone):
        
        query = User.objects.filter(phone=phone)
        if query.exists():
            return query.first()
        return None
    
class UserListCreateDeleteView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get(self, request, format=None, *args, **kwargs):
        user = User.objects.all()   
        serializer = ProfileSerializer(user, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'user':request.user})
        if serializer.is_valid():
            return Response(data={"message":"گذرواژه شما با موفقیت تغییر کرد"}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SendPasswordResetEmailView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            query = User.objects.filter(email=email)
            if query.exists():
                return Response(data={"message":"لینک مربوط به ریست کردن گذرواژه به ایمیل شما ارسال گردید "}, status=status.HTTP_200_OK)
            return Response(data={"message":"کاربری یافت نشد"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
class PasswordResetView(APIView):
    

    def post(self, request, *args, **kwargs):
        uid = kwargs.get('uid', None)
        token = kwargs.get('token', None)
        serializer = PasswordResetConfirmSerializer(data=request.data, context={'uid':uid, 'token':token})
        if serializer.is_valid():
            return Response(data={"message":"گذرواژه شما با موفقیت ریست شد"}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)