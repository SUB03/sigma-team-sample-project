from rest_framework import serializers
from .models import User


class CustomUserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели User"""

    password = serializers.CharField(
        write_only=True, min_length=8, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """Создание пользователя с хешированным паролем"""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """Обновление пользователя с хешированием пароля при его изменении"""
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance

    def validate_password(self, value):
        """Дополнительная валидация пароля (пример)"""
        if len(value) < 8 or not any(char.isdigit() for char in value):
            raise serializers.ValidationError(
                "Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру."
            )
        return value
