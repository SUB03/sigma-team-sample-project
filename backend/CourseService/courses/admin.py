from django.contrib import admin
from courses.models import Course
# Register your models here.

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'price', 'created_at']
    search_fields = ['title']
    readonly_fields = ['created_at']