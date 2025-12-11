from django.urls import path
from .views import RegistrationAPIView, LoginAPIView, LogoutAPIView, ShowUsersAPIView

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('users/', ShowUsersAPIView.as_view(), name='show_users'),
]

