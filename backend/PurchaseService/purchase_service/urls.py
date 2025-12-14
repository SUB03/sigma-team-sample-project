"""
URL configuration for purchase_service project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("purchase/", include("purchase.urls")),
]
