from django.db import models

class Review(models.Model):
    """Модель отзыва на курс"""
    id = models.AutoField(primary_key=True)
    course_id = models.IntegerField(help_text="ID курса из Course Service")
    user_id = models.IntegerField(help_text="ID пользователя из User Service")
    rating = models.IntegerField(help_text="Рейтинг от 1 до 5")
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        # Один пользователь может оставить только один отзыв на курс
        unique_together = ['course_id', 'user_id']

    def __str__(self):
        return f"Review {self.id} for Course {self.course_id} by User {self.user_id}"
