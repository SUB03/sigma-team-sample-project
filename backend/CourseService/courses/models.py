from django.db import models

# Create your models here.
class Course(models.Model):
    difficulty_level_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    category_CHOICES = [
        ('Programming', 'Programming'),
        ('Data Science', 'Data Science'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Business', 'Business'),
        ('Mathematics', 'Mathematics'),
        ('Other', 'Other'),
    ]
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(null=True, blank=True)
    popularity = models.IntegerField(default=0)
    is_limited = models.BooleanField(default=False)
    difficulty_level = models.CharField(max_length=50, choices=difficulty_level_CHOICES, default='beginner')
    duration_hours = models.IntegerField(default=0)
    category = models.CharField(max_length=100, choices=category_CHOICES, null=True, blank=True)
    def __str__(self):
        return self.title
    

class Review(models.Model):
    """Модель отзыва на курс"""
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, related_name='reviews', on_delete=models.CASCADE)
    user_id = models.IntegerField(help_text="ID пользователя из User Service")
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'course_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review {self.id} for Course {self.course.id} by User {self.user_id}"
