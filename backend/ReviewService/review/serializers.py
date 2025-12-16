from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Review"""
    
    class Meta:
        model = Review
        fields = ['id', 'course_id', 'user_id', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_rating(self, value):
        """Валидация рейтинга"""
        if not (1 <= value <= 5):
            raise serializers.ValidationError('Рейтинг должен быть от 1 до 5')
        return value
