from django.shortcuts import render
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer
from .models import User


class RegistrationAPIView(APIView):
    """API endpoint для регистрации новых пользователей"""

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            
            # Создание JWT токенов
            refresh = RefreshToken.for_user(user)
            refresh.payload.update(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            )

            return Response(
                {
                    "message": "Пользователь успешно зарегистрирован",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        
        return Response(
            {
                "error": "Ошибка валидации данных",
                "details": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginAPIView(APIView):
    """API endpoint для входа пользователей"""

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Необходимо указать username и password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Поиск пользователя по username или email
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Неверные учетные данные'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # Проверка пароля
        if not check_password(password, user.password):
            return Response(
                {'error': 'Неверные учетные данные'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Создание JWT токенов
        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        })

        return Response(
            {
                'message': 'Вход выполнен успешно',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            status=status.HTTP_200_OK
        )

class LogoutAPIView(APIView):
    """API endpoint для выхода пользователей"""

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Выход выполнен успешно"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": "Ошибка при выходе", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
