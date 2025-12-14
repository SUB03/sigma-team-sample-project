from rest_framework import serializers
from .models import Purchase


class PurchaseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Purchase"""
    
    class Meta:
        model = Purchase
        fields = [
            'id',
            'user_id',
            'course_id',
            'price',
            'status',
            'purchase_date',
            'payment_method',
            'transaction_id'
        ]
        read_only_fields = ['id', 'purchase_date']
    
    def validate(self, data):
        """Валидация данных покупки"""
        if data.get('price') and data['price'] < 0:
            raise serializers.ValidationError({'price': 'Цена не может быть отрицательной'})
        return data


class CreatePurchaseSerializer(serializers.Serializer):
    """Сериализатор для создания покупки"""
    
    course_id = serializers.IntegerField(required=True)
    payment_method = serializers.CharField(max_length=50, required=False, default='card')
    
    def validate_course_id(self, value):
        if value <= 0:
            raise serializers.ValidationError('ID курса должен быть положительным числом')
        return value
