"""
URL configuration for review_service project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("reviews/", include("review.urls")),
]
