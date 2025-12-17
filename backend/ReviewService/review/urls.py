from django.urls import path
from .views import (
    CourseReviewsAPIView,
    AddReviewAPIView,
    UpdateReviewAPIView,
    DeleteReviewAPIView,
    CourseAverageRatingAPIView,
    UserReviewsAPIView,
    UserCourseReviewAPIView,
)

urlpatterns = [
    path('course/<int:course_id>/', CourseReviewsAPIView.as_view(), name='course_reviews'),
    path('course/<int:course_id>/add/', AddReviewAPIView.as_view(), name='add_review'),
    path('<int:review_id>/update/', UpdateReviewAPIView.as_view(), name='update_review'),
    path('<int:review_id>/delete/', DeleteReviewAPIView.as_view(), name='delete_review'),
    path('course/<int:course_id>/average/', CourseAverageRatingAPIView.as_view(), name='course_average_rating'),
    path('my-reviews/', UserReviewsAPIView.as_view(), name='user_reviews'),
    path('my-reviews/<int:course_id>/', UserCourseReviewAPIView.as_view(), name='user_course_review')
]
