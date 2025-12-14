from django.contrib import admin
from .models import Purchase


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_id', 'course_id', 'price', 'status', 'purchase_date']
    list_filter = ['status', 'purchase_date']
    search_fields = ['user_id', 'course_id', 'transaction_id']
    readonly_fields = ['purchase_date']
