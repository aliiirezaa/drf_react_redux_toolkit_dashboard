from django.urls import path 
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
            RegisterView,
            LoginView,
            VerifyView,
            ProfileView ,
            UserCreateDetailEditeDeleteView,
            RefreshTokenView,
            UserListCreateDeleteView,
            ChangePasswordView,
            SendPasswordResetEmailView,
            PasswordResetView,
)
app_name = "authy"
urlpatterns = [
    path("register/",RegisterView.as_view(), name="register"),
    path("login/",LoginView.as_view(), name="login"),
    path("verify/",VerifyView.as_view(), name="verify"),
    path("profile/",ProfileView.as_view(), name="profile"),
    path("user/<phone>/",UserCreateDetailEditeDeleteView.as_view(), name="edite"),
    path("adduser/",UserCreateDetailEditeDeleteView.as_view(), name="edite"),
    path('api/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), 
    path('users/', UserListCreateDeleteView.as_view(), name="users"),
    path('user/change/password/', ChangePasswordView.as_view(), name="change_password"),
    path('user/send/email/for/password/reset/', SendPasswordResetEmailView.as_view(), name="send_password_reset_email"),
    path('user/reset/password/<uid>/<token>/', PasswordResetView.as_view(), name="reset_password"),
]