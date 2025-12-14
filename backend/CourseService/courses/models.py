from django.db import models

# Create your models here.
class Course(models.Model):
    difficulty_level_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
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
    def __str__(self):
        return self.title