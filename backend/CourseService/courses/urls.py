from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,
    CourseCreateAPIView,
    CourseUpdateAPIView,
    CourseDeleteAPIView,
    CoursesCategoriesAPIView,
    PopularCoursesAPIView,
    CourseReviewsAPIView,
    CourseAddReviewAPIView,
    GetCourseAverageRatingAPIView,
)

urlpatterns = [
    path('', CourseListAPIView.as_view(), name='course_list'),
    path('popular/', PopularCoursesAPIView.as_view(), name='popular_courses'),
    path('create/', CourseCreateAPIView.as_view(), name='course_create'),
    path('<int:course_id>/', CourseDetailAPIView.as_view(), name='course_detail'),
    path('<int:course_id>/update/', CourseUpdateAPIView.as_view(), name='course_update'),
    path('<int:course_id>/delete/', CourseDeleteAPIView.as_view(), name='course_delete'),
    path('categories/', CoursesCategoriesAPIView.as_view(), name='course_categories'),
    path('<int:course_id>/reviews/', CourseReviewsAPIView.as_view(), name='course_reviews'),
    path('<int:course_id>/reviews/add/', CourseAddReviewAPIView.as_view(), name='course_add_review'),
    path('<int:course_id>/average_rating/', GetCourseAverageRatingAPIView.as_view(), name='course_average_rating'),
]
