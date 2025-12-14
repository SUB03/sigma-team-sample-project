import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db import IntegrityError
from .models import Purchase
from .serializers import PurchaseSerializer, CreatePurchaseSerializer


class CreatePurchaseAPIView(APIView):
    """API endpoint для создания покупки курса"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreatePurchaseSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Ошибка валидации данных', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        course_id = serializer.validated_data['course_id']
        payment_method = serializer.validated_data.get('payment_method', 'card')
        user_id = request.user.id
        
        # Проверяем, существует ли курс в Course Service
        try:
            course_response = requests.get(
                f"{settings.COURSE_SERVICE_URL}/courses/{course_id}/",
                timeout=5
            )
            
            if course_response.status_code != 200:
                return Response(
                    {'error': 'Курс не найден'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            course_data = course_response.json()
            course_price = course_data.get('price', 0)
            
        except requests.exceptions.RequestException as e:
            return Response(
                {'error': 'Не удалось связаться с Course Service', 'details': str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Создаем покупку
        try:
            purchase = Purchase.objects.create(
                user_id=user_id,
                course_id=course_id,
                price=course_price,
                status='completed',  # В реальной системе здесь была бы интеграция с платежной системой
                payment_method=payment_method
            )
            
            purchase_serializer = PurchaseSerializer(purchase)
            
            return Response(
                {
                    'message': 'Курс успешно куплен',
                    'purchase': purchase_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
            
        except IntegrityError:
            return Response(
                {'error': 'Вы уже купили этот курс'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Ошибка при создании покупки', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserPurchasesAPIView(APIView):
    """API endpoint для получения списка покупок пользователя"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        purchases = Purchase.objects.filter(user_id=user_id)
        serializer = PurchaseSerializer(purchases, many=True)
        
        return Response(
            {
                'count': purchases.count(),
                'purchases': serializer.data
            },
            status=status.HTTP_200_OK
        )


class UserCoursesAPIView(APIView):
    """API endpoint для получения ID всех купленных курсов пользователя"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        purchases = Purchase.objects.filter(
            user_id=user_id,
            status='completed'
        ).values_list('course_id', flat=True)
        
        return Response(
            {
                'user_id': user_id,
                'purchased_course_ids': list(purchases)
            },
            status=status.HTTP_200_OK
        )


class CheckPurchaseAPIView(APIView):
    """API endpoint для проверки, купил ли пользователь конкретный курс"""
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user_id = request.user.id
        
        purchase_exists = Purchase.objects.filter(
            user_id=user_id,
            course_id=course_id,
            status='completed'
        ).exists()
        
        return Response(
            {
                'user_id': user_id,
                'course_id': course_id,
                'has_purchased': purchase_exists
            },
            status=status.HTTP_200_OK
        )


class AllPurchasesAPIView(APIView):
    """API endpoint для получения всех покупок (только для админов)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # В реальной системе добавить проверку на админа
        purchases = Purchase.objects.all()
        serializer = PurchaseSerializer(purchases, many=True)
        
        return Response(
            {
                'count': purchases.count(),
                'purchases': serializer.data
            },
            status=status.HTTP_200_OK
        )
