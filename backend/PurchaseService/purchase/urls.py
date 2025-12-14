from django.urls import path
from .views import (
    CreatePurchaseAPIView,
    UserPurchasesAPIView,
    UserCoursesAPIView,
    CheckPurchaseAPIView,
    AllPurchasesAPIView
)

urlpatterns = [
    path('create/', CreatePurchaseAPIView.as_view(), name='create_purchase'),
    path('my-purchases/', UserPurchasesAPIView.as_view(), name='my_purchases'),
    path('my-courses/', UserCoursesAPIView.as_view(), name='my_courses'),
    path('check/<int:course_id>/', CheckPurchaseAPIView.as_view(), name='check_purchase'),
    path('all/', AllPurchasesAPIView.as_view(), name='all_purchases'),
]
