from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Course"""
    
    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'created_at',
            'updated_at',
            'price',
            'quantity',
            'popularity',
            'is_limited',
            'difficulty_level',
            'duration_hours',
            'category'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'popularity']
    
    def validate_price(self, value):
        """Валидация цены"""
        if value < 0:
            raise serializers.ValidationError('Цена не может быть отрицательной')
        return value
    
    def validate_quantity(self, value):
        """Валидация количества"""
        if value is not None and value < 0:
            raise serializers.ValidationError('Количество не может быть отрицательным')
        return value
    
    def validate_duration_hours(self, value):
        """Валидация продолжительности"""
        if value < 0:
            raise serializers.ValidationError('Продолжительность не может быть отрицательной')
        return value
