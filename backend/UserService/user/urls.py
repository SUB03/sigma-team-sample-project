from django.urls import path
from .views import RefreshTokenAPIView, RegistrationAPIView, LoginAPIView, LogoutAPIView, ShowUsersAPIView, UserProfileAPIView

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('users/', ShowUsersAPIView.as_view(), name='show_users'),
    path('profile/', UserProfileAPIView.as_view(), name='user_profile'),
    path('token/refresh/', RefreshTokenAPIView.as_view(), name='token_refresh'),
]

