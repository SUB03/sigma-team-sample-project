from django.db import models
from django.utils import timezone


class Purchase(models.Model):
    """Модель покупки курса пользователем"""
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('completed', 'Завершена'),
        ('failed', 'Ошибка'),
        ('refunded', 'Возврат'),
    ]
    
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(db_index=True, help_text="ID пользователя из User Service")
    course_id = models.IntegerField(db_index=True, help_text="ID курса из Course Service")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Цена покупки")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    purchase_date = models.DateTimeField(default=timezone.now, db_index=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    class Meta:
        db_table = 'purchases'
        ordering = ['-purchase_date']
        indexes = [
            models.Index(fields=['user_id', 'course_id']),
            models.Index(fields=['status']),
        ]
        # Один пользователь не может купить один курс дважды
        unique_together = ['user_id', 'course_id']
    
    def __str__(self):
        return f"Purchase {self.id}: User {self.user_id} - Course {self.course_id}"
    
    def is_active(self):
        """Проверка, активна ли покупка"""
        return self.status == 'completed'
